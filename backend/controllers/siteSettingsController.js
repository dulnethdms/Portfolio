const SiteSettings = require("../models/SiteSettings");

const DEFAULT_KEY = "homepage";

function sanitizeFocusAreas(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 12);
}

function sanitizeWhyAiHighlights(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => ({
      title: String(item?.title || "").trim(),
      description: String(item?.description || "").trim(),
    }))
    .filter((item) => item.title && item.description)
    .slice(0, 6);
}

function sanitizeSocialLinks(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => ({
      type: String(item?.type || "").trim(),
      label: String(item?.label || "").trim(),
      url: String(item?.url || "").trim(),
    }))
    .filter((item) => item.type && item.label && item.url)
    .slice(0, 20);
}

function sanitizeAboutTechnicalSkills(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      const name = String(item?.name || "").trim();
      const raw = Number(item?.percentage);
      const percentage = Number.isFinite(raw) ? Math.max(0, Math.min(100, Math.round(raw))) : NaN;
      return { name, percentage };
    })
    .filter((item) => item.name && Number.isFinite(item.percentage))
    .slice(0, 20);
}

function sanitizeAboutSoftSkills(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 30);
}

function sanitizeAboutEducationItems(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => ({
      title: String(item?.title || "").trim(),
      institution: String(item?.institution || "").trim(),
      period: String(item?.period || "").trim(),
      description: String(item?.description || "").trim(),
    }))
    .filter((item) => item.title)
    .slice(0, 20);
}

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne({ key: DEFAULT_KEY });
  if (!settings) {
    settings = await SiteSettings.create({ key: DEFAULT_KEY });
  }
  return settings;
}

exports.getSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to load site settings" });
  }
};

exports.updateSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    let hasChange = false;

    if (Object.prototype.hasOwnProperty.call(req.body, "heroTagline")) {
      settings.heroTagline = String(req.body.heroTagline || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "heroHeadline")) {
      settings.heroHeadline = String(req.body.heroHeadline || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "heroDescription")) {
      settings.heroDescription = String(req.body.heroDescription || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "contactEmail")) {
      settings.contactEmail = String(req.body.contactEmail || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "contactPhone")) {
      settings.contactPhone = String(req.body.contactPhone || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "contactLocation")) {
      settings.contactLocation = String(req.body.contactLocation || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "socialLinks")) {
      settings.socialLinks = sanitizeSocialLinks(req.body.socialLinks);
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aboutPageTitle")) {
      settings.aboutPageTitle = String(req.body.aboutPageTitle || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aboutPageSubtitle")) {
      settings.aboutPageSubtitle = String(req.body.aboutPageSubtitle || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aboutIntroParagraph1")) {
      settings.aboutIntroParagraph1 = String(req.body.aboutIntroParagraph1 || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aboutIntroParagraph2")) {
      settings.aboutIntroParagraph2 = String(req.body.aboutIntroParagraph2 || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aboutSkillsTitle")) {
      settings.aboutSkillsTitle = String(req.body.aboutSkillsTitle || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aboutTechnicalSkillsTitle")) {
      settings.aboutTechnicalSkillsTitle = String(req.body.aboutTechnicalSkillsTitle || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aboutTechnicalSkills")) {
      settings.aboutTechnicalSkills = sanitizeAboutTechnicalSkills(req.body.aboutTechnicalSkills);
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aboutSoftSkillsTitle")) {
      settings.aboutSoftSkillsTitle = String(req.body.aboutSoftSkillsTitle || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aboutSoftSkills")) {
      settings.aboutSoftSkills = sanitizeAboutSoftSkills(req.body.aboutSoftSkills);
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aboutEducationTitle")) {
      settings.aboutEducationTitle = String(req.body.aboutEducationTitle || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aboutEducationItems")) {
      settings.aboutEducationItems = sanitizeAboutEducationItems(req.body.aboutEducationItems);
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aboutCvButtonLabel")) {
      settings.aboutCvButtonLabel = String(req.body.aboutCvButtonLabel || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aboutCvButtonUrl")) {
      settings.aboutCvButtonUrl = String(req.body.aboutCvButtonUrl || "").trim();
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aiFocusTitle")) {
      const aiFocusTitle = String(req.body.aiFocusTitle || "").trim();
      if (!aiFocusTitle) {
        return res.status(400).json({ message: "AI focus title is required" });
      }
      settings.aiFocusTitle = aiFocusTitle;
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "aiFocusAreas")) {
      const aiFocusAreas = sanitizeFocusAreas(req.body.aiFocusAreas);
      if (!aiFocusAreas.length) {
        return res.status(400).json({ message: "Add at least one AI focus area" });
      }
      settings.aiFocusAreas = aiFocusAreas;
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "whyAiTitle")) {
      const whyAiTitle = String(req.body.whyAiTitle || "").trim();
      if (!whyAiTitle) {
        return res.status(400).json({ message: "Why AI title is required" });
      }
      settings.whyAiTitle = whyAiTitle;
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "whyAiDescription")) {
      const whyAiDescription = String(req.body.whyAiDescription || "").trim();
      if (!whyAiDescription) {
        return res.status(400).json({ message: "Why AI description is required" });
      }
      settings.whyAiDescription = whyAiDescription;
      hasChange = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "whyAiHighlights")) {
      const whyAiHighlights = sanitizeWhyAiHighlights(req.body.whyAiHighlights);
      if (!whyAiHighlights.length) {
        return res.status(400).json({ message: "Add at least one Why AI highlight card" });
      }
      settings.whyAiHighlights = whyAiHighlights;
      hasChange = true;
    }

    if (!hasChange) {
      return res.status(400).json({ message: "No valid site settings fields provided" });
    }

    await settings.save();

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to update site settings" });
  }
};
