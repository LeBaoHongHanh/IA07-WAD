require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const userService = require('./userService');
require('./db'); // Initialize database

const app = express();

const PORT = process.env.PORT || 4000;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret_dev';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret_dev';
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '5m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// SQLite database with userService
const refreshTokens = new Set(); // store valid refresh tokens

function generateAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });

  const [, token] = authHeader.split(' ');
  if (!token) return res.status(401).json({ message: 'Invalid Authorization header' });

  jwt.verify(token, JWT_ACCESS_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired access token' });
    }
    req.user = payload;
    next();
  });
}

app.get('/api/health', (req, res) => {
  res.json({ message: 'JWT auth backend is running' });
});

// Register new user
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await userService.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const newUser = await userService.create(name, email, password);
    return res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(400).json({ message: error.message });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = userService.verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.add(refreshToken);

    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Refresh token
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  if (!refreshTokens.has(refreshToken)) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ message: 'Expired refresh token' });
    }

    userService.findById(payload.sub).then(user => {
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const newAccessToken = generateAccessToken(user);
      return res.json({ accessToken: newAccessToken });
    }).catch(error => {
      console.error('Refresh token error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    });
  });
});

// Logout (invalidate refresh token)
app.post('/auth/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken && refreshTokens.has(refreshToken)) {
    refreshTokens.delete(refreshToken);
  }
  return res.json({ message: 'Logged out' });
});

// Protected endpoint
app.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await userService.findById(req.user.sub);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

const path = require('path');

// Serve static frontend
app.use(express.static(path.join(__dirname, '../public')));

// Serve index.html for all remaining routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Auth server listening on port ${PORT}`);
});
