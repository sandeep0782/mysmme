import { Router, Request, Response } from "express";

const router = Router();

/* ============================================================
   META WEBHOOK VERIFICATION
============================================================ */

router.get("/webhook", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("WhatsApp webhook verified");

    return res.status(200).send(challenge);
  }

  console.error("WhatsApp webhook verification failed");

  return res.sendStatus(403);
});

/* ============================================================
   RECEIVE WHATSAPP EVENTS
============================================================ */

router.post("/webhook", (req: Request, res: Response) => {
  console.log("WhatsApp webhook event:", JSON.stringify(req.body, null, 2));

  /*
   * IMPORTANT:
   * Acknowledge Meta immediately.
   * We can process messages/status updates afterward.
   */
  return res.sendStatus(200);
});

export default router;
