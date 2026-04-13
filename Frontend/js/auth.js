(function () {
  const form = document.getElementById("login-form");
  if (!form) return;
  const statusEl = document.getElementById("login-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      statusEl.textContent = "Please enter email and password.";
      statusEl.className = "text-xs text-red-400";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      statusEl.textContent = "Login successful. Redirecting...";
      statusEl.className = "text-xs text-emerald-400";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);
    } catch (err) {
      statusEl.textContent =
        err.message === "Failed to fetch"
          ? "Cannot reach API. Make sure backend is running on http://localhost:5000 and restart after CORS changes."
          : err.message;
      statusEl.className = "text-xs text-red-400";
    }
  });
})();