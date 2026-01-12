function Sidebar({ currentFilter, setFilter }) {
  const items = ["All", "Active", "Disputed", "Completed"];

  return (
    <div
      style={{
        width: "200px",
        padding: "20px",
        borderRight: "1px solid #333",
        height: "100vh"
      }}
    >
      <h3>Filters</h3>

      {items.map((item) => (
        <div
          key={item}
          onClick={() => setFilter(item)}
          style={{
            padding: "8px",
            cursor: "pointer",
            backgroundColor:
              currentFilter === item ? "#22c55e" : "transparent",
            color: currentFilter === item ? "#000" : "#fff",
            marginBottom: "5px",
            borderRadius: "6px"
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
