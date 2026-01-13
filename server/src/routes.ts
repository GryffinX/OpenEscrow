import { Router } from "express";
import { escrowContract } from "./escrow";

const router = Router();

/**
 * Health check for API router
 */
router.get("/", (_, res) => {
  res.json({ ok: true, message: "API is running" });
});

/**
 * Read-only: Get escrow state
 */
router.get("/state", async (_, res) => {
  try {
    const state = await escrowContract.state();
    res.json({ success: true, state: state.toString() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Read-only: total amount stored in escrow
 */
router.get("/totalAmount", async (_, res) => {
  try {
    const total = await escrowContract.totalAmount();
    res.json({ success: true, totalAmount: total.toString() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
