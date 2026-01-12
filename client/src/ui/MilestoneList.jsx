function MilestoneList({ milestones }) {
  return (
    <ul style={{ marginTop: "10px" }}>
      {milestones.map((m) => (
        <li key={m.id} style={{ marginBottom: "6px" }}>
          {m.title} —{" "}
          {m.status === "Completed" ? "✅ Completed" : "⏳ Pending"}
        </li>
      ))}
    </ul>
  );
}

export default MilestoneList;

