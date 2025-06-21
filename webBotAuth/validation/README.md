# Web Bot Auth Validation Flow

This directory contains the implementation of the HTTP Message Signatures validation flow for web-bot-auth, as requested by Thibault Meunier.

## Overview

The validation flow implements a two-step process:

1. **Fetch Directory**: Retrieve the HTTP Message Signatures directory from the target domain
2. **Validate Signature**: Verify the signature using the retrieved public keys with trust-on-first-use approach

## Architecture

```
validation/
├── lib/                    # Core validation library
│   ├── directory.ts       # Directory fetching and parsing
│   ├── signature.ts       # Signature validation logic
│   └── types.ts          # TypeScript type definitions
├── tests/                 # Test suite
│   ├── directory.test.ts  # Directory fetching tests
│   └── signature.test.ts  # Signature validation tests
├── examples/              # Usage examples
│   └── verification.ts    # Complete verification example
└── README.md             # This file
```

## Implementation Details

### Step 1: Directory Fetching

- Fetches the `.well-known/http-message-signatures-directory` endpoint
- Parses the JSON response containing public keys
- Validates the directory structure according to RFC 9421

### Step 2: Signature Validation

- Extracts signature components from HTTP request headers
- Verifies Ed25519 signatures using the retrieved public keys
- Implements trust-on-first-use validation (not dependent on Cloudflare's trust)

## Usage

```typescript
import { validateWebBotAuth } from "./lib/signature";

// Validate an incoming request
const isValid = await validateWebBotAuth(request, {
  directoryUrl: "https://example.com/.well-known/http-message-signatures-directory",
});
```

## Integration

This validation flow is integrated into the main crawler-test application and can be used to:

- Validate incoming requests from web-bot-auth enabled crawlers
- Ensure proper signature verification
- Provide debugging information for signature validation issues

## References

- [web-bot-auth GitHub Repository](https://github.com/cloudflare/web-bot-auth)
- [HTTP Message Signatures Example](https://http-message-signatures-example.research.cloudflare.com/)
- [Verification Workers Example](https://github.com/cloudflare/web-bot-auth/tree/main/examples/verification-workers)
- [RFC 9421 - HTTP Message Signatures](https://datatracker.ietf.org/doc/html/rfc9421)
