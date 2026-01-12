# OpenEscrow

## Overview

A Web3-native, wallet-authenticated escrow dApp for freelancers and project initiators. It enforces milestone-based payments, on-chain reputation, and decentralized dispute resolution using smart contracts. Users interact via wallets; all actions are on-chain or simulated as on-chain for UX clarity. Emphasizes that OpenEscrow is permissionless public infrastructure, one of many possible clients.

## App Shell

* **Layout:** Global header with navigation (Landing, Dashboard, Create Escrow, Reputation). Left sidebar on internal pages for quick filters (Active, Milestones, Disputes). Main content area with card-based panels. Right-hand activity/notifications panel. Footer reiterates infrastructure framing and client-agnostic messaging.

* **Theme:** Dark, glassy UI with neon cyan/mint accents. Subtle blockchain-inspired patterns. Monospace for addresses/hashes. Light, accessible tooltips.

* **Network Indicator:** Visible badge showing current network (Mainnet / Sepolia Testnet). Network switcher is available on wallet connect screen and in the header for explicit network switching. The indicator reflects live chain state.

* **Typography:** Clean sans-serif for UI; monospace for addresses/hashes. Status colors: Pending (amber), Confirmed (green), Disputed (red).

* **Copy Cues:** UI includes concise copy that “This UI is one of many possible clients for OpenEscrow, a permissionless public infrastructure.”

### Network Management and Synchronization (New)

* **Active Network Display:** The header shows the currently connected network (Ethereum Mainnet or Sepolia Testnet). The indicator updates in real-time to reflect MetaMask state. A persistent header network switcher and live network badge reflect MetaMask state.

* **Network Detection:** On app load and on account/network events, the app polls eth_chainId to determine the active network and synchronizes internal UI state accordingly.

* **User-Initiated Switch:** Users can explicitly switch networks via:

  * Wallet switch action: Trigger MetaMask wallet_switchEthereumChain with the target chainId.

  * If the target chain is not added, trigger wallet_addEthereumChain with the proper chain parameters (name, rpcUrls, nativeCurrency, blockExplorerUrls).

* **Safety and UX:** Never auto-switch silently. If the user attempts an escrow action on a mismatched network, the UI presents a clear “Wrong network” warning with a one-click fix action to switch to the correct network.

* **Gating:** All escrow actions are gated by the network match; mismatches display a conspicuous warning and disable relevant actions until the user switches networks.

* **Edge Cases:** Handle user rejection of the switch prompt gracefully with guidance. If the user’s wallet is on a locked or disconnected state, prompt to reconnect before attempting a switch.

* **Live Chain Sync:** The app continuously reflects the live chain state to ensure UI and data stay aligned with the connected wallet.

* **Live Network Synchronization and Prefix (New)**

  * **ChainChanged Listener:** Listen for ethereum.on("chainChanged") events and immediately refresh on-chain state, including network detection, account state, and UI gating.

  * **Supported Networks:** Explicitly support only Ethereum Mainnet (0x1) and Sepolia Testnet (0xaa36a7). Any other network will be treated as unsupported for escrow actions.

  * **Real-time Validation:** Upon chainChanged, re-validate gated actions and update the network banner, gate states, and any in-progress transactions as needed.

  * **Action Gating on Production:** Escrow creation, funding, and milestone actions are gated to supported networks; unsupported networks display a prominent warning and disable escrow-related actions until a supported network is selected.

  * **Implications:** If a user switches between Mainnet and Sepolia, the UI must immediately reflect the new network, refresh blockchain data, and re-check permission gating for all actions.

  * If a user connects to an unsupported network (e.g., a non-Mainnet/Non-Sepolia chain), display a prominent warning and disable escrow-related actions until a supported network is selected.

  * If the user rejects the chain switch prompt or has a disconnected wallet, the app should prompt to reconnect and then reattempt gating once connected.

