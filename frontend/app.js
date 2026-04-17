const BACKEND_URL = "http://localhost:3001/api/chat";

const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");

function addMessage(text, role) {
  const item = document.createElement("div");
  item.className = `message ${role}`;
  item.textContent = text;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

addMessage("Hi! I'm Astronomy Tutor AI. Ask me about planets, stars, gravity, or black holes.", "bot");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();
  if (!message) {
    return;
  }

  addMessage(message, "user");
  input.value = "";

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    addMessage(data.reply || "Sorry, I could not generate a response.", "bot");
  } catch (error) {
    addMessage("I couldn't reach the server. Is the backend running on port 3001?", "bot");
  }
});
