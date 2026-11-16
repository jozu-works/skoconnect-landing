#!/usr/bin/env python3
"""Regression tests: the gate verdict must publish a check run on the PR HEAD SHA (#410),
with the pull_request_target job's OWN check run as the verdict channel (#418 follow-up)
and exit-code-aligned fail-closed semantics.

Run: python3 -m unittest discover -s .github/scripts -p 'test_review_gate.py' -v
"""
# pyright: reportAttributeAccessIssue=false
# pyright: reportCallIssue=false
# (dynamic module mocking)
import contextlib
import importlib.util
import io
import json
import sys
import unittest
from pathlib import Path
from unittest import mock


def load_gate():
    spec = importlib.util.spec_from_file_location(
        "review_gate", Path(__file__).with_name("review_gate.py"))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class HeadShaCheckRunTest(unittest.TestCase):
    def setUp(self):
        self.gate = load_gate()
        self.checks = []
        self.gate.comment = mock.Mock()
        self.gate.create_check = mock.Mock(side_effect=lambda repo, head, token, verdict, summary, run_id:
                                           self.checks.append((repo, head, verdict)))
        # one changed file, empty diff, no findings, no errors
        self.gate.git = mock.Mock(side_effect=self._git)

    @staticmethod
    def _git(*args):
        if args[0] == "merge-base":
            return "base0000"
        if args[1] == "--name-only":
            return "src/a.ts"
        return "diff --git a/src/a.ts b/src/a.ts"

    def _run(self):
        return self.gate.run("base0000", "head1111", "jozu-works/SkoConnect", 42, "tok", "999")

    def test_pass_verdict_posts_success_check_on_head_sha(self):
        self.gate.review = mock.Mock(return_value=[])
        self.assertTrue(self._run())
        self.assertEqual(self.checks, [("jozu-works/SkoConnect", "head1111", "PASS")])

    def test_high_finding_posts_failure_check_on_head_sha(self):
        self.gate.review = mock.Mock(return_value=[
            {"severity": "high", "path": "src/a.ts", "line": 1, "description": "x"}])
        self.assertFalse(self._run())
        self.assertEqual(self.checks, [("jozu-works/SkoConnect", "head1111", "FAIL")])

    def test_incomplete_review_posts_failure_check(self):
        self.gate.review = mock.Mock(side_effect=RuntimeError("bridge down"))
        self.assertFalse(self._run())
        self.assertEqual(self.checks[-1], ("jozu-works/SkoConnect", "head1111", "FAIL"))


