/**
 * Web Bot Auth Validation - Main Export
 *
 * This module exports the complete validation flow for HTTP Message Signatures
 * using the web-bot-auth library with trust-on-first-use approach.
 *
 * Implementation of the two-step validation flow requested by Thibault Meunier:
 * 1. Fetch the directory with signature-agent
 * 2. Validate the signature based on trust-on-first-use
 */

// Core validation functions
export { validateWebBotAuth, validateWithDebug, createValidationMiddleware, validateBatch } from "./lib/signature";

// Directory fetching functions
export { fetchSignaturesDirectory, findKeyById, clearDirectoryCache, getCacheStats } from "./lib/directory";

// Type definitions
export type { ValidationResult, ValidationConfig, SignaturesDirectory, DirectoryResult, SignatureComponents, JWK } from "./lib/types";

// Example functions
export { validateIncomingRequest, validateWithDetailedDebug, demonstrateDirectoryFetching, demonstrateCompleteFlow, handleWorkerRequest } from "./examples/verification";
