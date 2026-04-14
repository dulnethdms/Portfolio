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

  const adminCredentialsForm = document.getElementById("admin-credentials-form");
  const adminCredentialsStatus = document.getElementById("admin-credentials-status");

  const form = document.getElementById("project-form");
  const statusEl = document.getElementById("project-form-status");
  const resetBtn = document.getElementById("reset-project-form");
  const list = document.getElementById("admin-projects-list");
  const refreshBtn = document.getElementById("refresh-projects");

  const photoForm = document.getElementById("photo-form");
  const photoStatusEl = document.getElementById("photo-form-status");
  const photoList = document.getElementById("admin-photos-list");
  const refreshPhotosBtn = document.getElementById("refresh-photos");

  const cvForm = document.getElementById("cv-form");
  const cvInput = document.getElementById("cv-file");
  const cvStatusEl = document.getElementById("cv-form-status");
  const cvLinkEl = document.getElementById("current-cv-link");
  const deleteCvBtn = document.getElementById("delete-cv-btn");
  let currentCvId = "";

  function toAssetUrl(imageUrl) {
    if (!imageUrl) return "https://via.placeholder.com/400x250";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    const origin = API_BASE.replace(/\/api\/?$/, "");
    return `${origin}${imageUrl}`;
  }

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

  async function loadPhotos() {
    if (!photoList) return;
    const res = await fetch(`${API_BASE}/photos`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load photos");

    photoList.innerHTML = "";
    if (!data.length) {
      photoList.innerHTML = '<p class="text-xs text-slate-400">No photos uploaded yet.</p>';
      return;
    }

    data.forEach((photo) => {
      const card = document.createElement("article");
      card.className = "bg-slate-900/60 border border-slate-800 rounded-xl p-2";
      card.innerHTML = `
        <img src="${toAssetUrl(photo.imageUrl)}" alt="${photo.caption || "Photo"}" class="w-full h-28 object-cover rounded mb-2" />
        <p class="text-[11px] text-slate-300 mb-2 line-clamp-2">${photo.caption || "No caption"}</p>
        <button data-id="${photo._id}" class="delete-photo w-full px-2 py-1 border border-red-500 text-red-400 rounded">Delete</button>
      `;
      photoList.appendChild(card);
    });
  }

  async function loadCv() {
    if (!cvLinkEl || !deleteCvBtn || !cvStatusEl) return;

    const res = await fetch(`${API_BASE}/cv`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load CV");

    if (!data) {
      currentCvId = "";
      cvLinkEl.classList.add("hidden");
      deleteCvBtn.classList.add("hidden");
      cvStatusEl.textContent = "No CV uploaded yet.";
      cvStatusEl.className = "text-xs text-slate-400";
      return;
    }

    currentCvId = data._id;
    cvLinkEl.href = toAssetUrl(data.fileUrl);
    cvLinkEl.textContent = `View current CV (${data.originalName})`;
    cvLinkEl.classList.remove("hidden");
    deleteCvBtn.classList.remove("hidden");
    cvStatusEl.textContent = "Current CV is available.";
    cvStatusEl.className = "text-xs text-emerald-400";
  }

  async function saveCv(e) {
    e.preventDefault();
    if (!cvForm || !cvInput) return;

    const file = cvInput.files[0];
    if (!file) {
      cvStatusEl.textContent = "Please choose a CV file.";
      cvStatusEl.className = "text-xs text-red-400";
      return;
    }

    const formData = new FormData();
    formData.append("cv", file);

    try {
      const res = await fetch(`${API_BASE}/cv`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload CV");

      cvStatusEl.textContent = "CV uploaded successfully.";
      cvStatusEl.className = "text-xs text-emerald-400";
      cvForm.reset();
      await loadCv();
    } catch (err) {
      cvStatusEl.textContent = err.message;
      cvStatusEl.className = "text-xs text-red-400";
    }
  }

  async function updateAdminCredentials(e) {
    e.preventDefault();
    if (!adminCredentialsForm || !adminCredentialsStatus) return;

    const currentPassword = document.getElementById("admin-current-password").value.trim();
    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value;
    const confirmPassword = document.getElementById("admin-confirm-password").value;

    if (password !== confirmPassword) {
      adminCredentialsStatus.textContent = "Passwords do not match.";
      adminCredentialsStatus.className = "text-xs text-red-400";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/admin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update admin credentials");

      adminCredentialsStatus.textContent = "Admin credentials updated.";
      adminCredentialsStatus.className = "text-xs text-emerald-400";
      adminCredentialsForm.reset();

      if (data.user?.email) {
        document.getElementById("admin-email").value = data.user.email;
      }
    } catch (err) {
      adminCredentialsStatus.textContent = err.message;
      adminCredentialsStatus.className = "text-xs text-red-400";
    }
  }

  async function deleteCv() {
    if (!currentCvId) return;
    if (!confirm("Remove current CV?")) return;

    const res = await fetch(`${API_BASE}/cv/${currentCvId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (!res.ok) {
      cvStatusEl.textContent = data.message || "Failed to remove CV.";
      cvStatusEl.className = "text-xs text-red-400";
      return;
    }

    currentCvId = "";
    cvStatusEl.textContent = "CV removed.";
    cvStatusEl.className = "text-xs text-emerald-400";
    await loadCv();
  }

  async function savePhoto(e) {
    e.preventDefault();
    if (!photoForm) return;

    const caption = document.getElementById("photo-caption").value.trim();
    const imageInput = document.getElementById("photo-image");
    const file = imageInput.files[0];

    if (!file) {
      photoStatusEl.textContent = "Please select an image.";
      photoStatusEl.className = "text-xs text-red-400";
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", file);

    try {
      const res = await fetch(`${API_BASE}/photos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload photo");

      photoStatusEl.textContent = "Photo uploaded.";
      photoStatusEl.className = "text-xs text-emerald-400";
      photoForm.reset();
      await loadPhotos();
    } catch (err) {
      photoStatusEl.textContent = err.message;
      photoStatusEl.className = "text-xs text-red-400";
    }
  }

  async function deletePhoto(id) {
    if (!confirm("Delete this photo?")) return;

    const res = await fetch(`${API_BASE}/photos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      photoStatusEl.textContent = data.message || "Failed to delete photo.";
      photoStatusEl.className = "text-xs text-red-400";
      return;
    }

    photoStatusEl.textContent = "Photo deleted.";
    photoStatusEl.className = "text-xs text-emerald-400";
    await loadPhotos();
  }

  function handlePhotoListClick(e) {
    const deleteBtn = e.target.closest(".delete-photo");
    if (!deleteBtn) return;
    deletePhoto(deleteBtn.dataset.id);
  }

  if (form) form.addEventListener("submit", saveProject);
  if (resetBtn) resetBtn.addEventListener("click", () => {
    form.reset();
    document.getElementById("project-id").value = "";
    statusEl.textContent = "";
  });
  if (adminCredentialsForm) adminCredentialsForm.addEventListener("submit", updateAdminCredentials);
  if (list) list.addEventListener("click", handleListClick);
  if (refreshBtn) refreshBtn.addEventListener("click", loadProjects);

  if (photoForm) photoForm.addEventListener("submit", savePhoto);
  if (photoList) photoList.addEventListener("click", handlePhotoListClick);
  if (refreshPhotosBtn) refreshPhotosBtn.addEventListener("click", () => {
    loadPhotos().catch((err) => {
      photoStatusEl.textContent = err.message;
      photoStatusEl.className = "text-xs text-red-400";
    });
  });

  if (cvForm) cvForm.addEventListener("submit", saveCv);
  if (deleteCvBtn) deleteCvBtn.addEventListener("click", deleteCv);

  loadProjects().catch((err) => {
    statusEl.textContent = err.message;
    statusEl.className = "text-xs text-red-400";
  });

  if (photoList) {
    loadPhotos().catch((err) => {
      photoStatusEl.textContent = err.message;
      photoStatusEl.className = "text-xs text-red-400";
    });
  }

  if (cvForm) {
    loadCv().catch((err) => {
      cvStatusEl.textContent = err.message;
      cvStatusEl.className = "text-xs text-red-400";
    });
  }
})();