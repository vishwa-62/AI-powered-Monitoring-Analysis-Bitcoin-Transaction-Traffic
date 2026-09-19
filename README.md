# AI-Powered Monitoring & Analysis of Bitcoin Transaction Traffic ⚡

> **AI-Powered Bitcoin Transaction Monitoring & Risk Analysis Platform**

"Bitcoin Traffic Intelligence" is a full-stack, enterprise-style cybersecurity & blockchain analytics platform designed for security administrators, risk analysts, and compliance teams. The platform monitors Bitcoin transaction traffic, performs real-time AI anomaly detection, scores transaction & wallet risk, visualizes complex transaction networks, generates incident alerts, and exports formal compliance reports.

---

## 🌟 Key Features

1. **Cybersecurity Analytics Dashboard**:
   - Live telemetry feed with system status indicators (`ONLINE` / `ACTIVE`).
   - Summary statistics cards: Total Transactions, Volume, Active Wallets, Suspicious Transactions, High-Risk Wallets, Active Alerts, and Average Risk Score.
   - Interactive Recharts volume throughput, risk distribution donut chart, and suspicious activity timeline.

2. **Real-Time Transaction Monitoring (`/transactions`)**:
   - Real-time transaction ingestion via Socket.IO WebSocket stream.
   - Multi-criteria filtering (search by hash/wallet/block, risk level, status, date range, min/max BTC).
   - Export dataset to CSV and JSON formats.

3. **Detailed Transaction Inspection (`/transactions/:hash`)**:
   - Visual transaction flow graph (`Sender Address` ➔ `Transaction Node` ➔ `Receiver Address`).
   - Inputs, outputs, fee ratio, block hash, and AI anomaly indicator breakdown.

4. **Wallet Behavioral Intelligence (`/wallets` & `/wallets/:address`)**:
   - Lifetime volume stats (total sent/received, current balance, unique counterparties).
   - Behavioral profiling: velocity trend, clustering factor, and anomaly indicators.
   - Wallet ego network graph visualization.

5. **AI-Based Risk Analysis (`/ai-analysis`)**:
   - Integration with Python FastAPI AI Service running scikit-learn `IsolationForest` models.
   - 0-100 numerical risk scoring with classification levels (`LOW`: 0-24, `MEDIUM`: 25-49, `HIGH`: 50-74, `CRITICAL`: 75-100).
   - Pattern detection for 12 transaction behaviors (burst activity, rapid fund movement, circular paths, structuring, dormant reactivation, fan-in/fan-out, etc.).

6. **Interactive Transaction Network Graph (`/network`)**:
   - Canvas visualization powered by React Flow (`@xyflow/react`).
   - Node color coding by risk severity (`LOW` green, `MEDIUM` amber, `HIGH` red, `CRITICAL` purple).
   - Node selection inspector side drawer with degree centrality metrics.

