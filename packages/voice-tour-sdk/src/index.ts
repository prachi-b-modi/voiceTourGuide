import { EventEmitter } from "./utils/eventEmitter";
import { TourManager, type TourEvents } from "./tourManager";
import { VapiClient } from "./vapiClient";
import { AnalyticsClient } from "./analyticsClient";
import type { VoiceTourOptions, VoiceTourController, VoiceTourStep, JoyrideCallback } from "./types";
import { JoyrideAdapter } from "./joyrideAdapter";

export type { VoiceTourStep, VoiceTourOptions, VoiceTourController } from "./types";

function normalizeOptions(options: VoiceTourOptions): { assistantId: string; steps: VoiceTourStep[]; makeWebhookUrl?: string; flushIntervalMs?: number; maxBatch?: number; voice?: { autoStartOnFirstStep: boolean; publicKey: string } }
{
  // Legacy shape
  if ((options as any).assistantId)
  {
    const legacy = options as any;
    return {
      assistantId: legacy.assistantId,
      steps: legacy.steps,
      makeWebhookUrl: legacy.makeWebhookUrl
    } as any;
  }
  // New shape
  const modern = options as any;
  return {
    assistantId: modern.vapi.assistantId,
    steps: modern.steps,
    makeWebhookUrl: modern.analytics?.makeWebhookUrl,
    flushIntervalMs: modern.analytics?.flushIntervalMs,
    maxBatch: modern.analytics?.maxBatch,
    voice: modern.voice
  };
}

export function createVoiceTour(options: VoiceTourOptions): VoiceTourController
{
  const { assistantId, steps, makeWebhookUrl, flushIntervalMs, maxBatch, voice } = normalizeOptions(options);
  const bus = new EventEmitter<TourEvents>();
  const tour = new TourManager(steps, bus);
  const vapi = new VapiClient(assistantId, bus);
  const analytics = new AnalyticsClient({ webhookUrl: makeWebhookUrl, intervalMs: flushIntervalMs ?? 15000, maxBatch: maxBatch ?? 20 });
  const joyride = new JoyrideAdapter(steps, bus);

  bus.on("step:viewed", async ({ step }) =>
  {
    if (voice?.autoStartOnFirstStep && voice.publicKey)
    {
      await vapi.ensureVoiceStarted(voice.publicKey);
    }
    vapi.updateContextForStep(step);
    analytics.track({ type: "viewed_step", stepId: step.id, at: Date.now() });
  });

  bus.on("tour:completed", () =>
  {
    analytics.track({ type: "tour_completed", at: Date.now() });
  });

  function start(): void
  {
    analytics.start();
    vapi.startSession();
    tour.start();
  }

  function stop(): void
  {
    console.log("VoiceTour: Stopping tour...");
    tour.stop();
    console.log("VoiceTour: Stopping VAPI session...");
    vapi.stopSession();
    analytics.stop();
    console.log("VoiceTour: Tour stopped");
  }

  function ask(text: string): void
  {
    analytics.track({ type: "asked_question", text, at: Date.now() });
    vapi.ask(text);
  }

  async function startVoice(): Promise<void>
  {
    if (voice?.publicKey)
    {
      try 
      {
        await vapi.startVoiceManually(voice.publicKey);
        analytics.track({ type: "voice_started_manually", at: Date.now() });
      }
      catch (error)
      {
        console.error("VoiceTour: Failed to start voice:", error);
        throw error;
      }
    }
    else
    {
      throw new Error("VoiceTour: No public key configured for voice");
    }
  }

  function bindJoyride(originalCallback?: JoyrideCallback): JoyrideCallback
  {
    return joyride.bind(originalCallback);
  }

  function onToolCall(handler: (toolName: string, parameters?: any) => void): void
  {
    const listener = (event: CustomEvent) =>
    {
      const toolName = event.type.replace('voice-tour:', '');
      handler(toolName, event.detail);
    };
    
    window.addEventListener('voice-tour:next', listener as EventListener);
    // Future: add more tool events like voice-tour:prev, voice-tour:goto, etc.
  }

  return {
    start,
    stop,
    next: () => tour.next(),
    prev: () => tour.prev(),
    goTo: (stepId: string) => tour.goTo(stepId),
    updateStepDocs: (stepId: string, docs: string) => tour.updateStepDocs(stepId, docs),
    addSteps: (newSteps: VoiceTourStep[]) => tour.addSteps(newSteps),
    ask,
    startVoice,
    bindJoyride,
    onToolCall
  };
} 