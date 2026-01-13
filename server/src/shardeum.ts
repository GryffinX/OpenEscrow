import { ethers } from "ethers";

if (!process.env.SHARDEUM_RPC) {
  throw new Error("SHARDEUM_RPC not set in .env");
}

export const provider = new ethers.JsonRpcProvider(
  process.env.SHARDEUM_RPC
);
