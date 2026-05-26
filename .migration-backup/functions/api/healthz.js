import { json } from "./_data.js";

export async function onRequestGet() {
  return json({ status: "ok" });
}
