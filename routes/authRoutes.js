const express = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../models"); // Import User Model
const { generateToken } = require("../utils/jwt"); // Import JWT function

const router = express.Router();

// User Registration API = Creates a new user account
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default role is 'user', only and admin should be able to assign a role
    });

    // Generate a JWT token for the new user
    const token = generateToken(newUser);

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    req.staus(500).json({ message: "Server error", error: error.message });
  }
});

// User Login API - Authentication user and returns a JWT token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in database by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token for the user
    const token = generateToken(user);

    res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

/* Explanation for Register API: 
- Checks if the user already exists in the database.
- Hashes the password using bcrypt before saving.
- Creates the user in PostgreSQL using Sequelize.
- Generates a JWT token and sends it to the client.
*/

/* Explanation for Login API: 
- Finds the user by email.
- Compares password with the hashed password in the database.
- Generates a JWT token if the password matches.
- Returns "Invalid credentials" if the user is not found or the password is incorrect.
*/