class CreateCheckPayloadTest(unittest.TestCase):
    """2026-11-01 GitHub behavior change: GITHUB_TOKEN cannot POST-create a
    check run whose name collides with the pull_request_target job's own check
    (403 'Resource not accessible by integration'). The verdict channel is the
    job's OWN check run, discovered via the workflow-run jobs API and PATCHed;
    POST create survives only as the dead-man fallback on a lookup miss."""

    def setUp(self):
        self.gate = load_gate()
        self.calls = []

    def _fake_urlopen(self, lookup_body=b'{"jobs": []}'):
        def fake(req, timeout=None):
            payload = json.loads(req.data.decode()) if req.data else None
            self.calls.append({"method": req.get_method(), "url": req.full_url,
                               "payload": payload})
            if req.get_method() == "GET":
                return _FakeResponse(lookup_body)
            return _FakeResponse(b"{}")
        return fake

    def _create(self, lookup_body=b'{"jobs": []}'):
        with mock.patch.object(self.gate.urllib.request, "urlopen",
                               side_effect=self._fake_urlopen(lookup_body)):
            self.gate.create_check("jozu-works/SkoConnect", "head1111",
                                   "tok", "PASS", "summary", "999")

    def test_verdict_patched_via_jobs_api_job_check(self):
        # The job's check-run id equals the job id; the lookup must use the
        # workflow-run jobs endpoint (a commit-API lookup finds nothing — the
        # job check attaches to the head SHA only at completion).
        lookup_body = json.dumps({"jobs": [
            {"id": 111111, "name": "lint", "started_at": "2026-11-01T15:00:00Z"},
            {"id": 123456, "name": "AI review gate",
             "started_at": "2026-11-01T15:57:00Z", "status": "in_progress"},
        ]}).encode()
        self._create(lookup_body)
        self.assertEqual([c["method"] for c in self.calls], ["GET", "PATCH"])
        lookup, patch_call = self.calls
        self.assertIn("/repos/jozu-works/SkoConnect/actions/runs/999/jobs",
                      lookup["url"])
        self.assertIn("filter=latest", lookup["url"])
        self.assertEqual(patch_call["url"],
                         "https://api.github.com/repos/jozu-works/SkoConnect/check-runs/123456")
        self.assertEqual(patch_call["payload"]["name"], "AI review gate")  # promote_runner-matched name, keep stable
        self.assertEqual(patch_call["payload"]["conclusion"], "success")
        self.assertEqual(patch_call["payload"]["status"], "completed")
        self.assertNotIn("head_sha", patch_call["payload"])  # PATCH takes no head_sha

    def test_jobs_lookup_miss_falls_back_to_post_create_on_head_sha(self):
        self._create()
        self.assertEqual([c["method"] for c in self.calls], ["GET", "POST"])
        post = self.calls[1]
        self.assertIn("/repos/jozu-works/SkoConnect/check-runs", post["url"])
        self.assertEqual(post["payload"]["head_sha"], "head1111")
        self.assertEqual(post["payload"]["name"], "AI review gate")
        self.assertEqual(post["payload"]["conclusion"], "success")

    def test_dead_man_post_rejection_absorbed_exit_code_carries_verdict(self):
        # 2026-11-01 (late): GitHub rejects the jobs lookup AND the dead-man
        # POST for this token. The write attempt stays on the head SHA only,
        # its rejection is ABSORBED, and the job's exit code (0/1) carries
        # the verdict via the job's own head-SHA check run.
        gate = self.gate
        posted = []

        def fake_urlopen(req, timeout=None):
            if req.get_method() == "GET":
                return io.BytesIO(b'{"jobs": []}')
            posted.append(json.loads(req.data.decode()))
            raise gate.urllib.error.HTTPError(req.full_url, 422, "no commit", None, None)

        log = io.StringIO()
        with mock.patch.object(gate.urllib.request, "urlopen", side_effect=fake_urlopen), \
                contextlib.redirect_stdout(log):
            gate.create_check("jozu-works/SkoConnect", "forkhead", "tok",
                              "FAIL", "sum", "999")  # must NOT raise
        self.assertEqual(len(posted), 1)  # exactly one write attempt — on the head SHA
        self.assertEqual(posted[0]["head_sha"], "forkhead")
        self.assertIn("verdict carried by job exit code", log.getvalue())

    def test_non_fork_http_error_absorbed_pass_stays_green(self):
        gate = self.gate

        def fake_urlopen(req, timeout=None):
            if req.get_method() == "GET":
                return io.BytesIO(b'{"jobs": []}')
            raise gate.urllib.error.HTTPError(req.full_url, 500, "boom", None, None)

        log = io.StringIO()
        with mock.patch.object(gate.urllib.request, "urlopen", side_effect=fake_urlopen), \
                mock.patch.object(gate.time, "sleep"), \
                contextlib.redirect_stdout(log):
            gate.create_check("jozu-works/SkoConnect", "head1111", "tok",
                              "PASS", "sum", "999")  # must NOT raise — exit 0 keeps job green
        self.assertIn("verdict carried by job exit code", log.getvalue())


class ExitCodeAlignedVerdictTest(unittest.TestCase):
    """Fail-closed semantics: the script's exit code must MATCH the verdict.
    On PASS the PATCH is best-effort — exit 0 even if the PATCH 403s, because
    the job exiting 0 turns its own check green (which IS the gate check on
    the head SHA). On FAIL exit 1 — the job check goes red regardless."""

    def setUp(self):
        self.gate = load_gate()
        self.gate.git = mock.Mock(side_effect=self._git)
        self.gate.comment = mock.Mock()
        self.sleep = mock.Mock()

    @staticmethod
    def _git(*args):
        if args[0] == "merge-base":
            return "base0000"
        if args[1] == "--name-only":
            return "src/a.ts"
        return "diff --git a/src/a.ts b/src/a.ts"

    def _run_gate(self, verdict_findings):
        """Run the real run() with the job check found and every write 403ing."""
        self.gate.review = mock.Mock(return_value=verdict_findings)
        error = self.gate.urllib.error.HTTPError(
            "https://api.github.com/repos/jozu-works/SkoConnect/check-runs/888",
            403, "Forbidden", _FakeHeaders(),
            io.BytesIO(b'{"message": "Resource not accessible by integration"}'))

        def fake_urlopen(req, timeout=None):
            if req.get_method() == "GET":
                return io.BytesIO(json.dumps(
                    {"jobs": [{"id": 888, "name": "AI review gate",
                               "started_at": "2026-11-01T15:57:00Z"}]}).encode())
            raise error

        log = io.StringIO()
        with mock.patch.object(self.gate.urllib.request, "urlopen",
                               side_effect=fake_urlopen), \
                mock.patch.object(self.gate.time, "sleep", self.sleep), \
                contextlib.redirect_stdout(log):
            result = self.gate.run("base0000", "head1111", "jozu-works/SkoConnect",
                                   42, "tok", "999")
        return result, log.getvalue()

    def test_patch_403_on_pass_returns_true_exit_zero(self):
        result, log = self._run_gate([])
        self.assertTrue(result)  # main maps True → sys.exit(0)
        self.assertIn("verdict channel: job check run (PATCH 888)", log)
        self.assertIn("PATCH failed; verdict carried by job exit code", log)
        self.assertEqual(self.sleep.call_count, 3)  # retries still attempted

    def test_patch_403_on_fail_returns_false_exit_one(self):
        result, log = self._run_gate([
            {"severity": "high", "path": "src/a.ts", "line": 1, "description": "x"}])
        self.assertFalse(result)  # main maps False → sys.exit(1)
        self.assertIn("verdict channel: job check run (PATCH 888)", log)
        self.assertIn("PATCH failed; verdict carried by job exit code", log)

    def test_patch_success_records_verdict(self):
        self.gate.review = mock.Mock(return_value=[])

        def fake_urlopen(req, timeout=None):
            if req.get_method() == "GET":
                return io.BytesIO(json.dumps(
                    {"jobs": [{"id": 888, "name": "AI review gate",
                               "started_at": "2026-11-01T15:57:00Z"}]}).encode())
            return _FakeResponse(b"{}")

        log = io.StringIO()
        with mock.patch.object(self.gate.urllib.request, "urlopen",
                               side_effect=fake_urlopen), \
                contextlib.redirect_stdout(log):
            result = self.gate.run("base0000", "head1111", "jozu-works/SkoConnect",
                                   42, "tok", "999")
        self.assertTrue(result)
        self.assertIn("verdict: PATCHed job check-run 888", log.getvalue())


