import { ethers } from "ethers";

function ConnectWallet({ setProvider }) {
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request wallet connection
      await provider.send("eth_requestAccounts", []);

      // IMPORTANT: store the provider object
      setProvider(provider);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  return (
    <button onClick={connectWallet}>
      Connect Wallet
    </button>
  );
}

export default ConnectWallet;
