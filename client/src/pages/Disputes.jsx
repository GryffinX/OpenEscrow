"use client"

import { useState, useRef } from "react"

function Disputes({ escrows }) {
  const [selectedDispute, setSelectedDispute] = useState(null)
  const [viewDetailsModal, setViewDetailsModal] = useState(null)
  const [evidenceModal, setEvidenceModal] = useState(null)
  const [respondModal, setRespondModal] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [responseText, setResponseText] = useState("")
  const [evidenceDescription, setEvidenceDescription] = useState("")
  const fileInputRef = useRef(null)

  const disputed = escrows.filter((e) => e.state === "DISPUTED")

  const truncateAddress = (address) => {
  if (typeof address !== "string") return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const newFiles = files.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      type: file.type,
      file: file,
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const newFiles = files.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      type: file.type,
      file: file,
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitEvidence = () => {
    // Basic submit logic - in real app, would upload to IPFS/server
    console.log("Submitting evidence:", { files: uploadedFiles, description: evidenceDescription })
    alert(`Evidence submitted successfully!\n${uploadedFiles.length} file(s) uploaded.`)
    setUploadedFiles([])
    setEvidenceDescription("")
    setEvidenceModal(null)
  }

  const handleSubmitResponse = () => {
    console.log("Submitting response:", responseText)
    alert("Response submitted successfully!")
    setResponseText("")
    setRespondModal(null)
  }

  const containerStyle = {
    minHeight: "100vh",
    background: "#0a0a0f",
    padding: "40px 24px",
  }

  const contentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
  }

  const headerStyle = {
    marginBottom: "32px",
  }

  const headerTitleContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "8px",
  }

  const headerIconStyle = {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const headerTitleStyle = {
    fontSize: "28px",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.5px",
  }

  const headerSubtitleStyle = {
    fontSize: "14px",
    color: "#6b7280",
    letterSpacing: "0.5px",
  }

  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  }

  const statCardStyle = {
    padding: "20px",
    borderRadius: "12px",
    background: "#111118",
    border: "1px solid #1a1a24",
  }

  const statLabelStyle = {
    fontSize: "11px",
    fontWeight: "500",
    color: "#6b7280",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }

  const statValueStyle = {
    fontSize: "24px",
    fontWeight: "600",
    color: "#ffffff",
  }

  const emptyStateStyle = {
    padding: "80px 40px",
    borderRadius: "16px",
    background: "#111118",
    border: "1px solid #1a1a24",
    textAlign: "center",
  }

  const emptyIconStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.02))",
    border: "1px solid rgba(6, 182, 212, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
  }

  const emptyTitleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "8px",
  }

  const emptyTextStyle = {
    fontSize: "14px",
    color: "#6b7280",
  }

  const disputesGridStyle = {
    display: "grid",
    gap: "16px",
  }

  const disputeCardStyle = {
    padding: "24px",
    borderRadius: "16px",
    background: "#111118",
    border: "1px solid #1a1a24",
    transition: "all 0.2s ease",
    cursor: "pointer",
  }

  const disputeCardHoverStyle = {
    ...disputeCardStyle,
    borderColor: "rgba(239, 68, 68, 0.3)",
    background: "#14141c",
  }

  const disputeHeaderStyle = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "20px",
  }

  const disputeTitleContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }

  const disputeIconStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const disputeTitleStyle = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
  }

  const disputeIdStyle = {
    fontSize: "12px",
    color: "#6b7280",
    fontFamily: "monospace",
    marginTop: "2px",
  }

  const statusBadgeStyle = {
    padding: "6px 12px",
    borderRadius: "20px",
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    fontSize: "11px",
    fontWeight: "600",
    color: "#ef4444",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }

  const statusDotStyle = {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#ef4444",
    boxShadow: "0 0 8px rgba(239, 68, 68, 0.6)",
    animation: "pulse 2s infinite",
  }

  const disputeInfoGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  }

  const infoItemStyle = {
    padding: "16px",
    borderRadius: "10px",
    background: "#0a0a0f",
    border: "1px solid #1a1a24",
  }

  const infoLabelStyle = {
    fontSize: "10px",
    fontWeight: "500",
    color: "#6b7280",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }

  const infoValueStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#ffffff",
    fontFamily: "monospace",
  }

  const infoValueEthStyle = {
    ...infoValueStyle,
    color: "#06b6d4",
    fontFamily: "inherit",
    fontWeight: "600",
  }

  const actionsContainerStyle = {
    display: "flex",
    gap: "12px",
    paddingTop: "16px",
    borderTop: "1px solid #1a1a24",
  }

  const primaryButtonStyle = {
    flex: 1,
    padding: "12px 20px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #06b6d4, #0891b2)",
    border: "none",
    color: "#000000",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  }

  const secondaryButtonStyle = {
    flex: 1,
    padding: "12px 20px",
    borderRadius: "10px",
    background: "transparent",
    border: "1px solid #2a2a36",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  }

  const warningButtonStyle = {
    flex: 1,
    padding: "12px 20px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))",
    border: "1px solid rgba(245, 158, 11, 0.4)",
    color: "#f59e0b",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  }

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  }

  const modalContentStyle = {
    background: "#111118",
    borderRadius: "20px",
    border: "1px solid #1a1a24",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflow: "auto",
  }

  const modalHeaderStyle = {
    padding: "24px",
    borderBottom: "1px solid #1a1a24",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }

  const modalTitleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }

  const modalCloseButtonStyle = {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "#0a0a0f",
    border: "1px solid #1a1a24",
    color: "#6b7280",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  }

  const modalBodyStyle = {
    padding: "24px",
  }

  const dropZoneStyle = {
    padding: "40px",
    borderRadius: "12px",
    border: "2px dashed #2a2a36",
    background: "#0a0a0f",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "20px",
  }

  const dropZoneActiveStyle = {
    ...dropZoneStyle,
    borderColor: "#06b6d4",
    background: "rgba(6, 182, 212, 0.05)",
  }

  const uploadIconStyle = {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.05))",
    border: "1px solid rgba(6, 182, 212, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  }

  const fileListStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
  }

  const fileItemStyle = {
    padding: "12px 16px",
    borderRadius: "10px",
    background: "#0a0a0f",
    border: "1px solid #1a1a24",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }

  const textareaStyle = {
    width: "100%",
    minHeight: "120px",
    padding: "16px",
    borderRadius: "12px",
    background: "#0a0a0f",
    border: "1px solid #1a1a24",
    color: "#ffffff",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
    marginBottom: "20px",
  }

  const detailRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #1a1a24",
  }

  const detailLabelStyle = {
    fontSize: "13px",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  }

  const detailValueStyle = {
    fontSize: "14px",
    color: "#ffffff",
    fontFamily: "monospace",
  }

  // Calculate stats
  const totalDisputedValue = disputed.reduce((sum, e) => {
    const value = Number.parseFloat(e.totalValue) || 0
    return sum + value
  }, 0)

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>

      <div style={contentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={headerTitleContainerStyle}>
            <div style={headerIconStyle}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h1 style={headerTitleStyle}>Dispute Center</h1>
          </div>
          <p style={headerSubtitleStyle}>MANAGE AND RESOLVE ACTIVE DISPUTES</p>
        </div>

        {/* Stats Grid */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statLabelStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
              ACTIVE DISPUTES
            </div>
            <div style={{ ...statValueStyle, color: "#ef4444" }}>{disputed.length}</div>
          </div>

          <div style={statCardStyle}>
            <div style={statLabelStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              PENDING RESOLUTION
            </div>
            <div style={statValueStyle}>{disputed.length}</div>
          </div>

          <div style={statCardStyle}>
            <div style={statLabelStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              TOTAL VALUE LOCKED
            </div>
            <div style={{ ...statValueStyle, color: "#06b6d4" }}>{totalDisputedValue.toFixed(4)} ETH</div>
          </div>
        </div>

        {/* Disputes List */}
        {disputed.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={emptyIconStyle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 style={emptyTitleStyle}>No Active Disputes</h3>
            <p style={emptyTextStyle}>All escrows are running smoothly. No disputes to resolve at this time.</p>
          </div>
        ) : (
          <div style={disputesGridStyle}>
            {disputed.map((e, index) => (
              <div
                key={e.id}
                style={selectedDispute === e.id ? disputeCardHoverStyle : disputeCardStyle}
                onMouseEnter={() => setSelectedDispute(e.id)}
                onMouseLeave={() => setSelectedDispute(null)}
              >
                {/* Card Header */}
                <div style={disputeHeaderStyle}>
                  <div style={disputeTitleContainerStyle}>
                    <div style={disputeIconStyle}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <div>
                      <div style={disputeTitleStyle}>{e.title || `Dispute #${index + 1}`}</div>
                      <div style={disputeIdStyle}>ID: {e.id ? truncateAddress(e.id) : `DSP-${index + 1}`}</div>
                    </div>
                  </div>
                  <div style={statusBadgeStyle}>
                    <div style={statusDotStyle}></div>
                    DISPUTED
                  </div>
                </div>

                {/* Info Grid */}
                <div style={disputeInfoGridStyle}>
                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      FREELANCER
                    </div>
                    <div style={infoValueStyle}>{truncateAddress(e.freelancer)}</div>
                  </div>

                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      TOTAL VALUE
                    </div>
                    <div style={infoValueEthStyle}>{e.totalValue} ETH</div>
                  </div>

                  <div style={infoItemStyle}>
                    <div style={infoLabelStyle}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      TIME IN DISPUTE
                    </div>
                    <div style={infoValueStyle}>{e.disputeTime || "2d 14h"}</div>
                  </div>
                </div>

                {/* Actions */}
                <div style={actionsContainerStyle}>
                  <button
                    style={primaryButtonStyle}
                    onClick={() => setViewDetailsModal(e)}
                    onMouseEnter={(ev) => {
                      ev.target.style.transform = "translateY(-2px)"
                      ev.target.style.boxShadow = "0 4px 20px rgba(6, 182, 212, 0.3)"
                    }}
                    onMouseLeave={(ev) => {
                      ev.target.style.transform = "translateY(0)"
                      ev.target.style.boxShadow = "none"
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    VIEW DETAILS
                  </button>
                  <button
                    style={warningButtonStyle}
                    onClick={() => setEvidenceModal(e)}
                    onMouseEnter={(ev) => {
                      ev.target.style.transform = "translateY(-2px)"
                      ev.target.style.boxShadow = "0 4px 20px rgba(245, 158, 11, 0.3)"
                      ev.target.style.background =
                        "linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.1))"
                    }}
                    onMouseLeave={(ev) => {
                      ev.target.style.transform = "translateY(0)"
                      ev.target.style.boxShadow = "none"
                      ev.target.style.background =
                        "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))"
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                    SUBMIT EVIDENCE
                  </button>
                  <button
                    style={secondaryButtonStyle}
                    onClick={() => setRespondModal(e)}
                    onMouseEnter={(ev) => {
                      ev.target.style.borderColor = "#06b6d4"
                      ev.target.style.color = "#06b6d4"
                    }}
                    onMouseLeave={(ev) => {
                      ev.target.style.borderColor = "#2a2a36"
                      ev.target.style.color = "#ffffff"
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    RESPOND
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewDetailsModal && (
        <div style={modalOverlayStyle} onClick={() => setViewDetailsModal(null)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div style={modalTitleStyle}>
                <div style={{ ...headerIconStyle, width: "36px", height: "36px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                Dispute Details
              </div>
              <button
                style={modalCloseButtonStyle}
                onClick={() => setViewDetailsModal(null)}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#06b6d4"
                  e.target.style.color = "#06b6d4"
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#1a1a24"
                  e.target.style.color = "#6b7280"
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div style={modalBodyStyle}>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Dispute ID</span>
                <span style={detailValueStyle}>{viewDetailsModal.id || "N/A"}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Title</span>
                <span style={{ ...detailValueStyle, fontFamily: "inherit" }}>
                  {viewDetailsModal.title || "Untitled Dispute"}
                </span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Freelancer</span>
                <span style={detailValueStyle}>{viewDetailsModal.freelancer || "N/A"}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Client</span>
                <span style={detailValueStyle}>{viewDetailsModal.client || "N/A"}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Total Value</span>
                <span style={{ ...detailValueStyle, color: "#06b6d4" }}>{viewDetailsModal.totalValue || "0"} ETH</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Status</span>
                <span style={{ ...detailValueStyle, color: "#ef4444", fontFamily: "inherit" }}>DISPUTED</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Time in Dispute</span>
                <span style={detailValueStyle}>{viewDetailsModal.disputeTime || "2d 14h"}</span>
              </div>
              <div style={{ ...detailRowStyle, borderBottom: "none" }}>
                <span style={detailLabelStyle}>Created At</span>
                <span style={detailValueStyle}>{viewDetailsModal.createdAt || new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {evidenceModal && (
        <div
          style={modalOverlayStyle}
          onClick={() => {
            setEvidenceModal(null)
            setUploadedFiles([])
            setEvidenceDescription("")
          }}
        >
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div style={modalTitleStyle}>
                <div
                  style={{
                    ...headerIconStyle,
                    width: "36px",
                    height: "36px",
                    background: "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))",
                    borderColor: "rgba(245, 158, 11, 0.3)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                Submit Evidence
              </div>
              <button
                style={modalCloseButtonStyle}
                onClick={() => {
                  setEvidenceModal(null)
                  setUploadedFiles([])
                  setEvidenceDescription("")
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#f59e0b"
                  e.target.style.color = "#f59e0b"
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#1a1a24"
                  e.target.style.color = "#6b7280"
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div style={modalBodyStyle}>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
                Upload documents, screenshots, or files to support your case for dispute #
                {evidenceModal.id ? truncateAddress(evidenceModal.id) : "N/A"}
              </p>

              {/* Drop Zone */}
              <div
                style={dropZoneStyle}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  multiple
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,.zip"
                />
                <div style={uploadIconStyle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p style={{ fontSize: "14px", color: "#ffffff", marginBottom: "4px" }}>
                  Click to upload or drag and drop
                </p>
                <p style={{ fontSize: "12px", color: "#6b7280" }}>PDF, DOC, PNG, JPG, TXT, ZIP (Max 10MB each)</p>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div style={fileListStyle}>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} style={fileItemStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <div>
                          <p style={{ fontSize: "13px", color: "#ffffff", margin: 0 }}>{file.name}</p>
                          <p style={{ fontSize: "11px", color: "#6b7280", margin: 0 }}>{file.size}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          background: "rgba(239, 68, 68, 0.15)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          color: "#ef4444",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Evidence Description */}
              <label style={{ ...infoLabelStyle, marginBottom: "8px" }}>EVIDENCE DESCRIPTION</label>
              <textarea
                style={textareaStyle}
                placeholder="Describe the evidence you are submitting and how it supports your case..."
                value={evidenceDescription}
                onChange={(e) => setEvidenceDescription(e.target.value)}
              />

              {/* Submit Button */}
              <button
                style={{
                  ...primaryButtonStyle,
                  width: "100%",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                }}
                onClick={handleSubmitEvidence}
                disabled={uploadedFiles.length === 0}
                onMouseEnter={(e) => {
                  if (uploadedFiles.length > 0) {
                    e.target.style.transform = "translateY(-2px)"
                    e.target.style.boxShadow = "0 4px 20px rgba(245, 158, 11, 0.3)"
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "none"
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                SUBMIT EVIDENCE ({uploadedFiles.length} FILE{uploadedFiles.length !== 1 ? "S" : ""})
              </button>
            </div>
          </div>
        </div>
      )}

      {respondModal && (
        <div
          style={modalOverlayStyle}
          onClick={() => {
            setRespondModal(null)
            setResponseText("")
          }}
        >
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div style={modalTitleStyle}>
                <div
                  style={{
                    ...headerIconStyle,
                    width: "36px",
                    height: "36px",
                    background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.05))",
                    borderColor: "rgba(6, 182, 212, 0.3)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                Respond to Dispute
              </div>
              <button
                style={modalCloseButtonStyle}
                onClick={() => {
                  setRespondModal(null)
                  setResponseText("")
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#06b6d4"
                  e.target.style.color = "#06b6d4"
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#1a1a24"
                  e.target.style.color = "#6b7280"
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div style={modalBodyStyle}>
              <div
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  background: "#0a0a0f",
                  border: "1px solid #1a1a24",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <div style={statusBadgeStyle}>
                    <div style={statusDotStyle}></div>
                    DISPUTED
                  </div>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    #{respondModal.id ? truncateAddress(respondModal.id) : "N/A"}
                  </span>
                </div>
                <p style={{ fontSize: "14px", color: "#ffffff", margin: 0 }}>
                  {respondModal.title || "Untitled Dispute"}
                </p>
              </div>

              <label style={{ ...infoLabelStyle, marginBottom: "8px" }}>YOUR RESPONSE</label>
              <textarea
                style={textareaStyle}
                placeholder="Enter your response to this dispute. Be clear and provide any relevant details that support your position..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
              />

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  style={{ ...secondaryButtonStyle, flex: 1 }}
                  onClick={() => {
                    setRespondModal(null)
                    setResponseText("")
                  }}
                >
                  CANCEL
                </button>
                <button
                  style={{ ...primaryButtonStyle, flex: 2 }}
                  onClick={handleSubmitResponse}
                  disabled={!responseText.trim()}
                  onMouseEnter={(e) => {
                    if (responseText.trim()) {
                      e.target.style.transform = "translateY(-2px)"
                      e.target.style.boxShadow = "0 4px 20px rgba(6, 182, 212, 0.3)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)"
                    e.target.style.boxShadow = "none"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  SUBMIT RESPONSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Disputes
