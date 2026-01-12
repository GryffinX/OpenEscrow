function Reputation({ escrows, wallet }) {
  const completed = escrows.filter(
    (e) => e.state === "COMPLETED"
  );
  const disputed = escrows.filter(
    (e) => e.state === "DISPUTED"
  );

  const score = completed.length * 10 - disputed.length * 5;

  return (
    <div>
      <h2>Reputation</h2>

      <p>
        <b>Wallet:</b>{" "}
        {wallet || "Connect wallet"}
      </p>

      <h3>Reputation Score</h3>
      <div
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: score >= 0 ? "#22c55e" : "#ef4444"
        }}
      >
        {score}
      </div>

      <h3>Summary</h3>
      <ul>
        <li>Completed Escrows: {completed.length}</li>
        <li>Disputed Escrows: {disputed.length}</li>
      </ul>

      <h3>History</h3>
      <ul>
        {escrows.map((e) => (
          <li key={e.id}>
            {e.freelancer.slice(0, 6)}... —{" "}
            <b>{e.state}</b>
          </li>
        ))}
      </ul>

      <p style={{ marginTop: "20px", fontStyle: "italic" }}>
        Reputation is derived from escrow outcomes and is
        portable across platforms.
      </p>
    </div>
  );
}

export default Reputation;
