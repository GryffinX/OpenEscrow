import { useState } from "react";
import StatusBadge from "../ui/StatusBadge";

function EscrowDetail({
  escrow,
  onBack,
  onRaiseDispute,
  onApproveMilestone,
  onFundEscrow
}) {
  const [amount, setAmount] = useState("");

  if (!escrow) return null;

  return (
    <div>
      <button onClick={onBack}>← Back</button>

      <h2>Escrow Detail</h2>

      <p><b>Freelancer:</b> {escrow.freelancer}</p>
      <p><b>Design %:</b> {escrow.designPercent}%</p>
      <p><b>Development %:</b> {escrow.developmentPercent}%</p>

      <StatusBadge status={escrow.state} />

      {/* FUND ESCROW */}
      {escrow.state === "AWAITING_PAYMENT" && (
        <div style={{ marginTop: "20px" }}>
          <h3>Fund Escrow</h3>

          <input
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <br /><br />

          <button
            disabled={!amount}
            onClick={() => onFundEscrow(escrow.id, amount)}
          >

            Fund Escrow
          </button>
        </div>
      )}

      {/* MILESTONES */}
      {escrow.state === "FUNDED" && (
        <>
          <h3>Milestones</h3>

          <ul>
            <li>
              Design —{" "}
              {escrow.designReleased ? "✅ Completed" : "⏳ Pending"}

              {!escrow.designReleased && (
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => onApproveMilestone(escrow.id, "design")}
                >
                  Release Design Payment
                </button>
              )}
            </li>

            <li>
              Development —{" "}
              {escrow.developmentReleased ? "✅ Completed" : "⏳ Pending"}

              {escrow.designReleased &&
                !escrow.developmentReleased && (
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() =>
                      onApproveMilestone(escrow.id, "development")
                    }
                  >
                    Release Development Payment
                  </button>
                )}
            </li>
          </ul>

          <button
            style={{
              marginTop: "20px",
              background: "#ef4444",
              color: "#fff"
            }}
            onClick={() => onRaiseDispute(escrow.id)}
          >
            Raise Dispute
          </button>
        </>
      )}
    </div>
  );
}

export default EscrowDetail;
