# Vapi Voice Tour Monorepo

This monorepo contains:

- `packages/voice-tour-sdk`: A reusable TypeScript SDK that integrates the Vapi Web Widget with React Joyride to power voice-guided onboarding tours.
- `apps/trellify-demo`: A Trello-style demo app (Vite + React + TS + Tailwind) showcasing the voice tour.
- `apps/webhook-server`: A minimal Node/Express server (TS) receiving Vapi Server URLs events and Call Analysis; optionally forwards to Make.

## Decisions
- Package manager: pnpm workspaces
- Layout: `packages/voice-tour-sdk`, `apps/trellify-demo`, `apps/webhook-server`
- Node 18+, TypeScript strict
- License: MIT

## Quick start

1. Install dependencies

```bash
pnpm install
```

2. Start the webhook server

```bash
cp apps/webhook-server/.env.example apps/webhook-server/.env
pnpm -F webhook-server dev
```

Expose via ngrok and paste these in Vapi → Assistant → Server URLs:
- `POST https://<ngrok>/vapi/webhook`
- `POST https://<ngrok>/vapi/call-analysis`

3. Configure the demo app

```bash
cp apps/trellify-demo/.env.example apps/trellify-demo/.env
# Fill VITE_VAPI_ASSISTANT_ID, VITE_VAPI_PUBLIC_API_KEY, optionally VITE_MAKE_WEBHOOK_URL
pnpm -F trellify-demo dev
```

4. Open the app at http://localhost:5173 and start interacting with the voice tour.

## Analytics
- Ground-truth analytics flow through the webhook server via Vapi Server URLs and Call Analysis.
- The SDK ships a lightweight client-only buffer for UX events (`viewed_step`, `asked_question`, `tour_completed`) that can optionally forward to Make.

## Docs
- Vapi: see [Introduction](https://docs.vapi.ai/quickstart/introduction)
- Vapi × Make: see [Make Vapi App](https://apps.make.com/vapi) 