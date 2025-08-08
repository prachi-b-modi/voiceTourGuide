export type VoiceTourStep = {
  id: string;
  selector: string;
  docs: string;
  title?: string;
  screenshotUrl?: string;
};

export type VoiceAutoStartOptions = {
  autoStartOnFirstStep: boolean;
  publicKey: string;
};

// New preferred options shape per spec
export type CreateVoiceTourOptions = {
  vapi: { mode: "web-widget"; assistantId: string };
  steps: VoiceTourStep[];
  analytics?: { makeWebhookUrl?: string; flushIntervalMs?: number; maxBatch?: number };
  voice?: VoiceAutoStartOptions;
};

// Back-compat options shape supported by the SDK
export type LegacyVoiceTourOptions = {
  assistantId: string;
  steps: VoiceTourStep[];
  makeWebhookUrl?: string;
};

export type VoiceTourOptions = CreateVoiceTourOptions | LegacyVoiceTourOptions;

export type ViewedStepEvent = {
  type: "step:viewed";
  step: VoiceTourStep;
};

export type TourCompletedEvent = {
  type: "tour:completed";
};

export type AnalyticsEvent =
  | { type: "viewed_step"; stepId: string; at: number }
  | { type: "asked_question"; text: string; at: number }
  | { type: "tour_completed"; at: number }
  | { type: "voice_started_manually"; at: number };

export type JoyrideCallback = (data: any) => void;

export type VoiceTourController = {
  start: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  goTo: (stepId: string) => void;
  updateStepDocs: (stepId: string, docs: string) => void;
  addSteps: (steps: VoiceTourStep[]) => void;
  ask: (text: string) => void;
  startVoice: () => Promise<void>;
  bindJoyride: (originalCallback?: JoyrideCallback) => JoyrideCallback;
  onToolCall: (handler: (toolName: string, parameters?: any) => void) => void;
}; 