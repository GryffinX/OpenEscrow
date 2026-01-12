import StatusBadge from "./StatusBadge";
import MilestoneList from "./MilestoneList";

function EscrowCard({ escrow, onOpen }) {
  return (
    <div
      style={{
        border: "1px solid #333",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "15px",
        background: "#111"
      }}
    >
      <p><b>Freelancer:</b> {escrow.freelancer}</p>
      <p><b>Total Value:</b> {escrow.totalValue}</p>

      <StatusBadge status={escrow.state === "AWAITING_PAYMENT" && (
        <p style={{ marginTop: "8px", fontStyle: "italic", color: "#aaa" }}>
          Contract deployed. Awaiting buyer to fund escrow.
        </p>
      )}
      />

      <MilestoneList milestones={escrow.milestones} />

      <button
        style={{ marginTop: "10px" }}
        onClick={() => onOpen(escrow)}
      >
        View Escrow
      </button>
    </div>
  );
}

export default EscrowCard;
