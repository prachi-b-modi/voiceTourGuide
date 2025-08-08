import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const PORT = Number(process.env.PORT ?? 4000);
const MAKE_WEBHOOK = process.env.MAKE_WEBHOOK;

async function forwardToMake(payload: unknown): Promise<void>
{
  if (!MAKE_WEBHOOK)
  {
    return;
  }
  try
  {
    await fetch(MAKE_WEBHOOK, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
  catch (err)
  {
    console.error("[FORWARD ERROR]", (err as Error).message);
  }
}

app.get("/", (_req: Request, res: Response) =>
{
  res.json({ ok: true });
});

app.post("/vapi/webhook", async (req: Request, res: Response) =>
{
  const payload = req.body as any;
  try
  {
    const kind = payload?.type ?? payload?.event ?? "unknown";
    console.log(JSON.stringify({ tag: "VAPI EVENT", kind, at: Date.now() }));
    await forwardToMake({ source: "vapi-server-url", event: payload });
    res.status(200).json({ ok: true });
  }
  catch (err)
  {
    res.status(500).json({ ok: false, error: (err as Error).message });
  }
});

app.post("/vapi/call-analysis", async (req: Request, res: Response) =>
{
  const payload = req.body as any;
  try
  {
    const outcome = payload?.outcome ?? payload?.analysis?.outcome ?? "unknown";
    console.log(JSON.stringify({ tag: "VAPI CALL ANALYSIS", outcome, at: Date.now() }));
    await forwardToMake({ source: "vapi-call-analysis", report: payload });
    res.status(200).json({ ok: true });
  }
  catch (err)
  {
    res.status(500).json({ ok: false, error: (err as Error).message });
  }
});

app.listen(PORT, () =>
{
  console.log(`[webhook-server] listening on http://localhost:${PORT}`);
}); 