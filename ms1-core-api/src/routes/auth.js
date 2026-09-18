const express = require('express');
const router = express.Router();
const { registerSchema, loginSchema } = require('../schemas/auth');
const { registerController, loginController, getMeController } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    req.body = validatedData;
    await registerController(req, res);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Validation error:', error);
    res.status(400).json({ error: 'Validation failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    req.body = validatedData;
    await loginController(req, res);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Validation error:', error);
    res.status(400).json({ error: 'Validation failed' });
  }
});

router.get('/me', authenticate, getMeController);

module.exports = router;
