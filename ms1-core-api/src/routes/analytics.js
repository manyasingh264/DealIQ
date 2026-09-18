const express = require('express');
const router = express.Router();
const {
  getStatsController,
  getOverviewController,
  getLossReasonsController,
  getCompetitorsController,
  getMonthlyTrendsController
} = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getStatsController);
router.get('/stats', authenticate, getStatsController);
router.get('/overview', authenticate, getOverviewController);
router.get('/loss-reasons', authenticate, getLossReasonsController);
router.get('/competitors', authenticate, getCompetitorsController);
router.get('/trends', authenticate, getMonthlyTrendsController);

module.exports = router;
