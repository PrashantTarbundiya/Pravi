# R&B InfraManage — Solution Architecture Document

## Project Title
**R&B InfraManage — AI-Powered Infrastructure Asset Lifecycle & Governance System**

## Problem Statement
The Roads & Buildings Department (Government of Gujarat) manages thousands of kilometers of state highways, bridges, and government buildings. Currently, grievance reporting, asset tracking, contractor DLP warranties, and field inspections are handled through disconnected manual workflows, leading to delayed repairs, photo fraud in evidence submissions, and poor transparency.

## Solution Overview
R&B InfraManage is a full-stack, AI-powered infrastructure governance platform that provides:

1. **Citizen Grievance Portal** — Citizens report road defects using live geofenced camera capture or gallery uploads, with AI-powered authenticity verification.
2. **Department Command Center** — Role-based dashboards for inspectors, project managers, asset managers, grievance officers, contractors, and auditors.
3. **AI Verification Pipeline** — Every submitted photo is analyzed by Nvidia Nemotron-3 (via OpenRouter) for defect classification, severity scoring (IRC:SP:84 standards), and fraud detection.
4. **End-to-End Lifecycle Tracking** — From citizen report → triage → work order → contractor assignment → field inspection → repair verification → audit trail.

---

## Architecture

### Frontend (Deployed on Vercel)
- **Framework**: React 18 + Vite 5 (SPA)
- **UI Library**: Shadcn UI + Radix Primitives + Tailwind CSS
- **State Management**: Zustand (role-based store)
- **Mapping**: Leaflet + OpenStreetMap
- **Charts**: Recharts
- **Routing**: React Router v6 with SPA rewrites

### Backend (Express.js API Server)
- **Runtime**: Node.js 22 + Express.js
- **Database**: MongoDB Atlas (cloud-hosted)
- **AI Service**: OpenRouter API → Nvidia Nemotron-3 Nano (free tier, vision-capable)
- **Image Storage**: Base64 encoded in MongoDB GridFS-style (ImageStore collection)
- **Authentication Tokens**: Single-use geofenced camera tokens with TTL

### Database Collections
| Collection | Purpose |
|---|---|
| `Assets` | State highways, bridges, buildings with PCI index & GPS corridors |
| `Complaints` | Citizen grievances with photo evidence, AI analysis, status tracking |
| `WorkOrders` | Sanctioned maintenance work with contractor assignments |
| `Inspections` | IRC:SP:84 field inspection reports with photo evidence |
| `ImageStore` | Base64 photo storage with metadata (geolocation, hash, AI scores) |
| `AuditLog` | Immutable governance audit trail |

### Role-Based Access Control (8 Roles)
| Role | Access Level |
|---|---|
| Citizen | Report issues, track grievances, view map |
| Inspector | Field QA inspections, verify repairs, dispatch gangs |
| Contractor | View awarded tenders, submit milestones, DLP notices |
| Project Manager | Sanction tenders, approve milestones, manage projects |
| Asset Manager | Master asset registry, PCI index, DLP bank guarantees |
| Grievance Officer | Triage complaints, dispatch repair gangs |
| Auditor | AI flagged queue, audit ledger, quarantine fraud |
| Admin | Full administrative access to all modules |

---

## Key Technical Features

### 1. Live Camera Capture with Geofencing
- Browser-native `getUserMedia` API for real-time camera access
- Single-use tokens with GPS coordinate validation
- Front/rear camera switching
- Photo stored directly as Base64 in MongoDB (no external storage dependency)

### 2. AI-Powered Defect Classification
- Nvidia Nemotron-3 Nano Omni (30B parameters, free via OpenRouter)
- Automatic detection of: potholes, cracks, drainage issues, structural damage
- Severity scoring aligned to IRC:SP:84 / MORTH 500 standards
- Fraud detection (screenshot detection, metadata inconsistency, AI-generated image detection)

### 3. SLA-Driven Complaint Lifecycle
- Automatic ticket numbering (RNB-GRV-YYYY-XXXX)
- Status pipeline: Filed → Under Review → Assigned → Work In Progress → Resolved → Closed
- SLA countdown timers per severity level

### 4. Contractor DLP (Defect Liability Period) Manager
- 3-to-5 year warranty tracking per asset
- Automatic bank guarantee forfeiture countdown
- Defect notice issuance to contractors

### 5. Interactive GIS Map
- Leaflet + OpenStreetMap integration
- Asset corridor visualization with color-coded condition ratings
- Live complaint pinpoints with severity markers

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS, Shadcn UI, Zustand, Recharts, Leaflet |
| Backend | Node.js 22, Express.js, Multer (file upload) |
| Database | MongoDB Atlas (cloud) |
| AI/ML | OpenRouter API → Nvidia Nemotron-3 Nano (vision model) |
| Deployment | Vercel (frontend), Render/Railway (backend) |
| Version Control | Git + GitHub |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stats/summary` | Dashboard KPIs |
| GET/POST | `/api/assets` | Asset CRUD operations |
| GET/POST | `/api/complaints` | Complaint lifecycle |
| POST | `/api/complaints/:ticket/audit-review` | Auditor review |
| POST | `/api/verification/token` | Geofenced camera token |
| POST | `/api/verification/upload` | Photo upload + AI verification |
| GET | `/api/verification/audit-queue` | AI flagged evidence queue |
| GET/POST | `/api/inspections` | Field inspection reports |
| GET/POST/PUT | `/api/work-orders` | Work order management |

---

## How to Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- OpenRouter API key (free tier)

### Backend
```bash
cd server
npm install
cp .env.example .env  # Fill in your credentials
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.

---

## Assumptions & Remarks

1. **AI Model**: We use Nvidia Nemotron-3 Nano via OpenRouter's free tier. In production, this would be upgraded to a dedicated GPU-backed endpoint for faster inference.
2. **Image Storage**: Photos are stored as Base64 in MongoDB for zero-dependency deployment. In production, AWS S3 or Azure Blob Storage would be used for scalability.
3. **Authentication**: The current system uses role-switching (demo mode) for evaluator convenience. In production, this would integrate with Gujarat State SSO / DigiLocker.
4. **GIS Data**: Asset corridor coordinates use representative Gujarat highway data. In production, this would connect to the Survey of India / NHAI GIS database.
5. **SLA Timers**: Complaint SLA deadlines follow Gujarat R&B Department norms (48-hour critical, 7-day high, 14-day medium).
6. **Standards Compliance**: Inspection parameters follow IRC:SP:84 (Pavement Condition Survey) and MORTH 500 (Specifications for Road and Bridge Works).
7. **Mobile Responsive**: The citizen portal is fully responsive for mobile use, as most citizen reports come from smartphones on-site.
8. **Seed Data**: The system comes pre-seeded with realistic Gujarat infrastructure data (SG Highway, Sardar Patel Ring Road, Sabarmati Riverfront, etc.) with real images from the internet for demonstration purposes.
