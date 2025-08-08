import { useEffect, useMemo } from "react";
import { createVoiceTour, type VoiceTourStep, type VoiceTourController } from "voice-tour-sdk";

function getAssistantIdFromDom(): string | undefined
{
  const el = typeof document !== "undefined" ? document.querySelector("vapi-widget") : null;
  return el?.getAttribute("assistant-id") ?? undefined;
}

function getPublicKeyFromDom(): string | undefined
{
  const el = typeof document !== "undefined" ? document.querySelector("vapi-widget") : null;
  return el?.getAttribute("public-key") ?? undefined;
}

function createNoopController(): VoiceTourController
{
  const pass = (fn?: any) => fn ?? (() => {});
  return {
    start: () => {},
    stop: () => {},
    next: () => {},
    prev: () => {},
    goTo: () => {},
    updateStepDocs: () => {},
    addSteps: () => {},
    ask: () => {},
    bindJoyride: (original?: any) => pass(original)
  } as VoiceTourController;
}

export function useVoiceTour(steps: VoiceTourStep[])
{
  const envAssistantId = (import.meta as any)?.env?.VITE_VAPI_ASSISTANT_ID as string | undefined;
  const assistantId = envAssistantId || getAssistantIdFromDom();
  const makeWebhookUrl = ((import.meta as any)?.env?.VITE_MAKE_WEBHOOK_URL as string) || undefined;
  const publicKey = ((import.meta as any)?.env?.VITE_VAPI_PUBLIC_API_KEY as string) || getPublicKeyFromDom();

  const tour = useMemo(() =>
  {
    if (!assistantId)
    {
      console.warn("VoiceTour: assistantId not set. UI will render; voice context updates disabled.");
      return createNoopController();
    }
    return createVoiceTour({
      vapi: { mode: "web-widget", assistantId },
      steps,
      analytics: { makeWebhookUrl },
      voice: publicKey ? { autoStartOnFirstStep: false, publicKey } : undefined
    } as any);
  }, [assistantId, steps, makeWebhookUrl, publicKey]);

  useEffect(() =>
  {
    tour.start();
    return () => tour.stop();
  }, [tour]);

  return tour;
} 