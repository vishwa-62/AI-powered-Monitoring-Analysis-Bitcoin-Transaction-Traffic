const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const dataStore = require('../services/dataStoreService');

async function register(req, res, next) {
  try {
    const { name, email, password, role = 'ANALYST' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existingUser = dataStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email address already registered' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser = {
      id: dataStore.users.length + 1,
      name,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      role: ['ADMIN', 'ANALYST', 'VIEWER'].includes(role) ? role : 'ANALYST',
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    };

    dataStore.users.push(newUser);

    const token = generateToken({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status
      }
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = dataStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, name: user.name, email: user.email, role: user.role });

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = dataStore.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(444).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  me
};
