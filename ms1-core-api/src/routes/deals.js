const express = require('express');
const router = express.Router();
const { createDealSchema } = require('../schemas/deal');
const {
  getAllDealsController,
  getDealByIdController,
  createDealController,
  analyzeDealController
} = require('../controllers/dealController');
const { authenticate } = require('../middleware/auth');

// All deal routes support authenticate (with dev fallback when unauthenticated)
router.get('/', authenticate, getAllDealsController);
router.get('/:id', authenticate, getDealByIdController);

// Direct AI diagnosis via MS2 + save in MS1
router.post('/analyze', authenticate, analyzeDealController);

router.post('/', authenticate, async (req, res) => {
  try {
    const validatedData = createDealSchema.parse(req.body);
    req.body = validatedData;
    await createDealController(req, res);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Validation error:', error);
    res.status(400).json({ error: 'Validation failed' });
  }
});

module.exports = router;
