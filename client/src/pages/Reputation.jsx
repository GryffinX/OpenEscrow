"use client"

import { useState } from "react"

function Reputation({ escrows = [], wallet }) {
  const [copied, setCopied] = useState(false)

  const completed = escrows.filter((e) => e.state === "COMPLETED")
  const disputed = escrows.filter((e) => e.state === "DISPUTED")
  const totalVolume = escrows.reduce((acc, e) => acc + (Number.parseFloat(e.amount) || 0), 0)
  const successRate = escrows.length > 0 ? Math.round((completed.length / escrows.length) * 100) : 100

  const score = Math.max(0, completed.length * 10 - disputed.length * 5)

  const copyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Calculate stroke dasharray for circular progress
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const maxScore = 100
  const progress = Math.min(score / maxScore, 1)
  const strokeDashoffset = circumference - progress * circumference

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#080808",
        color: "#ffffff",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Main Content */}
      <main style={{ padding: "48px 32px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Score Circle */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ position: "relative", width: "220px", height: "220px", margin: "0 auto 32px" }}>
            <svg width="220" height="220" style={{ transform: "rotate(-90deg)" }}>
              {/* Background circle */}
              <circle cx="110" cy="110" r={radius} fill="none" stroke="#1a1a1a" strokeWidth="8" />
              {/* Progress circle */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke="#0d9488"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            {/* Score number */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "64px",
                fontWeight: "300",
                color: "#ffffff",
              }}
            >
              {score}
            </div>
          </div>

          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              margin: "0 0 12px 0",
              letterSpacing: "-0.5px",
            }}
          >
            Protocol Reputation
          </h1>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              color: "#666",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {wallet || "0X2D286B58F3EEB485A712EB67FD26554A2354EB21"}
          </p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* Volume */}
          <div
            style={{
              backgroundColor: "#0f0f0f",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              <span style={{ fontSize: "12px", color: "#666", letterSpacing: "1px", fontWeight: "500" }}>
                VOLUME (ETH)
              </span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: "500", fontFamily: "monospace" }}>{totalVolume.toFixed(2)}</div>
          </div>

          {/* Success Rate */}
          <div
            style={{
              backgroundColor: "#0f0f0f",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06-.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
              <span style={{ fontSize: "12px", color: "#666", letterSpacing: "1px", fontWeight: "500" }}>
                SUCCESS RATE
              </span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: "500", fontFamily: "monospace" }}>{successRate}%</div>
          </div>

          {/* Completed */}
          <div
            style={{
              backgroundColor: "#0f0f0f",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span style={{ fontSize: "12px", color: "#666", letterSpacing: "1px", fontWeight: "500" }}>
                COMPLETED
              </span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: "500", fontFamily: "monospace" }}>{completed.length}</div>
          </div>

          {/* Disputes */}
          <div
            style={{
              backgroundColor: "#0f0f0f",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ fontSize: "12px", color: "#666", letterSpacing: "1px", fontWeight: "500" }}>DISPUTES</span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: "500", fontFamily: "monospace" }}>{disputed.length}</div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "16px",
          }}
        >
          {/* Activity Pulse */}
          <div
            style={{
              backgroundColor: "#0f0f0f",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              padding: "24px",
              minHeight: "200px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              <span style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "1px" }}>ACTIVITY PULSE</span>
            </div>

            {escrows.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {escrows.slice(0, 5).map((e, index) => (
                  <div
                    key={e.id || index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px",
                      backgroundColor: "#151515",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#888" }}>
                      {e.freelancer ? `${e.freelancer.slice(0, 6)}...${e.freelancer.slice(-4)}` : "Unknown"}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        backgroundColor:
                          e.state === "COMPLETED"
                            ? "rgba(16, 185, 129, 0.15)"
                            : e.state === "DISPUTED"
                              ? "rgba(239, 68, 68, 0.15)"
                              : "rgba(13, 148, 136, 0.15)",
                        color: e.state === "COMPLETED" ? "#10b981" : e.state === "DISPUTED" ? "#ef4444" : "#0d9488",
                      }}
                    >
                      {e.state}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "120px",
                  color: "#444",
                  fontSize: "14px",
                }}
              >
                No recent activity
              </div>
            )}
          </div>

          {/* Achievements */}
          <div
            style={{
              backgroundColor: "#0f0f0f",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              padding: "24px",
              minHeight: "200px",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "1px" }}>ACHIEVEMENTS</span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "120px",
                color: "#444",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {score >= 50 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "rgba(13, 148, 136, 0.15)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                  </div>
                  <span style={{ color: "#0d9488", fontWeight: "500" }}>Trusted Contractor</span>
                </div>
              ) : (
                "Complete escrows to earn badges"
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Toast for copy */}
      {copied && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: "#0d9488",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Address copied!
        </div>
      )}
    </div>
  )
}

export default Reputation
