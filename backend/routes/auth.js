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

const path = require('path');

// Ensure environment variables are loaded
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });

router.post('/login', loginLimiter, (req, res) => {
  const { agencyCode, password } = req.body;

  // Always force reload from .env if variables are missing
  if (!process.env.ADMIN_AGENCY_CODE || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });
  }

  const adminAgencyCode = process.env.ADMIN_AGENCY_CODE || 'A05916370';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Umesh@1972';
  const jwtSecret = process.env.JWT_SECRET || 'insuresathi_super_secret_jwt_key_2026_secure';

  if (!agencyCode || typeof agencyCode !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Agency code and password are required' });
  }

  const inputAgency = agencyCode.trim().toUpperCase();
  const inputPassword = password.trim();

  const validAgencyCodes = [
    adminAgencyCode.trim().toUpperCase(),
    'A05916370',
    '05916370'
  ];

  const isAgencyValid = validAgencyCodes.includes(inputAgency) ||
                        validAgencyCodes.includes(inputAgency.replace(/^A/, '')) ||
                        validAgencyCodes.includes('A' + inputAgency);

  const isPasswordValid = inputPassword === adminPassword.trim() ||
                          inputPassword.toLowerCase() === adminPassword.trim().toLowerCase();

  if (isAgencyValid && isPasswordValid) {
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
  const jwtSecret = process.env.JWT_SECRET || 'insuresathi_super_secret_jwt_key_2026_secure';

  try {
    jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
    return res.json({ valid: true });
  } catch (error) {
    return res.status(401).json({ valid: false });
  }
});

module.exports = router;

