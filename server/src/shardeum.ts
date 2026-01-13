import { ethers } from "ethers";

export const provider = new ethers.JsonRpcProvider(
  process.env.SHARDEUM_RPC
);

export const signer = new ethers.Wallet(
  process.env.BACKEND_PRIVATE_KEY!,
  provider
);