* **Balance Synchronization (New)**

  * The displayed ETH balance must always reflect the balance of the connected wallet, derived exclusively from the connected wallet provider (MetaMask-injected provider).

  * Balances are fetched via provider.getBalance(accounts[0]).

  * Balances are refreshed after every confirmed transaction (tx.wait()), on chainChanged, on accountsChanged, and on new blocks (provider.on("block")).

  * Do not cache balances or compute deltas locally; always re-query on-chain state after transactions and confirmations, and update the UI immediately once the block is mined.

  * If the balance fetch fails, surface a user-friendly error state with guidance to retry after re-connecting.

  * Balance display locations: show in the Wallet Connection Screen and in relevant wallet-status areas of the Dashboard header/cards. Balances are shown in ETH with monospace formatting for precision.

  * **Funding and Creation Guarded by Live Balance:** Before escrow creation or funding actions are allowed, the app fetches live balance (provider.getBalance(accounts[0])) and blocks the action if insufficient funds exist. This ensures all funding and deployment use real ETH.

### Features

#### Landing Page (Web3 Messaging)

* **What:** Verbalizes purpose and on-chain escrow flow; emphasizes decentralization, trustlessness, and the open-infrastructure framing.

* **UI:** Hero section with headline “Trustless Escrow Infrastructure for Freelancers.” Subtext mentions smart contracts, milestones, on-chain arbitration, and open-infrastructure framing. Diagram-style “How It Works” illustrating wallet-to-contract flows, milestones, and dispute resolution. Primary CTA: Connect Wallet; Secondary CTA: View Smart Contract Flow.

#### Wallet Connection Screen

* **What:** Wallet-based authentication, network selection, and address display.

* **UI:**

  * Wallet picker with MetaMask/WalletConnect style, network dropdown (select Mainnet or Sepolia), address preview “Connected as 0xA3…92F,” transaction status placeholders. Tooltips explain roles and edge states (e.g., insufficient funds).

  * Enhanced behavior: When a MetaMask-compatible wallet is available, the site should automatically prompt the user to connect their MetaMask account upon reaching this screen. If MetaMask is installed and connected, the app proceeds to the Dashboard. If MetaMask is not installed, the UI should gracefully fall back to WalletConnect as an alternative connection method and provide installation guidance for MetaMask.

  * Status indicators reflect the current connection state (Connecting, Connected, Disconnected) and the active network.

* **Important non-custodial enforcement:** The client address is strictly the connected MetaMask account; there is no backend wallet or default signer involved.

* **Flow:** User lands -> app detects MetaMask presence:

  * If MetaMask is available: automatically triggers MetaMask account connection prompt; upon user approval, the app detects network, shows connected address, and proceeds to Dashboard.

  * If MetaMask is not available: offer WalletConnect option; user can initiate connection via WalletConnect; on success, network and address are shown; proceed to Dashboard.

  * If the user needs to switch networks, guidance is provided and a network-switch action is offered.

* **Edge States:** Explicit handling and messaging for: MetaMask not installed, user rejection of connection, insufficient funds, and wrong network with actionable guidance.

* **Important note on behavior:** Do NOT auto-connect wallets on page load. Wallet detection may occur on load, but account authorization must only happen after an explicit user click. Implement in line with real dApp behavior (e.g., Uniswap-style wallet connection).

* **Account lifecycle:** Listen for account changes and update the client address accordingly:

  * ethereum.on("accountsChanged", handler)

  * Update the displayed client address (and from-address for deployments) to accounts[0], or force a reconnect if needed.

* **Network Synchronization:** In addition to the wallet connection logic, the app continuously synchronizes the UI with MetaMask’s current chainId to ensure consistency across sessions and page visibility.

* **Balance Display:** The UI should present the current ETH balance for the connected wallet, synchronized via the balance synchronization mechanism described above.

#### dApp Dashboard (On-Chain View)

* **What:** Central view of on-chain activity: Active Escrow Contracts, Pending Milestones, Locked Funds, Disputes, and verifiable reputation previews.

* **UI:** Cards per escrow showing:

  * Smart contract address (copyable)

  * Total value locked (ETH/TEST token)

  * Milestone status (progress bar)

  * Blockchain confirmation state (Pending/Confirmed)

  * Quick actions: View Escrow, Raise Dispute, Approve Milestone (if eligible)

  * Reputation preview snippet linked to related contributions and contract addresses

* **Flow:** User selects an escrow card -> opens detail; status updates reflect blockchain state (Pending → Confirmed).

#### Create Escrow (Smart Contract Flow)

* **What:** Step-by-step flow to deploy escrow and fund it with enhanced reputation and edge-state considerations.

