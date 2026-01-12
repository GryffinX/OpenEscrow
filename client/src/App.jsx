import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import CreateEscrow from "./components/CreateEscrow";
import Dashboard from "./pages/Dashboard";
import EscrowDetail from "./pages/EscrowDetail";
import Sidebar from "./ui/Sidebar";

function App() {
  const [provider, setProvider] = useState(null);
  const [escrows, setEscrows] = useState([]);
  const [selectedEscrow, setSelectedEscrow] = useState(null);
  const [view, setView] = useState("dashboard");
  const [filter, setFilter] = useState("All");
  const raiseDispute = (escrowId) => {
    setEscrows(
      escrows.map((e) =>
        e.id === escrowId ? { ...e, state: "Disputed" } : e
      )
    );

    setSelectedEscrow((prev) =>
      prev && prev.id === escrowId
        ? { ...prev, state: "Disputed" }
        : prev
    );
  };
  const approveMilestone = (escrowId, milestone) => {
  setEscrows(
    escrows.map((e) => {
      if (e.id !== escrowId) return e;

      // Release DESIGN
      if (milestone === "design" && !e.designReleased) {
        return {
          ...e,
          designReleased: true
        };
      }

      // Release DEVELOPMENT
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

  setEscrows(
    escrows.map((e) =>
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

  setEscrows([...escrows, newEscrow]);
  setSelectedEscrow(newEscrow);
  setView("detail");
};



  return (
    <div style={{ padding: "20px" }}>
      <h1>OpenEscrow</h1>

      <ConnectWallet setProvider={setProvider} />

      {provider && (
        <div style={{ display: "flex" }}>
          <Sidebar currentFilter={filter} setFilter={setFilter} />

          <div style={{ flex: 1, padding: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
              <button onClick={() => setView("dashboard")}>Dashboard</button>
              <button onClick={() => setView("create")}>Create Escrow</button>
            </div>

            {view === "dashboard" && (
              <Dashboard
                escrows={escrows}
                filter={filter}
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

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
