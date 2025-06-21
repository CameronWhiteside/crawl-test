# CrawlTest.com

A test page designed for validating web crawlers, scrapers, and content extraction algorithms. Built with modern web standards including semantic HTML5, JSON-LD structured data, and proper meta tags.

## Features

- Semantic HTML5 markup
- JSON-LD structured data
- OpenGraph & Twitter meta tags
- robots.txt & sitemap.xml
- Static content (no JavaScript required)
- Curated list of open-source crawler tools
- **Web Bot Auth validation flow** - HTTP Message Signatures validation with trust-on-first-use approach

## Web Bot Auth Validation

This project includes a comprehensive implementation of HTTP Message Signatures validation using the [web-bot-auth](https://github.com/cloudflare/web-bot-auth) library. The validation flow implements the two-step process requested by Thibault Meunier:

1. **Fetch Directory**: Retrieve the HTTP Message Signatures directory from the target domain
2. **Validate Signature**: Verify the signature using the retrieved public keys with trust-on-first-use approach

### Key Features

- Trust-on-first-use validation (not dependent on Cloudflare's trust)
- Directory caching for performance
- Purpose validation support
- Detailed error reporting
- Debug mode for troubleshooting
- Integration with Cloudflare Workers

### Usage

Visit `/validate` to see the validation flow in action, or use the validation library directly:

```typescript
import { validateWebBotAuth } from "./webBotAuth/validation/lib/signature";

const result = await validateWebBotAuth(request, {
  directoryUrl: "https://example.com/.well-known/http-message-signatures-directory",
  purpose: "rag",
});
```

### Implementation Details

The validation flow is implemented in the `webBotAuth/validation/` directory with:

- `lib/` - Core validation library
- `tests/` - Comprehensive test suite
- `examples/` - Usage examples and demonstrations

For more details, see the [validation README](webBotAuth/validation/README.md).

## Usage

Visit [crawltest.com](https://crawltest.com) to test your web crawler or scraper. The page is designed to be crawled once and provides a reliable baseline for testing parsing capabilities.

## Development

This is a site built with React and Remix. To run locally:

```bash
npm install
npm run build
npm run preview
```

### Testing

Run the validation tests:

```bash
npm test
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Feel free to submit issues, feature requests, or pull requests. This project is open source and welcomes contributions from the community.

## References

- [web-bot-auth GitHub Repository](https://github.com/cloudflare/web-bot-auth)
- [HTTP Message Signatures Example](https://http-message-signatures-example.research.cloudflare.com/)
- [Verification Workers Example](https://github.com/cloudflare/web-bot-auth/tree/main/examples/verification-workers)
- [RFC 9421 - HTTP Message Signatures](https://datatracker.ietf.org/doc/html/rfc9421)