class _FakeHeaders(dict):
    """Case-insensitive header mapping, like email.message.Message."""

    def get(self, name, default=None):
        for key, value in self.items():
            if key.lower() == name.lower():
                return value
        return default


class _FakeResponse(io.BytesIO):
    """BytesIO with the urlopen response surface the gate reads: read(),
    context manager, .status."""
    status = 200


# Fake token built at runtime so no credential-shaped literal appears in source.
TOKEN = "ghp_" + "T" * 36


class CheckRunHttpErrorDiagnosticsTest(unittest.TestCase):
    """2026-11-01 403 on POST /check-runs: capture sanitized body + headers."""

    def setUp(self):
        self.gate = load_gate()
        self.sleep = mock.Mock()

    def _http_error(self, code, body, headers=None):
        hdrs = _FakeHeaders(headers or {})
        return self.gate.urllib.error.HTTPError(
            "https://api.github.com/repos/jozu-works/SkoConnect/check-runs",
            code, "Forbidden", hdrs,
            io.BytesIO(body.encode()))

    def _run_create_check(self, error, expect_attempts):
        """Returns (raised, log output); asserts attempt count and sleep calls.

        expect_attempts counts WRITE attempts (POST/PATCH); the fake side-effect
        list is one longer because the jobs-API lookup GET consumes the first
        error and falls back to the dead-man POST path."""
        side_effect = error if expect_attempts is None else [error] * (expect_attempts + 1)
        log = io.StringIO()
        with mock.patch.object(self.gate.urllib.request, "urlopen",
                               side_effect=side_effect), \
                mock.patch.object(self.gate.time, "sleep", self.sleep), \
                contextlib.redirect_stdout(log):
            raised = None
            try:
                self.gate.create_check("jozu-works/SkoConnect", "head1111",
                                       TOKEN, "PASS", "sum", "999")
            except Exception as exc:  # noqa: BLE001 - test asserts on re-raise
                raised = exc
            return raised, log.getvalue()

    def test_permission_403_retries_then_absorbed_with_body_logged(self):
        body = json.dumps({
            "message": "Resource not accessible by integration",
            "documentation_url": "https://docs.github.com/rest"})
        raised, log = self._run_create_check(
            self._http_error(403, body), expect_attempts=4)
        self.assertIsNone(raised)  # absorbed: exit code carries the verdict
        self.assertEqual(self.sleep.call_count, 3)  # 5s/15s/45s
        self.assertIn("Resource not accessible by integration", log)
        self.assertIn("HTTP 403", log)
        self.assertIn("verdict: created check-run", log)  # lookup 403 → dead-man POST fallback
        self.assertNotIn(TOKEN, log)  # token never reaches the log

    def test_secondary_rate_limit_403_honors_retry_after_header(self):
        body = json.dumps({
            "message": "You have exceeded a secondary rate limit",
            "documentation_url": "https://docs.github.com/rest/overview/resources-in-the-rest-api#secondary-rate-limits"})
        error = self._http_error(403, body, headers={"retry-after": "30",
                                                     "x-ratelimit-remaining": "0"})
        raised, log = self._run_create_check(error, expect_attempts=4)
        self.assertIsNone(raised)  # absorbed: exit code carries the verdict
        self.assertEqual([mock.call(30)] * 3, self.sleep.call_args_list)
        self.assertIn("retry-after: 30", log)
        self.assertIn("x-ratelimit-remaining: 0", log)
        self.assertIn("secondary rate limit", log)

    def test_patch_403_on_job_check_is_best_effort_not_fatal(self):
        # #418 follow-up: the job's own check is found → PATCH path. A 403 on
        # the PATCH retries with full #416 diagnostics, but is then ABSORBED:
        # the job's exit code carries the verdict, so no exception propagates.
        body = json.dumps({
            "message": "Resource not accessible by integration",
            "documentation_url": "https://docs.github.com/rest"})
        lookup_body = json.dumps(
            {"jobs": [{"id": 4242, "name": "AI review gate",
                       "started_at": "2026-11-01T15:57:00Z"}]}).encode()

        def fake_urlopen(req, timeout=None):
            if req.get_method() == "GET":
                return io.BytesIO(lookup_body)
            raise self.gate.urllib.error.HTTPError(
                "https://api.github.com/repos/jozu-works/SkoConnect/check-runs/4242",
                403, "Forbidden", _FakeHeaders(), io.BytesIO(body.encode()))

        log = io.StringIO()
        with mock.patch.object(self.gate.urllib.request, "urlopen",
                               side_effect=fake_urlopen), \
                mock.patch.object(self.gate.time, "sleep", self.sleep), \
                contextlib.redirect_stdout(log):
            self.gate.create_check("jozu-works/SkoConnect", "head1111",
                                   TOKEN, "PASS", "sum", "999")  # must NOT raise
        self.assertEqual(self.sleep.call_count, 3)  # full backoff on the PATCH
        output = log.getvalue()
        self.assertIn("verdict channel: job check run (PATCH 4242)", output)
        self.assertIn("check-run PATCH /check-runs/4242: HTTP 403", output)
        self.assertIn("Resource not accessible by integration", output)
        self.assertIn("PATCH failed; verdict carried by job exit code", output)
        self.assertNotIn(TOKEN, output)

    def test_non_retryable_422_absorbed_on_first_attempt(self):
        body = json.dumps({"message": "No commit found on SHA: forkhead"})
        raised, log = self._run_create_check(
            self._http_error(422, body), expect_attempts=1)
        self.assertIsNone(raised)  # absorbed: exit code carries the verdict
        self.assertEqual(self.sleep.call_count, 0)  # 422 is non-retryable
        self.assertIn("No commit found on SHA", log)
        self.assertIn("verdict carried by job exit code", log)

    def test_body_is_truncated_to_500_chars(self):
        body = "x" * 2000
        raised, log = self._run_create_check(
            self._http_error(403, body), expect_attempts=None)
        self.assertIsNone(raised)
        self.assertIn("x" * 500, log)
        self.assertNotIn("x" * 501, log)
        self.assertEqual(self.sleep.call_count, 3)  # full backoff before absorption


