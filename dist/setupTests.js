import '@testing-library/jest-dom';
// Mock ResizeObserver which is not available in jsdom
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};
// Mock window.matchMedia which is not available in jsdom
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
// Mock IntersectionObserver which is not available in jsdom
global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
        this.callback = callback;
        this.root = null;
        this.rootMargin = '0px';
        this.thresholds = [0];
    }
    observe() { }
    unobserve() { }
    disconnect() { }
    takeRecords() {
        return [];
    }
};
// Mock fs-extra
jest.mock('fs-extra', () => ({
    readFile: jest.fn(),
    readdir: jest.fn(),
    stat: jest.fn(),
    writeFile: jest.fn(),
    exists: jest.fn(),
    mkdir: jest.fn(),
    remove: jest.fn()
}));
// Mock chokidar
jest.mock('chokidar', () => ({
    watch: jest.fn(() => ({
        on: jest.fn().mockReturnThis(),
        close: jest.fn()
    }))
}));
// Mock child_process
jest.mock('child_process', () => ({
    spawn: jest.fn(() => ({
        on: jest.fn(),
        kill: jest.fn()
    })),
    execSync: jest.fn()
}));
// Global test utilities
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
};
//# sourceMappingURL=setupTests.js.map