import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ---------------------------------------------------------------------------
  // Remove the X-Powered-By: Next.js response header (stack fingerprinting).
  // ---------------------------------------------------------------------------
  poweredByHeader: false,

  // ---------------------------------------------------------------------------
  // Explicitly disable production browser source maps.
  // This is already the default — setting it explicitly prevents an accidental
  // CI flag or future config change from exposing the source code.
  // ---------------------------------------------------------------------------
  productionBrowserSourceMaps: false,

  // ---------------------------------------------------------------------------
  // SWC compiler hardening.
  // ---------------------------------------------------------------------------
  compiler: {
    // Strip all console.* calls except console.error from production bundles.
    // Avoids leaking internal values, debug output, or calculation internals.
    removeConsole: {
      exclude: ["error"],
    },
    // Remove data-testid / data-test / data-cy attributes from production JSX.
    // These expose component structure to anyone reading the rendered DOM.
    reactRemoveProperties: {
      properties: ["^data-testid$", "^data-test$", "^data-cy$"],
    },
  },

  // ---------------------------------------------------------------------------
  // Security response headers applied at the application layer.
  //
  // These apply on every deployment target (Vercel, Railway, Docker, next start)
  // and serve as the authoritative source. public/_headers provides a secondary
  // layer at the CDN edge for Cloudflare Pages / Netlify deployments.
  //
  // CSP: script-src uses SHA-256 hashes instead of 'unsafe-inline'.
  // The hashes cover the two JSON-LD <script> blocks in layout.tsx.
  // If you change the content of jsonLdWebApp or jsonLdFaq in layout.tsx,
  // regenerate the hashes with: node scripts/gen-csp-hashes.mjs
  // ---------------------------------------------------------------------------
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevent MIME-type sniffing — reduces XSS surface.
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Block iframe embedding (clickjacking protection).
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Stop the full URL from being sent as a Referer to third-party origins.
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Enforce HTTPS for 2 years (minimum for HSTS preload list).
          // Submit domain at https://hstspreload.org after deploying this.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Disable browser features this app does not use.
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()",
          },
          // Content Security Policy.
          // Hashes cover the JSON-LD blocks in layout.tsx (via safeJsonStringify).
          // Regenerate with: node scripts/gen-csp-hashes.mjs
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'sha256-U8/Hnu9jI03RWMMdQ61EqhwmQguGG/TJ4chgwIIdgn4=' 'sha256-eDUWbxlt/BAsO7oz7spi9+iz1gJTnEWdXlFrc6sjZW8='",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
