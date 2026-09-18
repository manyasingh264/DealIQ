const bcrypt = require('bcrypt');
const { getDb, saveDb } = require('../db/connection');
const { generateToken } = require('../utils/jwt');
const { ROLES } = require('../utils/roles');

const SALT_ROUNDS = 10;

async function register(data) {
  const { companyName, name, email, password } = data;
  const db = await getDb();
  
  // Check if user already exists
  const existingUsers = db.exec(`SELECT id FROM users WHERE email = '${email}'`);
  if (existingUsers.length > 0 && existingUsers[0].values.length > 0) {
    throw new Error('Email already registered');
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  
  // Create organization
  db.run(`INSERT INTO organizations (name) VALUES ('${companyName}')`);
  const orgResult = db.exec('SELECT last_insert_rowid() as id');
  const organizationId = orgResult[0].values[0][0];
  
  // Create user with ADMIN role
  db.run(`INSERT INTO users (organization_id, email, password_hash, role, full_name) VALUES (${organizationId}, '${email}', '${passwordHash}', '${ROLES.ADMIN}', '${name}')`);
  const userResult = db.exec('SELECT last_insert_rowid() as id');
  const userId = userResult[0].values[0][0];
  
  // Save database
  saveDb();
  
  // Generate JWT
  const token = generateToken({
    sub: userId,
    organizationId,
    role: ROLES.ADMIN
  });
  
  return {
    token,
    user: {
      id: userId,
      email,
      name,
      role: ROLES.ADMIN,
      organizationId,
      organizationName: companyName
    }
  };
}

async function login(email, password) {
  const db = await getDb();
  
  // Find user
  const userResult = db.exec(`
    SELECT u.*, o.name as organization_name 
    FROM users u 
    JOIN organizations o ON u.organization_id = o.id 
    WHERE u.email = '${email}'
  `);
  
  if (userResult.length === 0 || userResult[0].values.length === 0) {
    throw new Error('Invalid credentials');
  }
  
  const columns = userResult[0].columns;
  const values = userResult[0].values[0];
  const user = {};
  columns.forEach((col, i) => {
    user[col] = values[i];
  });
  
  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }
  
  // Generate JWT
  const token = generateToken({
    sub: user.id,
    organizationId: user.organization_id,
    role: user.role
  });
  
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: user.role,
      organizationId: user.organization_id,
      organizationName: user.organization_name
    }
  };
}

async function getUserById(userId) {
  const db = await getDb();
  
  const userResult = db.exec(`
    SELECT u.id, u.email, u.full_name as name, u.role, u.organization_id, o.name as organization_name
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.id = ${userId}
  `);
  
  if (userResult.length === 0 || userResult[0].values.length === 0) {
    throw new Error('User not found');
  }
  
  const columns = userResult[0].columns;
  const values = userResult[0].values[0];
  const user = {};
  columns.forEach((col, i) => {
    user[col] = values[i];
  });
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organization_id,
    organizationName: user.organization_name
  };
}

module.exports = { register, login, getUserById };
