import type { JoyrideCallback, VoiceTourStep } from "./types";
import { EventEmitter } from "./utils/eventEmitter";
import type { TourEvents } from "./tourManager";

export class JoyrideAdapter
{
  private steps: VoiceTourStep[];
  private bus: EventEmitter<TourEvents>;

  constructor(steps: VoiceTourStep[], bus: EventEmitter<TourEvents>)
  {
    this.steps = steps;
    this.bus = bus;
  }

  bind(originalCallback?: JoyrideCallback): JoyrideCallback
  {
    return (data: any) =>
    {
      try
      {
        const index = typeof data?.index === "number" ? data.index : undefined;
        const status = data?.status ?? data?.action ?? data?.type;
        if (typeof index === "number")
        {
          const step = this.steps[index];
          if (step)
          {
            this.bus.emit({ type: "step:viewed", step });
          }
        }
        if (typeof originalCallback === "function")
        {
          originalCallback(data);
        }
      }
      catch (err)
      {
        // Swallow adapter errors to avoid breaking host
      }
    };
  }
} 