import { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm Astronomy Tutor AI. Ask me about planets, stars, black holes, or gravity."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(event) {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) {
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply || "No reply generated." }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "I couldn't reach the API. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Astronomy Tutor AI</h1>
      <p className="sub">Simple astronomy chat tutor.</p>

      <section className="messages" aria-live="polite">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
            {message.text}
          </div>
        ))}
      </section>

      <form className="chat-form" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Example: Why do stars twinkle?"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}
