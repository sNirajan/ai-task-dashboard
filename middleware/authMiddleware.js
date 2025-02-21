const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get  JWT from HTTP-only cookies
  const token = req.cookies.token;

  // Check if no token is provided
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request object
    next(); // Continue to the next middleware
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;

/*
Explanation:

- Extracts JWT token from Authorization header.
- Verifies the token using jwt.verify().
- If valid, attaches the user data (req.user) for future requests.
- If invalid, returns 401 Unauthorized.
*/
