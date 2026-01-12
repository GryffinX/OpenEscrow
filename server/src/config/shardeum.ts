import { JsonRpcProvider } from "ethers";

if (!process.env.SHARDEUM_RPC) {
  throw new Error("SHARDEUM_RPC missing in .env");
}

export const provider = new JsonRpcProvider(
  process.env.SHARDEUM_RPC
);