class SanitizeTest(unittest.TestCase):
    def test_strips_token_shapes(self):
        gate = load_gate()
        dirty = (f"Bearer {TOKEN} and "
                 'access_token: "ya29.supersecret" secret=abcd1234')
        clean = gate._sanitize(dirty, limit=500)
        self.assertNotIn(TOKEN, clean)
        self.assertNotIn("ya29.supersecret", clean)
        self.assertNotIn("abcd1234", clean)
        self.assertIn("<redacted>", clean)


class CommentHttpErrorDiagnosticsTest(unittest.TestCase):
    def test_comment_http_error_logs_sanitized_body_then_raises(self):
        gate = load_gate()
        body = json.dumps({"message": "Forbidden"})
        error = gate.urllib.error.HTTPError(
            "https://api.github.com/repos/jozu-works/SkoConnect/issues/42/comments",
            403, "Forbidden", _FakeHeaders(), io.BytesIO(body.encode()))
        log = io.StringIO()
        with mock.patch.object(gate.urllib.request, "urlopen",
                               side_effect=error), \
                contextlib.redirect_stdout(log):
            with self.assertRaises(gate.urllib.error.HTTPError):
                gate.comment("jozu-works/SkoConnect", 42, "tok", "verdict body")
        self.assertIn("comment POST /repos/jozu-works/SkoConnect/issues/42/comments", log.getvalue())
        self.assertIn('"message": "Forbidden"', log.getvalue())

    def test_comment_url_error_logs_then_raises(self):
        gate = load_gate()
        error = gate.urllib.error.URLError("connection refused")
        log = io.StringIO()
        with mock.patch.object(gate.urllib.request, "urlopen",
                               side_effect=error), \
                contextlib.redirect_stdout(log):
            with self.assertRaises(gate.urllib.error.URLError):
                gate.comment("jozu-works/SkoConnect", 42, "tok", "verdict body")
        self.assertIn("no HTTP response", log.getvalue())


if __name__ == "__main__":
    unittest.main()
