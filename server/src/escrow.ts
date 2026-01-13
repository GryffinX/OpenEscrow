import { ethers } from "ethers";
import type { InterfaceAbi } from "ethers";
import { signer } from "./shardeum";
import escrowAbi from "../abi/escrow.abi.json";

if (!process.env.ESCROW_ADDRESS) {
  throw new Error("ESCROW_ADDRESS not set");
}

const abi = escrowAbi as InterfaceAbi;

export const escrowContract = new ethers.Contract(
  process.env.ESCROW_ADDRESS,
  abi,
  signer
);
