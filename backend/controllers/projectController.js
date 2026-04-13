const Project = require("../models/Projects");

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, description, category, githubUrl, liveUrl } = req.body;
    const techStack = req.body.techStack ? JSON.parse(req.body.techStack) : [];
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const project = await Project.create({
      title,
      description,
      category,
      githubUrl,
      liveUrl,
      techStack,
      imageUrl,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to create project" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { title, description, category, githubUrl, liveUrl } = req.body;
    const techStack = req.body.techStack ? JSON.parse(req.body.techStack) : undefined;
    const update = { title, description, category, githubUrl, liveUrl };
    if (techStack) update.techStack = techStack;
    if (req.file) update.imageUrl = `/uploads/${req.file.filename}`;

    const project = await Project.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to update project" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete project" });
  }
};