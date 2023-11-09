// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { server } from "test/server";

import { initializeIcons } from "@fluentui/font-icons-mdl2";
import "@testing-library/jest-dom";

const crypto = require("crypto");

Object.defineProperty(global.self, "crypto", {
  value: {
    getRandomValues: (arr: string | any[]) => crypto.randomBytes(arr.length),
  },
});

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => {
  server.listen({ onUnhandledRequest: "bypass" });
  initializeIcons();
});
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

beforeEach(() => {
  jest.resetAllMocks();
});
