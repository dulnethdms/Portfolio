const API_BASE = "http://localhost:5000/api";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getAnimatedBackgroundPalette(theme) {
  if (theme === "light") {
    return {
      orb1: "rgba(79, 70, 229, 0.40)",
      orb2: "rgba(14, 165, 233, 0.32)",
      orb3: "rgba(16, 185, 129, 0.26)",
      gradient:
        "radial-gradient(circle_at_top, rgba(99, 102, 241, 0.24), transparent 32%), radial-gradient(circle_at_80%_18%, rgba(14, 165, 233, 0.20), transparent 24%), radial-gradient(circle_at_bottom_left, rgba(16, 185, 129, 0.16), transparent 30%)",
      gradientOpacity: 1,
    };
  }

  return {
    orb1: "rgba(79, 70, 229, 0.20)",
    orb2: "rgba(14, 165, 233, 0.15)",
    orb3: "rgba(16, 185, 129, 0.10)",
    gradient:
      "radial-gradient(circle_at_top, rgba(99, 102, 241, 0.14), transparent 34%), radial-gradient(circle_at_80%_18%, rgba(14, 165, 233, 0.12), transparent 28%), radial-gradient(circle_at_bottom_left, rgba(16, 185, 129, 0.1), transparent 32%)",
    gradientOpacity: 0.9,
  };
}

function ensureAnimatedBackground() {
  if (document.getElementById("site-background-spreads")) return document.getElementById("site-background-spreads");

  const body = document.body;
  if (!body) return null;

  const background = document.createElement("div");
  background.id = "site-background-spreads";
  background.setAttribute("aria-hidden", "true");
  background.className = "pointer-events-none fixed inset-0 z-0 overflow-hidden";
  background.innerHTML = `
    <div data-bg-orb="1" class="absolute -top-28 -left-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"></div>
    <div data-bg-orb="2" class="absolute top-36 right-0 h-[32rem] w-[32rem] rounded-full bg-sky-500/15 blur-3xl"></div>
    <div data-bg-orb="3" class="absolute bottom-[-8rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-emerald-400/10 blur-3xl"></div>
    <div data-bg-gradient="true" class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.14),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(14,165,233,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_32%)]"></div>
  `;

  body.insertBefore(background, body.firstChild);
  return background;
}

function updateAnimatedBackground() {
  const background = ensureAnimatedBackground();
  if (!background) return;

  const orb1 = background.querySelector("[data-bg-orb='1']");
  const orb2 = background.querySelector("[data-bg-orb='2']");
  const orb3 = background.querySelector("[data-bg-orb='3']");
  const gradientLayer = background.querySelector("[data-bg-gradient='true']");
  const palette = getAnimatedBackgroundPalette(document.body.getAttribute("data-theme") || "dark");

  if (orb1) orb1.style.backgroundColor = palette.orb1;
  if (orb2) orb2.style.backgroundColor = palette.orb2;
  if (orb3) orb3.style.backgroundColor = palette.orb3;
  if (gradientLayer) {
    gradientLayer.style.backgroundImage = palette.gradient;
    gradientLayer.style.opacity = String(palette.gradientOpacity);
  }

  const scrollTop = window.scrollY || window.pageYOffset || 0;
  const pageHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = clamp(scrollTop / pageHeight, 0, 1);

  if (orb1) orb1.style.transform = `translate3d(${progress * 24}px, ${progress * 160}px, 0) scale(${1 + progress * 0.06})`;
  if (orb2) orb2.style.transform = `translate3d(${-progress * 36}px, ${progress * 120}px, 0) scale(${1 + progress * 0.04})`;
  if (orb3) orb3.style.transform = `translate3d(${progress * 30}px, ${-progress * 110}px, 0) scale(${1 + progress * 0.05})`;
  if (gradientLayer) {
    gradientLayer.style.transform = `translate3d(0, ${progress * 80}px, 0)`;
    gradientLayer.style.opacity = String(0.9 - progress * 0.12);
  }
}

