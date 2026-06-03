# Aureva Fund Insight Tracker

> **Live URL:** _Add your Vercel frontend URL here after deployment_

A full-stack MERN application to search Indian Mutual Funds, manage a personal watchlist, and view NAV performance charts — powered by [MFapi.in](https://www.mfapi.in/).

---

## Live URLs

| Service | URL |
|---|---|
| Frontend | `https://your-app.vercel.app` (replace after deployment) |
| Backend API | `https://your-api.vercel.app` (replace after deployment) |

---

## Tech Stack

- **Frontend** — React 19 (Vite), React Router, Recharts, Axios, react-hot-toast
- **Backend** — Node.js, Express, Mongoose
- **Database** — MongoDB Atlas (free tier)
- **Deployment** — Vercel (frontend + backend)

---

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` → `backend/.env` and fill in your values:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/aureva?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_string
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` → `frontend/.env` and fill in your values:

```
VITE_API_BASE_URL=http://localhost:5000
```

> For production, set `VITE_API_BASE_URL` to your deployed backend URL (e.g. `https://your-api.vercel.app`).

---

## Running Locally

### Prerequisites
- Node.js 18+
- A MongoDB Atlas account (free tier)

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd aureva-fund-tracker
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env
npm install
npm run dev
# Server starts on http://localhost:5000
```

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:5000  (already set in .env.example)
npm install
npm run dev
# App opens at http://localhost:5173
```

---

## Project Structure

```
├── backend/
│   ├── app.js              # Express entry point
│   ├── vercel.json         # Vercel serverless config
│   ├── .env.example
│   ├── config/
│   │   └── db.js           # Mongoose connection
│   ├── models/
│   │   ├── User.js
│   │   └── Watchlist.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── watchlistController.js
│   │   └── fundsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── watchlistRoutes.js
│   │   └── fundsRoutes.js
│   └── middleware/
│       └── authMiddleware.js
│
└── frontend/
    ├── vercel.json          # SPA rewrite rules
    ├── .env.example
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── hooks/useDebounce.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── FundCard.jsx
        │   ├── WatchlistItem.jsx
        │   ├── NavChart.jsx
        │   ├── ProtectedRoute.jsx
        │   └── LoadingSpinner.jsx
        └── pages/
            ├── HomePage.jsx
            ├── WatchlistPage.jsx
            ├── FundDetailPage.jsx
            ├── LoginPage.jsx
            └── RegisterPage.jsx
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/watchlist` | Yes | Get user's watchlist |
| POST | `/api/watchlist` | Yes | Add fund to watchlist |
| DELETE | `/api/watchlist/:schemeCode` | Yes | Remove from watchlist |
| GET | `/api/funds/search?q=` | No | Search mutual funds |
| GET | `/api/funds/:schemeCode` | No | Get NAV history (1hr cached) |

---

## Deployment Guide

### Deploy Backend to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → import your repo
3. Set root directory to `backend/`
4. Add environment variables:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a long random string
   - `FRONTEND_URL` — your Vercel frontend URL
5. Deploy

### Deploy Frontend to Vercel

1. Go to Vercel → New Project → same repo
2. Set root directory to `frontend/`
3. Add environment variable:
   - `VITE_API_BASE_URL` — your deployed backend Vercel URL
4. Deploy

> **CORS**: The backend uses `FRONTEND_URL` env var for CORS. Make sure it matches your deployed frontend URL exactly.

---

## Assumptions & Decisions

- **Per-user watchlist**: Each user sees only their own watchlist (using `userId` in the schema).
- **JWT in localStorage**: Used for simplicity in this assignment. For production, HttpOnly cookies are more secure.
- **Search proxied through backend**: Both search and fund detail go through the backend, keeping the frontend fully decoupled from MFapi.in.
- **NAV caching**: Historical NAV responses are cached in-memory for 1 hour using `node-cache` to be kind to the free API.

## Known Limitations

- The in-memory cache resets on every server restart (cold start on Vercel). A Redis cache would persist across restarts in production.
- NAV data from MFapi.in is updated daily, so real-time prices are not available.
- No pagination on search results — MFapi.in returns up to ~50 matches per query.
