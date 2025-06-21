/**
 * Complete verification example for Web Bot Auth
 * Demonstrates the two-step validation flow:
 * 1. Fetch the directory with signature-agent
 * 2. Validate the signature based on trust-on-first-use
 *
 * Based on the research website implementation:
 * https://http-message-signatures-example.research.cloudflare.com/
 */

import { validateWebBotAuth, validateWithDebug } from "../lib/signature";
import { fetchSignaturesDirectory } from "../lib/directory";
import type { ValidationConfig, ValidationResult } from "../lib/types";

/**
 * Example configuration for validating requests from the research website
 * This demonstrates trust-on-first-use validation
 */
const exampleConfig: ValidationConfig = {
  directoryUrl: "https://http-message-signatures-example.research.cloudflare.com/.well-known/http-message-signatures-directory",
  purpose: "rag", // Expected purpose from the research website
  cacheTimeout: 60 * 60 * 1000, // 1 hour cache
};

/**
 * Example function that validates an incoming request
 * This can be used as middleware in a web application
 *
 * @param request - The incoming HTTP request
 * @returns Promise<ValidationResult> - The validation result
 */
export async function validateIncomingRequest(request: Request): Promise<ValidationResult> {
  console.log("🔍 Validating incoming request...");
  console.log(`📝 URL: ${request.url}`);
  console.log(`🔧 Method: ${request.method}`);

  // Validate the request using our two-step flow
  const result = await validateWebBotAuth(request, exampleConfig);

  if (result.isValid) {
    console.log("✅ Request validation successful!");
    console.log(`🔑 Key ID: ${result.metadata?.kid}`);
    console.log(`🎯 Purpose: ${result.metadata?.purpose}`);
  } else {
    console.log("❌ Request validation failed!");
    console.log(`🚨 Error: ${result.error}`);
    if (result.details) {
      console.log("📊 Validation details:", result.details);
    }
  }

  return result;
}

/**
 * Example function that validates with detailed debugging information
 * Useful for troubleshooting signature validation issues
 *
 * @param request - The incoming HTTP request
 * @returns Promise<ValidationResult> - Detailed validation result
 */
export async function validateWithDetailedDebug(request: Request): Promise<ValidationResult & { debug?: any }> {
  console.log("🔍 Validating request with detailed debug...");

  const result = await validateWithDebug(request, exampleConfig);

  if (result.debug) {
    console.log("🔧 Debug information:");
    console.log("Headers:", result.debug.headers);
    console.log("Config:", result.debug.config);
  }

  return result;
}

/**
 * Example function that demonstrates directory fetching
 * Shows Step 1 of the validation flow
 *
 * @param directoryUrl - The URL to fetch the directory from
 * @returns Promise<void>
 */
export async function demonstrateDirectoryFetching(directoryUrl: string): Promise<void> {
  console.log("📁 Demonstrating directory fetching...");
  console.log(`🌐 Fetching from: ${directoryUrl}`);

  const result = await fetchSignaturesDirectory(directoryUrl);

  if (result.success && result.directory) {
    console.log("✅ Directory fetched successfully!");
    console.log(`🔑 Number of keys: ${result.directory.keys.length}`);
    console.log(`🎯 Purpose: ${result.directory.purpose}`);

    result.directory.keys.forEach((key, index) => {
      console.log(`  Key ${index + 1}:`);
      console.log(`    ID: ${key.kid}`);
      console.log(`    Type: ${key.kty}`);
      console.log(`    Curve: ${key.crv}`);
      if (key.nbf) console.log(`    Not Before: ${new Date(key.nbf).toISOString()}`);
      if (key.exp) console.log(`    Expires: ${new Date(key.exp).toISOString()}`);
    });
  } else {
    console.log("❌ Directory fetching failed!");
    console.log(`🚨 Error: ${result.error}`);
  }
}

/**
 * Example function that demonstrates the complete validation flow
 * Shows both steps working together
 *
 * @param request - The incoming HTTP request
 * @returns Promise<void>
 */
export async function demonstrateCompleteFlow(request: Request): Promise<void> {
  console.log("🚀 Demonstrating complete validation flow...");
  console.log("=".repeat(50));

  // Step 1: Fetch the directory
  console.log("📋 Step 1: Fetching signatures directory...");
  const directoryResult = await fetchSignaturesDirectory(exampleConfig.directoryUrl);

  if (!directoryResult.success) {
    console.log("❌ Directory fetching failed, cannot proceed");
    return;
  }

  console.log("✅ Directory fetched successfully");
  console.log(`🔑 Found ${directoryResult.directory!.keys.length} keys`);

  // Step 2: Validate the signature
  console.log("🔐 Step 2: Validating signature...");
  const validationResult = await validateWebBotAuth(request, exampleConfig);

  if (validationResult.isValid) {
    console.log("✅ Signature validation successful!");
    console.log("🎉 Complete flow completed successfully!");
  } else {
    console.log("❌ Signature validation failed!");
    console.log(`🚨 Error: ${validationResult.error}`);
  }

  console.log("=".repeat(50));
}

/**
 * Example middleware function for use in web frameworks
 * Can be integrated into Express, Fastify, or other frameworks
 *
 * @param config - Validation configuration
 * @returns Middleware function
 */
export function createValidationMiddleware(config: ValidationConfig) {
  return async (request: Request, response: Response, next: Function) => {
    try {
      const result = await validateWebBotAuth(request, config);

      if (result.isValid) {
        // Add validation metadata to request for downstream use
        (request as any).webBotAuth = {
          isValid: true,
          metadata: result.metadata,
        };
        next();
      } else {
        // Return 401 Unauthorized for invalid signatures
        return new Response("Unauthorized: Invalid signature", { status: 401 });
      }
    } catch (error) {
      console.error("Validation middleware error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  };
}

/**
 * Example usage in a Cloudflare Worker
 * Shows how to integrate with the existing worker setup
 */
export async function handleWorkerRequest(request: Request, env: any, ctx: any): Promise<Response> {
  // Skip validation for certain paths (e.g., health checks)
  const url = new URL(request.url);
  if (url.pathname === "/health" || url.pathname === "/debug") {
    return new Response("OK", { status: 200 });
  }

  // Validate the request
  const validationResult = await validateIncomingRequest(request);

  if (!validationResult.isValid) {
    // Return detailed error information for debugging
    return new Response(
      JSON.stringify({
        error: "Signature validation failed",
        details: validationResult.error,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // Continue with normal request processing
  // This is where you would handle the validated request
  return new Response("Request validated successfully!", { status: 200 });
}
