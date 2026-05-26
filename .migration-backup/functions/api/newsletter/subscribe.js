import { json } from "../_data.js";

const subscribers = new Set();

export async function onRequestPost({ request }) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ error: "Invalid email address" }, 400);
    }

    subscribers.add(email);

    return json({ message: "You're subscribed! Welcome to the PulseWire community." });
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
