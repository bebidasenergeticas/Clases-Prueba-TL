// El navegador SOLO llama a /api/chat (mismo dominio). No hay claves aqui.
const log = document.getElementById("log");
const statusEl = document.getElementById("status");
const history = [];
function add(cls, text) { const p = document.createElement("p"); p.className = cls; p.textContent = text; log.appendChild(p); }
document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("msg");
  const message = input.value.trim();
  if (!message) return;
  add("u", "Tu: " + message); input.value = ""; statusEl.textContent = "Consultando...";
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: history.slice(-6) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) { statusEl.textContent = "Error " + res.status + ": " + (data.detail || "respuesta no valida"); return; }
    add("a", "Asistente: " + data.reply);
    history.push({ role: "user", content: message }, { role: "assistant", content: data.reply });
    statusEl.textContent = "";
  } catch (err) { statusEl.textContent = "No se pudo conectar con el servidor."; }
});
