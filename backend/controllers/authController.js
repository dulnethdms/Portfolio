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
    const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (exists) return res.json({ message: "Admin already exists" });
    const user = await User.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    res.json({ message: "Admin created", id: user._id });
  } catch (err) {
    res.status(500).json({ message: "Failed to seed admin" });
  }
};