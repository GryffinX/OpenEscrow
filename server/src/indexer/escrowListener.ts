import { Contract } from "ethers";
import { provider } from "../config/shardeum.js";
import escrowAbi from "../contracts/escrow.abi.json";

const ESCROW_ADDRESS = process.env.ESCROW_CONTRACT_ADDRESS;

if (!ESCROW_ADDRESS) {
  throw new Error("ESCROW_CONTRACT_ADDRESS missing in .env");
}

export const escrowContract = new Contract(
  ESCROW_ADDRESS,
  escrowAbi,
  provider
);

export function startEscrowListener() {
  console.log("Listening to escrow events...");

  escrowContract.on("EscrowCreated", async (...args) => {
    const event = args.at(-1);
    const block = await provider.getBlock(event.blockNumber);

    console.log({
      escrowId: args[0],
      buyer: args[1],
      seller: args[2],
      timestamp: block?.timestamp
    });

    // later → persist to DB
  });
}
