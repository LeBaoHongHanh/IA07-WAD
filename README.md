# React Authentication with JWT (Access + Refresh)

This project contains:
- `backend/`: Simple Express server providing JWT-based authentication.
- `frontend/`: React SPA using Axios, React Query, and React Hook Form.

## Quick start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend runs on http://localhost:4000.

### 2. Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Features

- Login / Logout with access & refresh tokens
- Sign up (register new user)
- Access token stored in memory, refresh token in localStorage
- Axios interceptors auto-refresh access token on 401
- Protected dashboard route showing user info
- React Query for server state
- React Hook Form for forms & validation
