// Fetch projects and render on home + projects pages

async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json();
}

function createProjectCard(project) {
  const div = document.createElement("article");
  div.className = "bg-slate-900/60 border border-slate-800 rounded-2xl p-4 card-hover text-sm";
  div.dataset.category = project.category;

  div.innerHTML = `
    <img src="${project.imageUrl || "https://via.placeholder.com/400x250"}"
         alt="${project.title}"
         class="w-full h-40 object-cover rounded-xl mb-3" />
    <h3 class="font-semibold mb-1">${project.title}</h3>
    <p class="text-slate-300 text-xs mb-2 line-clamp-3">${project.description || ""}</p>
    <p class="text-[11px] text-slate-400 mb-2">${(project.techStack || []).join(", ")}</p>
    <div class="flex justify-between items-center text-[11px]">
      <a href="project-details.html?id=${project._id}" class="text-indigo-400 hover:underline">Details</a>
      <div class="flex gap-2">
        ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener" class="hover:underline">GitHub</a>` : ""}
        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener" class="hover:underline">Live</a>` : ""}
      </div>
    </div>
  `;
  return div;
}

(async function initProjects() {
  const featuredContainer = document.getElementById("featured-projects");
  const grid = document.getElementById("projects-grid");
  const filters = document.querySelectorAll(".project-filter");
  const detailsContainer = document.getElementById("project-details");

  try {
    const projects = await fetchProjects();

    // Home featured
    if (featuredContainer) {
      featuredContainer.innerHTML = "";
      projects.slice(0, 3).forEach((p) => {
        featuredContainer.appendChild(createProjectCard(p));
      });
    }

    // Projects grid
    if (grid) {
      grid.innerHTML = "";
      projects.forEach((p) => grid.appendChild(createProjectCard(p)));

      if (filters.length) {
        filters.forEach((btn) => {
          btn.addEventListener("click", () => {
            const filter = btn.dataset.filter;
            filters.forEach((b) => b.classList.remove("bg-indigo-500"));
            btn.classList.add("bg-indigo-500");

            Array.from(grid.children).forEach((card) => {
              if (filter === "all" || card.dataset.category === filter) {
                card.classList.remove("hidden");
              } else {
                card.classList.add("hidden");
              }
            });
          });
        });
      }
    }

    // Project details
    if (detailsContainer) {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      const project = projects.find((p) => p._id === id);
      if (!project) {
        detailsContainer.innerHTML = `<p class="text-sm text-red-400">Project not found.</p>`;
        return;
      }

      detailsContainer.innerHTML = `
        <header class="mb-4">
          <h1 class="text-3xl font-bold mb-1">${project.title}</h1>
          <p class="text-xs text-slate-400 uppercase tracking-[0.2em]">${project.category}</p>
        </header>
        <section class="grid md:grid-cols-2 gap-6 mb-6">
          <img src="${project.imageUrl || "https://via.placeholder.com/600x400"}"
               alt="${project.title}"
               class="w-full rounded-2xl border border-slate-800" />
          <div class="space-y-3 text-sm">
            <p>${project.description || ""}</p>
            <div>
              <h2 class="font-semibold mb-1">Tech Stack</h2>
              <p class="text-slate-300">${(project.techStack || []).join(", ")}</p>
            </div>
            <div class="flex gap-3 text-xs">
              ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener" class="px-3 py-1 rounded-full border border-slate-700 hover:border-indigo-400">GitHub</a>` : ""}
              ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener" class="px-3 py-1 rounded-full bg-indigo-500 hover:bg-indigo-600">Live Demo</a>` : ""}
            </div>
          </div>
        </section>
      `;
    }
  } catch (err) {
    if (featuredContainer) featuredContainer.innerHTML = `<p class="text-sm text-red-400">${err.message}</p>`;
    if (grid) grid.innerHTML = `<p class="text-sm text-red-400">${err.message}</p>`;
  }
})();