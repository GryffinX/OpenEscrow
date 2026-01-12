import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import CreateEscrow from "./components/CreateEscrow";
import Dashboard from "./pages/Dashboard";
import EscrowDetail from "./pages/EscrowDetail";
import Sidebar from "./ui/Sidebar";
import Reputation from "./pages/Reputation";
import Disputes from "./pages/Disputes";
import Landing from "./pages/Landing";

function App() {
  const [provider, setProvider] = useState(null);
  const [escrows, setEscrows] = useState([]);
  const [selectedEscrow, setSelectedEscrow] = useState(null);
  const [view, setView] = useState("dashboard");

  const raiseDispute = (escrowId) => {
    setEscrows((prev) =>
      prev.map((e) =>
        e.id === escrowId ? { ...e, state: "DISPUTED" } : e
      )
    );

    setSelectedEscrow((prev) =>
      prev && prev.id === escrowId
        ? { ...prev, state: "DISPUTED" }
        : prev
    );
  };

  const approveMilestone = (escrowId, milestone) => {
    setEscrows((prev) =>
      prev.map((e) => {
        if (e.id !== escrowId) return e;

        if (milestone === "design" && !e.designReleased) {
          return { ...e, designReleased: true };
        }

        if (
          milestone === "development" &&
          e.designReleased &&
          !e.developmentReleased
        ) {
          return {
            ...e,
            developmentReleased: true,
            state: "COMPLETED"
          };
        }

        return e;
      })
    );

    setSelectedEscrow((prev) => {
      if (!prev || prev.id !== escrowId) return prev;

      if (milestone === "design" && !prev.designReleased) {
        return { ...prev, designReleased: true };
      }

      if (
        milestone === "development" &&
        prev.designReleased &&
        !prev.developmentReleased
      ) {
        return {
          ...prev,
          developmentReleased: true,
          state: "COMPLETED"
        };
      }

      return prev;
    });
  };

  const fundEscrow = (escrowId, amount) => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid ETH amount");
      return;
    }

    setEscrows((prev) =>
      prev.map((e) =>
        e.id === escrowId
          ? {
              ...e,
              totalValue: amount + " ETH",
              state: "FUNDED"
            }
          : e
      )
    );

    setSelectedEscrow((prev) =>
      prev && prev.id === escrowId
        ? { ...prev, totalValue: amount + " ETH", state: "FUNDED" }
        : prev
    );
  };

  const deployEscrow = ({
    seller,
    designPercent,
    developmentPercent
  }) => {
    const newEscrow = {
      id: Date.now(),
      freelancer: seller,
      designPercent,
      developmentPercent,
      designReleased: false,
      developmentReleased: false,
      totalValue: "0 ETH",
      state: "AWAITING_PAYMENT"
    };

    setEscrows((prev) => [...prev, newEscrow]);
    setSelectedEscrow(newEscrow);
    setView("detail");
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
            zIndex: 500
            }}
          >
  {/* LEFT — LOGO */}
  <div
    style={{
      marginLeft: "84px",
      fontSize: "18px",
      fontWeight: "700",
      color: "#e5e7eb"
    }}
  >
    OpenEscrow
  </div>

  {/* RIGHT — WALLET */}
  
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
            display:"grid",
            placeItems:"centre"
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

            {view === "create" && (
              <CreateEscrow onDeploy={deployEscrow} />
            )}

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

            {view === "disputes" && (
              <Disputes escrows={escrows} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
