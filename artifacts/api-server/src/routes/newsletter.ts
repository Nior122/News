import { Router } from "express";
import { db, newsletterTable } from "@workspace/db";
import { z } from "zod";

const router = Router();

const emailSchema = z.object({ email: z.string().email() });

router.post("/newsletter/subscribe", async (req, res) => {
  try {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid email address" });
      return;
    }

    const { email } = parsed.data;

    try {
      await db.insert(newsletterTable).values({ email });
    } catch {
      // Unique constraint violation — already subscribed
    }

    res.json({ message: "You're subscribed! Welcome to the PulseWire community." });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
