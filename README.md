# R&B InfraManage — Infrastructure Asset Lifecycle & Governance System

An enterprise governance and asset lifecycle management platform for the **Roads & Buildings Department, Government of Gujarat**.

Built with a modern Vite + React frontend (styled with Tailwind CSS & Shadcn UI) and an Express.js + MongoDB Atlas backend with OpenRouter AI vision verification.

---

## 🏛️ System Features

- **Public Citizen Grievance Portal (`/report`, `/track`)**:
  - Live authenticated camera capture with geofenced location tokens.
  - Multi-category road damage logging (potholes, structural bridge cracks, drainage hazards).
  - OpenRouter AI automated distress classification & severity risk scoring.
  - Real-time ticket tracking with full SLA milestones and contractor assignment history.
- **Executive Command Center (`/dashboard`)**:
  - Real-time KPI summaries across all municipal corridors.
- **Asset Registry (`/assets`)**:
  - State Highways, Major District Roads, bridges, and government administrative complexes.
- **Contractor DLP Manager (`/defects`)**:
  - Tracking 3-to-5 year Defect Liability Periods (DLP) and automated bank guarantee forfeiture notices.
- **Field Inspection Capture (`/inspections/new`)**:
  - IRC:SP:84 and MORTH compliance inspections with live photo capture.
- **Capital Projects & Tenders (`/projects`)**:
  - Awarded EPC contracts, milestone progress, and financial sanctions.
- **GIS Corridors & Geoportal (`/map`)**:
  - Interactive map with asset corridors and live complaint pinpoints.
- **Immutable Audit Trail (`/audit`)**:
  - Complete tamper-evident governance ledger.

---

## 🚀 Getting Started Locally

### 1. Backend Setup
```bash
cd server
npm install
# Configure your environment in .env (copy from .env.example)
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The frontend will run at `http://localhost:5173` and proxy API calls to `http://localhost:5000`.

---

## ☁️ Deployment

- **Frontend (Vercel)**:
  - Root Directory: `client`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Env Var: `VITE_API_URL` (pointing to your deployed backend)
- **Backend (Render / Railway / VPS)**:
  - Root Directory: `server`
  - Start Command: `npm start` or `node src/server.js`
  - Env Vars: `MONGODB_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`
