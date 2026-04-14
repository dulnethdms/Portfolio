const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({
      token: generateToken(user._id),
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: seed a default admin user (call once manually or via script)
exports.seedAdmin = async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return res.status(400).json({ message: "Admin credentials are missing" });
    }

    const exists = await User.findOne({ email: adminEmail });

    if (exists) {
      exists.password = adminPassword;
      await exists.save();
      return res.json({ message: "Admin updated", id: exists._id });
    }

    const user = await User.create({
      email: adminEmail,
      password: adminPassword,
    });
    res.json({ message: "Admin created", id: user._id });
  } catch (err) {
    res.status(500).json({ message: "Failed to seed admin" });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { currentPassword, email, password } = req.body;

    if (!currentPassword || !email || !password) {
      return res.status(400).json({ message: "Current password, email, and password are required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const validPassword = await user.matchPassword(currentPassword);
    if (!validPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ message: "Email is already in use" });
      }
      user.email = email;
    }

    user.password = password;
    await user.save();

    res.json({
      message: "Admin credentials updated",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update admin credentials" });
  }
};