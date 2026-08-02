const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authentication token, access denied' });
  }

  const token = authHeader.substring(7);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('FATAL: JWT_SECRET environment variable is not defined.');
    return res.status(500).json({ error: 'Server authentication configuration error' });
  }

  try {
    const verified = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token verification failed, authorization denied' });
  }
};

module.exports = authMiddleware;

