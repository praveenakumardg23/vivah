import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach full user info (id, email, phone, role) from token payload
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ msg: 'Invalid or expired token' });
  }
};