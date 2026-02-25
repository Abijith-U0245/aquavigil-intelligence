## AquaVigil Backend

Node.js + Express + TypeScript backend for the AquaVigil AI risk intelligence application.

### Features

- `POST /api/analyze` endpoint
  - Validates:
    - `city: string`
    - `pharmaPresence: "low" | "medium" | "high"`
    - `wasteScore: number` in the range **1–5**
    - `populationDensity: "low" | "medium" | "high"`
  - Returns HTTP 400 on invalid inputs.
- Deterministic risk scoring in `utils/riskCalculator.ts`
  - Produces:
    - `riskScore: number` (0–100)
    - `riskLevel: "Low" | "Moderate" | "High"`
- OpenAI integration in `services/aiService.ts`
  - Uses `GPT-4o-mini` (or model from `OPENAI_MODEL`)
  - Sends a structured prompt with all inputs and computed risk
  - Forces JSON-only output and safely parses the response
  - Uses a robust fallback payload when AI calls fail or JSON is malformed
- Centralized error handling and request timeout guards
- Strong TypeScript types for request and response bodies in `types/index.ts`

### Environment setup

Create a `.env` file in the `backend/` directory based on `.env.example`:

```bash
cd backend
cp .env.example .env
```

Populate at least:

- `OPENAI_API_KEY` – your OpenAI API key
- `OPENAI_MODEL` – optional, defaults to `gpt-4o-mini`
- `FRONTEND_ORIGIN` – e.g. `http://localhost:8080`

### Install dependencies

```bash
cd backend
npm install
```

### Run in development

```bash
cd backend
npm run dev
```

This starts the backend with `ts-node-dev` on the port specified in `PORT` (default: `4000`).

### Build and run in production

```bash
cd backend
npm run build
npm start
```

### Endpoint summary

#### POST `/api/analyze`

Request body:

```json
{
  "city": "Hyderabad",
  "pharmaPresence": "high",
  "wasteScore": 2,
  "populationDensity": "high"
}
```

Response body:

```json
{
  "riskScore": 78,
  "riskLevel": "High",
  "analysis": "…",
  "amrImpact": "…",
  "recommendations": ["…"],
  "policySuggestions": ["…"]
}
```

