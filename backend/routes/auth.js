const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Rate limiter for login endpoint (max 5 attempts per 15 minutes per IP)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts from this IP, please try again after 15 minutes.' }
});

router.post('/login', loginLimiter, (req, res) => {
  const { agencyCode, password } = req.body;
  const adminAgencyCode = process.env.ADMIN_AGENCY_CODE;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminAgencyCode || !adminPassword || !jwtSecret) {
    console.error('FATAL: Auth environment variables (ADMIN_AGENCY_CODE, ADMIN_PASSWORD, JWT_SECRET) are missing.');
    return res.status(500).json({ error: 'Server authentication misconfigured' });
  }

  if (!agencyCode || typeof agencyCode !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Agency code and password are required' });
  }

  if (agencyCode === adminAgencyCode && password === adminPassword) {
    const token = jwt.sign({ id: 'admin', role: 'admin' }, jwtSecret, { expiresIn: '8h', algorithm: 'HS256' });
    return res.json({ token, message: 'Login successful' });
  } else {
    return res.status(401).json({ error: 'Invalid agency code or password' });
  }
});

// Verify token endpoint to check if current token is valid
router.get('/verify', (req, res) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ valid: false });

  const token = authHeader.substring(7);
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) return res.status(500).json({ valid: false });

  try {
    jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
    return res.json({ valid: true });
  } catch (error) {
    return res.status(401).json({ valid: false });
  }
});

module.exports = router;

