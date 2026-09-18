const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(__dirname, '../../', process.env.DATABASE_PATH || 'dealiq.db');
let db;
let SQL;

async function getDb() {
  if (!db) {
    SQL = await initSqlJs();
    
    // Load existing database if it exists, otherwise create new
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }
  }
  return db;
}

function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

async function initDb() {
  const database = await getDb();
  
  // Create organizations table
  database.run(`
    CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Create users table
  database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      full_name TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    )
  `);

  // Create deals table (preserve existing structure, add org/user columns)
  database.run(`
    CREATE TABLE IF NOT EXISTS deals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER,
      user_id INTEGER,
      company TEXT NOT NULL,
      deal_size TEXT NOT NULL,
      outcome TEXT NOT NULL,
      deal_text TEXT NOT NULL,
      primary_reason TEXT,
      report TEXT,
      deal_name TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (organization_id) REFERENCES organizations(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Add organization_id and user_id columns if they don't exist (for existing deals table)
  try {
    database.run(`ALTER TABLE deals ADD COLUMN organization_id INTEGER`);
  } catch (e) {
    // Column already exists
  }
  
  try {
    database.run(`ALTER TABLE deals ADD COLUMN user_id INTEGER`);
  } catch (e) {
    // Column already exists
  }

  // Create deal_reports table
  database.run(`
    CREATE TABLE IF NOT EXISTS deal_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deal_id INTEGER NOT NULL UNIQUE,
      report TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (deal_id) REFERENCES deals(id)
    )
  `);

  // Create indexes
  database.run(`CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_deals_org ON deals(organization_id)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_deals_user ON deals(user_id)`);
  database.run(`CREATE INDEX IF NOT EXISTS idx_deals_created ON deals(created_at)`);

  saveDb();
  console.log('Database initialized successfully');
}

module.exports = { getDb, initDb, saveDb };
