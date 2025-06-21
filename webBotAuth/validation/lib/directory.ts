/**
 * Directory fetching module for HTTP Message Signatures
 * Implements Step 1 of the validation flow: fetch the directory with signature-agent
 */

import type { SignaturesDirectory, DirectoryResult, JWK } from "./types";

// In-memory cache for directory results
const directoryCache = new Map<string, { data: SignaturesDirectory; timestamp: number }>();

/**
 * Fetches the HTTP Message Signatures directory from the specified URL
 * This implements the first step of the validation flow
 *
 * @param url - The URL to fetch the directory from (e.g., https://example.com/.well-known/http-message-signatures-directory)
 * @param cacheTimeout - Cache timeout in milliseconds (default: 1 hour)
 * @returns Promise<DirectoryResult> - The directory fetching result
 */
export async function fetchSignaturesDirectory(
  url: string,
  cacheTimeout: number = 60 * 60 * 1000 // 1 hour default
): Promise<DirectoryResult> {
  const timestamp = Date.now();

  try {
    // Check cache first
    const cached = directoryCache.get(url);
    if (cached && timestamp - cached.timestamp < cacheTimeout) {
      return {
        success: true,
        directory: cached.data,
        url,
        timestamp: cached.timestamp,
      };
    }

    // Fetch the directory
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "web-bot-auth-validator/1.0",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch directory: ${response.status} ${response.statusText}`,
        url,
        timestamp,
      };
    }

    const data = await response.json();

    // Validate directory structure
    const validationResult = validateDirectoryStructure(data);
    if (!validationResult.isValid) {
      return {
        success: false,
        error: `Invalid directory structure: ${validationResult.error}`,
        url,
        timestamp,
      };
    }

    const directory = data as SignaturesDirectory;

    // Cache the result
    directoryCache.set(url, { data: directory, timestamp });

    return {
      success: true,
      directory,
      url,
      timestamp,
    };
  } catch (error) {
    return {
      success: false,
      error: `Error fetching directory: ${error instanceof Error ? error.message : String(error)}`,
      url,
      timestamp,
    };
  }
}

/**
 * Validates the structure of the signatures directory
 * Ensures it conforms to the expected format
 *
 * @param data - The parsed JSON data from the directory
 * @returns Object with validation result
 */
function validateDirectoryStructure(data: any): { isValid: boolean; error?: string } {
  if (!data || typeof data !== "object") {
    return { isValid: false, error: "Directory data is not an object" };
  }

  if (!Array.isArray(data.keys)) {
    return { isValid: false, error: 'Directory must contain a "keys" array' };
  }

  if (data.keys.length === 0) {
    return { isValid: false, error: "Directory keys array cannot be empty" };
  }

  // Validate each key in the array
  for (let i = 0; i < data.keys.length; i++) {
    const key = data.keys[i];
    const keyValidation = validateJWK(key);
    if (!keyValidation.isValid) {
      return {
        isValid: false,
        error: `Invalid key at index ${i}: ${keyValidation.error}`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Validates a JSON Web Key (JWK) structure
 * Ensures it has the required fields for Ed25519 keys
 *
 * @param key - The JWK to validate
 * @returns Object with validation result
 */
function validateJWK(key: any): { isValid: boolean; error?: string } {
  if (!key || typeof key !== "object") {
    return { isValid: false, error: "Key is not an object" };
  }

  // Check required fields for Ed25519 keys
  if (key.kty !== "OKP") {
    return { isValid: false, error: 'Key type must be "OKP" for Ed25519' };
  }

  if (key.crv !== "Ed25519") {
    return { isValid: false, error: 'Curve must be "Ed25519"' };
  }

  if (!key.x || typeof key.x !== "string") {
    return { isValid: false, error: 'Missing or invalid "x" coordinate' };
  }

  if (!key.kid || typeof key.kid !== "string") {
    return { isValid: false, error: 'Missing or invalid "kid" (Key ID)' };
  }

  // Validate timestamp fields if present
  if (key.nbf !== undefined && typeof key.nbf !== "number") {
    return { isValid: false, error: 'Invalid "nbf" (Not Before) timestamp' };
  }

  if (key.exp !== undefined && typeof key.exp !== "number") {
    return { isValid: false, error: 'Invalid "exp" (Expiration) timestamp' };
  }

  return { isValid: true };
}

/**
 * Finds a key in the directory by its Key ID (kid)
 *
 * @param directory - The signatures directory
 * @param kid - The Key ID to search for
 * @returns The matching JWK or undefined if not found
 */
export function findKeyById(directory: SignaturesDirectory, kid: string): JWK | undefined {
  return directory.keys.find((key) => key.kid === kid);
}

/**
 * Clears the directory cache
 * Useful for testing or when cache needs to be refreshed
 */
export function clearDirectoryCache(): void {
  directoryCache.clear();
}

/**
 * Gets cache statistics
 * Useful for debugging and monitoring
 */
export function getCacheStats(): { size: number; entries: string[] } {
  return {
    size: directoryCache.size,
    entries: Array.from(directoryCache.keys()),
  };
}
