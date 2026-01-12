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
    <div>
      <h2>Create Escrow</h2>

      {!deployed ? (
        <>
          <input
            placeholder="Freelancer (Seller) Address"
            value={seller}
            onChange={(e) => setSeller(e.target.value)}
          />

          <br /><br />

          <label>Design Milestone (%)</label>
          <input
            type="number"
            value={designPercent}
            onChange={(e) =>
              setDesignPercent(e.target.value)
            }
          />

          <br /><br />

          <label>Development Milestone (%)</label>
          <input
            type="number"
            value={developmentPercent}
            onChange={(e) =>
              setDevelopmentPercent(e.target.value)
            }
          />

          <br /><br />

          <button onClick={handleDeploy}>
            Deploy Escrow Contract
          </button>
        </>
      ) : (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#022c22",
            borderRadius: "8px",
            color: "#22c55e"
          }}
        >
          ✅ Escrow contract deployed successfully  
          <br />
          Awaiting buyer to fund escrow.
        </div>
      )}
    </div>
  );
}

export default CreateEscrow;
