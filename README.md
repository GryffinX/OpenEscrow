# OpenEscrow

OpenEscrow is a minimal, milestone-based decentralized escrow system built on **Shardeum**.  
It enables transparent, trustless escrow settlement using smart contracts, while preserving privacy for sensitive milestone and dispute data using **Inco**.

---

## 🚀 Problem Statement

Traditional escrow systems for freelance and contract-based work:
- Depend on centralized intermediaries
- Charge high platform fees
- Require trust in opaque dispute resolution
- Expose users to custody and censorship risks

On the other hand, fully on-chain escrow systems often:
- Leak sensitive business data publicly
- Are overly complex and hard to audit

**OpenEscrow** solves this by cleanly separating **settlement logic** and **privacy-sensitive decision-making**.

---

## 🧠 Core Idea

- **Shardeum (Blockchain Layer)**  
  Handles transparent fund locking, milestone enforcement, and settlement.

- **Inco (Privacy Layer)**  
  Handles confidential processing of milestone evidence and dispute context.

This separation ensures:
- Trustless and auditable fund movement
- Privacy for real-world business data
- Minimal and explainable smart contract logic

---

## 🏗️ Architecture Overview

Buyer / Seller
|
v
Frontend (React + MetaMask)
|
| Public settlement calls
v
OpenEscrow Smart Contract (Shardeum)
^
|
| Confidential computation
|
Inco Confidential Compute


- The smart contract never processes private data  
- Inco never controls funds  
- Each layer has a single, well-defined responsibility  

---

## ⛓️ Blockchain Network

- **Network:** Shardeum EVM Testnet  
- **Chain ID:** 8119  
- **Currency:** SHM  

Shardeum was chosen for its EVM compatibility, low fees, and suitability for scalable dApp experimentation.

---

## 📜 Smart Contract

### Contract Name
`OpenEscrow.sol`

### Deployment Address
0x79333add32954821FE9Df4b9A81fC1AD3AF3C47E
### 👥 Roles

* **Buyer**
    * Deploys the contract
    * Funds the escrow
    * Approves milestones
    * Can raise disputes
* **Seller**
    * Receives funds only after milestone approval
    * Cannot withdraw funds unilaterally

---

### 🔄 Escrow Lifecycle

1.  **Deployment**
    * Buyer deploys the contract
    * Seller address and milestone split are locked on-chain
2.  **Funding**
    * Buyer funds the escrow with SHM
    * Funds are locked inside the smart contract
3.  **Milestone Release**
    * Two milestones: **Design** and **Development**
    * Split is configurable (e.g., 40% / 60%)
    * Buyer explicitly approves each milestone
4.  **Completion**
    * All funds are released to the seller
    * Escrow is marked as completed
5.  **Dispute**
    * Buyer can raise a dispute
    * Remaining funds are frozen permanently
    * No automatic refunds or arbitration (intentional MVP scope)

---

### 🔍 Smart Contract Design

**Key properties:**
* No admin or owner privileges
* No automatic fund transfers
* No off-chain dependency
* Minimal state machine

**Core variables:**
```solidity
address buyer;
address seller;

uint256 totalAmount;
uint256 releasedAmount;

uint256 designPercent;
uint256 developmentPercent;

enum State { AWAITING_PAYMENT, FUNDED, COMPLETED, DISPUTED }
```
The contract is intentionally minimal to:
* Reduce attack surface
* Improve auditability
* Ensure a reliable hackathon demo

## 🔐 Inco Integration (Privacy Layer)

### Why?
While escrow settlement must be transparent, **not all data should be public**.

- Sensitive data evidence
- Dispute explanations  
- Deliverable context
Publishing this data on-chain would **permanently expose private business information**.

### How Inco is Used
**OpenEscrow integrates Inco as a confidential computation layer**:

1. Users submit sensitive milestone or dispute data privately
2. Inco processes this using confidential compute  
3. Inco returns a public signal to trigger on-chain escrow actions
4. **Escrow smart contract remains unchanged**
5. **Sensitive data never touches the blockchain**


**Design Principle**  
Settlement must be public. Decisions can be private.  
This allows OpenEscrow to combine trustless settlement with real-world privacy needs.

**Demo Flow**

**Happy Path**  
1. Buyer connects wallet  
2. Buyer funds escrow  
3. Buyer approves development milestone  
4. Buyer approves development milestone  
5. Seller receives full payment  

**Dispute Path**  
1. Buyer funds escrow  
2. Buyer raises dispute  
3. Funds are frozen on-chain  
4. Dispute context handled privately via Inc

---

## **⚠️ Scope & Limitations (Internal)**  
This project is a hackathon MVP, not a production system.

**Not included by design:**
- Refund mechanisms
- Time-based auto releases  
- Governance or DAO extensions

These are planned as future MVPs.

**🚀 Future Scope**
- Multi-milestone escrow contracts
- Inco-powered dispute resolution
- Cross-chain escrow

**🔧 Tech Stack**
- Smart contracts: Solidity (EVM)
- Blockchain: Shardeum (EVM)
- Frontend: React + ethers.js
- Privacy Layer: Inco (confidential compute)

---

## **✨ Conclusion**  
OpenEscrow demonstrates how:
- Smart contracts can replace centralized escrow platforms
- Confidential compute can protect sensitive business data
- Clean separation of concerns leads to safer web3 applications

