import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// ---------------------------------------------------------------------------
// GitHub Pages static-export gate.
//
// This is opt-in via the GITHUB_PAGES env var and is ONLY enabled for the
// Pages deploy (see .github/workflows/deploy.yml, which sets GITHUB_PAGES=true).
//
// It MUST stay gated: `next dev`, `next start`, and the Docker/server build all
// run WITHOUT this var so the app keeps serving from the root path (/) locally
// and the async headers() block below continues to apply on server targets.
// Hardcoding output: 'export' + basePath would break local dev and silently
// drop the security headers, so we only switch them on when explicitly asked.
// ---------------------------------------------------------------------------
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // ---------------------------------------------------------------------------
  // Static export for GitHub Pages — project subpath deploy.
  //
  // The site lives at https://tsatsarisg.github.io/pocketmath/, so every route
  // and asset must be prefixed with /pocketmath. basePath handles routing,
  // assetPrefix handles static asset URLs, and images.unoptimized is required
  // because GitHub Pages has no Next.js image-optimization server.
  //
  // NOTE: the async headers() block below is NOT applied to a static export.
  // GitHub Pages serves plain files and cannot emit custom response headers, so
  // those headers only take effect on server-target builds (next start/Docker).
  // A best-effort CSP <meta> tag is injected in src/app/layout.tsx instead.
  // ---------------------------------------------------------------------------
  ...(isGithubPages
    ? {
        output: "export" as const,
        basePath: "/pocketmath",
        assetPrefix: "/pocketmath",
        images: { unoptimized: true },
      }
    : {}),

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
  // CSP: script-src uses 'unsafe-inline' because Next.js injects inline
  // bootstrap/hydration scripts whose hashes change on every build.
  // External script loading is still blocked by default-src 'self'.
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
          // unsafe-eval is added in dev only — Turbopack requires it for HMR.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
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
