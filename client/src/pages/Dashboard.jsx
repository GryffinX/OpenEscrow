import EscrowCard from "../ui/EscrowCard";

function Dashboard({ escrows, setSelectedEscrow, filter }) {
  const filteredEscrows = escrows.filter((e) => {
    if (filter === "All") return true;
    return e.state === filter;
  });

  if (filteredEscrows.length === 0) {
    return <p>No escrows found</p>;
  }

  return (
    <div>
      <h2>Dashboard</h2>

      {filteredEscrows.map((e) => (
        <EscrowCard
          key={e.id}
          escrow={e}
          onOpen={setSelectedEscrow}
        />
      ))}
    </div>
  );
}

export default Dashboard;
