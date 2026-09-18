const { getAllDeals, getDealById, createDeal, analyzeAndCreateDeal } = require('../services/dealService');

async function getAllDealsController(req, res) {
  try {
    const deals = await getAllDeals(req.user);
    // Return array directly for frontend compatibility
    res.json(deals);
  } catch (error) {
    console.error('Get all deals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getDealByIdController(req, res) {
  try {
    const deal = await getDealById(req.params.id, req.user);
    res.json(deal);
  } catch (error) {
    if (error.message === 'Deal not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Get deal by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createDealController(req, res) {
  try {
    const deal = await createDeal(req.body, req.user);
    res.status(201).json(deal);
  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function analyzeDealController(req, res) {
  try {
    const result = await analyzeAndCreateDeal(req.body, req.user);
    res.json(result);
  } catch (error) {
    console.error('Analyze deal error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze deal' });
  }
}

module.exports = {
  getAllDealsController,
  getDealByIdController,
  createDealController,
  analyzeDealController
};
