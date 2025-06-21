/**
 * Tests for the directory fetching module
 * Tests Step 1 of the validation flow: fetch the directory with signature-agent
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fetchSignaturesDirectory, findKeyById, clearDirectoryCache, getCacheStats } from "../lib/directory";
import type { SignaturesDirectory } from "../lib/types";

// Mock data for testing
const mockDirectory: SignaturesDirectory = {
  keys: [
    {
      kty: "OKP",
      crv: "Ed25519",
      kid: "test-key-1",
      x: "JrQLj5P_89iXES9-vFgrIy29clF9CC_oPPsw3c5D0bs",
      nbf: 1743465600000,
      exp: 1743552000000,
    },
    {
      kty: "OKP",
      crv: "Ed25519",
      kid: "test-key-2",
      x: "AnotherTestKeyForValidationPurposesOnly",
      nbf: 1743465600000,
    },
  ],
  purpose: "rag",
};

describe("Directory Fetching", () => {
  beforeEach(() => {
    // Clear cache before each test
    clearDirectoryCache();
  });

  afterEach(() => {
    // Clear cache after each test
    clearDirectoryCache();
  });

  describe("fetchSignaturesDirectory", () => {
    it("should fetch and parse a valid directory", async () => {
      // Mock fetch to return our test directory
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDirectory),
      });

      const result = await fetchSignaturesDirectory("https://example.com/.well-known/http-message-signatures-directory");

      expect(result.success).toBe(true);
      expect(result.directory).toEqual(mockDirectory);
      expect(result.url).toBe("https://example.com/.well-known/http-message-signatures-directory");
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it("should handle HTTP errors", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      const result = await fetchSignaturesDirectory("https://example.com/.well-known/http-message-signatures-directory");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Failed to fetch directory: 404 Not Found");
    });

    it("should handle network errors", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const result = await fetchSignaturesDirectory("https://example.com/.well-known/http-message-signatures-directory");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Error fetching directory: Network error");
    });

    it("should validate directory structure", async () => {
      const invalidDirectory = { keys: [] }; // Empty keys array

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(invalidDirectory),
      });

      const result = await fetchSignaturesDirectory("https://example.com/.well-known/http-message-signatures-directory");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Directory keys array cannot be empty");
    });

    it("should validate JWK structure", async () => {
      const invalidDirectory = {
        keys: [
          {
            kty: "RSA", // Wrong key type
            kid: "test-key",
          },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(invalidDirectory),
      });

      const result = await fetchSignaturesDirectory("https://example.com/.well-known/http-message-signatures-directory");

      expect(result.success).toBe(false);
      expect(result.error).toContain('Key type must be "OKP" for Ed25519');
    });

    it("should cache directory results", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDirectory),
      });

      const url = "https://example.com/.well-known/http-message-signatures-directory";

      // First fetch
      const result1 = await fetchSignaturesDirectory(url);
      expect(result1.success).toBe(true);

      // Second fetch should use cache
      const result2 = await fetchSignaturesDirectory(url);
      expect(result2.success).toBe(true);

      // Fetch should only be called once
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should respect cache timeout", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDirectory),
      });

      const url = "https://example.com/.well-known/http-message-signatures-directory";
      const shortTimeout = 100; // 100ms

      // First fetch
      await fetchSignaturesDirectory(url, shortTimeout);

      // Wait for cache to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Second fetch should not use cache
      await fetchSignaturesDirectory(url, shortTimeout);

      // Fetch should be called twice
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("findKeyById", () => {
    it("should find a key by its ID", () => {
      const key = findKeyById(mockDirectory, "test-key-1");
      expect(key).toBeDefined();
      expect(key?.kid).toBe("test-key-1");
      expect(key?.x).toBe("JrQLj5P_89iXES9-vFgrIy29clF9CC_oPPsw3c5D0bs");
    });

    it("should return undefined for non-existent key", () => {
      const key = findKeyById(mockDirectory, "non-existent-key");
      expect(key).toBeUndefined();
    });

    it("should handle empty directory", () => {
      const emptyDirectory: SignaturesDirectory = { keys: [] };
      const key = findKeyById(emptyDirectory, "test-key-1");
      expect(key).toBeUndefined();
    });
  });

  describe("Cache Management", () => {
    it("should clear cache", () => {
      // Add some test data to cache
      const cache = new Map();
      cache.set("test-url", { data: mockDirectory, timestamp: Date.now() });

      clearDirectoryCache();

      const stats = getCacheStats();
      expect(stats.size).toBe(0);
    });

    it("should provide cache statistics", () => {
      const stats = getCacheStats();
      expect(stats).toHaveProperty("size");
      expect(stats).toHaveProperty("entries");
      expect(Array.isArray(stats.entries)).toBe(true);
    });
  });
});
