/**
 * Indirection over window.location.replace so tests can mock navigation
 * without fighting jsdom's unforgeable Location object.
 */
export function redirect(url: string): void {
  window.location.replace(url);
}
