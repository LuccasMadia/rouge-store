import '@testing-library/jest-dom/vitest';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!('ResizeObserver' in globalThis)) {
  // @ts-ignore - jsdom lacks ResizeObserver, Framer Motion checks for it
  globalThis.ResizeObserver = ResizeObserverMock;
}
