/**
 * Generate static image assets (favicon PNGs + OG image).
 * Run: node scripts/gen-assets.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "fs";

const BRAND_INDIGO = "#4f46e5";
const BRAND_GREEN = "#34d399";
const WHITE = "#ffffff";
const BG_LIGHT = "#f8fafc";

// ── Apple Touch Icon (180×180) ──────────────────────────────────────────────
const appleTouchSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" fill="none">
  <rect width="180" height="180" rx="40" fill="${BRAND_INDIGO}"/>
  <text x="90" y="124" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"
        font-weight="700" font-size="112" fill="${WHITE}">P</text>
  <circle cx="148" cy="38" r="18" fill="${BRAND_GREEN}"/>
</svg>`;

await sharp(Buffer.from(appleTouchSvg))
  .resize(180, 180)
  .png()
  .toFile("public/apple-touch-icon.png");

console.log("✓ public/apple-touch-icon.png (180×180)");

// ── Favicon 32×32 PNG (fallback for older browsers) ─────────────────────────
const favicon32Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="7" fill="${BRAND_INDIGO}"/>
  <text x="16" y="22.5" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"
        font-weight="700" font-size="20" fill="${WHITE}">P</text>
  <circle cx="26" cy="7" r="3.5" fill="${BRAND_GREEN}"/>
</svg>`;

await sharp(Buffer.from(favicon32Svg))
  .resize(32, 32)
  .png()
  .toFile("public/favicon-32x32.png");

console.log("✓ public/favicon-32x32.png (32×32)");

// ── OG Image (1200×630) ─────────────────────────────────────────────────────
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" fill="none">
  <!-- Background -->
  <rect width="1200" height="630" fill="${BG_LIGHT}"/>

  <!-- Decorative top bar -->
  <rect width="1200" height="6" fill="${BRAND_INDIGO}"/>

  <!-- Brand icon -->
  <rect x="80" y="200" width="88" height="88" rx="20" fill="${BRAND_INDIGO}"/>
  <text x="124" y="262" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"
        font-weight="700" font-size="54" fill="${WHITE}">P</text>
  <circle cx="156" cy="210" r="10" fill="${BRAND_GREEN}"/>

  <!-- Title -->
  <text x="192" y="256" font-family="system-ui, -apple-system, sans-serif"
        font-weight="700" font-size="52" fill="#1e1b4b">PocketMath</text>

  <!-- Tagline -->
  <text x="80" y="360" font-family="system-ui, -apple-system, sans-serif"
        font-weight="500" font-size="32" fill="#475569">Υπολογιστής Καθαρού Μισθού</text>
  <text x="80" y="408" font-family="system-ui, -apple-system, sans-serif"
        font-weight="500" font-size="32" fill="#475569">Ελλάδα 2026</text>

  <!-- Subtitle pills -->
  <rect x="80" y="456" width="168" height="40" rx="20" fill="#eef2ff"/>
  <text x="164" y="483" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"
        font-weight="600" font-size="18" fill="${BRAND_INDIGO}">Μισθωτός</text>

  <rect x="264" y="456" width="290" height="40" rx="20" fill="#eef2ff"/>
  <text x="409" y="483" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"
        font-weight="600" font-size="18" fill="${BRAND_INDIGO}">Ελ. Επαγγελματίας</text>

  <rect x="570" y="456" width="160" height="40" rx="20" fill="#eef2ff"/>
  <text x="650" y="483" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"
        font-weight="600" font-size="18" fill="${BRAND_INDIGO}">Μπλοκάκι</text>

  <!-- URL -->
  <text x="80" y="568" font-family="system-ui, -apple-system, sans-serif"
        font-weight="400" font-size="22" fill="#94a3b8">pocketmath.gr</text>

  <!-- Green accent dot bottom-right -->
  <circle cx="1120" cy="540" r="50" fill="${BRAND_GREEN}" opacity="0.15"/>
  <circle cx="1120" cy="540" r="24" fill="${BRAND_GREEN}" opacity="0.3"/>
</svg>`;

await sharp(Buffer.from(ogSvg))
  .resize(1200, 630)
  .png()
  .toFile("public/og-image.png");

console.log("✓ public/og-image.png (1200×630)");
console.log("\nDone — all assets generated.");
