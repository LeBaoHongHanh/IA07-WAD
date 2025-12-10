# Backend for React JWT Auth Demo

Simple Express server providing:
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /me (protected)

## Setup

```bash
cd backend
npm install
cp .env.example .env
# (optionally edit secrets in .env)
npm run dev
```

Server runs at http://localhost:4000 by default.
