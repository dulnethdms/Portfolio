(function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }

  const form = document.getElementById("project-form");
  const statusEl = document.getElementById("project-form-status");
  const resetBtn = document.getElementById("reset-project-form");
  const list = document.getElementById("admin-projects-list");
  const refreshBtn = document.getElementById("refresh-projects");

  async function loadProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load projects");
    list.innerHTML = "";
    data.forEach((p) => {
      const card = document.createElement("article");
      card.className = "bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-1";
      card.innerHTML = `
        <p class="font-semibold text-xs">${p.title}</p>
        <p class="text-[11px] text-slate-400">${p.category}</p>
        <div class="flex gap-2 mt-2 text-[11px]">
          <button data-id="${p._id}" class="edit-project px-2 py-1 border border-slate-700 rounded">Edit</button>
          <button data-id="${p._id}" class="delete-project px-2 py-1 border border-red-500 text-red-400 rounded">Delete</button>
        </div>
      `;
      list.appendChild(card);
    });
  }

  async function saveProject(e) {
    e.preventDefault();
    const id = document.getElementById("project-id").value;
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();
    const githubUrl = document.getElementById("githubUrl").value.trim();
    const liveUrl = document.getElementById("liveUrl").value.trim();
    const techStack = document.getElementById("techStack").value.split(",").map((t) => t.trim()).filter(Boolean);
    const imageInput = document.getElementById("image");

    if (!title) {
      statusEl.textContent = "Title is required.";
      statusEl.className = "text-xs text-red-400";
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("githubUrl", githubUrl);
    formData.append("liveUrl", liveUrl);
    formData.append("techStack", JSON.stringify(techStack));
    if (imageInput.files[0]) {
      formData.append("image", imageInput.files[0]);
    }

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_BASE}/projects/${id}` : `${API_BASE}/projects`;

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save project");
      statusEl.textContent = "Project saved.";
      statusEl.className = "text-xs text-emerald-400";
      form.reset();
      document.getElementById("project-id").value = "";
      await loadProjects();
    } catch (err) {
      statusEl.textContent = err.message;
      statusEl.className = "text-xs text-red-400";
    }
  }

  function handleListClick(e) {
    const editBtn = e.target.closest(".edit-project");
    const deleteBtn = e.target.closest(".delete-project");
    if (editBtn) {
      const id = editBtn.dataset.id;
      editProject(id);
    } else if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      deleteProject(id);
    }
  }

  async function editProject(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    const data = await res.json();
    if (!res.ok) {
      statusEl.textContent = data.message || "Failed to load project.";
      statusEl.className = "text-xs text-red-400";
      return;
    }
    document.getElementById("project-id").value = data._id;
    document.getElementById("title").value = data.title || "";
    document.getElementById("category").value = data.category || "ai";
    document.getElementById("description").value = data.description || "";
    document.getElementById("githubUrl").value = data.githubUrl || "";
    document.getElementById("liveUrl").value = data.liveUrl || "";
    document.getElementById("techStack").value = (data.techStack || []).join(", ");
    statusEl.textContent = "Editing project.";
    statusEl.className = "text-xs text-slate-300";
  }

  async function deleteProject(id) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      statusEl.textContent = data.message || "Failed to delete project.";
      statusEl.className = "text-xs text-red-400";
      return;
    }
    statusEl.textContent = "Project deleted.";
    statusEl.className = "text-xs text-emerald-400";
    await loadProjects();
  }

  if (form) form.addEventListener("submit", saveProject);
  if (resetBtn) resetBtn.addEventListener("click", () => {
    form.reset();
    document.getElementById("project-id").value = "";
    statusEl.textContent = "";
  });
  if (list) list.addEventListener("click", handleListClick);
  if (refreshBtn) refreshBtn.addEventListener("click", loadProjects);

  loadProjects().catch((err) => {
    statusEl.textContent = err.message;
    statusEl.className = "text-xs text-red-400";
  });
})();