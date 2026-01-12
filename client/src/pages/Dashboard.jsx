import { useState } from "react";

function Dashboard({ escrows, setSelectedEscrow }) {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");


  const filteredEscrows = escrows.filter((e) => {
  const matchesSearch =
    e.freelancer.toLowerCase().includes(search.toLowerCase());

  if (!matchesSearch) return false;

  if (statusFilter === "ALL") return true;

  if (statusFilter === "ACTIVE") {
    return e.state === "AWAITING_PAYMENT" || e.state === "FUNDED";
  }

  return e.state === statusFilter;
});
  const totalValueLocked = escrows
    .filter((e) => e.state === "FUNDED" || e.state === "COMPLETED")
    .reduce((sum, e) => {
      const val = parseFloat(e.totalValue);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  const walletBalance = "— ETH";




  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px" }}>Escrow Registry</h1>
        <p style={{ color: "#9ca3af", fontSize: "14px" }}>
          Protocol Network: <b>Sepolia Testnet</b>
        </p>
      </div>
    <input
      placeholder="Search escrow registry..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "12px",
        background: "#0b1220",
        border: "1px solid #1f2933",
        color: "#fff",
        marginBottom: "20px"
      }}
    />
    <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
      <div className="kpi">
        <p>Total Value Locked</p>
        <h2>{totalValueLocked} ETH</h2>
      </div>

      <div className="kpi">
        <p>Wallet Balance</p>
        <h2>{walletBalance}</h2>
      </div>
    </div>
      {/* FILTER PILLS */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "24px"
        }}
      >
        {["ALL", "ACTIVE", "COMPLETED", "DISPUTED"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              padding: "6px 16px",
              borderRadius: "999px",
              border: "1px solid #1f2933",
              background:
                statusFilter === status ? "#22d3ee" : "transparent",
              color:
                statusFilter === status ? "#000" : "#9ca3af",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {status}
          </button>
        ))}
      </div>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: "6px 12px",
          borderRadius: "8px",
          background: "#0b1220",
          border: "1px solid #1f2933",
          color: "#9ca3af",
          cursor: "pointer"
        }}
      >
        ⟳ Refresh
      </button>


      {/* REGISTRY */}
      {filteredEscrows.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            border: "1px dashed #1f2933",
            borderRadius: "12px",
            color: "#9ca3af"
          }}
        >
          <h3>Genesis Pending</h3>
          <p>No escrows found for this filter.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {filteredEscrows.map((escrow) => (
            <div
              key={escrow.id}
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "#0b1220",
                border: "1px solid #1f2933"
              }}
            >
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "13px",
                  color: "#9ca3af"
                }}
              >
                Freelancer: {escrow.freelancer}
              </p>

              <p style={{ marginTop: "6px" }}>
                Total Value: <b>{escrow.totalValue}</b>
              </p>

              <p style={{ marginTop: "6px" }}>
                Status: <b>{escrow.state}</b>
              </p>

              <button
                style={{
                  marginTop: "12px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  background: "#22d3ee",
                  color: "#000",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
                onClick={() => setSelectedEscrow(escrow)}
              >
                View Escrow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
  