import express from "express";
import { escrowContract } from "../indexer/escrowListener.js";

const router = express.Router();

router.get("/state", async (_, res) => {
  try {
    const data = {
      buyer: await escrowContract.buyer(),
      seller: await escrowContract.seller(),
      totalAmount: (await escrowContract.totalAmount()).toString(),
      releasedAmount: (await escrowContract.releasedAmount()).toString(),
      state: Number(await escrowContract.state()),
    };

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch escrow state" });
  }
});

export default router;
