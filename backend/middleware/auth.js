const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No authentication token, access denied' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'insuresathi_fallback_secret_key_2026';
    const verified = jwt.verify(token, jwtSecret);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token verification failed, authorization denied' });
  }
};

module.exports = authMiddleware;
