function SidebarButton({ icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "52px",
        height: "52px",
        borderRadius: "14px",
        border: active ? "2px solid #22d3ee" : "1px solid #1f2933",
        background: active ? "#22d3ee" : "#020617",
        color: active ? "#020617" : "#9ca3af",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
        cursor: "pointer",
        transition: "all 0.2s ease"
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1
        }}
      >
        {icon}
      </span>
    </button>
  );
}

export default function Sidebar({ currentView, setView }) {
  return (
    <div
      style={{
      position: "fixed",
      top: "64px",
      left: 0,
      width: "84px",
      height: "calc(100vh - 64px)",
      background: "linear-gradient(180deg, #020617, #020617ee)",
      borderRight: "1px solid #1f2933",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "20px",
      gap: "18px",
      zIndex: 900
    }}
    >

      <SidebarButton
        icon="🏠"
        active={currentView === "dashboard"}
        onClick={() => setView("dashboard")}
      />
      <SidebarButton
        icon="➕"
        active={currentView === "create"}
        onClick={() => setView("create")}
      />
      <SidebarButton
        icon="👤"
        active={currentView === "reputation"}
        onClick={() => setView("reputation")}
      />
      <SidebarButton
        icon="⚠️"
        active={currentView === "disputes"}
        onClick={() => setView("disputes")}
      />
    </div>
  );
}
