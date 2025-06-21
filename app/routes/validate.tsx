/**
 * Web Bot Auth Validation Route
 * Demonstrates the two-step validation flow:
 * 1. Fetch the directory with signature-agent
 * 2. Validate the signature based on trust-on-first-use
 */

import { json } from "@remix-run/cloudflare";
import { validateWebBotAuth, validateWithDebug } from "../../webBotAuth/validation/lib/signature";
import { fetchSignaturesDirectory } from "../../webBotAuth/validation/lib/directory";
import type { ValidationConfig } from "../../webBotAuth/validation/lib/types";

export function meta() {
  return [
    { title: "Web Bot Auth Validation - CrawlTest.com" },
    {
      name: "description",
      content: "Validate HTTP Message Signatures using web-bot-auth library with trust-on-first-use approach.",
    },
  ];
}

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const debug = url.searchParams.get("debug") === "true";

  // Configuration for validation
  const config: ValidationConfig = {
    directoryUrl: "https://http-message-signatures-example.research.cloudflare.com/.well-known/http-message-signatures-directory",
    purpose: "rag",
    cacheTimeout: 60 * 60 * 1000, // 1 hour
  };

  try {
    // Perform validation
    const result = debug ? await validateWithDebug(request, config) : await validateWebBotAuth(request, config);

    return json({
      success: true,
      validation: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "fetch-directory") {
    const directoryUrl = formData.get("directoryUrl") as string;

    try {
      const result = await fetchSignaturesDirectory(directoryUrl);
      return json({
        success: true,
        directory: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return json(
        {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  }

  return json({ success: false, error: "Invalid action" }, { status: 400 });
}

export default function ValidatePage() {
  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black tracking-tight mb-4">Web Bot Auth Validation</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Validate HTTP Message Signatures using the web-bot-auth library with trust-on-first-use approach. This implements the two-step validation flow requested by Thibault Meunier.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Validation Flow */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-black mb-4">Two-Step Validation Flow</h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <div>
                  <h3 className="font-semibold text-black">Fetch Directory</h3>
                  <p className="text-gray-600 text-sm">Retrieve the HTTP Message Signatures directory from the target domain using signature-agent.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                <div>
                  <h3 className="font-semibold text-black">Validate Signature</h3>
                  <p className="text-gray-600 text-sm">Verify the signature using the retrieved public keys with trust-on-first-use approach.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Key Features</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Trust-on-first-use validation (not dependent on Cloudflare's trust)</li>
                <li>• Directory caching for performance</li>
                <li>• Purpose validation support</li>
                <li>• Detailed error reporting</li>
                <li>• Debug mode for troubleshooting</li>
              </ul>
            </div>
          </div>

          {/* Usage Examples */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-black mb-4">Usage Examples</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-black mb-2">Basic Validation</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {`import { validateWebBotAuth } from './validation/lib/signature';

const result = await validateWebBotAuth(request, {
  directoryUrl: 'https://example.com/.well-known/http-message-signatures-directory',
  purpose: 'rag'
});`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-black mb-2">Debug Mode</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {`import { validateWithDebug } from './validation/lib/signature';

const result = await validateWithDebug(request, config);
console.log(result.debug);`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-black mb-2">Directory Fetching</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {`import { fetchSignaturesDirectory } from './validation/lib/directory';

const result = await fetchSignaturesDirectory(
  'https://example.com/.well-known/http-message-signatures-directory'
);`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Section */}
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-black mb-4">Integration</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-black mb-3">Cloudflare Worker</h3>
              <p className="text-gray-600 text-sm mb-3">The validation flow is integrated into the main crawler-test application and can be used as middleware in Cloudflare Workers.</p>
              <a href="/validate?debug=true" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Test with Debug Mode
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-3">Research Website</h3>
              <p className="text-gray-600 text-sm mb-3">This implementation follows the same pattern as the research website:</p>
              <a
                href="https://http-message-signatures-example.research.cloudflare.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                View Research Website
              </a>
            </div>
          </div>
        </div>

        {/* References */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">References</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>
              •{" "}
              <a href="https://github.com/cloudflare/web-bot-auth" className="underline hover:no-underline">
                web-bot-auth GitHub Repository
              </a>
            </li>
            <li>
              •{" "}
              <a href="https://github.com/cloudflare/web-bot-auth/tree/main/examples/verification-workers" className="underline hover:no-underline">
                Verification Workers Example
              </a>
            </li>
            <li>
              •{" "}
              <a href="https://http-message-signatures-example.research.cloudflare.com/" className="underline hover:no-underline">
                HTTP Message Signatures Example
              </a>
            </li>
            <li>
              •{" "}
              <a href="https://datatracker.ietf.org/doc/html/rfc9421" className="underline hover:no-underline">
                RFC 9421 - HTTP Message Signatures
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
