# Trellify – Voice Tour Demo

Vite + React + TS + Tailwind demo showcasing the Voice Tour SDK with React Joyride and the Vapi Web Widget.

## Configure

```bash
cp .env.example .env
# Fill VITE_VAPI_ASSISTANT_ID and VITE_VAPI_PUBLIC_API_KEY
pnpm -F trellify-demo dev
```

Embed the Vapi Web Widget via `index.html`. See [Vapi Introduction](https://docs.vapi.ai/quickstart/introduction). The SDK assumes a global `window.VapiWidget` with `sendSystemMessage` and `sendUserMessage`.

## Steps

Defined in `src/steps.json`. Selectors map directly to Joyride targets. The SDK updates the assistant context when Joyride changes the active step.

## Run

```bash
pnpm -F trellify-demo dev
```

Open http://localhost:5173 and start the tour. Speak with the voice guide in the widget. 