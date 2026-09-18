const { getDb, saveDb } = require('../src/db/connection');
const bcrypt = require('bcrypt');

async function addAEUser() {
  console.log('Adding AE user to default organization...');
  
  const db = await getDb();
  
  // Get default organization
  const orgResult = db.exec('SELECT id FROM organizations WHERE name = "Default Organization"');
  if (orgResult.length === 0 || orgResult[0].values.length === 0) {
    console.log('Default organization not found. Please run migration first.');
    return;
  }
  const organizationId = orgResult[0].values[0][0];
  
  // Check if AE user already exists
  const existingUser = db.exec(`SELECT id FROM users WHERE email = 'ae@dealiq.com'`);
  if (existingUser.length > 0 && existingUser[0].values.length > 0) {
    console.log('AE user already exists. Deleting and recreating...');
    db.run(`DELETE FROM users WHERE email = 'ae@dealiq.com'`);
    saveDb();
  }
  
  // Create AE user
  console.log('Creating AE user with password ae123...');
  const passwordHash = await bcrypt.hash('ae123', 10);
  console.log('Password hash:', passwordHash.substring(0, 20) + '...');
  
  db.run(`INSERT INTO users (organization_id, email, password_hash, role, full_name) VALUES (${organizationId}, 'ae@dealiq.com', '${passwordHash}', 'AE', 'AE User')`);
  
  saveDb();
  
  // Verify user was created
  const verifyUser = db.exec(`SELECT id, email, role FROM users WHERE email = 'ae@dealiq.com'`);
  console.log('Verification:', verifyUser);
  
  console.log('AE user created successfully!');
  console.log('Credentials: ae@dealiq.com / ae123');
}

addAEUser().catch(console.error);
