/**
 * Tests for the signature validation module
 * Tests Step 2 of the validation flow: validate the signature based on trust-on-first-use
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateWebBotAuth, validateWithDebug } from "../lib/signature";
import { clearDirectoryCache } from "../lib/directory";
import type { ValidationConfig } from "../lib/types";

// Mock configuration for testing
const testConfig: ValidationConfig = {
  directoryUrl: "https://example.com/.well-known/http-message-signatures-directory",
  purpose: "test",
  cacheTimeout: 1000,
};

describe("Signature Validation", () => {
  beforeEach(() => {
    // Clear cache before each test
    clearDirectoryCache();
  });

  describe("validateWebBotAuth", () => {
    it("should return false for requests without signature headers", async () => {
      const request = new Request("https://example.com/test", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await validateWebBotAuth(request, testConfig);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain("No HTTP Message Signature headers found");
      expect(result.details?.signatureFound).toBe(false);
    });

    it("should return false for requests with incomplete signature headers", async () => {
      const request = new Request("https://example.com/test", {
        method: "GET",
        headers: {
          signature: "test-signature",
          // Missing signature-input header
        },
      });

      const result = await validateWebBotAuth(request, testConfig);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain("No HTTP Message Signature headers found");
    });

    it("should extract signature components correctly", async () => {
      const request = new Request("https://example.com/test", {
        method: "GET",
        headers: {
          signature: "test-signature-value",
          "signature-input": 'keyid="test-key",alg="ed25519",created=1234567890,expires=1234567899,tag="web-bot-auth"',
        },
      });

      // Mock the directory fetching to return a valid directory
      const mockDirectory = {
        keys: [
          {
            kty: "OKP",
            crv: "Ed25519",
            kid: "test-key",
            x: "test-public-key",
          },
        ],
        purpose: "test",
      };

      // Mock fetch to return our test directory
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDirectory),
      });

      const result = await validateWebBotAuth(request, testConfig);

      // The validation should fail at the signature verification step
      // but we can verify that the components were extracted correctly
      expect(result.details?.signatureFound).toBe(true);
      expect(result.details?.directoryFetched).toBe(true);
      expect(result.details?.keyMatched).toBe(true);
    });
  });

  describe("validateWithDebug", () => {
    it("should include debug information", async () => {
      const request = new Request("https://example.com/test", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await validateWithDebug(request, testConfig);

      expect(result.debug).toBeDefined();
      expect(result.debug?.url).toBe("https://example.com/test");
      expect(result.debug?.method).toBe("GET");
      expect(result.debug?.config).toEqual(testConfig);
      expect(result.debug?.headers).toBeDefined();
    });
  });

  describe("Signature Component Extraction", () => {
    it("should parse signature-input header correctly", async () => {
      const signatureInput = 'keyid="test-key",alg="ed25519",created=1234567890,expires=1234567899,tag="web-bot-auth",nonce="test-nonce"';

      const request = new Request("https://example.com/test", {
        method: "GET",
        headers: {
          signature: "test-signature",
          "signature-input": signatureInput,
        },
      });

      // Clear any cached directory results
      clearDirectoryCache();

      // Mock fetch to return an error
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      const result = await validateWebBotAuth(request, testConfig);

      expect(result.details?.signatureFound).toBe(true);
      expect(result.details?.directoryFetched).toBe(false);
      expect(result.error).toContain("Failed to fetch signatures directory");
    });
  });
});
