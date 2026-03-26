import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // 🔍 Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        msg: "No token provided"
      });
    }

    // 🔓 Extract token
    const token = authHeader.split(" ")[1];

    // 🔐 Verify token
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // ✅ Attach user info to request
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(403).json({
      msg: "Invalid or expired token"
    });
  }
};