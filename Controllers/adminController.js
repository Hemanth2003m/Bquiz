const Admin = require("../Models/admin");
const jwt = require("jsonwebtoken");

// Token generation function
const generateToken = (admin) => {
  return jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Register Admin
exports.registerAdmin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Email already exists" });

    const admin = await Admin.create({ username, email, password });

    res.status(201).json({
      message: "Admin registered successfully",
      token: generateToken(admin),
    });
  } catch (err) {
    next(err);
  }
};

// Login Admin
exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Logged in successfully",
      token: generateToken(admin),
    });
  } catch (err) {
    next(err);
  }
};
