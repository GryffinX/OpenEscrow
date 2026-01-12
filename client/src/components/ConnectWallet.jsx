import { useState } from "react";
import { ethers } from "ethers";

function ConnectWallet({ setProvider }) {
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    setProvider(provider);
    setAccount(address);
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      <p>{account}</p>
    </div>
  );
}

export default ConnectWallet;
