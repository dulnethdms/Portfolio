const API_BASE = "http://localhost:5000/api";

// Theme toggle
(function () {
  const body = document.body;
  const toggleBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    body.setAttribute("data-theme", savedTheme);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = body.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      body.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// Loading overlay helpers
function showLoading() {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) overlay.classList.add("active");
}
function hideLoading() {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) overlay.classList.remove("active");
}

// Simple form validation helper
function validateRequiredFields(fields) {
  for (const field of fields) {
    if (!field.value.trim()) {
      return false;
    }
  }
  return true;
}

// Contact form
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const statusEl = document.getElementById("contact-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.name;
    const email = form.email;
    const message = form.message;

    if (!validateRequiredFields([name, email, message])) {
      statusEl.textContent = "Please fill in all fields.";
      statusEl.className = "text-xs text-red-400";
      return;
    }

    try {
      showLoading();
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.value, email: email.value, message: message.value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");
      statusEl.textContent = "Message sent successfully.";
      statusEl.className = "text-xs text-emerald-400";
      form.reset();
    } catch (err) {
      statusEl.textContent = err.message;
      statusEl.className = "text-xs text-red-400";
    } finally {
      hideLoading();
    }
  });
})();

// Chatbot widget (simple rule-based)
(function () {
  const toggleBtn = document.getElementById("chatbot-toggle");
  const panel = document.getElementById("chatbot-panel");
  const closeBtn = document.getElementById("chatbot-close");
  const form = document.getElementById("chatbot-form");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  if (!toggleBtn || !panel) return;

  function addMessage(sender, text) {
    const p = document.createElement("p");
    p.textContent = `${sender}: ${text}`;
    p.className = sender === "You" ? "text-indigo-300" : "text-slate-300";
    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
  }

  toggleBtn.addEventListener("click", () => {
    panel.classList.toggle("hidden");
    if (!panel.classList.contains("hidden")) {
      addMessage("Bot", "Hi! Ask me about my skills, projects, or AI focus.");
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      panel.classList.add("hidden");
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const question = input.value.trim();
      if (!question) return;
      addMessage("You", question);

      let answer = "I'm focused on AI, ML, and full-stack development.";
      const q = question.toLowerCase();
      if (q.includes("skills")) {
        answer = "I work with Python, ML libraries, JavaScript, React, Node.js, and MongoDB.";
      } else if (q.includes("project")) {
        answer = "Check the Projects page—AI, web, and data science projects are listed there.";
      } else if (q.includes("ai") || q.includes("machine learning")) {
        answer = "I enjoy building ML models for classification, recommendation, and NLP tasks.";
      }
      addMessage("Bot", answer);
      input.value = "";
    });
  }
})();