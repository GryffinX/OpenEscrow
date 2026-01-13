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

  console.log("Funding escrow with:", amountEth);

  const tx = await contract.fundEscrow({
    value: ethers.parseEther(amountEth),
  });

  console.log("TX SENT:", tx.hash);

  const receipt = await tx.wait();

  console.log("TX MINED:", receipt.hash);

  return receipt;
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

  // ✅ IMPORTANT: this is the REAL on-chain balance locked in escrow
  const contractAddress = contract.target; // ethers v6 contract address
  const provider = contract.runner;        // ethers v6 provider
  const contractBalanceWei = await provider.getBalance(contractAddress);

  console.log("✅ Escrow contract balance (wei):", contractBalanceWei.toString());
  console.log("✅ Escrow contract balance (eth):", ethers.formatEther(contractBalanceWei));

  return {
    buyer: await contract.buyer(),
    seller: await contract.seller(),

    // ✅ TOTAL AMOUNT = CONTRACT BALANCE (always correct)
    totalAmount: contractBalanceWei.toString(),

    releasedAmount: (await contract.releasedAmount()).toString(),
    designReleased: await contract.designReleased(),
    developmentReleased: await contract.developmentReleased(),
    state: (await contract.state()).toString(),
  };
}
