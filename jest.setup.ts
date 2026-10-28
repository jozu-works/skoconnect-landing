import '@testing-library/jest-dom';

// ── IntersectionObserver mock ────────────────────────────────────────────────
// LandingPage (app/page.tsx) observes [data-animate] sections for scroll reveal.
// jsdom does not implement IntersectionObserver.
class MockIntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {}
  observe = jest.fn((target: Element) => {
    // Report everything as intersecting so reveal logic runs deterministically.
    this.callback(
      [
        {
          isIntersecting: true,
          target,
          intersectionRatio: 1,
          time: 0,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
        } as unknown as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver,
    );
  });
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});
Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// ── Scroll stubs ─────────────────────────────────────────────────────────────
// jsdom has no layout engine: scrollIntoView and window.scrollTo don't exist.
Element.prototype.scrollIntoView = jest.fn();
window.scrollTo = jest.fn();
