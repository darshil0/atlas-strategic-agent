// vitest/setup.ts
import "@testing-library/jest-dom/vitest";
import { vi, beforeEach, beforeAll, afterAll } from "vitest";

// Mock localStorage for consistent testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock IntersectionObserver
class IntersectionObserverMock {
  constructor() { }
  observe() { }
  disconnect() { }
  unobserve() { }
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// Mock console methods for cleaner test output
const originalConsole = console;
beforeAll(() => {
  // @ts-ignore
  vi.spyOn(console, 'warn').mockImplementation(() => { });
  // @ts-ignore
  vi.spyOn(console, 'error').mockImplementation(() => { });
});

afterAll(() => {
  // @ts-ignore
  vi.restoreAllMocks();
  console.warn = originalConsole.warn.bind(originalConsole);
  console.error = originalConsole.error.bind(originalConsole);
});

// Reset mocks before each test
beforeEach(() => {
  localStorageMock.clear.mockClear();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();

  // Reset all mocks
  vi.clearAllMocks();
});

// Mock ENV for testing
vi.stubGlobal('ENV', {
  GEMINI_API_KEY: 'test-key',
  DEBUG_MODE: true,
  APP_VERSION: '3.2.0-test',
});

// Mock crypto.randomUUID for deterministic tests
vi.stubGlobal('crypto', {
  getRandomValues: vi.fn(() => new Uint8Array(16)),
});
