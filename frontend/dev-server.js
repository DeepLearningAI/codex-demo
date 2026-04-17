import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT || 5173);
const host = process.env.HOST || "0.0.0.0";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function safePath(urlPath) {
  const cleaned = urlPath === "/" ? "/index.html" : urlPath;
  const fullPath = path.normalize(path.join(__dirname, cleaned));
  if (!fullPath.startsWith(__dirname)) {
    return null;
  }
  return fullPath;
}

const server = http.createServer(async (req, res) => {
  const filePath = safePath(req.url || "/");
  if (!filePath) {
    res.writeHead(400);
    return res.end("Bad request");
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain; charset=utf-8" });
    return res.end(file);
  } catch {
    res.writeHead(404);
    return res.end("Not found");
  }
});

server.listen(port, host, () => {
  console.log(`Astronomy Tutor AI frontend running on http://${host}:${port}`);
});
