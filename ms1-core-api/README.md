# MS1 Core API

DealIQ Microservice 1 - Core API Service

## Technology Stack

- Node.js
- Express.js
- SQLite (better-sqlite3)
- Zod (validation)
- bcrypt (password hashing)
- jsonwebtoken (JWT authentication)
- cors
- dotenv

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (copy from .env.example):
```bash
cp .env.example .env
```

3. Run in development:
```bash
npm run dev
```

4. Run in production:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Service health check

### Authentication
- `POST /api/auth/register` - Register new user and organization
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile (requires authentication)

## Authentication

The service uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Roles

- ADMIN - Full access to organization data
- SALES_MANAGER - Team-level access
- AE - Own deals only

## Database

The service uses SQLite with the following tables:
- organizations
- users
- deals
- deal_reports
