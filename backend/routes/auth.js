const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { agencyCode, password } = req.body;
  const adminAgencyCode = process.env.ADMIN_AGENCY_CODE || 'A05916370';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Umesh@1972';
  const jwtSecret = process.env.JWT_SECRET || 'insuresathi_fallback_secret_key_2026';

  if (!agencyCode || !password) {
    return res.status(400).json({ error: 'Agency code and password are required' });
  }

  if (agencyCode === adminAgencyCode && password === adminPassword) {
    const token = jwt.sign({ id: 'admin', role: 'admin' }, jwtSecret, { expiresIn: '7d' });
    return res.json({ token, message: 'Login successful' });
  } else {
    return res.status(401).json({ error: 'Invalid agency code or password' });
  }
});

// Verify token endpoint to check if current token is valid
router.get('/verify', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ valid: false });

  try {
    const jwtSecret = process.env.JWT_SECRET || 'insuresathi_fallback_secret_key_2026';
    jwt.verify(token, jwtSecret);
    return res.json({ valid: true });
  } catch (error) {
    return res.status(401).json({ valid: false });
  }
});

module.exports = router;
