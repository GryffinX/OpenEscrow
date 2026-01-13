import { Router } from "express";
import { escrowContract } from "./escrow";
import { ethers } from "ethers";

const router = Router();

router.post("/fund", async (req, res) => {
  try {
    const { amountEth } = req.body;

    const tx = await escrowContract.fundEscrow({
      value: ethers.parseEther(amountEth)
    });

    const receipt = await tx.wait();

    res.json({
      success: true,
      txHash: receipt.hash
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/release/design", async (_, res) => {
  try {
    const tx = await escrowContract.releaseDesignMilestone();
    const receipt = await tx.wait();

    res.json({ success: true, txHash: receipt.hash });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
