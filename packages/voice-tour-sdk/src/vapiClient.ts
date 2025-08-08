import type { VoiceTourStep } from "./types";
import { EventEmitter } from "./utils/eventEmitter";
import type { TourEvents } from "./tourManager";
import Vapi from '@vapi-ai/web';

export class VapiClient
{
  private assistantId: string;
  private bus: EventEmitter<TourEvents>;
  private webClient: any | undefined;
  private voiceStarted = false;

  constructor(assistantId: string, bus: EventEmitter<TourEvents>)
  {
    if (!assistantId)
    {
      throw new Error("VoiceTour: assistantId is required");
    }
    this.assistantId = assistantId;
    this.bus = bus;
  }

  async ensureVoiceStarted(publicKey: string): Promise<void>
  {
    if (this.voiceStarted)
    {
      return;
    }
    try
    {
      if (!this.webClient)
      {
        // Avoid bundler static resolution
        const mod = await import(/* @vite-ignore */ "@vapi-ai/web");
        const Vapi = (mod as any).default ?? (mod as any);
        this.webClient = new Vapi(publicKey);
        this.setupEventListeners();
      }
      await this.webClient.start(this.assistantId);
      this.voiceStarted = true;
    }
    catch (error)
    {
      console.warn("VoiceTour: Failed to start web client:", error);
      // Ignore startup failures
    }
  }

  async startVoiceManually(publicKey: string): Promise<void>
  {
    // Force start the voice regardless of current state
    try
    {
      if (!this.webClient)
      {
        const mod = await import(/* @vite-ignore */ "@vapi-ai/web");
        const Vapi = (mod as any).default ?? (mod as any);
        this.webClient = new Vapi(publicKey);
        this.setupEventListeners();
      }
      await this.webClient.start(this.assistantId);
      this.voiceStarted = true;
      console.log("VoiceTour: Voice started manually");
    }
    catch (error)
    {
      console.warn("VoiceTour: Failed to start voice manually:", error);
      throw error;
    }
  }

  private setupEventListeners(): void
  {
    if (!this.webClient)
    {
      return;
    }

    // Listen for call events
    this.webClient.on('call-start', () =>
    {
      console.log('VoiceTour: Voice call started');
      this.voiceStarted = true;
    });

    this.webClient.on('call-end', () =>
    {
      console.log('VoiceTour: Voice call ended');
      this.voiceStarted = false;
    });

    this.webClient.on('message', (message: any) =>
    {
      if (message.type === 'transcript')
      {
        console.log(`VoiceTour: ${message.role}: ${message.transcript}`);
        
        // Check for the specific phrase that should trigger next step
        if (message.role === 'assistant' && message.transcript === "Let's head on over to the next step.")
        {
          console.log('=== VAPI TRANSCRIPT TRIGGER ===');
          console.log('VoiceTour: Detected next step phrase - dispatching event');
          window.dispatchEvent(new CustomEvent('voice-tour:next'));
          console.log('=== TRANSCRIPT EVENT DISPATCHED ===');
        }
      }
      
      // Handle function/tool calls according to Vapi documentation
      if (message.type === 'function-call' && message.functionCall)
      {
        const functionName = message.functionCall.name;
        console.log(`VoiceTour: Function call received: ${functionName}`);
        
        // Check for nextStep tool call
        if (functionName === 'NextStep')
        {
          console.log('=== VAPI FUNCTION CALL TRIGGER ===');
          console.log('VoiceTour: nextStep tool called - dispatching event');
          window.dispatchEvent(new CustomEvent('voice-tour:next'));
          console.log('=== FUNCTION CALL EVENT DISPATCHED ===');
        }
      }
    });

    this.webClient.on('error', (error: any) =>
    {
      console.warn('VoiceTour: Voice client error:', error);
    });
  }

  startSession(): void
  {
    // Session management handled by web client
  }

  stopSession(): void
  {
    if (!this.webClient || !this.voiceStarted)
    {
      console.warn("VoiceTour: Web client not active, nothing to stop");
      return;
    }

    try
    {
      this.webClient.stop();
      this.voiceStarted = false;
      console.log("VoiceTour: Stopped web client");
    }
    catch (error)
    {
      console.error("VoiceTour: Error stopping web client:", error);
    }
  }

  updateContextForStep(step: VoiceTourStep): void
  {
    if (!this.webClient || !this.voiceStarted)
    {
      console.warn(`VoiceTour: Cannot send context update for step ${step.id} - web client not active`);
      return;
    }

    const contextMessage = `You are now guiding the user through step "${step.id}". 

Current step information:
- Element: ${step.selector}
- Context: ${step.docs}

Please explain this feature to the user in a friendly, conversational way and ask if they'd like to proceed to the next step or if they have any questions about this feature.`;

    try
    {
      this.webClient.send({
        type: "add-message",
        message: {
          role: "system",
          content: contextMessage
        }
      });
      console.log(`VoiceTour: Sent context update for step: ${step.id}`);
    }
    catch (error)
    {
      console.error(`VoiceTour: Failed to send context update for step ${step.id}:`, error);
    }
  }

  ask(text: string): void
  {
    if (!text)
    {
      return;
    }

    if (!this.webClient || !this.voiceStarted)
    {
      console.warn(`VoiceTour: Cannot send user message - web client not active`);
      return;
    }

    try
    {
      this.webClient.send({
        type: "add-message",
        message: {
          role: "user",
          content: text
        }
      });
      console.log(`VoiceTour: Sent user question: ${text}`);
    }
    catch (error)
    {
      console.error(`VoiceTour: Failed to send user message:`, error);
    }
  }

  isVoiceActive(): boolean
  {
    return !!(this.webClient && this.voiceStarted);
  }

  getConnectionInfo(): { webClientActive: boolean; voiceStarted: boolean }
  {
    return {
      webClientActive: !!(this.webClient && this.voiceStarted),
      voiceStarted: this.voiceStarted
    };
  }
} 