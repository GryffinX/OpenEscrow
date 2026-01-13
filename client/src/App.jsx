import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Existing Imports
import ConnectWallet from "./components/ConnectWallet";
import CreateEscrow from "./components/CreateEscrow";
import Dashboard from "./pages/Dashboard";
import EscrowDetail from "./pages/EscrowDetail";
import Sidebar from "./ui/Sidebar";
import Reputation from "./pages/Reputation";
import Disputes from "./pages/Disputes";
import Landing from "./pages/Landing";

// Web3 Imports (NEW)
import { getEscrowDetails } from "./web3/escrow";
import { fundEscrow as fundEscrowOnChain } from "./web3/escrow";
import { releaseDesign as releaseDesignOnChain } from "./web3/escrow";
import { releaseDevelopment as releaseDevelopmentOnChain } from "./web3/escrow";

// State mapper (NEW)
import { mapStateToLabel } from "./web3/stateMapper";

function App() {
  const [provider, setProvider] = useState(null);

  const [escrows, setEscrows] = useState([]);
  const [selectedEscrow, setSelectedEscrow] = useState(null);
  const [view, setView] = useState("dashboard");

  /* -------------------- LOAD ON-CHAIN ESCROW -------------------- */
  const loadOnChainEscrow = async () => {
    try {
      const d = await getEscrowDetails();
      console.log("🔥 ONCHAIN DETAILS:", d);
      console.log("🔥 totalAmount(ETH):", ethers.formatEther(d.totalAmount));

      const escrowFromChain = {
  id: 1,
  title: "OpenEscrow Contract",
  freelancer: d.seller,

  totalValue: ethers.formatEther(d.totalAmount),
  fundsLocked: ethers.formatEther(d.totalAmount),

  state: mapStateToLabel(d.state),
  createdAt: Date.now(),

  designReleased: d.designReleased,
  developmentReleased: d.developmentReleased,
};


      setEscrows([escrowFromChain]);

      // keep selectedEscrow updated
      setSelectedEscrow((prev) => {
        if (!prev) return escrowFromChain;
        return escrowFromChain;
      });
    } catch (err) {
      console.error("Failed to load on-chain escrow:", err);
    }
  };

  // Load escrow ONLY after wallet connection
  useEffect(() => {
    if (provider) {
      loadOnChainEscrow();
    }
  }, [provider]);

  useEffect(() => {
  if (!provider) return;

  const interval = setInterval(() => {
    loadOnChainEscrow();
  }, 5000); // ✅ refresh every 5 seconds

  return () => clearInterval(interval);
}, [provider]);


  /* -------------------- DISPUTE (UI ONLY FOR NOW) -------------------- */
  const raiseDispute = (escrowId) => {
    setEscrows((prev) =>
      prev.map((e) => (e.id === escrowId ? { ...e, state: "DISPUTED" } : e))
    );

    setSelectedEscrow((prev) =>
      prev && prev.id === escrowId ? { ...prev, state: "DISPUTED" } : prev
    );
  };

  /* -------------------- MILESTONE APPROVAL (ON-CHAIN) -------------------- */
  const approveMilestone = async (escrowId, milestone) => {
  try {
    if (milestone === "design") {
      const receipt = await releaseDesignOnChain();
      alert("Design milestone released ✅ Tx: " + receipt.hash);
    } else if (milestone === "development") {
      const receipt = await releaseDevelopmentOnChain();
      alert("Development milestone released ✅ Tx: " + receipt.hash);
    }

    await loadOnChainEscrow(); // ✅ must refresh
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

  /* -------------------- FUND ESCROW (ON-CHAIN) -------------------- */
  const fundEscrow = async (escrowId, amount) => {
  if (!amount || Number(amount) <= 0) {
    alert("Enter valid amount");
    return;
  }

  try {
    const receipt = await fundEscrowOnChain(amount);
    alert("Funded ✅ Tx: " + receipt.hash);

    // ✅ IMPORTANT: refresh chain state IMMEDIATELY
    await loadOnChainEscrow();

    // ✅ IMPORTANT: go back to detail view to see milestones
    setView("detail");
  } catch (err) {
    console.error("Funding failed:", err);
    alert(err.message);
  }
};



  /* -------------------- DEPLOY ESCROW (UI ONLY / DISABLE FOR NOW) -------------------- */
  const deployEscrow = ({ seller, designPercent, developmentPercent }) => {
  const newEscrow = {
    id: Date.now(),
    title: "New Escrow",
    freelancer: seller,
    designPercent,
    developmentPercent,
    designReleased: false,
    developmentReleased: false,
    totalValue: "0",
    fundsLocked: "0",
    state: "AWAITING_PAYMENT",
    progress: 0,
    createdAt: Date.now(),
  };

  setEscrows((prev) => [newEscrow, ...prev]); // ✅ add to dashboard list
  setSelectedEscrow(newEscrow);
  setView("dashboard"); // ✅ go back and show it in dashboard
};


  /* ------------------ UI ------------------ */
  return (
    <div>
      {/* CONNECT WALLET (only before connection) */}
      {!provider && <Landing setProvider={setProvider} />}

      {provider && (
        <>
          {/* FIXED HEADER */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: "64px",
              background: "linear-gradient(90deg, #020617, #020617)",
              borderBottom: "1px solid #1f2933",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              zIndex: 500,
            }}
          >
            {/* LEFT — LOGO */}
            <div
              style={{
                marginLeft: "84px",
                fontSize: "18px",
                fontWeight: "700",
                color: "#e5e7eb",
              }}
            >
              OpenEscrow
            </div>

            {/* RIGHT — WALLET */}
            <div style={{ color: "#94a3b8", fontSize: "12px" }}>
              Wallet Connected ✅
            </div>
          </div>

          {/* FLOATING SIDEBAR */}
          <Sidebar currentView={view} setView={setView} />

          {/* MAIN CONTENT */}
          <div
            style={{
              marginLeft: "84px",
              paddingTop: "96px",
              paddingLeft: "32px",
              paddingRight: "32px",
              display: "grid",
              placeItems: "centre",
            }}
          >
            {view === "dashboard" && (
              <Dashboard
                escrows={escrows}
                setSelectedEscrow={(e) => {
                  setSelectedEscrow(e);
                  setView("detail");
                }}
              />
            )}

            {view === "create" && <CreateEscrow onDeploy={deployEscrow} />}

            {view === "detail" && (
              <EscrowDetail
                escrow={selectedEscrow}
                onBack={() => setView("dashboard")}
                onRaiseDispute={raiseDispute}
                onApproveMilestone={approveMilestone}
                onFundEscrow={fundEscrow}
              />
            )}

            {view === "reputation" && (
              <Reputation
                escrows={escrows}
                wallet={provider?.provider?.selectedAddress}
              />
            )}

            {view === "disputes" && <Disputes escrows={escrows} />}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
