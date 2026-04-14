const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    heroTagline: { type: String, default: "Artificial Intelligence Student" },
    heroHeadline: {
      type: String,
      default:
        "Hi, I'm Dulneth Damsira an undergraduate AI student passionate about building intelligent systems.",
    },
    heroDescription: {
      type: String,
      default:
        "I’m an undergraduate AI student focused on machine learning, deep learning, and intelligent web applications.",
    },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    contactLocation: { type: String, default: "" },
    socialLinks: {
      type: [
        {
          type: { type: String, required: true },
          label: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
      default: [
        { type: "GitHub", label: "GitHub", url: "https://github.com/yourusername" },
        { type: "LinkedIn", label: "LinkedIn", url: "https://www.linkedin.com/in/yourusername" },
        { type: "Twitter", label: "Twitter", url: "https://twitter.com/yourusername" },
      ],
    },
    aboutPageTitle: { type: String, default: "About Me" },
    aboutPageSubtitle: {
      type: String,
      default: "Undergraduate student specializing in Artificial Intelligence.",
    },
    aboutIntroParagraph1: {
      type: String,
      default:
        "I am an undergraduate student pursuing a degree in Artificial Intelligence, with a strong interest in machine learning, deep learning, and intelligent web applications. I enjoy turning data into insights and building systems that can learn from experience.",
    },
    aboutIntroParagraph2: {
      type: String,
      default:
        "My work spans academic projects, personal experiments, and open-source contributions, focusing on practical applications of AI such as recommendation systems, computer vision, and natural language processing.",
    },
    aboutSkillsTitle: { type: String, default: "Skills" },
    aboutTechnicalSkillsTitle: { type: String, default: "Technical Skills" },
    aboutTechnicalSkills: {
      type: [
        {
          name: { type: String, required: true },
          percentage: { type: Number, min: 0, max: 100, required: true },
        },
      ],
      default: [
        { name: "Python & ML Libraries", percentage: 80 },
        { name: "Deep Learning (NNs)", percentage: 70 },
        { name: "JavaScript & React", percentage: 75 },
        { name: "Node.js & Express", percentage: 70 },
      ],
    },
    aboutSoftSkillsTitle: { type: String, default: "Soft Skills" },
    aboutSoftSkills: {
      type: [String],
      default: [
        "Problem-solving and analytical thinking",
        "Collaboration and communication in team projects",
        "Continuous learning and experimentation",
        "Technical writing and documentation",
      ],
    },
    aboutEducationTitle: { type: String, default: "Education" },
    aboutEducationItems: {
      type: [
        {
          title: { type: String, required: true },
          institution: { type: String, default: "" },
          period: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      default: [
        {
          title: "BSc in Artificial Intelligence",
          institution: "Your University Name",
          period: "2023 - Present",
          description:
            "Coursework: Machine Learning, Deep Learning, Data Structures, Algorithms, Databases, Web Development.",
        },
        {
          title: "Relevant Certifications",
          institution: "Online ML/AI courses (Coursera, edX, etc.)",
          period: "",
          description: "",
        },
      ],
    },
    aboutCvButtonLabel: { type: String, default: "Download CV" },
    aboutCvButtonUrl: { type: String, default: "assets/YourName_CV.pdf" },
    aiFocusTitle: { type: String, default: "AI Focus Areas" },
    aiFocusAreas: {
      type: [String],
      default: [
        "Automation",
        "Generative AI",
        "Machine Learning",
        "AI-powered Web Applications",
      ],
    },
    whyAiTitle: { type: String, default: "Why Artificial Intelligence?" },
    whyAiDescription: {
      type: String,
      default:
        "I’m passionate about building systems that can perceive, reason, and learn from data-bridging theory with real-world impact.",
    },
    whyAiHighlights: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
        },
      ],
      default: [
        {
          title: "Machine Learning",
          description:
            "Regression, classification, clustering, and model evaluation using Python and popular ML libraries.",
        },
        {
          title: "Deep Learning",
          description:
            "Neural networks for vision and text tasks, experimenting with CNNs, RNNs, and transformers.",
        },
        {
          title: "AI for the Web",
          description:
            "Integrating ML models into full-stack applications to create intelligent user experiences.",
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
