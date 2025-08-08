## Trellify – Voice-Guided Product Tours

A calming, modern demo that blends React Joyride with Vapi voice to create step-by-step, voice-assisted walkthroughs. Built with Vite + React + TypeScript + Tailwind in a pnpm monorepo.
Demo video: https://youtu.be/i65is73Z8eA

### What’s inside
- `packages/voice-tour-sdk`: TypeScript SDK that bridges Vapi (web widget) and React Joyride
- `apps/trellify-demo`: Trello-style UI showcasing the voice tour
- `apps/webhook-server`: Minimal Node/Express service for analytics and Vapi Server URLs

### Highlights
- Voice-aware step navigation (say “next step” to advance)
- Debounced, conflict-free programmatic control of Joyride
- Calm, glassy UI with refined tour popovers
- Privacy-safe: .env and secrets are ignored by Git

---

### Quickstart

1) Install
```bash
pnpm install
```

2) Configure environment
- Copy and fill env files (kept out of Git):
```bash
# Demo app
cp apps/trellify-demo/.env.example apps/trellify-demo/.env
# Webhook server (optional)
cp apps/webhook-server/.env.example apps/webhook-server/.env
```
- Required variables (demo app):
  - `VITE_VAPI_ASSISTANT_ID`
  - `VITE_VAPI_PUBLIC_API_KEY`
  - Optional: `VITE_MAKE_WEBHOOK_URL`

3) Run
```bash
# Start the Trellify demo UI
pnpm -F trellify-demo dev
# Start the webhook server (optional)
pnpm -F webhook-server dev
```
Visit the demo at `http://localhost:5173` (or the port Vite shows).

---

### How it works
- The SDK (`voice-tour-sdk`) exposes a `createVoiceTour` controller and a Joyride adapter.
- The demo app binds Joyride’s callback through the adapter and listens for tool calls via custom events.
- A guarded step index (with debouncing and manual-advance flag) prevents race conditions when both Joyride and voice attempt to change steps.
- The Vapi web client listens for:
  - Function/tool call: `NextStep`
  - Assistant transcript phrase: “Let’s head on over to the next step.”
  Both dispatch a `voice-tour:next` event. A debounce prevents accidental double-advances.

---

### Project scripts
```bash
# root
pnpm install

# demo app
pnpm -F trellify-demo dev
pnpm -F trellify-demo build

# webhook server
pnpm -F webhook-server dev
pnpm -F webhook-server build
```

---

### Development notes
- Keep `.env` and keys out of version control (already in `.gitignore`).
- UI-only changes should not alter IDs/selectors used by Joyride steps (`#board`, `#new-card-btn`, `#filters`, `#board-settings`).
- The demo app intentionally centers tour reliability (no step skipping, no resets).

---

### Tech stack
- React 18, TypeScript, Vite, Tailwind CSS
- React Joyride for guided tours
- Vapi web widget for voice
- pnpm workspaces monorepo

---

### License
MIT © Trellify Demo 
