function Disputes({ escrows }) {
  const disputed = escrows.filter(
    (e) => e.state === "DISPUTED"
  );

  return (
    <div>
      <h2>Dispute Details</h2>

      {disputed.length === 0 ? (
        <p style={{ color: "#9ca3af" }}>
          No disputes found.
        </p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {disputed.map((e) => (
            <div
              key={e.id}
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "#0b1220",
                border: "1px solid #1f2933"
              }}
            >
              <p className="address">
                Freelancer: {e.freelancer}
              </p>
              <p>Total Value: {e.totalValue}</p>
              <p>Status: DISPUTED</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Disputes;
