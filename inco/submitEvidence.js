import { submitEvidence } from "./inco/submitEvidence";

async function handleDesignApproval() {
  const evidence = prompt("Describe design completion (private)");

  const approved = await submitEvidence(evidence);

  if (!approved) {
    alert("Evidence rejected by confidential compute");
    return;
  }

  // Call your escrow contract ONLY AFTER Inco approval
  await escrow.releaseDesignMilestone();
}
