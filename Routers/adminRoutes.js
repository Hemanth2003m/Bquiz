const express = require("express");
const Admin = require("../Models/admin");
const bcrypt = require('bcrypt');  // or 'bcrypt' if you installed that instead
const jwt = require('jsonwebtoken');
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { registerAdmin, loginAdmin } = require("../Controllers/adminController");

// List of disposable email domains to block (you can extend this list)
const disposableDomains = [
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "dispostable.com",
  "fakeinbox.com",
];

// Custom validator to block disposable email domains
const isNotDisposableEmail = (email) => {
  const domain = email.split("@")[1].toLowerCase();
  if (disposableDomains.includes(domain)) {
    throw new Error("Disposable email addresses are not allowed");
  }
  return true;
};

// Register route with validators
router.post(
  "/",
  [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .trim()
      .escape(),
    body("email")
      .isEmail()
      .withMessage("Enter a valid email")
      .custom(isNotDisposableEmail),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  registerAdmin
);

// Login route with validators
// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { email, password } = req.body;

      // Find admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      res.status(200).json({
        message: 'Logged in successfully',
        token,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
