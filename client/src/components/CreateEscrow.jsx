

import { useState } from "react"

function CreateEscrow({ onDeploy }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    seller: "",
    designPercent: 50,
    developmentPercent: 50,
    fundAmount: "",
  })
  const [deployed, setDeployed] = useState(false)

  const steps = [
    { id: 1, label: "Participant", icon: "person" },
    { id: 2, label: "Milestones", icon: "milestones" },
    { id: 3, label: "Funding", icon: "funding" },
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContinue = () => {
    if (currentStep === 1) {
      if (!formData.title || !formData.seller) {
        alert("Please fill in all fields")
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      const total = Number(formData.designPercent) + Number(formData.developmentPercent)
      if (total !== 100) {
        alert("Design % + Development % must equal 100")
        return
      }
      setCurrentStep(3)
    } else if (currentStep === 3) {
      if (!formData.fundAmount) {
        alert("Please enter fund amount")
        return
      }
      onDeploy({
        title: formData.title,
        seller: formData.seller,
        designPercent: formData.designPercent,
        developmentPercent: formData.developmentPercent,
        fundAmount: formData.fundAmount,
      })
      setDeployed(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepIcon = (step) => {
    if (step.icon === "person") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    } else if (step.icon === "milestones") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6" />
          <path d="M9 16h6" />
        </svg>
      )
    } else {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18" />
          <path d="M7 15h4" />
        </svg>
      )
    }
  }

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#0a0a0a",
      padding: "48px 24px",
      fontFamily: "'Inter', -apple-system, sans-serif",
    },
    stepperContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "48px",
      maxWidth: "800px",
      margin: "0 auto 48px auto",
    },
    stepWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
    },
    stepCircle: (isActive, isCompleted) => ({
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: isActive ? "rgba(6, 182, 212, 0.15)" : "transparent",
      border: `2px solid ${isActive || isCompleted ? "#06b6d4" : "#374151"}`,
      color: isActive || isCompleted ? "#06b6d4" : "#6b7280",
      transition: "all 0.3s ease",
    }),
    stepLabel: (isActive) => ({
      marginTop: "12px",
      fontSize: "14px",
      fontWeight: "500",
      color: isActive ? "#06b6d4" : "#6b7280",
      letterSpacing: "0.5px",
    }),
    stepLine: (isCompleted) => ({
      width: "180px",
      height: "2px",
      background: isCompleted ? "#06b6d4" : "#374151",
      margin: "0 16px",
      marginBottom: "32px",
      transition: "all 0.3s ease",
    }),
    card: {
      maxWidth: "700px",
      margin: "0 auto",
      background: "transparent",
      border: "1px solid #1f2937",
      borderRadius: "16px",
      padding: "40px",
    },
    cardTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#ffffff",
      marginBottom: "32px",
      letterSpacing: "1px",
    },
    label: {
      display: "block",
      fontSize: "12px",
      fontWeight: "500",
      color: "#6b7280",
      marginBottom: "12px",
      letterSpacing: "2px",
      textTransform: "uppercase",
    },
    input: {
      width: "100%",
      padding: "16px 20px",
      background: "#1a1a1a",
      border: "1px solid #2a2a2a",
      borderRadius: "8px",
      color: "#ffffff",
      fontSize: "15px",
      marginBottom: "24px",
      outline: "none",
      transition: "border-color 0.2s ease",
      boxSizing: "border-box",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "24px",
    },
    backButton: {
      background: "transparent",
      border: "none",
      color: "#9ca3af",
      fontSize: "15px",
      fontWeight: "500",
      cursor: "pointer",
      padding: "12px 0",
    },
    continueButton: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: "#06b6d4",
      border: "none",
      borderRadius: "50px",
      padding: "16px 32px",
      color: "#000000",
      fontSize: "14px",
      fontWeight: "600",
      letterSpacing: "1px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    successCard: {
      marginTop: "12px",
      padding: "24px",
      background: "rgba(34, 197, 94, 0.1)",
      border: "1px solid rgba(34, 197, 94, 0.3)",
      borderRadius: "12px",
      color: "#22c55e",
      textAlign: "center",
      fontSize: "15px",
      lineHeight: "1.6",
    },
  }

  if (deployed) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successCard}>
            Escrow contract deployed successfully
            <br />
            Awaiting buyer to fund escrow.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Stepper */}
      <div style={styles.stepperContainer}>
        {steps.map((step, index) => (
          <div key={step.id} style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={styles.stepWrapper}>
              <div style={styles.stepCircle(currentStep === step.id, currentStep > step.id)}>
                {renderStepIcon(step)}
              </div>
              <span style={styles.stepLabel(currentStep === step.id)}>{step.label}</span>
            </div>
            {index < steps.length - 1 && <div style={styles.stepLine(currentStep > step.id)} />}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div style={styles.card}>
        {currentStep === 1 && (
          <>
            <h2 style={styles.cardTitle}>PARTICIPANT DATA</h2>

            <label style={styles.label}>CONTRACT SHARD TITLE</label>
            <input
              type="text"
              placeholder="Project Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>RECIPIENT (NON-CUSTODIAL WALLET)</label>
            <input
              type="text"
              placeholder="0x..."
              value={formData.seller}
              onChange={(e) => handleInputChange("seller", e.target.value)}
              style={styles.input}
            />
          </>
        )}

        {currentStep === 2 && (
          <>
            <h2 style={styles.cardTitle}>MILESTONE ALLOCATION</h2>

            <label style={styles.label}>DESIGN MILESTONE (%)</label>
            <input
              type="number"
              placeholder="50"
              value={formData.designPercent}
              onChange={(e) => handleInputChange("designPercent", e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>DEVELOPMENT MILESTONE (%)</label>
            <input
              type="number"
              placeholder="50"
              value={formData.developmentPercent}
              onChange={(e) => handleInputChange("developmentPercent", e.target.value)}
              style={styles.input}
            />

            <div
              style={{
                padding: "12px 16px",
                background: "rgba(6, 182, 212, 0.1)",
                borderRadius: "8px",
                color: "#06b6d4",
                fontSize: "13px",
              }}
            >
              Total: {Number(formData.designPercent) + Number(formData.developmentPercent)}% (must equal 100%)
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <h2 style={styles.cardTitle}>FUNDING DETAILS</h2>

            <label style={styles.label}>ESCROW FUND AMOUNT (ETH)</label>
            <input
              type="text"
              placeholder="0.00"
              value={formData.fundAmount}
              onChange={(e) => handleInputChange("fundAmount", e.target.value)}
              style={styles.input}
            />

            <div
              style={{
                padding: "16px",
                background: "#1a1a1a",
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#6b7280", fontSize: "13px" }}>Design Milestone</span>
                <span style={{ color: "#ffffff", fontSize: "13px" }}>
                  {formData.fundAmount
                    ? ((Number(formData.fundAmount) * formData.designPercent) / 100).toFixed(4)
                    : "0.00"}{" "}
                  ETH
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#6b7280", fontSize: "13px" }}>Development Milestone</span>
                <span style={{ color: "#ffffff", fontSize: "13px" }}>
                  {formData.fundAmount
                    ? ((Number(formData.fundAmount) * formData.developmentPercent) / 100).toFixed(4)
                    : "0.00"}{" "}
                  ETH
                </span>
              </div>
            </div>
          </>
        )}

        <div style={styles.buttonContainer}>
          <button style={styles.backButton} onClick={handleBack} disabled={currentStep === 1}>
            Back
          </button>
          <button style={styles.continueButton} onClick={handleContinue}>
            {currentStep === 3 ? "DEPLOY" : "CONTINUE"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateEscrow
