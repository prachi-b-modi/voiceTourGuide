# Webhook Server

Receives Vapi Server URLs events and Call Analysis. Optionally forwards to Make when `MAKE_WEBHOOK` is set.

- POST `/vapi/webhook` → any Vapi server event
- POST `/vapi/call-analysis` → end-of-call analysis report
- GET `/` → health

Environment:
- `PORT` (default 4000)
- `MAKE_WEBHOOK` (optional)

## Run

```bash
cp .env.example .env
pnpm -F webhook-server dev
```

Expose with ngrok and paste URLs in Vapi → Assistant → Server URLs.

References: [Vapi Introduction](https://docs.vapi.ai/quickstart/introduction) · [Vapi in Make](https://apps.make.com/vapi) 