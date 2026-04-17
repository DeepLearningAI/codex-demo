import http from "node:http";

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || "0.0.0.0";

const SYSTEM_PROMPT = `You are Astronomy Tutor AI, a friendly astronomy tutor.
- Give clear, short explanations.
- Encourage curiosity.
- Sometimes ask one follow-up question.
- Stay focused on astronomy topics like planets, stars, gravity, black holes, and space basics.`;

function json(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(payload));
}

function fallbackReply(message) {
  const trimmed = message.trim();
  return `I'm an astronomy tutor. You asked: "${trimmed}". Here's a simple explanation: astronomy often compares size, distance, and gravity to explain how objects move in space. Want a quick analogy?`;
}

async function callLlm(message) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return fallbackReply(message);
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      max_output_tokens: 220
    })
  });

  if (!response.ok) {
    throw new Error(`LLM request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.output_text?.trim() || fallbackReply(message);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error("Body too large"));
      }
    });

    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    return json(res, 204, {});
  }

  if (req.method === "POST" && req.url === "/api/chat") {
    let messageForFallback = "your question";
    try {
      const body = await parseBody(req);
      const message = body?.message;
      if (typeof message === "string") {
        messageForFallback = message;
      }

      if (!message || typeof message !== "string") {
        return json(res, 400, { reply: "Please send a non-empty message string." });
      }

      const reply = await callLlm(message);
      return json(res, 200, { reply });
    } catch (error) {
      return json(res, 200, { reply: fallbackReply(messageForFallback) });
    }
  }

  return json(res, 404, { error: "Not found" });
});

server.listen(port, host, () => {
  console.log(`Astronomy Tutor AI backend running on http://${host}:${port}`);
});
