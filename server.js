require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const adminRoutes = require("./routes/adminRoutes");
const cookieParser = require("cookie-parser");
const { User } = require("./models");
const jwt = require("jsonwebtoken");

const app = express();

// Middlewares
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Reads cookies
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Allows cookies to be sent
  })
); // Enable CORS
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Logging

// Routes
app.use("/api/auth", authRoutes); // API URLs
app.use("/api/admin", adminRoutes); // Admin-Only routes

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/protected", authMiddleware, async (req, res) => {
  try {
    /// Find the authenticated user by ID
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Welcome to the protected route!", user,});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
