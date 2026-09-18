const { verifyToken } = require('../utils/jwt');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // In development or when no token is supplied, provide default dev context
    if (process.env.NODE_ENV !== 'production') {
      req.user = {
        sub: 1,
        email: 'admin@dealiq.com',
        role: 'ADMIN',
        organizationId: 1
      };
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }
  
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
  
  req.user = decoded;
  next();
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
    }
    
    next();
  };
}

function requireOrganizationAccess(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

module.exports = { authenticate, requireRole, requireOrganizationAccess };
