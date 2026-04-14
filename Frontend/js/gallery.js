(function () {
  const grid = document.getElementById("home-photos-grid");
  const fullGalleryGrid = document.getElementById("gallery-grid");
  if (!grid && !fullGalleryGrid) return;

  const gallerySection = grid ? grid.closest("section") : null;

  let fullscreenViewer = null;
  let sliderTimer = null;
  let sliderCurrentIndex = 0;
  let sliderTrack = null;
  let sliderDots = null;
  let sliderSlides = [];
  let sliderImages = [];

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function rgbToHex(red, green, blue) {
    return [red, green, blue]
      .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0"))
      .join("");
  }

  function hexToRgb(hex) {
    const normalized = hex.replace("#", "");
    return {
      red: parseInt(normalized.slice(0, 2), 16),
      green: parseInt(normalized.slice(2, 4), 16),
      blue: parseInt(normalized.slice(4, 6), 16),
    };
  }

  function setGalleryBackground(hexColor) {
    if (!gallerySection) return;
    const { red, green, blue } = hexToRgb(hexColor);
    gallerySection.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, 0.16)`;
    gallerySection.style.backgroundImage = "none";
    gallerySection.style.borderRadius = "1.5rem";
    gallerySection.style.border = "1px solid rgba(51, 65, 85, 0.2)";
    gallerySection.style.boxShadow = "none";
  }

  function extractAverageColor(image) {
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return null;

      const sampleSize = 24;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      context.drawImage(image, 0, 0, sampleSize, sampleSize);

      const { data } = context.getImageData(0, 0, sampleSize, sampleSize);
      let redTotal = 0;
      let greenTotal = 0;
      let blueTotal = 0;
      let pixelCount = 0;

      for (let index = 0; index < data.length; index += 4) {
        const alpha = data[index + 3];
        if (alpha < 100) continue;
        redTotal += data[index];
        greenTotal += data[index + 1];
        blueTotal += data[index + 2];
        pixelCount += 1;
      }

      if (!pixelCount) return null;
      return rgbToHex(redTotal / pixelCount, greenTotal / pixelCount, blueTotal / pixelCount);
    } catch (_error) {
      return null;
    }
  }

  function updateGalleryBackgroundForSlide(index) {
    const image = sliderImages[index];
    if (!image) return;

    const applyColor = () => {
      const backgroundColor = extractAverageColor(image);
      if (backgroundColor) {
        setGalleryBackground(backgroundColor);
      }
    };

    if (image.complete && image.naturalWidth > 0) {
      applyColor();
      return;
    }

    image.addEventListener("load", applyColor, { once: true });
  }

  function stopSlider() {
    if (sliderTimer) {
      clearInterval(sliderTimer);
      sliderTimer = null;
    }
  }

  function startSlider() {
    stopSlider();
    if (!sliderSlides.length) return;

    sliderTimer = setInterval(() => {
      goToSlide(sliderCurrentIndex + 1);
    }, 4000);
  }

  function updateSlider() {
    if (!sliderTrack || !sliderSlides.length) return;

    sliderTrack.style.transform = `translateX(-${sliderCurrentIndex * 100}%)`;
    updateGalleryBackgroundForSlide(sliderCurrentIndex);

    if (sliderDots) {
      Array.from(sliderDots.children).forEach((dot, index) => {
        dot.classList.toggle("bg-indigo-500", index === sliderCurrentIndex);
        dot.classList.toggle("bg-slate-600", index !== sliderCurrentIndex);
      });
    }
  }

  function goToSlide(index) {
    if (!sliderSlides.length) return;
    sliderCurrentIndex = (index + sliderSlides.length) % sliderSlides.length;
    updateSlider();
  }

  function ensureFullscreenViewer() {
    if (fullscreenViewer) return fullscreenViewer;

    fullscreenViewer = document.createElement("div");
    fullscreenViewer.id = "photo-fullscreen-viewer";
    fullscreenViewer.className = "fixed inset-0 z-50 hidden items-center justify-center bg-black/90 px-4";
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.setAttribute("data-close", "true");
    closeBtn.setAttribute("aria-label", "Close image viewer");
    closeBtn.className = "absolute top-4 right-4 text-white text-2xl leading-none";
    closeBtn.innerHTML = "&times;";

    const figure = document.createElement("figure");
    figure.className = "max-w-5xl w-full text-center";

    const image = document.createElement("img");
    image.setAttribute("data-fullscreen-image", "true");
    image.alt = "";
    image.className = "mx-auto max-h-[85vh] w-auto rounded-2xl shadow-2xl object-contain";

    const caption = document.createElement("figcaption");
    caption.setAttribute("data-fullscreen-caption", "true");
    caption.className = "mt-3 text-sm text-slate-200";

    figure.appendChild(image);
    figure.appendChild(caption);
    fullscreenViewer.appendChild(closeBtn);
    fullscreenViewer.appendChild(figure);

    fullscreenViewer.addEventListener("click", (event) => {
      if (event.target === fullscreenViewer || event.target.hasAttribute("data-close")) {
        hideFullscreenViewer();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hideFullscreenViewer();
      }
    });

    document.body.appendChild(fullscreenViewer);
    return fullscreenViewer;
  }

  function showFullscreenViewer(imageUrl, caption, altText) {
    const viewer = ensureFullscreenViewer();
    const image = viewer.querySelector("[data-fullscreen-image]");
    const captionEl = viewer.querySelector("[data-fullscreen-caption]");

    image.src = imageUrl;
    image.alt = altText || caption || "Featured photo";
    captionEl.textContent = caption || "";
    viewer.classList.remove("hidden");
    viewer.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  }

  function hideFullscreenViewer() {
    if (!fullscreenViewer) return;
    fullscreenViewer.classList.add("hidden");
    fullscreenViewer.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  }

  function toAssetUrl(imageUrl) {
    if (!imageUrl) return "https://via.placeholder.com/500x350";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    const origin = API_BASE.replace(/\/api\/?$/, "");
    return `${origin}${imageUrl}`;
  }

  function buildSliderSkeleton() {
    grid.innerHTML = "";
    grid.className = "relative overflow-hidden rounded-3xl p-2 md:p-3";

    const viewport = document.createElement("div");
    viewport.className = "overflow-hidden rounded-2xl";

    sliderTrack = document.createElement("div");
    sliderTrack.className = "flex transition-transform duration-700 ease-in-out";
    sliderTrack.style.willChange = "transform";

    viewport.appendChild(sliderTrack);
    grid.appendChild(viewport);

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", "Previous photo");
    prevBtn.className = "absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-slate-950/35 backdrop-blur-md text-white w-10 h-10 rounded-full border border-slate-700/50 shadow-lg flex items-center justify-center";
    prevBtn.innerHTML = "&#10094;";

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", "Next photo");
    nextBtn.className = "absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-slate-950/35 backdrop-blur-md text-white w-10 h-10 rounded-full border border-slate-700/50 shadow-lg flex items-center justify-center";
    nextBtn.innerHTML = "&#10095;";

    sliderDots = document.createElement("div");
    sliderDots.className = "mt-4 flex items-center justify-center gap-2";

    prevBtn.addEventListener("click", () => {
      goToSlide(sliderCurrentIndex - 1);
      startSlider();
    });

    nextBtn.addEventListener("click", () => {
      goToSlide(sliderCurrentIndex + 1);
      startSlider();
    });

    grid.appendChild(prevBtn);
    grid.appendChild(nextBtn);
    grid.appendChild(sliderDots);

    grid.addEventListener("mouseenter", stopSlider);
    grid.addEventListener("mouseleave", startSlider);
  }

  function createPhotoCard(photo) {
    const card = document.createElement("figure");
    card.className = "bg-transparent border-0 rounded-3xl p-0 card-hover h-full shadow-none overflow-hidden";

    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.className = "block w-full text-left";
    openBtn.dataset.photoUrl = toAssetUrl(photo.imageUrl);
    openBtn.dataset.photoCaption = photo.caption || "";
    openBtn.dataset.photoAlt = photo.caption || "Portfolio photo";

    const imageFrame = document.createElement("div");
    imageFrame.className = "relative w-full aspect-[16/9] overflow-hidden p-0 rounded-3xl bg-slate-950/10";

    const image = document.createElement("img");
    image.crossOrigin = "anonymous";
    image.src = toAssetUrl(photo.imageUrl);
    image.alt = photo.caption || "Portfolio photo";
    image.className = "block w-full h-full object-cover object-center rounded-3xl";

    imageFrame.appendChild(image);
    const edgeFade = document.createElement("div");
    edgeFade.className = "pointer-events-none absolute inset-0 rounded-3xl";
    edgeFade.style.background = "radial-gradient(circle at center, rgba(15, 23, 42, 0) 58%, rgba(15, 23, 42, 0.18) 78%, rgba(15, 23, 42, 0.35) 100%)";
    imageFrame.appendChild(edgeFade);
    openBtn.appendChild(imageFrame);
    openBtn.addEventListener("click", () => {
      showFullscreenViewer(openBtn.dataset.photoUrl, openBtn.dataset.photoCaption, openBtn.dataset.photoAlt);
    });

    card.appendChild(openBtn);

    if (photo.caption) {
      const caption = document.createElement("figcaption");
      caption.className = "text-xs text-slate-300 mt-2 px-1";
      caption.textContent = photo.caption;
      card.appendChild(caption);
    }

    return { card, image };
  }

  function renderFullGallery(photos) {
    fullGalleryGrid.innerHTML = "";
    fullGalleryGrid.className = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

    photos.forEach((photo) => {
      const { card } = createPhotoCard(photo);
      fullGalleryGrid.appendChild(card);
    });
  }

  async function loadPhotos() {
    try {
      const res = await fetch(`${API_BASE}/photos`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load photos");

      if (!Array.isArray(data) || data.length === 0) {
        const target = grid || fullGalleryGrid;
        target.innerHTML = '<p class="text-sm text-slate-400">No photos available yet.</p>';
        return;
      }

      if (grid) {
        const photos = data.slice(0, 9);
        buildSliderSkeleton();
        sliderSlides = [];
        sliderImages = [];
        sliderCurrentIndex = 0;

        photos.forEach((photo, index) => {
          const slide = document.createElement("figure");
          slide.className = "min-w-full px-1";

          const { card, image } = createPhotoCard(photo);

          slide.appendChild(card);
          sliderTrack.appendChild(slide);
          sliderSlides.push(slide);
          sliderImages.push(image);

          const dot = document.createElement("button");
          dot.type = "button";
          dot.setAttribute("aria-label", `Go to photo ${index + 1}`);
          dot.className = "w-2.5 h-2.5 rounded-full bg-slate-600 transition-colors";
          dot.addEventListener("click", () => {
            goToSlide(index);
            startSlider();
          });
          sliderDots.appendChild(dot);
        });

        updateSlider();
        startSlider();
      }

      if (fullGalleryGrid) {
        renderFullGallery(data);
      }
    } catch (err) {
      const target = grid || fullGalleryGrid;
      target.innerHTML = `<p class="text-sm text-red-400">${err.message}</p>`;
    }
  }

  loadPhotos();
})();
