## AquaVigil – AI Pharmaceutical Pollution Intelligence

AquaVigil is an AI-powered decision support tool for assessing pharmaceutical pollution and antimicrobial resistance (AMR) risk at the district and watershed level. It combines a modern React frontend with a TypeScript/Express backend and OpenAI integration to generate structured risk intelligence and policy-ready recommendations.

### Frontend stack

- **Vite + React 18 + TypeScript**
- **React Router** for SPA routing
- **Tailwind CSS + shadcn-ui** for design system and components
- **Recharts** for analytics visualizations

To run the frontend:

```bash
cd aquavigil-intelligence
npm install
npm run dev
```

The dev server runs on `http://localhost:8080` by default.

### Backend stack

- **Node.js + Express + TypeScript**
- **OpenAI GPT-4o-mini** for AI-generated analysis
- **dotenv** for environment configuration

The backend lives in the `backend/` folder and exposes a typed `POST /api/analyze` endpoint that:

- Validates city, pharma presence, waste score, and population density
- Computes a deterministic 0–100 risk score and categorical risk level
- Calls OpenAI to generate structured narrative, AMR impact, and recommendations

To run the backend:

```bash
cd backend
npm install
cp .env.example .env   # then edit .env with your keys
npm run dev            # or: npm run build && npm start
```

By default the backend listens on `http://localhost:4000`.

### High-level architecture

- **Landing page** introduces AquaVigil and links into the analyzer and results dashboard.
- **Analyzer page** collects district parameters and calls the backend `/api/analyze` endpoint.
- **Results dashboard** renders the returned risk score, level, AI analysis, and structured recommendations using reusable visual components.

This repository is intended for hackathon and research use; please review and harden configuration, logging, and security before production deployment.
