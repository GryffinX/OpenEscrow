export function mapStateToLabel(stateNumber) {
  // Update these labels if your contract uses different enums
  const mapping = {
    "0": "AWAITING_PAYMENT",
    "1": "FUNDED",
    "2": "COMPLETED",
    "3": "DISPUTED",
  };

  return mapping[stateNumber] || `UNKNOWN(${stateNumber})`;
}
