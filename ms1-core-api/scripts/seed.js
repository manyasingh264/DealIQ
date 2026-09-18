const { getDb, saveDb } = require('../src/db/connection');
const bcrypt = require('bcrypt');

const SEED_DEALS = [
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
  console.log('Starting seed...');
  
  const db = await getDb();
  
  // Check if data already exists
  const existingDeals = db.exec('SELECT COUNT(*) as count FROM deals');
  if (existingDeals[0].values[0][0] > 0) {
    console.log('Database already has data. Skipping seed.');
    return;
  }
  
  // Create default organization if not exists
  const orgResult = db.exec('SELECT id FROM organizations WHERE name = "Default Organization"');
  let organizationId;
  if (orgResult.length === 0 || orgResult[0].values.length === 0) {
    db.run(`INSERT INTO organizations (name) VALUES ('Default Organization')`);
    const result = db.exec('SELECT last_insert_rowid() as id');
    organizationId = result[0].values[0][0];
  } else {
    organizationId = orgResult[0].values[0][0];
  }
  
  // Create default admin user if not exists
  const userResult = db.exec('SELECT id FROM users WHERE email = "admin@dealiq.com"');
  let userId;
  if (userResult.length === 0 || userResult[0].values.length === 0) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    db.run(`INSERT INTO users (organization_id, email, password_hash, role, full_name) VALUES (${organizationId}, 'admin@dealiq.com', '${passwordHash}', 'ADMIN', 'Default Admin')`);
    const result = db.exec('SELECT last_insert_rowid() as id');
    userId = result[0].values[0][0];
  } else {
    userId = userResult[0].values[0][0];
  }
  
  // Insert seed deals
  for (const deal of SEED_DEALS) {
    db.run(`
      INSERT INTO deals (organization_id, user_id, company, deal_size, outcome, deal_text, primary_reason, report, deal_name, created_at)
      VALUES (${organizationId}, ${userId}, '${deal.company}', '${deal.deal_size}', '${deal.outcome}', '${deal.deal_text}', '${deal.primary_reason}', '${deal.report}', '${deal.deal_name}', '${deal.created_at}')
    `);
  }
  
  saveDb();
  
  console.log(`Seeded ${SEED_DEALS.length} deals successfully!`);
  console.log('Default admin credentials: admin@dealiq.com / admin123');
}

seed().catch(console.error);