* **UI:** Steps:

  1. Freelancer wallet address input (recipient)

  2. Escrow contract deployment (copyable address after deploy)

  3. Milestone definitions (titles, amounts, due blocks)

  4. Fund locking transaction (amounts, token type)

  5. Reputation preview during creation (shows expected impact on initiator and freelancer scores via related contributing addresses)

  6. Wallet confirmation screen with simulated gas estimate

  7. Transaction hash display and “Awaiting block confirmation” state

* **Flow:** User fills fields -> clicks Deploy → wallet modal pops for confirmation → deployment hash shown → after confirmation, milestones defined and funded appear on dashboard.

* **Non-custodial deployment mandate:** All escrow creation and contract deployment transactions must be signed directly by the user’s wallet via MetaMask. The app must NOT use any server-side wallet, relayer, default signer, or platform-controlled account for deployment or funding.

* **Signer handling:** The connected MetaMask account must be used as the signer (from address) for the deployment transaction.

* **Client address usage:** The displayed “Client” in the UI, the from address for escrow deployment transactions, and the initiator stored in the escrow contract must all reflect the connected MetaMask account (accounts[0]).

* **Flow adjustments:** On “Create Escrow” click, trigger a MetaMask confirmation popup; fail if MetaMask is disconnected or locked; the freelancer/contractor address continues to be taken from user input.

* **Edge States:** Explicit handling and UI for Rejected, Insufficient Funds, Wrong Network, and Reverted Contracts with clear messaging and guidance.

* **Account changes:** Deployment flow will reflect updated client address if accountsChanged occurs prior to deployment.

* **Milestone Release Guard (New):** Milestone releases must be executed as on-chain transfers from the escrow contract to the stored freelancer address. UI actions that trigger milestone completion will initiate a contract call (e.g., releaseMilestone) which performs a payable transfer from the escrow contract to the freelancer. Milestone completion is only considered finalized when the transaction is mined and the on-chain state confirms the transfer.

* **Zero-Amount Validation (New):** Milestone release transactions must validate non-zero transfer amounts at the contract level; attempts to release with zero value will be rejected by the contract.

* **Balance Dependency (New):** The ability to release a milestone is constrained by the escrow contract holding sufficient funds for the milestone amount. If funds are insufficient, the contract reverts and provides a clear on-chain failure reason, which will be surfaced in the UI.

* **On-Chain State Reliant (New):** The UI should rely on confirmed blockchain state (tx mined, event emitted) to reflect milestone release rather than UI-only flags. The balance and milestone status must update only after on-chain confirmation.

* **Flow when releasing milestone:** User initiates milestone release -> MetaMask confirmation -> on-chain transfer from contract to freelancer -> tx mined -> milestone status updates to Confirmed on-chain -> UI reflects new state via provider event listeners.

#### Escrow Detail (On-Chain Transparency)

* **What:** Deep dive into a single escrow’s on-chain state.

* **UI:**

  * Copyable smart contract address

  * Locked funds amount and token

  * Milestone timeline with statuses and timestamps

  * Action buttons:

    * Release Milestone (if funded & due) [replaces “Approve Milestone” in cases where on-chain release is the mechanism]

    * Raise Dispute (trigger arbitration)

    * Submit Evidence (for Open/Evidence stage)

  * Evidence/Evidence History panel with timestamps

  * Arbitration flow visualization with explicit states:

    * Open → Evidence → Voting → Resolved

  * Immutable transaction history panel with mock/existing on-chain-like entries

  * “View on block explorer” button (mock link)

* **Flow:** User views details -> initiates milestone release or dispute -> wallet popup for transaction confirmation -> status updates (Pending/Confirmed/Disputed) and arbitration progress.

#### On-Chain Reputation Profile

* **What:** Wallet-based reputation derived from escrow outcomes with verifiability and actionable links.

* **UI:**

  * Wallet address header

  * Reputation score (numeric or tiered) with verifiable badge

  * Outcomes: Total completed escrows, disputes won/lost, average payout reliability

  * Statement: “This reputation is portable and not owned by any platform.”

  * History list of past escrows affecting score

  * Link score to contributing contract addresses (clickable)

  * Quick copy/link to individual escrow histories

