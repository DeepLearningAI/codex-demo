const SYSTEM_PROMPT = `You are Astronomy Tutor AI, a friendly astronomy tutor.
- Give short, clear astronomy explanations.
- Encourage curiosity.
- Sometimes ask one follow-up question.
- Focus on planets, stars, black holes, gravity, and space basics.`;

function fallbackReply(message) {
  const question = String(message || "space").trim();
  return `Astronomy Tutor: You asked: ${question}. Here is a simple explanation about space: objects move based on gravity, mass, and distance. Want a quick everyday analogy?`;
}

async function callOpenAI(message) {
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
    throw new Error(`OpenAI request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.output_text?.trim() || fallbackReply(message);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const message = req.body?.message;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "Please send { message: string }" });
  }

  try {
    const reply = await callOpenAI(message);
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(200).json({ reply: fallbackReply(message) });
  }
}
