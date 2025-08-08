# Voice Tour SDK

Integrate the Vapi Web Widget with React Joyride to add voice-guided onboarding tours to any web app.

- Web session: Use the official Vapi Web Widget in your page
- Steps: Use Joyride selectors to spotlight UI targets
- Analytics: Only Vapi events and Call Analysis on the server are ground truth. This SDK emits lightweight client-side UX events optionally forwarded to Make.

References: [Vapi Introduction](https://docs.vapi.ai/quickstart/introduction) · [Vapi in Make](https://apps.make.com/vapi)

## Install

```bash
pnpm add voice-tour-sdk react-joyride
```

## Quick start

1) Ensure the Vapi Web Widget is embedded and initialized in your app.

2) Create a voice tour:

```ts
import { createVoiceTour, type VoiceTourStep } from "voice-tour-sdk";

const steps: VoiceTourStep[] = [
  { id: "board", selector: "#board", docs: "This board shows lists and cards" },
  { id: "new-card", selector: "#new-card-btn", docs: "Create a new card" }
];

const tour = createVoiceTour({ assistantId: "asst_123", steps, makeWebhookUrl: undefined });

// Bind to Joyride's callback
const joyrideCallback = tour.bindJoyride();

// Start when ready (after widget is present)
tour.start();
```

## API

- `createVoiceTour(options)` → controller
  - `options.assistantId: string` (required)
  - `options.steps: VoiceTourStep[]` (required)
  - `options.makeWebhookUrl?: string`

Controller methods:
- `start()`, `stop()`
- `next()`, `prev()`
- `goTo(stepId: string)`
- `updateStepDocs(stepId: string, docs: string)`
- `addSteps(steps: VoiceTourStep[])`
- `ask(text: string)`
- `bindJoyride(originalCallback?) => JoyrideCallback`

## Notes
- The widget owns session lifecycle. `start()` only pushes context and hooks analytics.
- System message template used when a step becomes active:
  - “You are a voice tour guide. Current step: <id>. Context: <docs>. Guide the user and ask if they want to proceed.”
- Analytics forwarded to Make are buffered (15s, up to 20 events) and optional.
- Ground-truth analytics should come from Vapi Server URLs + Call Analysis delivered to your server. 