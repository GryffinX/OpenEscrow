import { useState } from "react";

function CreateEscrow({ onDeploy }) {
  const [seller, setSeller] = useState("");
  const [designPercent, setDesignPercent] = useState(50);
  const [developmentPercent, setDevelopmentPercent] = useState(50);
  const [deployed, setDeployed] = useState(false);

  const handleDeploy = () => {
    const total =
      Number(designPercent) + Number(developmentPercent);

    if (total !== 100) {
      alert("Design % + Development % must equal 100");
      return;
    }

    if (!seller) {
      alert("Enter seller address");
      return;
    }

    onDeploy({
      seller,
      designPercent,
      developmentPercent
    });

    setDeployed(true);
  };

  return (
    /* STEP 1 — CENTER WRAPPER */
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "48px"
      }}
    >
      {/* STEP 2 — CARD CONTAINER */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          margin: "0 auto",
          background: "#020617",
          border: "1px solid #1f2933",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Create Escrow
        </h2>

        {!deployed ? (
          <>
            <input
              placeholder="Freelancer (Seller) Address"
              value={seller}
              onChange={(e) => setSeller(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "16px",
                borderRadius: "8px",
                border: "1px solid #1f2933",
                background: "#020617",
                color: "#e5e7eb"
              }}
            />

            <label>Design Milestone (%)</label>
            <input
              type="number"
              value={designPercent}
              onChange={(e) =>
                setDesignPercent(e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                marginBottom: "16px",
                borderRadius: "8px",
                border: "1px solid #1f2933",
                background: "#020617",
                color: "#e5e7eb"
              }}
            />

            <label>Development Milestone (%)</label>
            <input
              type="number"
              value={developmentPercent}
              onChange={(e) =>
                setDevelopmentPercent(e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                marginBottom: "20px",
                borderRadius: "8px",
                border: "1px solid #1f2933",
                background: "#020617",
                color: "#e5e7eb"
              }}
            />

            <button
              onClick={handleDeploy}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                background: "#22d3ee",
                color: "#020617",
                fontWeight: "600",
                border: "none",
                cursor: "pointer"
              }}
            >
              Deploy Escrow Contract
            </button>
          </>
        ) : (
          <div
            style={{
              marginTop: "12px",
              padding: "16px",
              background: "#022c22",
              borderRadius: "10px",
              color: "#22c55e",
              textAlign: "center"
            }}
          >
            ✅ Escrow contract deployed successfully  
            <br />
            Awaiting buyer to fund escrow.
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateEscrow;
