const jwt = require("jsonwebtoken");

// Generate a JWT token for user authentication
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role }, // Payload
    process.env.JWT_SECRET, // Secret key from .env file
    { expiresIn: "1h" } // Token expiration time
  );
};


module.exports = {generateToken};