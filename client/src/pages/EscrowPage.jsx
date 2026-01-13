"use client"

import { useState } from "react"

export default function EscrowPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    projectTitle: "",
    recipientWallet: "",
    milestones: [{ title: "", amount: "" }],
    fundingAmount: "",
  })

  const steps = [
    { id: 0, label: "Participant", icon: "user" },
    { id: 1, label: "Milestones", icon: "list" },
    { id: 2, label: "Funding", icon: "wallet" },
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const renderStepIcon = (step) => {
    const isActive = currentStep >= step.id
    const iconColor = isActive ? "#2dd4bf" : "#6b7280"

    if (step.icon === "user") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    }
    if (step.icon === "list") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      )
    }
    if (step.icon === "wallet") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 10H18a2 2 0 0 0 0 4h4" />
        </svg>
      )
    }
    return null
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>PARTICIPANT DATA</h2>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>CONTRACT SHARD TITLE</label>
              <input
                type="text"
                placeholder="Project Title"
                value={formData.projectTitle}
                onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>RECIPIENT (NON-CUSTODIAL WALLET)</label>
              <input
                type="text"
                placeholder="0x..."
                value={formData.recipientWallet}
                onChange={(e) => handleInputChange("recipientWallet", e.target.value)}
                style={styles.input}
              />
            </div>
          </div>
        )

      case 1:
        return (
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>MILESTONES</h2>

            {formData.milestones.map((milestone, index) => (
              <div key={index} style={{ marginBottom: "24px" }}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>MILESTONE {index + 1} TITLE</label>
                  <input
                    type="text"
                    placeholder="Milestone title"
                    value={milestone.title}
                    onChange={(e) => {
                      const newMilestones = [...formData.milestones]
                      newMilestones[index].title = e.target.value
                      setFormData((prev) => ({ ...prev, milestones: newMilestones }))
                    }}
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>AMOUNT (ETH)</label>
                  <input
                    type="text"
                    placeholder="0.00"
                    value={milestone.amount}
                    onChange={(e) => {
                      const newMilestones = [...formData.milestones]
                      newMilestones[index].amount = e.target.value
                      setFormData((prev) => ({ ...prev, milestones: newMilestones }))
                    }}
                    style={styles.input}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  milestones: [...prev.milestones, { title: "", amount: "" }],
                }))
              }}
              style={styles.addButton}
            >
              + Add Milestone
            </button>
          </div>
        )

      case 2:
        return (
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>FUNDING</h2>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>TOTAL FUNDING AMOUNT (ETH)</label>
              <input
                type="text"
                placeholder="0.00"
                value={formData.fundingAmount}
                onChange={(e) => handleInputChange("fundingAmount", e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.summaryBox}>
              <h3 style={{ color: "#ffffff", fontSize: "14px", marginBottom: "16px", letterSpacing: "0.1em" }}>
                SUMMARY
              </h3>
              <div style={styles.summaryRow}>
                <span style={{ color: "#6b7280" }}>Project</span>
                <span style={{ color: "#ffffff" }}>{formData.projectTitle || "-"}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={{ color: "#6b7280" }}>Recipient</span>
                <span style={{ color: "#ffffff", fontFamily: "monospace" }}>
                  {formData.recipientWallet
                    ? `${formData.recipientWallet.slice(0, 6)}...${formData.recipientWallet.slice(-4)}`
                    : "-"}
                </span>
              </div>
              <div style={styles.summaryRow}>
                <span style={{ color: "#6b7280" }}>Milestones</span>
                <span style={{ color: "#ffffff" }}>{formData.milestones.length}</span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={styles.container}>
      {/* Stepper */}
      <div style={styles.stepperContainer}>
        {steps.map((step, index) => (
          <div key={step.id} style={styles.stepWrapper}>
            <div style={styles.stepItem}>
              <div
                style={{
                  ...styles.stepCircle,
                  borderColor: currentStep >= step.id ? "#2dd4bf" : "#374151",
                  backgroundColor: currentStep >= step.id ? "rgba(45, 212, 191, 0.1)" : "transparent",
                }}
              >
                {renderStepIcon(step)}
              </div>
              <span
                style={{
                  ...styles.stepLabel,
                  color: currentStep >= step.id ? "#2dd4bf" : "#6b7280",
                }}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                style={{
                  ...styles.stepLine,
                  backgroundColor: currentStep > index ? "#2dd4bf" : "#374151",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      <div style={styles.navButtons}>
        <button
          onClick={handleBack}
          style={{
            ...styles.backButton,
            opacity: currentStep === 0 ? 0.5 : 1,
            cursor: currentStep === 0 ? "not-allowed" : "pointer",
          }}
          disabled={currentStep === 0}
        >
          Back
        </button>

        <button onClick={handleNext} style={styles.continueButton}>
          {currentStep === steps.length - 1 ? "SUBMIT" : "CONTINUE"}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ marginLeft: "8px" }}
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    padding: "60px 24px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  stepperContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    maxWidth: "800px",
    margin: "0 auto 48px",
    padding: "0 20px",
  },
  stepWrapper: {
    display: "flex",
    alignItems: "flex-start",
    flex: 1,
  },
  stepItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  stepCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  stepLabel: {
    fontSize: "14px",
    fontWeight: "500",
    letterSpacing: "0.05em",
    transition: "color 0.3s ease",
  },
  stepLine: {
    flex: 1,
    height: "2px",
    marginTop: "28px",
    marginLeft: "16px",
    marginRight: "16px",
    transition: "background-color 0.3s ease",
  },
  formCard: {
    maxWidth: "700px",
    margin: "0 auto",
    backgroundColor: "#111111",
    border: "1px solid #1f1f1f",
    borderRadius: "16px",
    padding: "40px",
  },
  formTitle: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "0.05em",
    marginBottom: "32px",
  },
  fieldGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: "500",
    letterSpacing: "0.1em",
    marginBottom: "12px",
  },
  input: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    border: "none",
    borderRadius: "8px",
    padding: "16px 20px",
    color: "#ffffff",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
  },
  addButton: {
    backgroundColor: "transparent",
    border: "1px dashed #374151",
    borderRadius: "8px",
    padding: "12px 24px",
    color: "#6b7280",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  summaryBox: {
    backgroundColor: "#0a0a0a",
    borderRadius: "12px",
    padding: "24px",
    marginTop: "24px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #1f1f1f",
  },
  navButtons: {
    maxWidth: "700px",
    margin: "32px auto 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "12px 24px",
  },
  continueButton: {
    backgroundColor: "#2dd4bf",
    border: "none",
    borderRadius: "50px",
    padding: "16px 40px",
    color: "#000000",
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "0.1em",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease",
  },
}
