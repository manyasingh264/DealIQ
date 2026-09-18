const {
  getOverview,
  getLossReasons,
  getCompetitors,
  getMonthlyTrends,
  getFullStats
} = require('../services/analyticsService');

async function getStatsController(req, res) {
  try {
    const stats = await getFullStats(req.user);
    res.json(stats);
  } catch (error) {
    console.error('Get full stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getOverviewController(req, res) {
  try {
    const overview = await getOverview(req.user);
    res.json(overview);
  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getLossReasonsController(req, res) {
  try {
    const reasons = await getLossReasons(req.user);
    res.json({ loss_reasons: reasons });
  } catch (error) {
    console.error('Get loss reasons error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getCompetitorsController(req, res) {
  try {
    const competitors = await getCompetitors(req.user);
    res.json({ top_competitors: competitors });
  } catch (error) {
    console.error('Get competitors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getMonthlyTrendsController(req, res) {
  try {
    const trends = await getMonthlyTrends(req.user);
    res.json({ monthly_trend: trends });
  } catch (error) {
    console.error('Get monthly trends error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getStatsController,
  getOverviewController,
  getLossReasonsController,
  getCompetitorsController,
  getMonthlyTrendsController
};