// Theme toggle
(function () {
  const body = document.body;
  const toggleBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");

  function updateThemeToggleIcon(theme) {
    if (!toggleBtn) return;

    if (theme === "dark") {
      toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-4 h-4" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3c.13.58.2 1.18.2 1.79A7 7 0 0019.21 12c.61 0 1.21-.07 1.79-.21z"/>
        </svg>
      `;
      toggleBtn.setAttribute("aria-label", "Dark theme active");
      toggleBtn.setAttribute("title", "Dark theme");
    } else {
      toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-4 h-4" aria-hidden="true">
          <circle cx="12" cy="12" r="4"/>
          <path stroke-linecap="round" d="M12 2v2m0 16v2m10-10h-2M4 12H2m17.07 7.07-1.41-1.41M6.34 6.34 4.93 4.93m14.14 0-1.41 1.41M6.34 17.66l-1.41 1.41"/>
        </svg>
      `;
      toggleBtn.setAttribute("aria-label", "Light theme active");
      toggleBtn.setAttribute("title", "Light theme");
    }
  }

  if (savedTheme) {
    body.setAttribute("data-theme", savedTheme);
  }

  const initialTheme = body.getAttribute("data-theme") || "dark";
  updateThemeToggleIcon(initialTheme);

  if (toggleBtn) {
    toggleBtn.classList.add("inline-flex", "items-center", "justify-center");

    toggleBtn.addEventListener("click", () => {
      const current = body.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      body.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      updateThemeToggleIcon(next);
      updateAnimatedBackground();
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  let ticking = false;
  function requestAnimatedBackgroundUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateAnimatedBackground();
      ticking = false;
    });
  }

  window.addEventListener("scroll", requestAnimatedBackgroundUpdate, { passive: true });
  window.addEventListener("resize", requestAnimatedBackgroundUpdate);
  updateAnimatedBackground();
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

// Homepage AI focus settings
(function () {
  const featuredProjectsEl = document.getElementById("featured-projects");
  if (!featuredProjectsEl) return;

  const heroTaglineEl = document.getElementById("hero-tagline");
  const heroHeadlineEl = document.getElementById("hero-headline");
  const heroDescriptionEl = document.getElementById("hero-description");
  const focusTitleEl = document.getElementById("ai-focus-title");
  const focusListEl = document.getElementById("ai-focus-list");
  const whyAiTitleEl = document.getElementById("why-ai-title");
  const whyAiDescriptionEl = document.getElementById("why-ai-description");
  const whyAiHighlightsEl = document.getElementById("why-ai-highlights");

  if (!heroTaglineEl && !heroHeadlineEl && !heroDescriptionEl && !focusTitleEl && !focusListEl && !whyAiTitleEl && !whyAiDescriptionEl && !whyAiHighlightsEl) return;

  function applyTextVisibility(element, value) {
    if (!element) return;
    const text = String(value || "").trim();
    if (!text) {
      element.classList.add("hidden");
      element.textContent = "";
      return;
    }

    element.classList.remove("hidden");
    element.textContent = text;
  }

  async function loadAiFocusSettings() {
    try {
      const res = await fetch(`${API_BASE}/site-settings`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load focus settings");

      if (Object.prototype.hasOwnProperty.call(data, "heroTagline")) {
        applyTextVisibility(heroTaglineEl, data.heroTagline);
      }

      if (Object.prototype.hasOwnProperty.call(data, "heroHeadline")) {
        applyTextVisibility(heroHeadlineEl, data.heroHeadline);
      }

      if (Object.prototype.hasOwnProperty.call(data, "heroDescription")) {
        applyTextVisibility(heroDescriptionEl, data.heroDescription);
      }

      if (focusTitleEl && data.aiFocusTitle) {
        focusTitleEl.textContent = data.aiFocusTitle;
      }

      if (focusListEl && Array.isArray(data.aiFocusAreas) && data.aiFocusAreas.length) {
        focusListEl.innerHTML = "";
        data.aiFocusAreas.forEach((area) => {
          const li = document.createElement("li");
          li.textContent = `• ${area}`;
          focusListEl.appendChild(li);
        });
      }

      if (whyAiTitleEl && data.whyAiTitle) {
        whyAiTitleEl.textContent = data.whyAiTitle;
      }

      if (whyAiDescriptionEl && data.whyAiDescription) {
        whyAiDescriptionEl.textContent = data.whyAiDescription;
      }

      if (whyAiHighlightsEl && Array.isArray(data.whyAiHighlights) && data.whyAiHighlights.length) {
        whyAiHighlightsEl.innerHTML = "";
        data.whyAiHighlights.forEach((item) => {
          const card = document.createElement("div");
          card.innerHTML = `
            <h3 class="font-semibold mb-1 text-indigo-300"></h3>
            <p></p>
          `;

          const titleEl = card.querySelector("h3");
          const descriptionEl = card.querySelector("p");
          titleEl.textContent = item.title;
          descriptionEl.textContent = item.description;

          whyAiHighlightsEl.appendChild(card);
        });
      }
    } catch (err) {
      // Keep hardcoded defaults when request fails.
      console.error("AI focus settings load failed:", err.message);
    }
  }

  loadAiFocusSettings();
})();

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
  const detailEmailEl = document.getElementById("contact-detail-email");
  const detailPhoneEl = document.getElementById("contact-detail-phone");
  const detailLocationEl = document.getElementById("contact-detail-location");
  const socialLinksEl = document.getElementById("contact-social-links");

  function setContactItem(element, label, value) {
    if (!element) return;
    const text = String(value || "").trim();
    if (!text) {
      element.classList.add("hidden");
      element.textContent = "";
      return;
    }

    element.classList.remove("hidden");
    element.textContent = `${label}: ${text}`;
  }

  function renderSocialLinks(links) {
    if (!socialLinksEl || !Array.isArray(links)) return;

    if (!links.length) {
      socialLinksEl.innerHTML = '<li class="text-slate-400">No social media links available.</li>';
      return;
    }

    socialLinksEl.innerHTML = "";
    links.forEach((item) => {
      const type = String(item?.type || "").trim();
      const label = String(item?.label || "").trim();
      const url = String(item?.url || "").trim();
      if (!type || !label || !url) return;

      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = label || type;
      a.title = type;
      li.appendChild(a);
      socialLinksEl.appendChild(li);
    });

    if (!socialLinksEl.children.length) {
      socialLinksEl.innerHTML = '<li class="text-slate-400">No social media links available.</li>';
    }
  }

  async function loadContactPageSettings() {
    try {
      const res = await fetch(`${API_BASE}/site-settings`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load contact details");

      setContactItem(detailEmailEl, "Email", data.contactEmail);
      setContactItem(detailPhoneEl, "Phone", data.contactPhone);
      setContactItem(detailLocationEl, "Location", data.contactLocation);
      renderSocialLinks(Array.isArray(data.socialLinks) ? data.socialLinks : []);
    } catch (err) {
      console.error("Contact settings load failed:", err.message);
    }
  }

  loadContactPageSettings();

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

// About page settings
(function () {
  const aboutPageTitleEl = document.getElementById("about-page-title");
  const aboutCvButtonEl = document.getElementById("about-cv-button");
  if (!aboutPageTitleEl || !aboutCvButtonEl) return;

  const aboutPageSubtitleEl = document.getElementById("about-page-subtitle");
  const aboutIntroParagraph1El = document.getElementById("about-intro-paragraph-1");
  const aboutIntroParagraph2El = document.getElementById("about-intro-paragraph-2");
  const aboutSkillsTitleEl = document.getElementById("about-skills-title");
  const aboutTechnicalSkillsTitleEl = document.getElementById("about-technical-skills-title");
  const aboutTechnicalSkillsListEl = document.getElementById("about-technical-skills-list");
  const aboutSoftSkillsTitleEl = document.getElementById("about-soft-skills-title");
  const aboutSoftSkillsListEl = document.getElementById("about-soft-skills-list");
  const aboutEducationTitleEl = document.getElementById("about-education-title");
  const aboutEducationListEl = document.getElementById("about-education-list");

  function setText(el, value) {
    if (!el) return;
    const text = String(value || "").trim();
    if (text) el.textContent = text;
  }

  function renderTechnicalSkills(items) {
    if (!aboutTechnicalSkillsListEl || !Array.isArray(items) || !items.length) return;
    aboutTechnicalSkillsListEl.innerHTML = "";
    items.forEach((item) => {
      const name = String(item?.name || "").trim();
      const percentage = Number(item?.percentage);
      if (!name || !Number.isFinite(percentage)) return;

      const value = Math.max(0, Math.min(100, Math.round(percentage)));
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="flex justify-between mb-1">
          <span data-role="name"></span><span>${value}%</span>
        </div>
        <div class="w-full bg-slate-800 rounded-full h-2">
          <div class="bg-indigo-500 h-2 rounded-full"></div>
        </div>
      `;
      li.querySelector('[data-role="name"]').textContent = name;
      li.querySelector(".bg-indigo-500").style.width = `${value}%`;
      aboutTechnicalSkillsListEl.appendChild(li);
    });
  }

  function renderSoftSkills(items) {
    if (!aboutSoftSkillsListEl || !Array.isArray(items) || !items.length) return;
    aboutSoftSkillsListEl.innerHTML = "";
    items.forEach((item) => {
      const text = String(item || "").trim();
      if (!text) return;
      const li = document.createElement("li");
      li.textContent = text;
      aboutSoftSkillsListEl.appendChild(li);
    });
  }

  function renderEducation(items) {
    if (!aboutEducationListEl || !Array.isArray(items) || !items.length) return;
    aboutEducationListEl.innerHTML = "";
    items.forEach((item) => {
      const title = String(item?.title || "").trim();
      if (!title) return;
      const institution = String(item?.institution || "").trim();
      const period = String(item?.period || "").trim();
      const description = String(item?.description || "").trim();

      const li = document.createElement("li");
      li.className = "ml-4";
      li.innerHTML = `
        <div class="w-3 h-3 bg-indigo-500 rounded-full -ml-[7px] mb-1"></div>
        <h3 class="font-semibold"></h3>
        <p class="text-slate-300"></p>
        <p class="text-slate-400 text-xs"></p>
        <p class="mt-1"></p>
      `;
      li.querySelector("h3").textContent = title;
      li.querySelectorAll("p")[0].textContent = institution;
      li.querySelectorAll("p")[1].textContent = period;
      li.querySelectorAll("p")[2].textContent = description;

      if (!institution) li.querySelectorAll("p")[0].classList.add("hidden");
      if (!period) li.querySelectorAll("p")[1].classList.add("hidden");
      if (!description) li.querySelectorAll("p")[2].classList.add("hidden");

      aboutEducationListEl.appendChild(li);
    });
  }

  async function loadAboutPageSettings() {
    try {
      const [settingsRes, cvRes] = await Promise.all([
        fetch(`${API_BASE}/site-settings`),
        fetch(`${API_BASE}/cv`),
      ]);

      const data = await settingsRes.json();
      const currentCv = await cvRes.json();

      if (!settingsRes.ok) throw new Error(data.message || "Failed to load about page settings");
      if (!cvRes.ok) throw new Error(currentCv.message || "Failed to load current CV");

      setText(aboutPageTitleEl, data.aboutPageTitle);
      setText(aboutPageSubtitleEl, data.aboutPageSubtitle);
      setText(aboutIntroParagraph1El, data.aboutIntroParagraph1);
      setText(aboutIntroParagraph2El, data.aboutIntroParagraph2);
      setText(aboutSkillsTitleEl, data.aboutSkillsTitle);
      setText(aboutTechnicalSkillsTitleEl, data.aboutTechnicalSkillsTitle);
      setText(aboutSoftSkillsTitleEl, data.aboutSoftSkillsTitle);
      setText(aboutEducationTitleEl, data.aboutEducationTitle);

      renderTechnicalSkills(data.aboutTechnicalSkills);
      renderSoftSkills(data.aboutSoftSkills);
      renderEducation(data.aboutEducationItems);

      if (aboutCvButtonEl) {
        const label = String(data.aboutCvButtonLabel || "Download CV").trim();
        const fallbackUrl = String(data.aboutCvButtonUrl || "").trim();
        const uploadedUrl = currentCv?.fileUrl ? `${API_BASE.replace(/\/api\/?$/, "")}${currentCv.fileUrl}` : "";
        const url = uploadedUrl || fallbackUrl;
        if (label) aboutCvButtonEl.textContent = label;
        if (url) {
          aboutCvButtonEl.href = url;
          aboutCvButtonEl.classList.remove("hidden");
        } else {
          aboutCvButtonEl.classList.add("hidden");
        }
      }
    } catch (err) {
      console.error("About settings load failed:", err.message);
    }
  }

  loadAboutPageSettings();
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