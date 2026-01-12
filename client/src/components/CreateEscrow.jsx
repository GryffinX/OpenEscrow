import { useState } from "react";

function CreateEscrow({ onDeploy }) {
  const [seller, setSeller] = useState("");
  const [designPercent, setDesignPercent] = useState(50);
  const [developmentPercent, setDevelopmentPercent] = useState(50);

  const handleDeploy = () => {
    const total = Number(designPercent) + Number(developmentPercent);

    if (total !== 100) {
      alert("Design % + Development % must equal 100");
      return;
    }

    if (designPercent <= 0 || developmentPercent <= 0) {
      alert("Percentages must be greater than 0");
      return;
    }

    onDeploy({
      seller,
      designPercent,
      developmentPercent
    });
  };

  return (
    <div>
      <h2>Create Escrow</h2>

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
        onChange={(e) => setDesignPercent(e.target.value)}
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
    </div>
  );
}

export default CreateEscrow;
