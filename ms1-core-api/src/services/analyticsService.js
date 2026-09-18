const { getDb } = require('../db/connection');

function buildWhereClause(user) {
  let where = '';
  const params = [];
  if (user && user.role === 'AE') {
    where = ' WHERE user_id = ?';
    params.push(user.sub);
  } else if (user && (user.role === 'SALES_MANAGER' || user.role === 'ADMIN')) {
    if (user.organizationId) {
      where = ' WHERE organization_id = ?';
      params.push(user.organizationId);
    }
  }
  return { where, params };
}

async function getOverview(user) {
  const db = await getDb();
  const { where, params } = buildWhereClause(user);
  
  const totalStmt = db.prepare(`SELECT COUNT(*) as count FROM deals${where}`);
  totalStmt.bind(params);
  let total = 0;
  if (totalStmt.step()) total = totalStmt.getAsObject().count;
  totalStmt.free();
  
  const wonWhere = where ? `${where} AND outcome='WON'` : " WHERE outcome='WON'";
  const wonStmt = db.prepare(`SELECT COUNT(*) as count FROM deals${wonWhere}`);
  wonStmt.bind(params);
  let won = 0;
  if (wonStmt.step()) won = wonStmt.getAsObject().count;
  wonStmt.free();
  
  const winRate = total > 0 ? Math.round((won / total) * 100 * 10) / 10 : 0;
  
  return {
    total_deals: total,
    won,
    lost: total - won,
    win_rate: winRate
  };
}

async function getLossReasons(user) {
  const db = await getDb();
  const { where, params } = buildWhereClause(user);
  
  const lossWhere = where ? `${where} AND outcome='LOST'` : " WHERE outcome='LOST'";
  const query = `
    SELECT primary_reason, COUNT(*) as count 
    FROM deals${lossWhere} 
    GROUP BY primary_reason
  `;
  
  const stmt = db.prepare(query);
  stmt.bind(params);
  const reasons = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    reasons.push({
      reason: row.primary_reason || 'other',
      count: row.count
    });
  }
  stmt.free();
  
  return reasons;
}

async function getCompetitors(user) {
  const db = await getDb();
  const { where, params } = buildWhereClause(user);
  
  const repWhere = where ? `${where} AND report IS NOT NULL` : " WHERE report IS NOT NULL";
  const stmt = db.prepare(`SELECT report FROM deals${repWhere}`);
  stmt.bind(params);
  
  const competitors = {};
  while (stmt.step()) {
    const row = stmt.getAsObject();
    try {
      const report = JSON.parse(row.report);
      if (Array.isArray(report.competitors)) {
        report.competitors.forEach(comp => {
          if (comp) {
            competitors[comp] = (competitors[comp] || 0) + 1;
          }
        });
      }
    } catch (e) {
      // Skip invalid JSON
    }
  }
  stmt.free();
  
  // Return [[name, count], ...] for frontend Dashboard.jsx compatibility
  return Object.entries(competitors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

async function getMonthlyTrends(user) {
  const db = await getDb();
  const { where, params } = buildWhereClause(user);
  
  const query = `
    SELECT strftime('%Y-%m', created_at) as month,
           SUM(CASE WHEN outcome='WON' THEN 1 ELSE 0 END) as won,
           SUM(CASE WHEN outcome='LOST' THEN 1 ELSE 0 END) as lost
    FROM deals${where}
    GROUP BY month
    ORDER BY month DESC
    LIMIT 6
  `;
  
  const stmt = db.prepare(query);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    rows.push({
      month: row.month,
      won: row.won || 0,
      lost: row.lost || 0
    });
  }
  stmt.free();
  
  return rows.reverse();
}

async function getFullStats(user) {
  const [overview, loss_reasons, monthly_trend, top_competitors] = await Promise.all([
    getOverview(user),
    getLossReasons(user),
    getMonthlyTrends(user),
    getCompetitors(user)
  ]);
  
  return {
    ...overview,
    loss_reasons,
    monthly_trend,
    top_competitors
  };
}

module.exports = {
  getOverview,
  getLossReasons,
  getCompetitors,
  getMonthlyTrends,
  getFullStats
};
