const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
  // roles can be "student", "owner", "admin" or an array; empty = any logged-in user
  if (!Array.isArray(roles)) roles = [roles];

  return (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role, iat, exp }

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden for this role" });
      }

      next();
    } catch (err) {
      console.error("JWT error", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = auth;
