// src/web3/escrow.js
import { ethers } from "ethers";
import escrowABI from "../contracts/escrowABI.json";

const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_ADDRESS";

async function getEscrowContract() {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    escrowABI,
    signer
  );
}

export async function fundEscrow(amountEth) {
  const contract = await getEscrowContract();
  const tx = await contract.fundEscrow({
    value: ethers.parseEther(amountEth),
  });
  await tx.wait();
}

export async function releaseDesign() {
  const contract = await getEscrowContract();
  const tx = await contract.releaseDesignMilestone();
  await tx.wait();
}

export async function releaseDevelopment() {
  const contract = await getEscrowContract();
  const tx = await contract.releaseDevelopmentMilestone();
  await tx.wait();
}

export async function getEscrowDetails() {
  const contract = await getEscrowContract();

  return {
    buyer: await contract.buyer(),
    seller: await contract.seller(),
    totalAmount: await contract.totalAmount(),
    releasedAmount: await contract.releasedAmount(),
    designReleased: await contract.designReleased(),
    developmentReleased: await contract.developmentReleased(),
    state: await contract.state(),
  };
}
