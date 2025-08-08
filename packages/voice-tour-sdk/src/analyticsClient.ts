import type { AnalyticsEvent } from "./types";

export class AnalyticsClient
{
  private buffer: AnalyticsEvent[] = [];
  private readonly webhookUrl?: string;
  private readonly intervalMs: number;
  private readonly maxBatch: number;
  private timer?: any;

  constructor(options: { webhookUrl?: string; intervalMs?: number; maxBatch?: number })
  {
    this.webhookUrl = options.webhookUrl;
    this.intervalMs = options.intervalMs ?? 15000;
    this.maxBatch = options.maxBatch ?? 20;
  }

  start(): void
  {
    if (!this.webhookUrl)
    {
      return;
    }
    this.stop();
    this.timer = setInterval(() => this.flush(), this.intervalMs);
  }

  stop(): void
  {
    if (this.timer)
    {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  track(event: AnalyticsEvent): void
  {
    this.buffer.push(event);
    if (this.buffer.length >= this.maxBatch)
    {
      void this.flush();
    }
  }

  async flush(): Promise<void>
  {
    if (!this.webhookUrl)
    {
      this.buffer = [];
      return;
    }
    if (this.buffer.length === 0)
    {
      return;
    }
    const batch = this.buffer.splice(0, this.maxBatch);
    try
    {
      await fetch(this.webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ source: "voice-tour-analytics", events: batch })
      });
    }
    catch
    {
      // Drop failures; keep UX lean
    }
  }
} 