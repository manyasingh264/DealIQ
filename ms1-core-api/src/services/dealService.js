const { getDb, saveDb } = require('../db/connection');
const { ROLES } = require('../utils/roles');
const { diagnoseDealWithMS2 } = require('./aiService');

async function getAllDeals(user) {
  const db = await getDb();
  let query = 'SELECT * FROM deals';
  let params = [];
  
  // Role-based filtering
  if (user && user.role === ROLES.AE) {
    query += ' WHERE user_id = ?';
    params.push(user.sub);
  } else if (user && (user.role === ROLES.SALES_MANAGER || user.role === ROLES.ADMIN)) {
    query += ' WHERE organization_id = ?';
    params.push(user.organizationId);
  }
  
  query += ' ORDER BY created_at DESC';
  
  const stmt = db.prepare(query);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  
  return rows.map(deal => {
    if (deal.deal_size === ',000') {
      deal.deal_size = '$45,000';
    }
    if (deal.report) {
      try {
        deal.report = JSON.parse(deal.report);
        if (deal.report && !deal.report.primary_reason && deal.primary_reason) {
          deal.report.primary_reason = deal.primary_reason;
        }
      } catch (e) {
        deal.report = null;
      }
    }
    return deal;
  });
}

async function getDealById(id, user) {
  const db = await getDb();
  
  let query = 'SELECT * FROM deals WHERE id = ?';
  let params = [id];
  
  if (user && user.role === ROLES.AE) {
    query += ' AND user_id = ?';
    params.push(user.sub);
  } else if (user && (user.role === ROLES.SALES_MANAGER || user.role === ROLES.ADMIN)) {
    query += ' AND organization_id = ?';
    params.push(user.organizationId);
  }
  
  const stmt = db.prepare(query);
  stmt.bind(params);
  let deal = null;
  if (stmt.step()) {
    deal = stmt.getAsObject();
  }
  stmt.free();
  
  if (!deal) {
    throw new Error('Deal not found');
  }
  
  if (deal.deal_size === ',000') {
    deal.deal_size = '$45,000';
  }
  if (deal.report) {
    try {
      deal.report = JSON.parse(deal.report);
      if (deal.report && !deal.report.primary_reason && deal.primary_reason) {
        deal.report.primary_reason = deal.primary_reason;
      }
    } catch (e) {
      deal.report = null;
    }
  }
  
  return deal;
}

async function createDeal(data, user) {
  const { company, deal_size, outcome, deal_text, primary_reason, report, deal_name } = data;
  const db = await getDb();
  
  const orgId = user?.organizationId || 1;
  const userId = user?.sub || 1;
  const reportJson = report ? JSON.stringify(report) : null;
  const reason = primary_reason || (report?.primary_reason) || 'other';
  const name = deal_name || company;
  
  db.run(
    `INSERT INTO deals (organization_id, user_id, company, deal_size, outcome, deal_text, primary_reason, report, deal_name)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [orgId, userId, company, deal_size, outcome, deal_text, reason, reportJson, name]
  );
  
  const result = db.exec('SELECT last_insert_rowid() as id');
  const dealId = result[0].values[0][0];
  
  if (reportJson) {
    try {
      db.run(
        `INSERT OR REPLACE INTO deal_reports (deal_id, report) VALUES (?, ?)`,
        [dealId, reportJson]
      );
    } catch (e) {
      console.warn('Could not insert into deal_reports:', e.message);
    }
  }
  
  saveDb();
  
  return getDealById(dealId, user);
}

/**
 * Calls MS2 AI service to diagnose the deal, saves the result in SQLite, and returns report
 */
async function analyzeAndCreateDeal(data, user) {
  const { company, deal_size, outcome, deal_text, deal_name } = data;
  
  // 1. Call MS2 AI Service (FastAPI + LangGraph)
  const report = await diagnoseDealWithMS2({
    company,
    deal_size,
    outcome,
    deal_text
  });
  
  // 2. Persist deal and structured AI report in SQLite (MS1 owned)
  const savedDeal = await createDeal({
    company,
    deal_size,
    outcome,
    deal_text,
    deal_name: deal_name || company,
    primary_reason: report.primary_reason || 'other',
    report
  }, user);
  
  return {
    success: true,
    report,
    deal: savedDeal
  };
}

module.exports = {
  getAllDeals,
  getDealById,
  createDeal,
  analyzeAndCreateDeal
};
