/**
 * Serializes a value to JSON that is safe to embed inside an HTML <script> tag.
 *
 * Plain JSON.stringify is NOT safe for inline script injection because the
 * string "</script>" inside any JSON value will break out of the script context
 * and allow arbitrary HTML injection. The Unicode line/paragraph separators
 * (U+2028, U+2029) are also illegal in script literals in some older parsers.
 *
 * This function escapes all five dangerous sequences. The output is valid JSON —
 * JSON parsers treat \u003c etc. identically to the unescaped characters.
 *
 * Usage:
 *   <script
 *     type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: safeJsonStringify(data) }}
 *   />
 */
export function safeJsonStringify(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
