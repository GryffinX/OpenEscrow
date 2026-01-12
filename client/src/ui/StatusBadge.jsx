 function StatusBadge({ status }) {
  const colors = {
    AWAITING_PAYMENT: "#f59e0b", // amber
    FUNDED: "#22c55e",           // green
    COMPLETED: "#16a34a",        // dark green
    DISPUTED: "#ef4444"          // red
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "8px",
        backgroundColor: colors[status] || "#999",
        color: "#000",
        fontSize: "12px",
        fontWeight: "bold"
      }}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default StatusBadge;
