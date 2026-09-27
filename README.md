# Money Way

A full-stack intelligent income discovery application built with **React**, **Vite**, **TailwindCSS**, and **Express**.

---

## 📁 Project Architecture

The codebase is organized into independent, modular **frontend** and **backend** applications managed seamlessly from the root using npm workspaces.

```
project Money/
├── frontend/                     # React + Vite Client Application
│   ├── public/                   # Static assets (favicons, SVGs)
│   ├── src/                      # React source code
│   │   ├── assets/               # Local icons & images
│   │   ├── components/           # UI Components (Dashboards, Modals, Forms)
│   │   ├── services/             # API client & image mapping utilities
│   │   ├── App.jsx               # Main application component & tab router
│   │   ├── main.jsx              # React DOM root entry
│   │   └── index.css             # TailwindCSS & theme styling
│   ├── index.html                # HTML entry template
│   ├── vite.config.js            # Vite configuration & backend proxy (/api)
│   ├── package.json              # Frontend dependencies and scripts
│   └── .env.example              # Frontend environment config
│
├── backend/                      # Node.js + Express API Server
│   ├── data/                     # In-memory datasets (opportunities, skillsMap)
│   ├── scripts/                  # Utility scripts (seed database)
│   ├── services/                 # Recommendation engine, AI query parser, scam detector
│   ├── index.js                  # Express API server entry point
│   ├── package.json              # Backend dependencies and scripts
│   └── .env.example              # Backend environment config
│
├── package.json                  # Root orchestration & npm workspaces
├── .gitignore                    # Multi-tier ignore rules
└── README.md                     # Project documentation
```

---

## 🚀 Quick Start

### 1. Install Dependencies
Run from the root directory to install dependencies for both `frontend` and `backend`:
```bash
npm install
```

### 2. Run Both Services Concurrently
Start the Express backend and the Vite frontend dev server together in one terminal:
```bash
npm run dev
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 🛠️ Individual Commands

You can run individual services directly from root or from within their respective directories:

| Command | Description |
|---|---|
| `npm run dev` | Runs both backend and frontend concurrently |
| `npm run frontend` | Runs frontend Vite dev server only |
| `npm run backend` | Runs backend Express server with auto-reload (`node --watch`) |
| `npm run build` | Builds the frontend for production (`frontend/dist`) |
| `npm run preview` | Previews the production build locally |
| `npm run seed` | Executes the database seed verification script |

### Or directly inside subfolders:
```bash
# Frontend only
cd frontend
npm run dev

# Backend only
cd backend
npm run dev
```

---

## 🔌 API Proxy Configuration
During development, requests made from the frontend to `/api/*` are automatically proxied to `http://localhost:5000` via [frontend/vite.config.js](file:///d:/project%20Money/frontend/vite.config.js).
