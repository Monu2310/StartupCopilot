# AI Startup Co-Founder

Production-ready web app for generating, roasting, and evaluating startup ideas with structured JSON outputs and scoring.

## Features
- Idea generator with strict JSON output
- Brutal roast mode with structured feedback
- Investor analysis with scoring and risks
- Idea improver with pivots and GTM suggestions
- Multi-agent chains: RoastChain, InvestorChain, ImproverChain
- Evaluation logic with weighted score and verdict mapping
- Red-flag detection
- Chat-style history and follow-up flow
- Streaming analysis responses (SSE)

## Architecture
```
[React UI] -> [Express API] -> [LangChain + OpenAI]
                     |-> [MongoDB]
                     |-> [Cache (Memory/Redis)]
```

## Project Structure
```
/client
  /components
  /hooks
  /pages
/server
  /routes
  /controllers
  /services
    /ai
    /evaluation
    /cache
    /db
  /utils
```

## Setup
1. Install dependencies in both apps.
2. Create environment file.
3. Run dev servers.

### Server
```
cd server
cp ../.env.example .env
npm install
npm run dev
```

### Client
```
cd client
npm install
npm run dev
```

## Environment
Required:
- OPENAI_API_KEY
- MONGO_URI
Or use Gemini:
- GEMINI_API_KEY
Or use Groq:
- GROQ_API_KEY

Optional:
- REDIS_URL
- PORT
- NODE_ENV
- LOG_LEVEL
- VITE_API_BASE_URL
- OPENAI_MODEL
- GROQ_MODEL
- GEMINI_MODEL

## Screenshots
- Home page (idea generator) — replace with real screenshot
- Analysis dashboard — replace with real screenshot

## Sample Ideas
- Skills: product design, Interests: creator economy, Budget: 5k, Audience: indie creators, Geography: LATAM
- Skills: logistics, Interests: manufacturing, Budget: 50k, Audience: mid-size factories, Geography: US Midwest

## Edge Cases
- Missing or contradictory inputs
- Ideas with no monetization path
- Markets dominated by incumbents
- High technical complexity for low budgets

## Local Testing
- Use the sample ideas above in the idea generator.
- Toggle Roast Harder vs Be Nicer to validate tone control.
- Check analysis SSE endpoint with a streaming-capable client.

## Deployment (Vercel)
1. Set environment variables in Vercel for the project: `OPENAI_API_KEY`, `MONGO_URI`, and optional `REDIS_URL`.
2. Set `VITE_API_BASE_URL` to your deployed `/api` base if needed.
3. Deploy the repo to Vercel. The `vercel.json` config serves the React build and the Express API via `/api`.

Notes:
- The API runs as a Vercel Serverless Function via `api/index.ts`.
- For larger workloads, deploy the API separately and point `VITE_API_BASE_URL` to it.

## Notes
- Replace screenshot placeholders with real images.
- Ensure MongoDB is running before starting the API.
