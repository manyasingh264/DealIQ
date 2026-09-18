const { getDb, saveDb } = require('../src/db/connection');
const bcrypt = require('bcrypt');

async function migrate() {
  console.log('Starting migration...');
  
  const db = await getDb();
  
  // Check if migration is needed
  const deals = db.exec('SELECT id FROM deals WHERE organization_id IS NULL');
  if (deals.length === 0 || deals[0].values.length === 0) {
    console.log('Migration already completed or no deals to migrate.');
    return;
  }
  
  // Create default organization
  db.run(`INSERT INTO organizations (name) VALUES ('Default Organization')`);
  const orgResult = db.exec('SELECT last_insert_rowid() as id');
  const defaultOrgId = orgResult[0].values[0][0];
  
  // Create default admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  db.run(`INSERT INTO users (organization_id, email, password_hash, role, full_name) VALUES (${defaultOrgId}, 'admin@dealiq.com', '${passwordHash}', 'ADMIN', 'Default Admin')`);
  const userResult = db.exec('SELECT last_insert_rowid() as id');
  const defaultUserId = userResult[0].values[0][0];
  
  // Update all existing deals to belong to default organization and user
  db.run(`UPDATE deals SET organization_id = ${defaultOrgId}, user_id = ${defaultUserId} WHERE organization_id IS NULL`);
  
  saveDb();
  
  console.log('Migration completed successfully!');
  console.log(`Default Organization ID: ${defaultOrgId}`);
  console.log(`Default User ID: ${defaultUserId}`);
  console.log('Default admin credentials: admin@dealiq.com / admin123');
}

migrate().catch(console.error);
