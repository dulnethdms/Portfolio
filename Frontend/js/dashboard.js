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
  const heroSettingsForm = document.getElementById("hero-settings-form");
  const heroTaglineInput = document.getElementById("admin-hero-tagline");
  const heroHeadlineInput = document.getElementById("admin-hero-headline");
  const heroDescriptionInput = document.getElementById("admin-hero-description");
  const heroSettingsStatusEl = document.getElementById("hero-settings-status");
  const reloadHeroSettingsBtn = document.getElementById("reload-hero-settings");
  const contactSocialForm = document.getElementById("contact-social-form");
  const contactEmailInput = document.getElementById("contact-email");
  const contactPhoneInput = document.getElementById("contact-phone");
  const contactLocationInput = document.getElementById("contact-location");
  const socialLinksEditor = document.getElementById("social-links-editor");
  const addSocialLinkBtn = document.getElementById("add-social-link");
  const reloadContactSocialBtn = document.getElementById("reload-contact-social");
  const contactSocialStatusEl = document.getElementById("contact-social-status");
  const aiFocusForm = document.getElementById("ai-focus-form");
  const aiFocusTitleInput = document.getElementById("ai-focus-title");
  const aiFocusAreasInput = document.getElementById("ai-focus-areas");
  const aiFocusStatusEl = document.getElementById("ai-focus-status");
  const reloadAiFocusBtn = document.getElementById("reload-ai-focus");
  const whyAiForm = document.getElementById("why-ai-form");
  const whyAiTitleInput = document.getElementById("why-ai-title");
  const whyAiDescriptionInput = document.getElementById("why-ai-description");
  const whyAiCard1TitleInput = document.getElementById("why-ai-card1-title");
  const whyAiCard1DescriptionInput = document.getElementById("why-ai-card1-description");
  const whyAiCard2TitleInput = document.getElementById("why-ai-card2-title");
  const whyAiCard2DescriptionInput = document.getElementById("why-ai-card2-description");
  const whyAiCard3TitleInput = document.getElementById("why-ai-card3-title");
  const whyAiCard3DescriptionInput = document.getElementById("why-ai-card3-description");
  const whyAiStatusEl = document.getElementById("why-ai-status");
  const reloadWhyAiBtn = document.getElementById("reload-why-ai");
  const aboutPageForm = document.getElementById("about-page-form");
  const aboutPageTitleInput = document.getElementById("admin-about-page-title");
  const aboutPageSubtitleInput = document.getElementById("admin-about-page-subtitle");
  const aboutIntroParagraph1Input = document.getElementById("admin-about-intro-paragraph-1");
  const aboutIntroParagraph2Input = document.getElementById("admin-about-intro-paragraph-2");
  const aboutSkillsTitleInput = document.getElementById("admin-about-skills-title");
  const aboutTechnicalSkillsTitleInput = document.getElementById("admin-about-technical-skills-title");
  const aboutTechnicalSkillsEditor = document.getElementById("about-technical-skills-editor");
  const addAboutTechnicalSkillBtn = document.getElementById("add-about-technical-skill");
  const aboutSoftSkillsTitleInput = document.getElementById("admin-about-soft-skills-title");
  const aboutSoftSkillsEditor = document.getElementById("about-soft-skills-editor");
  const addAboutSoftSkillBtn = document.getElementById("add-about-soft-skill");
  const aboutEducationTitleInput = document.getElementById("admin-about-education-title");
  const aboutEducationEditor = document.getElementById("about-education-editor");
  const addAboutEducationItemBtn = document.getElementById("add-about-education-item");
  const aboutCvButtonLabelInput = document.getElementById("admin-about-cv-button-label");
  const aboutCvButtonUrlInput = document.getElementById("admin-about-cv-button-url");
  const reloadAboutPageBtn = document.getElementById("reload-about-page");
  const aboutPageStatusEl = document.getElementById("about-page-status");

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

  function fillHeroSettingsInputs(data) {
    if (!heroSettingsForm) return;
    heroTaglineInput.value = data.heroTagline || "";
    heroHeadlineInput.value = data.heroHeadline || "";
    heroDescriptionInput.value = data.heroDescription || "";
  }

  async function loadHeroSettings() {
    if (!heroSettingsForm) return;

    const res = await fetch(`${API_BASE}/site-settings`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load hero settings");

    fillHeroSettingsInputs(data);
    if (heroSettingsStatusEl) {
      heroSettingsStatusEl.textContent = "";
      heroSettingsStatusEl.className = "text-xs";
    }
  }

  async function saveHeroSettings(e) {
    e.preventDefault();
    if (!heroSettingsForm || !heroSettingsStatusEl) return;

    const heroTagline = heroTaglineInput.value.trim();
    const heroHeadline = heroHeadlineInput.value.trim();
    const heroDescription = heroDescriptionInput.value.trim();

    try {
      const res = await fetch(`${API_BASE}/site-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ heroTagline, heroHeadline, heroDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save hero settings");

      heroSettingsStatusEl.textContent = "Hero settings saved.";
      heroSettingsStatusEl.className = "text-xs text-emerald-400";
      fillHeroSettingsInputs(data);
    } catch (err) {
      heroSettingsStatusEl.textContent = err.message;
      heroSettingsStatusEl.className = "text-xs text-red-400";
    }
  }

  function createSocialLinkRow(item = {}) {
    if (!socialLinksEditor) return;

    const row = document.createElement("div");
    row.className = "grid md:grid-cols-12 gap-2";
    row.innerHTML = `
      <input data-field="type" placeholder="Type (e.g. GitHub)" class="md:col-span-3 w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
      <input data-field="label" placeholder="Label" class="md:col-span-3 w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
      <input data-field="url" placeholder="https://..." class="md:col-span-5 w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
      <button type="button" data-action="remove" class="md:col-span-1 px-2 py-2 border border-red-500 text-red-400 rounded text-xs">Remove</button>
    `;

    row.querySelector('[data-field="type"]').value = item.type || "";
    row.querySelector('[data-field="label"]').value = item.label || "";
    row.querySelector('[data-field="url"]').value = item.url || "";
    row.querySelector('[data-action="remove"]').addEventListener("click", () => {
      row.remove();
    });

    socialLinksEditor.appendChild(row);
  }

  function readSocialLinksFromEditor() {
    if (!socialLinksEditor) return [];
    return Array.from(socialLinksEditor.children)
      .map((row) => ({
        type: row.querySelector('[data-field="type"]').value.trim(),
        label: row.querySelector('[data-field="label"]').value.trim(),
        url: row.querySelector('[data-field="url"]').value.trim(),
      }))
      .filter((item) => item.type && item.label && item.url);
  }

  function fillContactSocialInputs(data) {
    if (!contactSocialForm) return;

    contactEmailInput.value = data.contactEmail || "";
    contactPhoneInput.value = data.contactPhone || "";
    contactLocationInput.value = data.contactLocation || "";

    if (socialLinksEditor) {
      socialLinksEditor.innerHTML = "";
      const links = Array.isArray(data.socialLinks) ? data.socialLinks : [];
      if (!links.length) {
        createSocialLinkRow();
      } else {
        links.forEach((item) => createSocialLinkRow(item));
      }
    }
  }

  async function loadContactSocialSettings() {
    if (!contactSocialForm) return;

    const res = await fetch(`${API_BASE}/site-settings`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load contact/social settings");

    fillContactSocialInputs(data);
    if (contactSocialStatusEl) {
      contactSocialStatusEl.textContent = "";
      contactSocialStatusEl.className = "text-xs";
    }
  }

  async function saveContactSocialSettings(e) {
    e.preventDefault();
    if (!contactSocialForm || !contactSocialStatusEl) return;

    const contactEmail = contactEmailInput.value.trim();
    const contactPhone = contactPhoneInput.value.trim();
    const contactLocation = contactLocationInput.value.trim();
    const socialLinks = readSocialLinksFromEditor();

    try {
      const res = await fetch(`${API_BASE}/site-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contactEmail, contactPhone, contactLocation, socialLinks }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save contact/social settings");

      contactSocialStatusEl.textContent = "Contact and social settings saved.";
      contactSocialStatusEl.className = "text-xs text-emerald-400";
      fillContactSocialInputs(data);
    } catch (err) {
      contactSocialStatusEl.textContent = err.message;
      contactSocialStatusEl.className = "text-xs text-red-400";
    }
  }

  async function loadAiFocusSettings() {
    if (!aiFocusForm || !aiFocusTitleInput || !aiFocusAreasInput) return;

    const res = await fetch(`${API_BASE}/site-settings`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load AI focus settings");

    aiFocusTitleInput.value = data.aiFocusTitle || "AI Focus Areas";
    aiFocusAreasInput.value = (data.aiFocusAreas || []).join("\n");
    if (aiFocusStatusEl) {
      aiFocusStatusEl.textContent = "";
      aiFocusStatusEl.className = "text-xs";
    }
  }

  async function saveAiFocusSettings(e) {
    e.preventDefault();
    if (!aiFocusTitleInput || !aiFocusAreasInput || !aiFocusStatusEl) return;

    const aiFocusTitle = aiFocusTitleInput.value.trim();
    const aiFocusAreas = aiFocusAreasInput.value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!aiFocusTitle) {
      aiFocusStatusEl.textContent = "Please enter a section name.";
      aiFocusStatusEl.className = "text-xs text-red-400";
      return;
    }

    if (!aiFocusAreas.length) {
      aiFocusStatusEl.textContent = "Please add at least one focus area.";
      aiFocusStatusEl.className = "text-xs text-red-400";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/site-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ aiFocusTitle, aiFocusAreas }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save AI focus settings");

      aiFocusStatusEl.textContent = "AI focus settings saved.";
      aiFocusStatusEl.className = "text-xs text-emerald-400";
      aiFocusTitleInput.value = data.aiFocusTitle || aiFocusTitle;
      aiFocusAreasInput.value = (data.aiFocusAreas || aiFocusAreas).join("\n");
    } catch (err) {
      aiFocusStatusEl.textContent = err.message;
      aiFocusStatusEl.className = "text-xs text-red-400";
    }
  }

  function getWhyAiHighlightsFromInputs() {
    return [
      {
        title: (whyAiCard1TitleInput?.value || "").trim(),
        description: (whyAiCard1DescriptionInput?.value || "").trim(),
      },
      {
        title: (whyAiCard2TitleInput?.value || "").trim(),
        description: (whyAiCard2DescriptionInput?.value || "").trim(),
      },
      {
        title: (whyAiCard3TitleInput?.value || "").trim(),
        description: (whyAiCard3DescriptionInput?.value || "").trim(),
      },
    ].filter((item) => item.title && item.description);
  }

  function fillWhyAiInputs(data) {
    if (!whyAiForm) return;

    whyAiTitleInput.value = data.whyAiTitle || "Why Artificial Intelligence?";
    whyAiDescriptionInput.value = data.whyAiDescription || "";

    const cards = Array.isArray(data.whyAiHighlights) ? data.whyAiHighlights : [];
    const card1 = cards[0] || { title: "", description: "" };
    const card2 = cards[1] || { title: "", description: "" };
    const card3 = cards[2] || { title: "", description: "" };

    whyAiCard1TitleInput.value = card1.title;
    whyAiCard1DescriptionInput.value = card1.description;
    whyAiCard2TitleInput.value = card2.title;
    whyAiCard2DescriptionInput.value = card2.description;
    whyAiCard3TitleInput.value = card3.title;
    whyAiCard3DescriptionInput.value = card3.description;
  }

  async function loadWhyAiSettings() {
    if (!whyAiForm) return;

    const res = await fetch(`${API_BASE}/site-settings`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load Why AI settings");

    fillWhyAiInputs(data);
    if (whyAiStatusEl) {
      whyAiStatusEl.textContent = "";
      whyAiStatusEl.className = "text-xs";
    }
  }

  async function saveWhyAiSettings(e) {
    e.preventDefault();
    if (!whyAiForm || !whyAiStatusEl) return;

    const whyAiTitle = whyAiTitleInput.value.trim();
    const whyAiDescription = whyAiDescriptionInput.value.trim();
    const whyAiHighlights = getWhyAiHighlightsFromInputs();

    if (!whyAiTitle) {
      whyAiStatusEl.textContent = "Please enter a section title.";
      whyAiStatusEl.className = "text-xs text-red-400";
      return;
    }

    if (!whyAiDescription) {
      whyAiStatusEl.textContent = "Please enter a section description.";
      whyAiStatusEl.className = "text-xs text-red-400";
      return;
    }

    if (!whyAiHighlights.length) {
      whyAiStatusEl.textContent = "Please complete at least one highlight card title and description.";
      whyAiStatusEl.className = "text-xs text-red-400";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/site-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ whyAiTitle, whyAiDescription, whyAiHighlights }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save Why AI settings");

      whyAiStatusEl.textContent = "Why AI settings saved.";
      whyAiStatusEl.className = "text-xs text-emerald-400";
      fillWhyAiInputs(data);
    } catch (err) {
      whyAiStatusEl.textContent = err.message;
      whyAiStatusEl.className = "text-xs text-red-400";
    }
  }

  function createAboutTechnicalSkillRow(item = {}) {
    if (!aboutTechnicalSkillsEditor) return;
    const row = document.createElement("div");
    row.className = "grid md:grid-cols-12 gap-2";
    row.innerHTML = `
      <input data-field="name" placeholder="Skill name" class="md:col-span-7 w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
      <input data-field="percentage" type="number" min="0" max="100" placeholder="%" class="md:col-span-4 w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
      <button type="button" data-action="remove" class="md:col-span-1 px-2 py-2 border border-red-500 text-red-400 rounded text-xs">Remove</button>
    `;
    row.querySelector('[data-field="name"]').value = item.name || "";
    row.querySelector('[data-field="percentage"]').value = Number.isFinite(Number(item.percentage)) ? Number(item.percentage) : "";
    row.querySelector('[data-action="remove"]').addEventListener("click", () => row.remove());
    aboutTechnicalSkillsEditor.appendChild(row);
  }

  function createAboutSoftSkillRow(value = "") {
    if (!aboutSoftSkillsEditor) return;
    const row = document.createElement("div");
    row.className = "grid md:grid-cols-12 gap-2";
    row.innerHTML = `
      <input data-field="value" placeholder="Soft skill" class="md:col-span-11 w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
      <button type="button" data-action="remove" class="md:col-span-1 px-2 py-2 border border-red-500 text-red-400 rounded text-xs">Remove</button>
    `;
    row.querySelector('[data-field="value"]').value = value;
    row.querySelector('[data-action="remove"]').addEventListener("click", () => row.remove());
    aboutSoftSkillsEditor.appendChild(row);
  }

  function createAboutEducationItemRow(item = {}) {
    if (!aboutEducationEditor) return;
    const row = document.createElement("div");
    row.className = "grid md:grid-cols-12 gap-2 border border-slate-800 rounded-xl p-3";
    row.innerHTML = `
      <input data-field="title" placeholder="Title" class="md:col-span-5 w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
      <input data-field="institution" placeholder="Institution" class="md:col-span-4 w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
      <input data-field="period" placeholder="Period" class="md:col-span-2 w-full px-3 py-2 rounded bg-slate-900 border border-slate-700" />
      <button type="button" data-action="remove" class="md:col-span-1 px-2 py-2 border border-red-500 text-red-400 rounded text-xs">Remove</button>
      <textarea data-field="description" rows="2" placeholder="Description" class="md:col-span-12 w-full px-3 py-2 rounded bg-slate-900 border border-slate-700"></textarea>
    `;
    row.querySelector('[data-field="title"]').value = item.title || "";
    row.querySelector('[data-field="institution"]').value = item.institution || "";
    row.querySelector('[data-field="period"]').value = item.period || "";
    row.querySelector('[data-field="description"]').value = item.description || "";
    row.querySelector('[data-action="remove"]').addEventListener("click", () => row.remove());
    aboutEducationEditor.appendChild(row);
  }

  function readAboutTechnicalSkills() {
    if (!aboutTechnicalSkillsEditor) return [];
    return Array.from(aboutTechnicalSkillsEditor.children)
      .map((row) => ({
        name: row.querySelector('[data-field="name"]').value.trim(),
        percentage: Number(row.querySelector('[data-field="percentage"]').value),
      }))
      .filter((item) => item.name && Number.isFinite(item.percentage));
  }

  function readAboutSoftSkills() {
    if (!aboutSoftSkillsEditor) return [];
    return Array.from(aboutSoftSkillsEditor.children)
      .map((row) => row.querySelector('[data-field="value"]').value.trim())
      .filter(Boolean);
  }

  function readAboutEducationItems() {
    if (!aboutEducationEditor) return [];
    return Array.from(aboutEducationEditor.children)
      .map((row) => ({
        title: row.querySelector('[data-field="title"]').value.trim(),
        institution: row.querySelector('[data-field="institution"]').value.trim(),
        period: row.querySelector('[data-field="period"]').value.trim(),
        description: row.querySelector('[data-field="description"]').value.trim(),
      }))
      .filter((item) => item.title);
  }

  function fillAboutPageInputs(data) {
    if (!aboutPageForm) return;

    aboutPageTitleInput.value = data.aboutPageTitle || "";
    aboutPageSubtitleInput.value = data.aboutPageSubtitle || "";
    aboutIntroParagraph1Input.value = data.aboutIntroParagraph1 || "";
    aboutIntroParagraph2Input.value = data.aboutIntroParagraph2 || "";
    aboutSkillsTitleInput.value = data.aboutSkillsTitle || "";
    aboutTechnicalSkillsTitleInput.value = data.aboutTechnicalSkillsTitle || "";
    aboutSoftSkillsTitleInput.value = data.aboutSoftSkillsTitle || "";
    aboutEducationTitleInput.value = data.aboutEducationTitle || "";
    aboutCvButtonLabelInput.value = data.aboutCvButtonLabel || "";
    aboutCvButtonUrlInput.value = data.aboutCvButtonUrl || "";

    if (aboutTechnicalSkillsEditor) {
      aboutTechnicalSkillsEditor.innerHTML = "";
      const items = Array.isArray(data.aboutTechnicalSkills) ? data.aboutTechnicalSkills : [];
      if (!items.length) createAboutTechnicalSkillRow();
      items.forEach((item) => createAboutTechnicalSkillRow(item));
    }

    if (aboutSoftSkillsEditor) {
      aboutSoftSkillsEditor.innerHTML = "";
      const items = Array.isArray(data.aboutSoftSkills) ? data.aboutSoftSkills : [];
      if (!items.length) createAboutSoftSkillRow();
      items.forEach((item) => createAboutSoftSkillRow(item));
    }

    if (aboutEducationEditor) {
      aboutEducationEditor.innerHTML = "";
      const items = Array.isArray(data.aboutEducationItems) ? data.aboutEducationItems : [];
      if (!items.length) createAboutEducationItemRow();
      items.forEach((item) => createAboutEducationItemRow(item));
    }
  }

  async function loadAboutPageSettings() {
    if (!aboutPageForm) return;

    const res = await fetch(`${API_BASE}/site-settings`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load About page settings");

    fillAboutPageInputs(data);
    if (aboutPageStatusEl) {
      aboutPageStatusEl.textContent = "";
      aboutPageStatusEl.className = "text-xs";
    }
  }

  async function saveAboutPageSettings(e) {
    e.preventDefault();
    if (!aboutPageForm || !aboutPageStatusEl) return;

    const payload = {
      aboutPageTitle: aboutPageTitleInput.value.trim(),
      aboutPageSubtitle: aboutPageSubtitleInput.value.trim(),
      aboutIntroParagraph1: aboutIntroParagraph1Input.value.trim(),
      aboutIntroParagraph2: aboutIntroParagraph2Input.value.trim(),
      aboutSkillsTitle: aboutSkillsTitleInput.value.trim(),
      aboutTechnicalSkillsTitle: aboutTechnicalSkillsTitleInput.value.trim(),
      aboutTechnicalSkills: readAboutTechnicalSkills(),
      aboutSoftSkillsTitle: aboutSoftSkillsTitleInput.value.trim(),
      aboutSoftSkills: readAboutSoftSkills(),
      aboutEducationTitle: aboutEducationTitleInput.value.trim(),
      aboutEducationItems: readAboutEducationItems(),
      aboutCvButtonLabel: aboutCvButtonLabelInput.value.trim(),
      aboutCvButtonUrl: aboutCvButtonUrlInput.value.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/site-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save About page settings");

      aboutPageStatusEl.textContent = "About page settings saved.";
      aboutPageStatusEl.className = "text-xs text-emerald-400";
      fillAboutPageInputs(data);
    } catch (err) {
      aboutPageStatusEl.textContent = err.message;
      aboutPageStatusEl.className = "text-xs text-red-400";
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
  if (heroSettingsForm) heroSettingsForm.addEventListener("submit", saveHeroSettings);
  if (contactSocialForm) contactSocialForm.addEventListener("submit", saveContactSocialSettings);
  if (aiFocusForm) aiFocusForm.addEventListener("submit", saveAiFocusSettings);
  if (whyAiForm) whyAiForm.addEventListener("submit", saveWhyAiSettings);
  if (aboutPageForm) aboutPageForm.addEventListener("submit", saveAboutPageSettings);
  if (reloadAiFocusBtn) {
    reloadAiFocusBtn.addEventListener("click", () => {
      loadAiFocusSettings().catch((err) => {
        aiFocusStatusEl.textContent = err.message;
        aiFocusStatusEl.className = "text-xs text-red-400";
      });
    });
  }
  if (reloadWhyAiBtn) {
    reloadWhyAiBtn.addEventListener("click", () => {
      loadWhyAiSettings().catch((err) => {
        whyAiStatusEl.textContent = err.message;
        whyAiStatusEl.className = "text-xs text-red-400";
      });
    });
  }
  if (addSocialLinkBtn) {
    addSocialLinkBtn.addEventListener("click", () => createSocialLinkRow());
  }
  if (addAboutTechnicalSkillBtn) {
    addAboutTechnicalSkillBtn.addEventListener("click", () => createAboutTechnicalSkillRow());
  }
  if (addAboutSoftSkillBtn) {
    addAboutSoftSkillBtn.addEventListener("click", () => createAboutSoftSkillRow());
  }
  if (addAboutEducationItemBtn) {
    addAboutEducationItemBtn.addEventListener("click", () => createAboutEducationItemRow());
  }
  if (reloadContactSocialBtn) {
    reloadContactSocialBtn.addEventListener("click", () => {
      loadContactSocialSettings().catch((err) => {
        contactSocialStatusEl.textContent = err.message;
        contactSocialStatusEl.className = "text-xs text-red-400";
      });
    });
  }
  if (reloadHeroSettingsBtn) {
    reloadHeroSettingsBtn.addEventListener("click", () => {
      loadHeroSettings().catch((err) => {
        heroSettingsStatusEl.textContent = err.message;
        heroSettingsStatusEl.className = "text-xs text-red-400";
      });
    });
  }
  if (reloadAboutPageBtn) {
    reloadAboutPageBtn.addEventListener("click", () => {
      loadAboutPageSettings().catch((err) => {
        aboutPageStatusEl.textContent = err.message;
        aboutPageStatusEl.className = "text-xs text-red-400";
      });
    });
  }
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

  if (aiFocusForm) {
    loadAiFocusSettings().catch((err) => {
      aiFocusStatusEl.textContent = err.message;
      aiFocusStatusEl.className = "text-xs text-red-400";
    });
  }

  if (whyAiForm) {
    loadWhyAiSettings().catch((err) => {
      whyAiStatusEl.textContent = err.message;
      whyAiStatusEl.className = "text-xs text-red-400";
    });
  }

  if (heroSettingsForm) {
    loadHeroSettings().catch((err) => {
      heroSettingsStatusEl.textContent = err.message;
      heroSettingsStatusEl.className = "text-xs text-red-400";
    });
  }

  if (contactSocialForm) {
    loadContactSocialSettings().catch((err) => {
      contactSocialStatusEl.textContent = err.message;
      contactSocialStatusEl.className = "text-xs text-red-400";
    });
  }

  if (aboutPageForm) {
    loadAboutPageSettings().catch((err) => {
      aboutPageStatusEl.textContent = err.message;
      aboutPageStatusEl.className = "text-xs text-red-400";
    });
  }
})();