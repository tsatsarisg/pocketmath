import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const output = fileURLToPath(new URL("../out/", import.meta.url));
const files = (await readdir(output, { recursive: true })).filter((file) =>
  file.endsWith(".html"),
);
if (files.length === 0) {
  throw new Error("No static HTML found for CSP hardening.");
}

for (const file of files) {
  const path = join(output, file);
  const html = await readFile(path, "utf8");
  const meta =
    /<meta http-equiv="Content-Security-Policy" content="([^"]*)"\s*\/?\s*>/i;
  const scriptPolicy = /(?<=; )script-src .*?(?=; [a-z-]+ |$)/;
  const policy = html.match(meta)?.[1];
  const head = /<head>\s*<meta charset="utf-8"\s*\/?\s*>/i;
  if (!policy || !scriptPolicy.test(policy) || !head.test(html)) {
    throw new Error(`Missing CSP or UTF-8 document head in ${file}.`);
  }

  // Read the final Next.js hydration payload and other inline scripts as served.
  const hashes = new Set();
  for (const [, attributes, body] of html.matchAll(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
  )) {
    if (!/\ssrc\s*=/i.test(attributes) && body) {
      const hash = createHash("sha256")
        .update(body.replace(/\r\n?/g, "\n"))
        .digest("base64");
      hashes.add(`'sha256-${hash}'`);
    }
  }
  const hardened = policy.replace(
    scriptPolicy,
    ["script-src 'self'", ...hashes].join(" "),
  );
  const tag = `<meta http-equiv="Content-Security-Policy" content="${hardened}"/>`;
  await writeFile(
    path,
    html.replace(meta, "").replace(head, (opening) => opening + tag),
  );
}
console.log(`Hardened the script policy on ${files.length} static pages.`);
