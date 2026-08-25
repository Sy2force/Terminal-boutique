import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import server from "./dist/server/server.js";

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = fileURLToPath(new URL("./dist/client", import.meta.url));

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".txt": "text/plain",
};

async function tryStatic(urlPath, res) {
  const safePath = urlPath.replace(/\?.*$/, "").replace(/^\/+/, "");
  const filePath = join(PUBLIC_DIR, safePath);
  if (!filePath.startsWith(PUBLIC_DIR)) return false;
  if (!existsSync(filePath)) return false;

  try {
    const data = await readFile(filePath);
    const ext = extname(filePath);
    res.statusCode = 200;
    res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

createServer(async (req, res) => {
  const urlPath = req.url || "/";

  if (req.method === "GET" && urlPath !== "/") {
    const served = await tryStatic(urlPath, res);
    if (served) return;
  }

  const url = new URL(urlPath, `http://${req.headers.host}`);
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);

  const headerEntries = [];
  for (const [k, v] of Object.entries(req.headers)) {
    if (Array.isArray(v)) {
      for (const val of v) headerEntries.push([k, val]);
    } else if (v !== undefined) {
      headerEntries.push([k, v]);
    }
  }

  const request = new Request(url, {
    method: req.method,
    headers: new Headers(headerEntries),
    body: ["GET", "HEAD"].includes(req.method || "GET") ? undefined : Buffer.concat(chunks),
  });

  const response = await server.fetch(request);

  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      const cookies = response.headers.getSetCookie?.() || [value];
      res.setHeader("Set-Cookie", cookies);
    } else {
      res.setHeader(key, value);
    }
  });

  if (response.body) {
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
  }
  res.end();
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
