import { ethers } from "ethers";
import escrowABI from "../contracts/escrowABI.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_ESCROW_ADDRESS;

if (!CONTRACT_ADDRESS) {
  throw new Error("VITE_ESCROW_ADDRESS missing in client/.env");
}

function getProvider() {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  return new ethers.BrowserProvider(window.ethereum);
}

async function getReadContract() {
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, escrowABI, provider);
}

async function getWriteContract() {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, escrowABI, signer);
}

/* ---------------- WRITE ---------------- */

export async function fundEscrow(amountEth) {
  const contract = await getWriteContract();
  const tx = await contract.fundEscrow({
    value: ethers.parseEther(amountEth),
  });
  return await tx.wait();
}

export async function releaseDesign() {
  const contract = await getWriteContract();
  const tx = await contract.releaseDesignMilestone();
  return await tx.wait();
}

export async function releaseDevelopment() {
  const contract = await getWriteContract();
  const tx = await contract.releaseDevelopmentMilestone();
  return await tx.wait();
}

/* ---------------- READ ---------------- */

export async function getEscrowDetails() {
  const contract = await getReadContract();

  return {
    buyer: await contract.buyer(),
    seller: await contract.seller(),
    totalAmount: (await contract.totalAmount()).toString(),
    releasedAmount: (await contract.releasedAmount()).toString(),
    designReleased: await contract.designReleased(),
    developmentReleased: await contract.developmentReleased(),
    state: (await contract.state()).toString(),
  };
}
