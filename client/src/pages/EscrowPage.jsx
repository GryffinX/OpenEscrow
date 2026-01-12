import { useState, useEffect } from "react";
import EscrowDetail from "../components/EscrowDetail";
import {
  fundEscrow,
  releaseDesign,
  releaseDevelopment,
  getEscrowDetails,
} from "../web3/escrow";

function EscrowPage() {
  const [selectedEscrow, setSelectedEscrow] = useState(null);

  useEffect(() => {
    async function loadEscrow() {
      const data = await getEscrowDetails();
      setSelectedEscrow({
        id: 1, // local UI id
        freelancer: data.seller,
        designPercent: 40,
        developmentPercent: 60,
        designReleased: data.designReleased,
        developmentReleased: data.developmentReleased,
        state: mapState(data.state),
      });
    }

    loadEscrow();
  }, []);

  const onFundEscrow = async (id, amount) => {
    await fundEscrow(amount);
    refresh();
  };

  const onApproveMilestone = async (id, type) => {
    if (type === "design") await releaseDesign();
    if (type === "development") await releaseDevelopment();
    refresh();
  };

  const onRaiseDispute = async () => {
    // call raiseDispute() via ethers.js
  };

  return (
    <EscrowDetail
      escrow={selectedEscrow}
      onBack={() => setSelectedEscrow(null)}
      onFundEscrow={onFundEscrow}
      onApproveMilestone={onApproveMilestone}
      onRaiseDispute={onRaiseDispute}
    />
  );
}

export default EscrowPage;
