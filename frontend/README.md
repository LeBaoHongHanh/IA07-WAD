# React JWT Auth Frontend

This is the React single-page application implementing:
- Login with JWT access + refresh token
- Sign up (register new user)
- Protected dashboard route
- React Query for auth & user data
- React Hook Form for login & register forms
- Axios instance with interceptors (attach access token, auto refresh on 401)

## Setup

```bash
cd frontend
npm install
npm run dev
```

The app expects the backend to be running at `http://localhost:4000`.
