const { register, login, getUserById } = require('../services/authService');

async function registerController(req, res) {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'Email already registered') {
      return res.status(409).json({ error: error.message });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function loginController(req, res) {
  try {
    const result = await login(req.body.email, req.body.password);
    res.json(result);
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getMeController(req, res) {
  try {
    const user = await getUserById(req.user.sub);
    res.json({ user });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { registerController, loginController, getMeController };
