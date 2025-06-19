// import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "CrawlTest.com - AI Crawler Testing Ground" },
    {
      name: "description",
      content:
        "CrawlTest.com provides a structured environment for testing AI crawlers, web scrapers, and indexing tools. Features semantic HTML, JSON-LD data, and best practices for content extraction.",
    },
    { name: "robots", content: "index, follow" },
    { name: "author", content: "CrawlTest.com" },
    { name: "keywords", content: "AI crawler, web scraping, test site, machine learning, data extraction, semantic HTML, JSON-LD, structured data, crawler testing" },
    { property: "og:title", content: "CrawlTest.com - AI Crawler Testing Ground" },
    { property: "og:description", content: "Test your AI crawlers and web scrapers with our structured, semantic testing environment." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://crawltest.com" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "CrawlTest.com - AI Crawler Testing Ground" },
    { name: "twitter:description", content: "Test your AI crawlers and web scrapers with our structured, semantic testing environment." },
    { rel: "canonical", href: "https://crawltest.com" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    { href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap", rel: "stylesheet" },
  ];
}

export function loader() {
  return {
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };
}

export default function Home({ loaderData }: { loaderData: { timestamp: string; version: string } }) {
  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Human-readable content */}
        <main>
          <header className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <img src="/assets/crawl-test.svg" alt="CrawlTest Logo" className="w-16 h-16 mr-4" />
              <h1 className="text-5xl font-bold text-black tracking-tight">CrawlTest.com</h1>
            </div>
          </header>

          <section className="mb-10">
            <div className="prose max-w-none text-gray-700">
              <p className="mb-3">
                CrawlTest.com is a static test page designed for validating web crawlers, scrapers, and content extraction algorithms. The site implements standard web practices including semantic
                HTML5, JSON-LD structured data, and proper meta tags to provide a reliable baseline for testing parsing capabilities.
              </p>
              <p>
                Use this page to verify your crawler can correctly extract titles, descriptions, structured data, and content hierarchy. The page is intentionally simple and static to avoid JavaScript
                rendering requirements and provide consistent results across different crawling approaches.
              </p>
            </div>
          </section>

          {/* New section: Recommended Tools */}
          <div className="mb-10">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black">Recommended Crawler Tools</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-black mb-3">Open Source Crawlers</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <a href="https://github.com/scrapy/scrapy" className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors" target="_blank" rel="noopener noreferrer">
                      Scrapy
                    </a>
                    {" - "}
                    <span className="text-sm">Fast and powerful Python web crawling framework</span>
                  </li>
                  <li>
                    <a
                      href="https://github.com/microsoft/playwright"
                      className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Playwright
                    </a>
                    {" - "}
                    <span className="text-sm">Modern automation and testing framework</span>
                  </li>
                  <li>
                    <a
                      href="https://github.com/puppeteer/puppeteer"
                      className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Puppeteer
                    </a>
                    {" - "}
                    <span className="text-sm">Node.js API for Chrome/Chromium</span>
                  </li>
                  <li>
                    <a
                      href="https://github.com/crawlab-team/crawlab"
                      className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Crawlab
                    </a>
                    {" - "}
                    <span className="text-sm">Distributed crawler management platform</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-black mb-3">Parsing Libraries</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <a
                      href="https://github.com/cheeriojs/cheerio"
                      className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Cheerio
                    </a>
                    {" - "}
                    <span className="text-sm">Fast, flexible jQuery implementation for parsing</span>
                  </li>
                  <li>
                    <a
                      href="https://github.com/beautifulsoup/beautifulsoup4"
                      className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Beautiful Soup
                    </a>
                    {" - "}
                    <span className="text-sm">Python library for pulling data from HTML/XML</span>
                  </li>
                  <li>
                    <a
                      href="https://github.com/postlight/parser"
                      className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Mercury Parser
                    </a>
                    {" - "}
                    <span className="text-sm">Web article extraction tool</span>
                  </li>
                  <li>
                    <a href="https://github.com/jsdom/jsdom" className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors" target="_blank" rel="noopener noreferrer">
                      JSDOM
                    </a>
                    {" - "}
                    <span className="text-sm">Pure JavaScript DOM implementation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black">What's Included</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-black mr-3 text-lg">•</span>
                  <span>Semantic HTML5 markup</span>
                </li>
                <li className="flex items-center">
                  <span className="text-black mr-3 text-lg">•</span>
                  <span>JSON-LD structured data</span>
                </li>
                <li className="flex items-center">
                  <span className="text-black mr-3 text-lg">•</span>
                  <span>OpenGraph & Twitter meta tags</span>
                </li>
                <li className="flex items-center">
                  <span className="text-black mr-3 text-lg">•</span>
                  <span>robots.txt & sitemap.xml</span>
                </li>
                <li className="flex items-center">
                  <span className="text-black mr-3 text-lg">•</span>
                  <span>Static content (no JS required)</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black">Test Your Crawler</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-black mr-3 text-lg">•</span>
                  <span>Extract page title & meta description</span>
                </li>
                <li className="flex items-center">
                  <span className="text-black mr-3 text-lg">•</span>
                  <span>Parse JSON-LD structured data</span>
                </li>
                <li className="flex items-center">
                  <span className="text-black mr-3 text-lg">•</span>
                  <span>Identify content sections (h1-h4)</span>
                </li>
                <li className="flex items-center">
                  <span className="text-black mr-3 text-lg">•</span>
                  <span>Extract links & their attributes</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black">Source Code</h3>
            </div>
            <div className="text-gray-700">
              <p>This site is open source and available on GitHub:</p>
              <p className="mt-2">
                <a href="https://github.com/CameronWhiteside/crawl-test" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                  github.com/CameronWhiteside/crawl-test
                </a>
              </p>
            </div>
          </div>
        </main>

        {/* Machine-readable structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CrawlTest.com",
              description:
                "CrawlTest.com provides a structured environment for testing AI crawlers, web scrapers, and indexing tools. Features semantic HTML, JSON-LD data, and best practices for content extraction.",
              url: "https://crawltest.com",
              author: {
                "@type": "Organization",
                name: "CrawlTest.com",
              },
              publisher: {
                "@type": "Organization",
                name: "CrawlTest.com",
              },
              datePublished: "2024-01-01",
              dateModified: new Date().toISOString().split("T")[0],
              mainEntity: {
                "@type": "TechArticle",
                headline: "CrawlTest.com - AI Crawler Testing Ground",
                description: "Test your AI crawlers and web scrapers with our structured, semantic testing environment.",
                articleBody:
                  "CrawlTest.com is your dedicated testing ground for AI-powered web crawlers and content extraction tools. Our site serves as a controlled environment where developers and researchers can validate their crawling algorithms, test parsing capabilities, and ensure proper handling of structured data.",
                keywords: ["AI crawler", "web scraping", "test site", "machine learning", "data extraction", "semantic HTML", "JSON-LD", "structured data", "crawler testing"],
                author: {
                  "@type": "Organization",
                  name: "CrawlTest.com",
                },
                about: {
                  "@type": "SoftwareApplication",
                  applicationCategory: "Testing Environment",
                  operatingSystem: "Web-based",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                },
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              additionalType: "TestingEnvironment",
              sitePurpose: "Test AI crawlers and scrapers",
              targetAudience: "Developers & researchers",
              contentFeatures: [
                "Semantic HTML5 markup",
                "JSON-LD structured data",
                "OpenGraph and Twitter meta tags",
                "robots.txt and sitemap.xml",
                "Clear content hierarchy",
                "Machine-readable metadata",
                "Static, crawl-once content",
              ],
              recommendedTools: [
                {
                  "@type": "SoftwareApplication",
                  name: "Scrapy",
                  url: "https://github.com/scrapy/scrapy",
                  applicationCategory: "Web Crawler",
                },
                {
                  "@type": "SoftwareApplication",
                  name: "Playwright",
                  url: "https://github.com/microsoft/playwright",
                  applicationCategory: "Browser Automation",
                },
                {
                  "@type": "SoftwareApplication",
                  name: "Beautiful Soup",
                  url: "https://github.com/beautifulsoup/beautifulsoup4",
                  applicationCategory: "HTML Parser",
                },
              ],
            }),
          }}
        />

        <div style={{ display: "none" }}>
          <div id="crawler-metadata">
            <meta name="site-purpose" content="Test AI crawlers and scrapers" />
            <meta name="content-type" content="Static, educational" />
            <meta name="target-audience" content="Developers & researchers" />
            <meta name="test-features" content="semantic-html,content-hierarchy,machine-readable-metadata,modern-styling,static-content,json-ld,opengraph,twitter-cards" />
            <meta name="expected-behavior" content="title-extraction,content-parsing,metadata-parsing,context-understanding,structured-data-parsing" />
            <meta name="recommended-tools" content="scrapy,playwright,puppeteer,crawlab,cheerio,beautifulsoup,mercury-parser,jsdom" />
            <meta name="site-version" content={loaderData.version} />
            <meta name="last-updated" content={loaderData.timestamp} />
          </div>
        </div>
      </div>
    </div>
  );
}