* **Flow:** User selects a wallet -> score renders from on-chain data (mocked if needed) -> can copy address or link to individual escrow histories.

#### Role-Aware UI and Permissions

* **Roles:**

  * Initiator (Project Owner)

  * Freelancer (Recipient)

  * Arbitrator (Dispute Resolver)

* **UI Behavior:**

  * Actions are gated by role and escrow state.

  * Initiator can create escrow, fund milestones, approve milestones, and raise disputes with evidence. Milestone release is an on-chain action that requires the Initiator’s wallet to fund and trigger the contract call.

  * Freelancer can be recipient, approve milestones when due and funded, and raise disputes with evidence. Milestone approval is implied by on-chain release; UI should reflect on-chain state of milestone transfers.

  * Arbitrator can view disputes, submit evidence, participate in voting once in Voting state.

* **Tooltips:** Contextual tooltips explain why an action is enabled/disabled, and what each arbitration state means.

* **Flow:** Role selection is inferred from wallet address mapping and displayed in the header; action buttons enable/disable based on role and state.

#### Arbitration Flow (Visualized)

* **States:** Open → Evidence → Voting → Resolved

* **UI:**

  * Visual progress bar and status chips for the arbitration case

  * Evidence submission area with attachments-like metadata

  * Voting panel with time limits and eligibility hints

  * Final outcome displayed with timestamp and linked to dispute record

* **Edge Handling:** If an arbitrator is not assigned or voting window lapses, UI shows guidance and default outcomes if applicable.

#### On-Chain Identity and Linkage

* **Verifiable Reputation:** Reputation scores are derived from on-chain data and linked contract contributions; scores are testable and verifiable via explorer-like endpoints (mocked but labeled).

* **Contribution Linking:** Scores display related contributing contract addresses and allow navigation to escrow histories.

#### Public-Infrastructure Framing and Copy Cues

* **Footer:** Explicit framing that OpenEscrow is permissionless public infrastructure and that the UI is one of many possible clients.

* **Copy Cues:** Clear indicators that contract addresses and transaction hashes are visible and that explorer URLs are mock placeholders for demonstration.

## User Flows

### Primary Flow: Create Escrow, Fund Milestones, and Reputation Preview

1. User connects wallet on Landing -> navigates to Create Escrow

2. User enters freelancer address, defines milestones, and deploys the contract

3. Reputation preview during creation shows expected impact on reputations via related contributing addresses

4. System presents gas estimate, wallet confirmation, and transaction hash

5. Transaction pending -> blockchain confirmation -> escrow appears in Dashboard with milestones, funds locked, and reputation links

6. Milestone release flows on-chain: when a milestone is due and funded, the initiator triggers an on-chain release, transferring the milestone amount from the escrow contract to the freelancer. The UI updates only after the transaction is mined and the on-chain state reflects the transfer.

### Secondary Flow: Approve Milestone or Raise Dispute (with Arbitration)

1. User opens Escrow Detail -> sees milestone due

2. If conditions met and role authorized, user triggers a milestone release (on-chain) -> wallet confirmation shown

3. If dispute needed, user clicks Raise Dispute -> arbitration trigger modal and on-chain prompt

4. Evidence is submitted, arbitration proceeds through Open → Evidence → Voting → Resolved states

5. Status updates to Pending/Confirmed/Disputed/Resolved accordingly

## State Management

* Escrows array: [{id, contractAddress, freelancer, initiator, totalValue, milestones:[{id,title,amount,date,dueBlock,status}], state: Pending/Active/Completed/Disputed, confirmations}]

* Milestones: [{id, title, amount, dueBlock, status}]

* FundsLocked: numeric (ETH/token quantity)

* Disputes: [{id, escrowId, status, outcome, arbitrationState(Open/Evidence/Voting/Resolved), raiser, timestamp, disputedMilestones, evidenceHashURI}]

* ReputationProfiles: {address, score, history, verifiableLink}

* UI State: currentView, walletConnected, network, loading/confirming states, transactionHash, gasEstimate

* EdgeStateFlags: indicates Rejected, InsufficientFunds, WrongNetwork, RevertedContract with messages

Default/empty states

* No escrows: “No active escrows yet”

* No reputation history: score 0 with zero history

* Pending on any action shows “Waiting for blockchain confirmation…”