7. **Security Alert & Incident Center (`/alerts`)**:
   - Alert management with severity indicators (`INFO`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
   - Incident assignment and investigation notes log audit trail.

8. **Advanced Analytics Suite (`/analytics`)**:
   - 11 interactive Recharts visualizations covering hourly throughput, fee distribution, transaction size brackets, top active wallets, and volume streams.

9. **Compliance Report Generator (`/reports`)**:
   - Formal report generation for SAR (Suspicious Activity Reports), Transaction Analysis, and Wallet Intelligence.
   - Print layout view and JSON/CSV export.

10. **Role-Based Authentication & Authorization**:
    - Roles: **ADMIN**, **ANALYST**, **VIEWER**.
    - JWT authentication with bcrypt password hashing.

---

## 📐 System Architecture

```
                       ┌─────────────────────────┐
                       │     REACT FRONTEND      │
                       │   React 18 + Vite +     │
                       │  Tailwind CSS + Recharts│
                       └────────────┬────────────┘
                                    │
                                REST API /
                                WebSockets
                                    │
                       ┌────────────▼────────────┐
                       │    NODE.JS BACKEND      │
                       │   Express.js API +      │
                       │  Socket.IO Real-time    │
                       └──────┬───────────┬──────┘
                              │           │
                     ┌────────▼───┐   ┌───▼────────────────┐
                     │   MySQL    │   │  PYTHON AI SERVICE │
                     │  Database  │   │  FastAPI + scikit- │
                     │ (or DB Adapt)  │ learn IsolationForest│
                     └────────────┘   └────────────────────┘
```

---

## 🔐 Demo User Credentials

The system provides a pre-seeded administrator account:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `vishwa62@bitcoinintel.com` | `Vish@2007@` | Full system configuration, audit logs, user management |

> *A quick-fill button is available on the `/login` page for one-click authentication.*

---

## 📁 Repository Structure

```
d:\Analysis Bitcoin\
├── database/
│   ├── schema.sql              # MySQL DDL table schemas & foreign keys
│   └── seed.sql                # Seed SQL script for baseline data
├── ai_service/
│   ├── main.py                 # FastAPI server entry point (Port 8000)
│   ├── requirements.txt        # Python dependencies
│   ├── preprocessing/          # Feature engineering vectors
│   ├── anomaly_detection/     # IsolationForest model trainer & predictor
│   ├── network_analysis/       # NetworkX graph centrality metrics
│   ├── risk_scoring/           # 0-100 numerical risk engine
│   └── pattern_detection/      # 12 analytical transaction pattern matchers
├── server/
│   ├── src/
│   │   ├── config/             # DB connection adapter (MySQL + Fallback) & JWT
│   │   ├── controllers/        # REST API controllers
│   │   ├── middleware/         # Auth JWT verification & error handler
│   │   ├── providers/          # Bitcoin Data Provider abstraction
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # Data store & AI integration service
│   │   └── websocket/          # Socket.IO live transaction streaming
│   ├── .env.example            # Environment template
│   ├── package.json            # Server node packages
│   └── server.js               # Node Express server entry point (Port 5000)
├── client/
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, StatCard, ReactFlow Graph, etc.
│   │   ├── context/            # AuthContext provider
│   │   ├── hooks/              # useAuth & useWebSocket custom hooks
│   │   ├── pages/              # Dashboard, Transactions, Network, AI, Analytics, Reports
│   │   ├── services/           # Axios API client
│   │   ├── utils/              # Formatters & risk styling
│   │   ├── App.jsx             # React router configuration
│   │   └── main.jsx            # Entry point
│   ├── index.html              # HTML5 template
│   ├── package.json            # React frontend packages
│   ├── tailwind.config.js      # Tailwind styling configuration
│   └── vite.config.js          # Vite build config & API proxy (Port 5173)
└── README.md                   # Complete documentation
```

---

## 🛠️ Installation & Setup Instructions

### Prerequisites
- **Node.js**: v18+ or v24+
- **NPM**: v9+ or v11+
- **Python**: v3.9+ (Optional for FastAPI service; Node backend includes built-in AI fallback engine)
- **MySQL**: v8.0+ (Optional; Node backend includes built-in SQLite/In-memory fallback database)

---

### Step 1: Database Setup (MySQL)
If running local MySQL:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p bitcoin_monitoring < database/seed.sql
```

---

### Step 2: Backend Setup (Node.js Express)
Navigate to `server/`:
```bash
cd server
npm install
```

Create `.env` file (or copy `.env.example`):
```env
PORT=5000
JWT_SECRET=bitcoin_traffic_intel_jwt_secret_key_2026_super_secure
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=bitcoin_monitoring
AI_SERVICE_URL=http://localhost:8000
BITCOIN_PROVIDER=synthetic
CLIENT_ORIGIN=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
# Server will start on http://localhost:5000
```

---

### Step 3: Python AI Service Setup (FastAPI)
Navigate to `ai_service/`:
```bash
cd ai_service
pip install -r requirements.txt
python main.py
# AI service will run on http://localhost:8000
```

---

### Step 4: Frontend Setup (React + Vite)
Navigate to `client/`:
```bash
cd client
npm install
npm run dev
# React Web App will launch on http://localhost:5173
```

---

## 📡 API Endpoint Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user account.
- `POST /api/auth/login` - Authenticate user & issue JWT token.
- `GET /api/auth/me` - Fetch authenticated user profile.

### Transactions (`/api/transactions`)
- `GET /api/transactions` - Fetch transactions with search, risk filter, status filter, and pagination.
- `GET /api/transactions/stats` - Fetch overall SOC dashboard metric counters.
- `GET /api/transactions/:hash` - Inspect transaction detail record with inputs/outputs.

### Wallets (`/api/wallets`)
- `GET /api/wallets` - List monitored wallets with balances & risk scores.
- `GET /api/wallets/:address` - Inspect wallet overview, behavioral profile, and metrics.
- `GET /api/wallets/:address/transactions` - Fetch transaction history for target wallet.
- `GET /api/wallets/:address/network` - Fetch ego network nodes & edges for target wallet.

### AI Engine (`/api/ai`)
- `POST /api/ai/analyze/transaction` - Submit transaction parameters for IsolationForest anomaly scoring.
- `POST /api/ai/analyze/wallet` - Submit wallet metrics for behavioral scoring.
- `GET /api/ai/anomalies` - Fetch recent anomaly triggers and statistics.
- `GET /api/ai/risk-distribution` - Fetch risk level breakdown count.

### Incident Alerts (`/api/alerts`)
- `GET /api/alerts` - List security alerts with severity & status filters.
- `GET /api/alerts/:id` - Inspect alert record and investigation notes.
- `PUT /api/alerts/:id/status` - Update alert status (`NEW`, `ACKNOWLEDGED`, `INVESTIGATING`, `RESOLVED`).
- `PUT /api/alerts/:id/assign` - Assign alert to security analyst.
- `POST /api/alerts/:id/notes` - Add investigation note to alert record.

### Analytics (`/api/analytics`)
- `GET /api/analytics/overview` - Fetch 11 chart datasets for volume, hourly distribution, fee analysis, and top wallets.

### Network Topology (`/api/network`)
- `GET /api/network` - Fetch full network nodes and edges for React Flow canvas.

### Reports (`/api/reports`)
- `POST /api/reports/generate` - Generate JSON/CSV printable compliance report.

---

## 🏷️ Legal & Analytical Disclaimer

> **IMPORTANT:** Risk scores (0-100), anomaly flags, and pattern detections generated by the Bitcoin Traffic Intelligence system are analytical statistical indicators designed for blockchain traffic monitoring. They do not constitute legal or criminal proof of illicit activity.
>>>>>>> 13b9177 (feat: complete AI-powered Bitcoin transaction traffic monitoring & enterprise SaaS UI/UX)
