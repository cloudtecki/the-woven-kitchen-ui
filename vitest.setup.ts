import { afterEach, beforeAll, vi, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import AuthService from './src/core/http/auth.service';
// Import to ensure the types are properly registered
import '@testing-library/jest-dom/vitest';

// Polyfills for jsdom
class ResizeObserverMock implements ResizeObserver {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_: ResizeObserverCallback) {
        // Mock implementation
    }
    observe() {
        // Mock implementation
    }
    unobserve() {
        // Mock implementation
    }
    disconnect() {
        // Mock implementation
    }
}

class IntersectionObserverMock implements IntersectionObserver {
    root: Document | Element | null = null;
    rootMargin: string = '';
    thresholds: ReadonlyArray<number> = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_: IntersectionObserverCallback, __?: IntersectionObserverInit) {
        // Mock implementation
    }
    observe() {
        // Mock implementation
    }
    unobserve() {
        // Mock implementation
    }
    disconnect() {
        // Mock implementation
    }
    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }
}

global.ResizeObserver = ResizeObserverMock;
global.IntersectionObserver = IntersectionObserverMock;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
});

// Define mock environment variables
const mockTwkVars = {
    apiUrl: 'http://localhost:7000/api',
    apiScope: 'api://abcd',
    clientId: 'abcd-client-id',
    authority: 'https://sts.windows.net/abcd/',
    baseUrl: 'http://localhost:7001',
};

// Set the global variable
beforeAll(() => {
    globalThis.twkVars = mockTwkVars;

    // Mock the getAppEnv function
    vi.mock('utils/env-vars', () => ({
        getAppEnv: () => mockTwkVars,
    }));
});

beforeEach(() => {
    vi.resetAllMocks();
    // Mock the AuthService getAuthToken method to return an empty string promise
    vi.spyOn(AuthService, 'getAuthToken').mockImplementation(() => {
        return Promise.resolve('');
    });
});

afterEach(() => {
    cleanup();
    vi.resetAllMocks();
});