* Rejected or reverted transactions show explicit messaging and remediation steps

Notes

* All wallet actions show explicit confirmations and irreversible action warnings.

* View-on-explorer links are mocked but labeled as explorer URLs.

* All addresses, hashes, and contracts are displayed in monospace.

* Actions and messaging reflect the permissionless infrastructure framing, clarifying that this is a client among many for OpenEscrow.

* Non-custodial enforcement throughout: Client address is always derived from the connected MetaMask account (accounts[0]); there is no server-side wallet, relayer, default signer, or platform-controlled account for deployment or funding.

### Enhancements for Fully On-Chain Dispute System (Incorporated)

* Dispute Raising

  * Any authorized user (Initiator or Freelancer) can raise a dispute for a specific escrow or milestone via a dedicated on-chain function raiseDispute(escrowId, milestoneIds, evidenceHashURI). The function records the raiser address and timestamp and transitions the escrow state from Active to Disputed (immutable on-chain state).

* Dispute Recording

  * Disputes data model is extended to include: raiser (address), timestamp, disputedMilestones (array of milestone IDs), evidenceHashURI (string). This is stored on-chain and surfaced in UI via confirmed events.

* State Transitions

  * Escrow state transitions from Active to Disputed occur only via the on-chain dispute raise call. There is no optimistic flag; UI updates only after confirmation events.

* Evidence and Arbitration lifecycle

  * Evidence submission remains available during Open/Evidence states; each submission is tied to the open dispute record and includes an evidenceHashURI.

  * Arbitration flows Open → Evidence → Voting → Resolved are fully enforced on-chain with role gating:

    * Initiator/Freelancer can submit evidence while in Open or Evidence states.

    * Arbitrators (and any appointed arbitration pool/contract) participate in Voting when in Voting state.

  * Final resolution is an on-chain event emitted by the arbitration contract, with possible outcomes:

    * Release to Freelancer (on-chain payable transfer from escrow)

    * Refund to Client (on-chain payable transfer back to client)

    * Split (on-chain transfers per predefined split logic)

  * All outcomes are executed by real ETH transfers from the escrow contract; no UI-only resolution.

* Fund Locking During Dispute

  * While a dispute is open, further fund releases from the escrow contract are locked to prevent leakage of funds until the dispute is resolved.

* Role-Gated Actions

  * Actions are gated by role (Initiator, Freelancer, Arbitrator) and escrow/dispute state. Tooltips explain gating rationale.

* UI Driven by On-Chain State

  * All status indicators, milestone approvals/releases, and dispute progress are driven exclusively by confirmed blockchain state and event logs. Optimistic UI flags are removed for dispute outcomes.

* MetaMask Balance Handling

  * After dispute resolution, MetaMask balances reflect the updated on-chain state through standard provider balance updates triggered by mined transactions and chain events.

* Edge Cases

  * If a raiser is not authorized or a dispute is raised on an unsupported escrow/milestone, the UI surfaces clear guidance and reverts to a safe state.

  * If the arbitrator pool cannot assign an arbitrator or voting window lapses, the UI presents default guidance and potential fallback outcomes as defined by governance in the arbitration contract.

* Developer Notes

  * All dispute-related actions and state changes must be confirmed on-chain; the UI should listen for the mined events (DisputeRaised, EvidenceSubmitted, ArbitrationOpened, VotingStarted, RulingOutcome) to reflect status changes.

  * Explorer links and transaction hashes are presented as mock placeholders for demonstration, with explicit labeling.

***

Notes on Enhancement Request Alignment with Specification

* Funding and Escrow Creation: Before creating or funding an escrow, the app now fetches live balance via provider.getBalance(accounts[0]) and blocks actions if funds are insufficient. This enforces real ETH accounting and prevents over-allocation.

* On-Chain Transactions: Funding, deployment, milestone releases, and dispute outcomes are executed as real payable transactions with proper awaiting (tx.wait()) and immediate post-confirmation balance refresh.

* Balance Freshness: Balances are no longer cached or inferred; they are re-fetched after every relevant event (transaction mined, chain changes, new blocks) to align UI with on-chain state.

* Gating and UX: All actions remain gated by network state and balance sufficiency with clear user guidance and one-click fixes where applicable.
