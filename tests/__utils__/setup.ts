import '@testing-library/jest-dom';

// Mock ResizeObserver which is not available in JSDOM
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.performance.memory
Object.defineProperty(window.performance, 'memory', {
  configurable: true,
  enumerable: true,
  value: {
    jsHeapSizeLimit: 2330000000,
    totalJSHeapSize: 2330000000,
    usedJSHeapSize: 2330000000
  }
});

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Setup test environment timeouts
jest.setTimeout(10000);

// Suppress console errors during tests
const originalError = console.error;
console.error = (...args) => {
  if (
    /Warning: ReactDOM.render is no longer supported in React 18/.test(args[0]) ||
    /Warning: useLayoutEffect does nothing on the server/.test(args[0])
  ) {
    return;
  }
  originalError.call(console, ...args);
}; 