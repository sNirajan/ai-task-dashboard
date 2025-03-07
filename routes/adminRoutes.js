const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const { User } = require("../models");

const router = express.Router();

// Admin-Only Route: Get All Users
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Only admins can update a user's role
router.put("/update-role/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const {role} = req.body;    
    const user = await User.findByPk(req.params.id);

    if(!user) return res.status(404).json({ message: "User not found"});

    // Update user's role
    user.role = role;
    await user.save();

    res.json({ message: `User role updated to ${role}`});
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Server error"});
  }
});

// Admin-Only Route: Delete a User
router.delete("/users/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
