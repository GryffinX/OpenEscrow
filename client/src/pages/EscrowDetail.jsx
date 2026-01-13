"use client"

import { useState } from "react"

function EscrowDetail({ escrow, onBack, onRaiseDispute, onApproveMilestone, onFundEscrow }) {
  const [amount, setAmount] = useState("")
  const [hoveredButton, setHoveredButton] = useState(null)
  const [showDisputeModal, setShowDisputeModal] = useState(false)

  if (!escrow) return null
  const isFunded = Number(escrow?.totalValue || 0) > 0;


  const truncateAddress = (addr) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "FUNDED":
        return { bg: "rgba(34, 197, 94, 0.15)", text: "#22c55e", border: "rgba(34, 197, 94, 0.3)" }
      case "AWAITING_PAYMENT":
        return { bg: "rgba(234, 179, 8, 0.15)", text: "#eab308", border: "rgba(234, 179, 8, 0.3)" }
      case "COMPLETED":
        return { bg: "rgba(6, 182, 212, 0.15)", text: "#06b6d4", border: "rgba(6, 182, 212, 0.3)" }
      case "DISPUTED":
        return { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444", border: "rgba(239, 68, 68, 0.3)" }
      default:
        return { bg: "rgba(107, 114, 128, 0.15)", text: "#6b7280", border: "rgba(107, 114, 128, 0.3)" }
    }
  }

  const statusColors = getStatusColor(escrow.state)

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#0a0a0f",
      padding: "48px 24px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    wrapper: {
      maxWidth: "800px",
      margin: "0 auto",
    },
    backButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      background: "transparent",
      border: "none",
      color: "#6b7280",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      padding: "8px 0",
      marginBottom: "32px",
      transition: "color 0.2s ease",
    },
    headerCard: {
      background: "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, transparent 50%)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "16px",
      padding: "28px",
      marginBottom: "24px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    titleSection: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    title: {
      color: "#ffffff",
      fontSize: "24px",
      fontWeight: "700",
      margin: "0",
      letterSpacing: "-0.02em",
    },
    subtitle: {
      color: "#6b7280",
      fontSize: "13px",
      margin: "0",
      fontFamily: "'SF Mono', 'Fira Code', monospace",
      textTransform: "uppercase",
    },
    statusBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      backgroundColor: statusColors.bg,
      color: statusColors.text,
      border: `1px solid ${statusColors.border}`,
    },
    statusDot: {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      backgroundColor: statusColors.text,
      boxShadow: `0 0 8px ${statusColors.text}`,
    },
    card: {
      backgroundColor: "rgba(17, 17, 22, 0.6)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      borderRadius: "16px",
      padding: "28px",
      marginBottom: "20px",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px",
    },
    infoItem: {
      padding: "20px",
      backgroundColor: "rgba(10, 10, 15, 0.8)",
      borderRadius: "12px",
      border: "1px solid rgba(255, 255, 255, 0.04)",
    },
    infoLabel: {
      color: "#6b7280",
      fontSize: "10px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: "8px",
    },
    infoValue: {
      color: "#ffffff",
      fontSize: "20px",
      fontWeight: "700",
      fontFamily: "'SF Mono', 'Fira Code', monospace",
    },
    infoValueSmall: {
      color: "#ffffff",
      fontSize: "13px",
      fontWeight: "500",
      fontFamily: "'SF Mono', 'Fira Code', monospace",
    },
    sectionTitle: {
      color: "#ffffff",
      fontSize: "13px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: "20px",
    },
    milestoneCard: {
      backgroundColor: "rgba(10, 10, 15, 0.8)",
      border: "1px solid rgba(255, 255, 255, 0.04)",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "12px",
    },
    milestoneHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    milestoneName: {
      color: "#ffffff",
      fontSize: "15px",
      fontWeight: "600",
    },
    milestoneStatus: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "12px",
      fontWeight: "500",
    },
    progressBar: {
      height: "6px",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: "3px",
      overflow: "hidden",
      marginBottom: "12px",
    },
    progressFill: {
      height: "100%",
      borderRadius: "3px",
      transition: "width 0.5s ease",
    },
    milestoneInfo: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    milestonePercent: {
      color: "#6b7280",
      fontSize: "13px",
    },
    releaseButton: {
      padding: "8px 16px",
      backgroundColor: "transparent",
      border: "1px solid #06b6d4",
      borderRadius: "8px",
      color: "#06b6d4",
      fontSize: "11px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    inputLabel: {
      color: "#6b7280",
      fontSize: "10px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: "8px",
      display: "block",
    },
    inputWrapper: {
      position: "relative",
    },
    input: {
      width: "100%",
      padding: "14px 50px 14px 16px",
      backgroundColor: "rgba(10, 10, 15, 0.8)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "10px",
      color: "#ffffff",
      fontSize: "16px",
      fontFamily: "'SF Mono', 'Fira Code', monospace",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.2s ease",
    },
    inputSuffix: {
      position: "absolute",
      right: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#6b7280",
      fontSize: "13px",
      fontWeight: "600",
    },
    fundButton: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#06b6d4",
      border: "none",
      borderRadius: "10px",
      color: "#000000",
      fontSize: "13px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      cursor: "pointer",
      marginTop: "16px",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    disputeButton: {
      width: "100%",
      padding: "14px",
      backgroundColor: "transparent",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      borderRadius: "10px",
      color: "#ef4444",
      fontSize: "12px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      cursor: "pointer",
      marginTop: "20px",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      backdropFilter: "blur(8px)",
    },
    modalCard: {
      backgroundColor: "#111116",
      border: "1px solid rgba(6, 182, 212, 0.2)",
      borderRadius: "16px",
      padding: "40px",
      maxWidth: "400px",
      width: "90%",
      textAlign: "center",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
    },
    modalIconWrapper: {
      width: "72px",
      height: "72px",
      borderRadius: "50%",
      backgroundColor: "rgba(6, 182, 212, 0.1)",
      border: "1px solid rgba(6, 182, 212, 0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 24px",
    },
    modalTitle: {
      color: "#ffffff",
      fontSize: "20px",
      fontWeight: "700",
      marginBottom: "12px",
      letterSpacing: "-0.02em",
    },
    modalText: {
      color: "#9ca3af",
      fontSize: "15px",
      lineHeight: "1.6",
      marginBottom: "28px",
    },
    modalButton: {
      padding: "14px 32px",
      backgroundColor: "#06b6d4",
      border: "none",
      borderRadius: "10px",
      color: "#000000",
      fontSize: "14px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
  }

  return (
    <>
      <div style={styles.container}>
        <div style={styles.wrapper}>
          {/* Back Button */}
          <button
            style={{
              ...styles.backButton,
              color: hoveredButton === "back" ? "#06b6d4" : "#6b7280",
            }}
            onClick={onBack}
            onMouseEnter={() => setHoveredButton("back")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Header Card */}
          <div style={styles.headerCard}>
            <div style={styles.header}>
              <div style={styles.titleSection}>
                <h1 style={styles.title}>Escrow Detail</h1>
                <p style={styles.subtitle}>{truncateAddress(escrow.freelancer)}</p>
              </div>
              <div style={styles.statusBadge}>
                <span style={styles.statusDot} />
                {escrow.state?.replace("_", " ")}
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div style={styles.card}>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Freelancer</div>
                <div style={styles.infoValueSmall}>{truncateAddress(escrow.freelancer)}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Design %</div>
                <div style={styles.infoValue}>{escrow.designPercent}%</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Development %</div>
                <div style={styles.infoValue}>{escrow.developmentPercent}%</div>
              </div>
            </div>
          </div>

        {/* Fund Escrow Section */}
        {!isFunded && (
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Fund Escrow</h3>
            <div style={styles.inputWrapper}>
              <label style={styles.inputLabel}>Amount</label>
              <input
                style={{
                  ...styles.input,
                  borderColor: amount ? "rgba(6, 182, 212, 0.3)" : "rgba(255, 255, 255, 0.08)",
                }}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <span style={styles.inputSuffix}>SHM</span>
            </div>
            <button
              style={{
                ...styles.fundButton,
                opacity: !amount ? 0.5 : 1,
                cursor: !amount ? "not-allowed" : "pointer",
              }}
              disabled={!amount}
              onClick={() => onFundEscrow(escrow.id, amount)}
            >
              Fund Escrow
            </button>
          </div>
        )}

        {/* Milestones Section */}
        {isFunded && (
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Milestones</h3>

              {/* Design Milestone */}
              <div style={styles.milestoneCard}>
                <div style={styles.milestoneHeader}>
                  <span style={styles.milestoneName}>Design</span>
                  <span
                    style={{
                      ...styles.milestoneStatus,
                      color: escrow.designReleased ? "#22c55e" : "#eab308",
                    }}
                  >
                    {escrow.designReleased ? "✓ Completed" : "⏳ Pending"}
                  </span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: escrow.designReleased ? "100%" : "0%",
                      backgroundColor: escrow.designReleased ? "#22c55e" : "#06b6d4",
                    }}
                  />
                </div>
                <div style={styles.milestoneInfo}>
                  <span style={styles.milestonePercent}>{escrow.designPercent}% of funds</span>
                  {!escrow.designReleased && (
                    <button
                      style={{
                        ...styles.releaseButton,
                        backgroundColor: hoveredButton === "design" ? "#06b6d4" : "transparent",
                        color: hoveredButton === "design" ? "#000" : "#06b6d4",
                      }}
                      onClick={() => onApproveMilestone(escrow.id, "design")}
                      onMouseEnter={() => setHoveredButton("design")}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      Release Design Payment
                    </button>
                  )}
                </div>
              </div>

              {/* Development Milestone */}
              <div style={styles.milestoneCard}>
                <div style={styles.milestoneHeader}>
                  <span style={styles.milestoneName}>Development</span>
                  <span
                    style={{
                      ...styles.milestoneStatus,
                      color: escrow.developmentReleased ? "#22c55e" : "#eab308",
                    }}
                  >
                    {escrow.developmentReleased ? "✓ Completed" : "⏳ Pending"}
                  </span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: escrow.developmentReleased ? "100%" : "0%",
                      backgroundColor: escrow.developmentReleased ? "#22c55e" : "#06b6d4",
                    }}
                  />
                </div>
                <div style={styles.milestoneInfo}>
                  <span style={styles.milestonePercent}>{escrow.developmentPercent}% of funds</span>
                  {escrow.designReleased && !escrow.developmentReleased && (
                    <button
                      style={{
                        ...styles.releaseButton,
                        backgroundColor: hoveredButton === "dev" ? "#06b6d4" : "transparent",
                        color: hoveredButton === "dev" ? "#000" : "#06b6d4",
                      }}
                      onClick={() => onApproveMilestone(escrow.id, "development")}
                      onMouseEnter={() => setHoveredButton("dev")}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      Release Development Payment
                    </button>
                  )}
                </div>
              </div>

              {/* Dispute Button */}
              <button
                style={{
                  ...styles.disputeButton,
                  backgroundColor: hoveredButton === "dispute" ? "rgba(239, 68, 68, 0.1)" : "transparent",
                }}
                onClick={() => {
                  onRaiseDispute(escrow.id)
                  setShowDisputeModal(true)
                }}
                onMouseEnter={() => setHoveredButton("dispute")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Raise Dispute
              </button>
            </div>
          )}
        </div>
      </div>

      {showDisputeModal && (
        <div style={styles.modalOverlay} onClick={() => setShowDisputeModal(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalIconWrapper}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 style={styles.modalTitle}>Dispute Raised</h3>
            <p style={styles.modalText}>
              Dispute Evidence is handled privately via{" "}
              <span style={{ color: "#06b6d4", fontWeight: "600" }}>Inco</span>
            </p>
            <button
              style={styles.modalButton}
              onClick={() => setShowDisputeModal(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0891b2"
                e.currentTarget.style.transform = "scale(1.02)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#06b6d4"
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default EscrowDetail
