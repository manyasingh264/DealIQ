const { getDb, saveDb } = require('../src/db/connection');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Fallback seed deals if all_deals.json is not present
const FALLBACK_DEALS = [
  {
    company: "Acme Corp",
    deal_name: "Enterprise License",
    deal_size: "$50,000",
    outcome: "WON",
    deal_text: "Large enterprise deal with strong champion in IT department.",
    primary_reason: "relationship",
    report: JSON.stringify({
      competitors: ["Salesforce"],
      objections: ["Price"],
      positive_signals: ["Strong champion", "Technical fit"],
      coaching_note: "Champion strategy worked well.",
      strategic_insight: "Enterprise deals require C-level champions.",
      next_time: ["Engage C-level earlier", "Prepare ROI calculator"],
      what_worked: ["Technical demonstration", "Relationship building"],
      primary_explanation: "Strong internal champion drove the decision."
    }),
    created_at: "2025-01-15 10:00:00"
  },
  {
    company: "TechStart Inc",
    deal_name: "SMB Package",
    deal_size: "$15,000",
    outcome: "LOST",
    deal_text: "SMB customer, price sensitive, lost to cheaper competitor.",
    primary_reason: "pricing",
    report: JSON.stringify({
      competitors: ["Zoho"],
      objections: ["Price too high"],
      positive_signals: ["Product fit", "Liked features"],
      coaching_note: "Price objections need to be handled earlier.",
      strategic_insight: "SMB segment needs flexible pricing options.",
      next_time: ["Offer tiered pricing", "Qualify budget early"],
      what_worked: ["Product demonstration", "Feature comparison"],
      primary_explanation: "40% price difference to Zoho was decisive."
    }),
    created_at: "2025-01-10 14:30:00"
  },
  {
    company: "Global Industries",
    deal_name: "Multi-year Contract",
    deal_size: "$100,000",
    outcome: "WON",
    deal_text: "Strategic partnership with multi-year commitment.",
    primary_reason: "product_gap",
    report: JSON.stringify({
      competitors: [],
      objections: ["Implementation timeline"],
      positive_signals: ["Strategic fit", "Long-term commitment"],
      coaching_note: "Multi-year deals require strong executive buy-in.",
      strategic_insight: "Strategic partnerships beat feature-by-feature comparisons.",
      next_time: ["Focus on strategic value", "Prepare executive presentations"],
      what_worked: ["Executive engagement", "Strategic positioning"],
      primary_explanation: "Strategic partnership value overcame implementation concerns."
    }),
    created_at: "2025-01-05 09:00:00"
  }
];

async function seed() {
  console.log('Checking database seed status...');
  const db = await getDb();
  
  // 1. Create default organization if not exists
  let organizationId = 1;
  const orgResult = db.exec('SELECT id FROM organizations WHERE name = "Default Organization"');
  if (orgResult.length === 0 || orgResult[0].values.length === 0) {
    db.run(`INSERT INTO organizations (name) VALUES ('Default Organization')`);
    const result = db.exec('SELECT last_insert_rowid() as id');
    organizationId = result[0].values[0][0];
    console.log(`Created Default Organization (ID: ${organizationId})`);
  } else {
    organizationId = orgResult[0].values[0][0];
  }
  
  // 2. Create default Admin user if not exists
  let adminId = 1;
  const adminResult = db.exec('SELECT id FROM users WHERE email = "admin@dealiq.com"');
  if (adminResult.length === 0 || adminResult[0].values.length === 0) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    db.run(`INSERT INTO users (organization_id, email, password_hash, role, full_name) VALUES (${organizationId}, 'admin@dealiq.com', '${passwordHash}', 'ADMIN', 'Default Admin')`);
    const result = db.exec('SELECT last_insert_rowid() as id');
    adminId = result[0].values[0][0];
    console.log(`Created Demo Admin: admin@dealiq.com / admin123 (ID: ${adminId})`);
  } else {
    adminId = adminResult[0].values[0][0];
  }

  // 3. Create default AE user if not exists
  const aeResult = db.exec('SELECT id FROM users WHERE email = "ae@dealiq.com"');
  if (aeResult.length === 0 || aeResult[0].values.length === 0) {
    const aePasswordHash = await bcrypt.hash('ae123456', 10);
    db.run(`INSERT INTO users (organization_id, email, password_hash, role, full_name) VALUES (${organizationId}, 'ae@dealiq.com', '${aePasswordHash}', 'AE', 'Demo AE')`);
    console.log('Created Demo AE: ae@dealiq.com / ae123456');
  }

  // 4. Seed deals if empty
  const dealsCountRes = db.exec('SELECT COUNT(*) as count FROM deals');
  const count = (dealsCountRes.length > 0 && dealsCountRes[0].values.length > 0) ? dealsCountRes[0].values[0][0] : 0;
  
  if (count > 0) {
    console.log(`Database already has ${count} deals. Skipping deals seed.`);
    saveDb();
    return;
  }

  // Load all deals from JSON if available
  let dealsToInsert = FALLBACK_DEALS;
  const jsonPath = path.resolve(__dirname, 'all_deals.json');
  if (fs.existsSync(jsonPath)) {
    try {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      dealsToInsert = JSON.parse(raw);
    } catch (e) {
      console.warn('Could not read all_deals.json, using fallback deals:', e.message);
    }
  }

  for (const deal of dealsToInsert) {
    const safeCompany = (deal.company || '').replace(/'/g, "''");
    const safeDealName = (deal.deal_name || '').replace(/'/g, "''");
    const safeText = (deal.deal_text || '').replace(/'/g, "''");
    const safeReason = (deal.primary_reason || 'pricing').replace(/'/g, "''");
    const safeReport = typeof deal.report === 'string' ? deal.report.replace(/'/g, "''") : JSON.stringify(deal.report || {}).replace(/'/g, "''");
    const createdAt = deal.created_at || new Date().toISOString().replace('T', ' ').slice(0, 19);

    db.run(`
      INSERT INTO deals (organization_id, user_id, company, deal_size, outcome, deal_text, primary_reason, report, deal_name, created_at)
      VALUES (${organizationId}, ${adminId}, '${safeCompany}', '${deal.deal_size}', '${deal.outcome}', '${safeText}', '${safeReason}', '${safeReport}', '${safeDealName}', '${createdAt}')
    `);
  }

  saveDb();
  console.log(`Successfully seeded ${dealsToInsert.length} deals!`);
}

if (require.main === module) {
  seed().catch(console.error);
}

module.exports = { seed };
