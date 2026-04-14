(function () {
  const grid = document.getElementById("home-photos-grid");
  if (!grid) return;

  function toAssetUrl(imageUrl) {
    if (!imageUrl) return "https://via.placeholder.com/500x350";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    const origin = API_BASE.replace(/\/api\/?$/, "");
    return `${origin}${imageUrl}`;
  }

  async function loadPhotos() {
    try {
      const res = await fetch(`${API_BASE}/photos`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load photos");

      if (!Array.isArray(data) || data.length === 0) {
        grid.innerHTML = '<p class="text-sm text-slate-400">No photos available yet.</p>';
        return;
      }

      grid.innerHTML = "";
      data.slice(0, 9).forEach((photo) => {
        const card = document.createElement("figure");
        card.className = "bg-slate-900/60 border border-slate-800 rounded-2xl p-2 card-hover";
        card.innerHTML = `
          <img src="${toAssetUrl(photo.imageUrl)}" alt="${photo.caption || "Portfolio photo"}" class="w-full h-44 object-cover rounded-xl" />
          ${photo.caption ? `<figcaption class="text-xs text-slate-300 mt-2 px-1">${photo.caption}</figcaption>` : ""}
        `;
        grid.appendChild(card);
      });
    } catch (err) {
      grid.innerHTML = `<p class="text-sm text-red-400">${err.message}</p>`;
    }
  }

  loadPhotos();
})();
