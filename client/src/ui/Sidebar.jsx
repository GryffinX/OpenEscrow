"use client"

import { useState } from "react"

function SidebarButton({ icon, label, active, onClick }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          border: active ? "2px solid #06b6d4" : "1px solid rgba(255,255,255,0.08)",
          background: active
            ? "linear-gradient(135deg, #06b6d4, #0891b2)"
            : isHovered
              ? "rgba(6, 182, 212, 0.1)"
              : "#0a0a0f",
          color: active ? "#020617" : isHovered ? "#06b6d4" : "#6b7280",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.25s ease",
          boxShadow: active
            ? "0 0 20px rgba(6, 182, 212, 0.4), 0 4px 12px rgba(0,0,0,0.3)"
            : isHovered
              ? "0 0 15px rgba(6, 182, 212, 0.2)"
              : "none",
          transform: isHovered && !active ? "scale(1.05)" : "scale(1)",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "24px",
            height: "24px",
          }}
        >
          {icon}
        </span>
      </button>

      {/* Tooltip */}
      <div
        style={{
          position: "absolute",
          left: "62px",
          top: "50%",
          transform: `translateY(-50%) ${isHovered ? "translateX(0)" : "translateX(-10px)"}`,
          background: "linear-gradient(135deg, #1a1a24, #0f0f14)",
          border: "1px solid rgba(6, 182, 212, 0.3)",
          borderRadius: "8px",
          padding: "8px 14px",
          fontSize: "13px",
          fontWeight: "500",
          color: "#e5e7eb",
          whiteSpace: "nowrap",
          opacity: isHovered ? 1 : 0,
          pointerEvents: "none",
          transition: "all 0.2s ease",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          letterSpacing: "0.5px",
        }}
      >
        {label}
        {/* Tooltip arrow */}
        <div
          style={{
            position: "absolute",
            left: "-6px",
            top: "50%",
            transform: "translateY(-50%) rotate(45deg)",
            width: "10px",
            height: "10px",
            background: "#1a1a24",
            borderLeft: "1px solid rgba(6, 182, 212, 0.3)",
            borderBottom: "1px solid rgba(6, 182, 212, 0.3)",
          }}
        />
      </div>
    </div>
  )
}

// Professional SVG Icons
const DashboardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const CreateIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
)

const ReputationIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    <path d="M15 5l1.5 1.5L15 8" opacity="0.6" />
  </svg>
)

const DisputesIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" />
  </svg>
)

const SettingsIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
)

export default function Sidebar({ currentView, setView }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "64px",
        left: 0,
        width: "84px",
        height: "calc(100vh - 64px)",
        background: "linear-gradient(180deg, #0a0a0f 0%, #050508 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "24px",
        gap: "16px",
        zIndex: 900,
      }}
    >
      {/* Main Navigation */}
      <SidebarButton
        icon={<DashboardIcon />}
        label="Dashboard"
        active={currentView === "dashboard"}
        onClick={() => setView("dashboard")}
      />
      <SidebarButton
        icon={<CreateIcon />}
        label="Create Escrow"
        active={currentView === "create"}
        onClick={() => setView("create")}
      />
      <SidebarButton
        icon={<ReputationIcon />}
        label="Reputation"
        active={currentView === "reputation"}
        onClick={() => setView("reputation")}
      />
      <SidebarButton
        icon={<DisputesIcon />}
        label="Disputes"
        active={currentView === "disputes"}
        onClick={() => setView("disputes")}
      />

      {/* Divider */}
      <div
        style={{
          width: "36px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent)",
          margin: "8px 0",
        }}
      />

      {/* Settings at bottom */}
      <div style={{ marginTop: "auto", marginBottom: "24px" }}>
        <SidebarButton
          icon={<SettingsIcon />}
          label="Settings"
          active={currentView === "settings"}
          onClick={() => setView("settings")}
        />
      </div>
    </div>
  )
}
