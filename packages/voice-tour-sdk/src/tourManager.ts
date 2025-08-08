import { EventEmitter } from "./utils/eventEmitter";
import type { VoiceTourStep, ViewedStepEvent, TourCompletedEvent } from "./types";

export type TourEvents = ViewedStepEvent | TourCompletedEvent;

export class TourManager
{
  private steps: VoiceTourStep[];
  private currentIndex: number;
  private bus: EventEmitter<TourEvents>;

  constructor(steps: VoiceTourStep[], bus: EventEmitter<TourEvents>)
  {
    if (!steps || steps.length === 0)
    {
      throw new Error("VoiceTour: steps are required");
    }
    this.steps = [...steps];
    this.currentIndex = 0;
    this.bus = bus;
  }

  start(): void
  {
    this.currentIndex = 0;
    this.emitCurrent();
  }

  stop(): void
  {
    // No-op for now; consumer controls UI widgets
  }

  next(): void
  {
    if (this.currentIndex < this.steps.length - 1)
    {
      this.currentIndex += 1;
      this.emitCurrent();
      return;
    }
    this.bus.emit({ type: "tour:completed" });
  }

  prev(): void
  {
    if (this.currentIndex > 0)
    {
      this.currentIndex -= 1;
      this.emitCurrent();
    }
  }

  goTo(stepId: string): void
  {
    const idx = this.steps.findIndex((s) => s.id === stepId);
    if (idx === -1)
    {
      throw new Error(`VoiceTour: step not found: ${stepId}`);
    }
    this.currentIndex = idx;
    this.emitCurrent();
  }

  updateStepDocs(stepId: string, docs: string): void
  {
    const idx = this.steps.findIndex((s) => s.id === stepId);
    if (idx === -1)
    {
      throw new Error(`VoiceTour: step not found: ${stepId}`);
    }
    this.steps[idx] = { ...this.steps[idx], docs };
    if (idx === this.currentIndex)
    {
      this.emitCurrent();
    }
  }

  addSteps(newSteps: VoiceTourStep[]): void
  {
    if (!newSteps || newSteps.length === 0)
    {
      return;
    }
    this.steps = [...this.steps, ...newSteps];
  }

  getSteps(): VoiceTourStep[]
  {
    return [...this.steps];
  }

  getIndex(): number
  {
    return this.currentIndex;
  }

  private emitCurrent(): void
  {
    const step = this.steps[this.currentIndex];
    this.bus.emit({ type: "step:viewed", step });
  }
} 