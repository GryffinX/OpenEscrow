# OpenEscrow

## Overview

A Web3-native, wallet-authenticated escrow dApp for freelancers and project initiators. It enforces milestone-based payments, on-chain reputation, and fully on-chain dispute resolution using smart contracts. Users interact exclusively via the MetaMask-injected provider; all actions are on-chain with real blockchain state and zero simulated states for UX. OpenEscrow is permissionless public infrastructure, one of many possible clients.

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

  * The balance is derived exclusively from the MetaMask-injected provider and must be fetched directly via the provider, not via any internal BalanceService or framework-specific balance wrappers.

  * **Provider Initialization:** Initialize an ethers.BrowserProvider(window.ethereum) (or equivalent Web3 provider) and retrieve balances using provider.getBalance(accounts[0]). Format with ethers.formatEther for display.

  * Balances are refreshed after every confirmed transaction (tx.wait()), on chainChanged, on accountsChanged, and on new blocks (provider.on("block")).

  * Do not cache balances or compute deltas locally; always re-query on-chain state after transactions and confirmations, and update the UI immediately once the block is mined.

  * If the balance fetch fails, surface a user-friendly error state with guidance to retry after re-connecting.

  * Balance display locations: show in the Wallet Connection Screen and in relevant wallet-status areas of the Dashboard header/cards. Balances are shown in ETH with monospace formatting for precision.

  * **Funding and Creation Guarded by Live Balance:** Before escrow creation or funding actions are allowed, the app fetches live balance (provider.getBalance(accounts[0])) and blocks the action if insufficient funds exist. This ensures all funding and deployment use real ETH.

  * **Escrow Contract Balance Tracking (New):** Fetch and display the live balance of the escrow contract address (contractAddress) via provider.getBalance(contractAddress) and reflect on-chain balance changes in the UI.

  * **Invalid Escrow Guard:** If an escrow lacks a valid contract address, consider it invalid and disable its actions with a clear error message indicating the contract address is missing.

  * Note: Do not reference or rely on a BalanceService anywhere in the codebase. All balance-related logic must be implemented via direct provider calls as described above.

## Features

### UI Rendering Stabilization and Minimal Root (New)

*Goal:* Simplify and stabilize the render path to guarantee a clean, single-root React render before enabling full functionality.

*Key Actions:*

* Refactor the app to use one minimal React root with no conditional rendering at the root.

* Remove React.StrictMode and temporarily disable React Query (QueryClientProvider) until base UI renders without runtime errors.

* Render the app with a single App component mounted unconditionally from main.tsx.

* Ensure only one React and react-dom version exists; all hooks (useEffect, useState, etc.) are imported directly from "react" and never accessed via dynamic or wrapped references.

* Temporarily disable or stub advanced providers (QueryClientProvider, wallet context, arbitration context) until the base UI renders.

* Replace all undefined or design-system components (e.g., Badge) with simple inline JSX elements (e.g., with inline styles).

* Guard every component against null or undefined data (wallet, provider, contractAddress) using early returns instead of partial renders.

* Render static placeholders for Dashboard, Escrow Card, and Header first, then progressively re-enable MetaMask connection, balance fetching, and contract logic only after the app renders without runtime errors.

* Do not reference any BalanceService or abstracted hooks—use direct provider calls only after render stability is confirmed.

* Ensure only a blank app initially, then static UI, followed by wallet connect, balances, and escrow logic as stability is verified.

### React Runtime Integrity and Single-Instance Guarantee (New)

*Purpose:* Resolve runtime error Cannot read properties of null (reading 'useEffect') by enforcing a single React instance, correct hook imports, and a robust provider hierarchy.

* Core Requirements:*

* Ensure the application uses a single, consistent React instance across the entire codebase.

* All React hooks (useEffect, useState, useMemo, useCallback, etc.) must be imported directly from "react" (e.g., import React, { useEffect, useState } from "react") and never accessed via a possibly-null or mismatched React reference (e.g., React.useEffect on a null dispatcher).

* Verify React and ReactDOM versions are aligned and deduplicated (no multiple React copies in node_modules). Fail the build if multiple React versions are detected.

* Confirm that QueryClientProvider from @tanstack/react-query is rendered inside a valid React component tree wrapped by a single <React.StrictMode> and at the root (e.g., main.tsx or App.tsx), not conditionally or outside render flow.

* Remove any custom wrappers, mocks, or no-code abstractions that shadow or override React imports.

* Ensure the build does not mix ESM/CJS React bundles or dynamically inject React at runtime.

* Add a guard to fail build-time if multiple React versions are detected.

* Confirm the app runs with a single provider hierarchy so hooks resolve against a valid, non-null React dispatcher.

*Developer Guidance and Best Practices:*

* Explicitly import and declare all UI components used in the project to avoid implicit globals or shadowing.

* Use a single root render path, typically in main.tsx, that mounts the app within <React.StrictMode><QueryClientProvider ...></React.StrictMode>.

* Ensure no conditional rendering trees wrap the root provider in a way that would create multiple React roots or bypass the main render path.

* Add lint/build-time checks to flag:

  * Duplicate React/ReactDOM versions in node_modules.

  * Any file that imports React via non-standard paths or uses React in a way that could be null-evaluated (e.g., React.useEffect guarded by runtime checks).

  * Any dynamic injection of React at runtime or conditional initialization of the React tree.

* Testing and validation:

  * Run npm ls react to verify a single version is used.

  * Ensure TypeScript or Babel configuration resolves to a single React runtime.

  * Validate that on initial load, useEffect and other hooks run within a valid React dispatcher by performing a smoke test of the app bootstrapping sequence.

  * Add a build-time script or plugin that throws if multiple React versions are detected and integrate with CI.

### Flow Compliance

* Ensure that the root rendering path is not wrapped in conditional logic that could cause the provider hierarchy to be created more than once or after some asynchronous condition resolves.

* Ensure all components rely on the same React instance for hook resolution and state management.

### Edge Handling

* If any violation is detected (multiple React versions, non-imported hooks, incorrect provider nesting), fail the build with a descriptive error and provide remediation steps.

## User Flows

### Primary Flow: Create Escrow, Fund Milestones, and Reputation Preview

1. User connects wallet on Landing -> navigates to Create Escrow

2. User enters freelancer address, defines milestones, and deploys the contract

3. Reputation preview during creation shows expected impact on reputations via related contributing addresses

4. System presents gas estimate, wallet confirmation, and transaction hash

5. Transaction pending -> blockchain confirmation -> escrow contract address is emitted and appears in Dashboard with milestones, funds locked, and reputation links

6. Milestone release flows on-chain: when a milestone is due and funded, the initiator triggers an on-chain release, transferring the milestone amount from the escrow contract to the freelancer. The UI updates only after the transaction is mined and the on-chain state reflects the transfer.

### Secondary Flow: Approve Milestone or Raise Dispute (with Arbitration)

1. User opens Escrow Detail -> sees milestone due

2. If conditions met and role authorized, user triggers a milestone release (on-chain) -> wallet confirmation shown

3. If dispute needed, user clicks Raise Dispute -> arbitration trigger modal and on-chain prompt

4. Evidence is submitted, arbitration proceeds through Open → Evidence → Voting → Resolved states

5. Status updates to Pending/Confirmed/Disputed/Resolved accordingly

## State Management

* Escrows array: [{id, contractAddress, freelancer, initiator, totalValue, milestones:[{id,title,amount,date,dueBlock,status}], state: Pending/Active/Completed/Disputed, confirmations}]

  * Note: contractAddress is the sole source of truth for on-chain state; if missing or invalid, the escrow is considered invalid.

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

* Escrow backing: Every escrow is tied to a deployed on-chain contract; the contract address is the sole source of truth for vault balance, milestone funding, and releases.

* Balance queries: Get both connected wallet balance and escrow contract balance using the MetaMask provider; refresh after mined transactions, chain changes, account changes, and new blocks.

* Milestone releases: Enforced as on-chain transfers from the escrow contract to the freelancer; only reflect in UI after tx mined and events confirmed.

* Reputations and completion: Derived strictly from confirmed on-chain events (escrow completed, funds released, disputes resolved).

* Signer model: MetaMask is the only signer; no backend or alternative signer allowed.

Error handling: Surface clear errors for missing contract addresses, failed transfers, or reverted transactions; ensure wallet balances always reflect on-chain reality.

### Tailwind CSS Enhancement (New)

To fix the Tailwind CSS build error related to a missing custom utility class shadow-glass, remove the invalid utility shadow-glass from all @apply statements and use standard Tailwind utilities instead.

What to implement

* In src/index.css, update the following:

  * In the .glass-panel and .glass-button rules, REMOVE shadow-glass from the @apply line and replace with valid utilities.

  * Replace:\
    @apply bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-glass;\
    with:\
    @apply bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-xl shadow-inner;

* Do NOT define or reference shadow-glass anywhere.

* Ensure the Tailwind/PostCSS build completes successfully.

* Apply the fix directly to the CSS file.

Validation and safety

* Build should pass without the previous missing utility error.

* The glassy effect should render identically across environments supported by your project, leveraging existing Tailwind color tokens where possible.

* If the project has a design system or tokens for shadows, align with those tokens to ensure visual consistency.

Enhancement Implementation (Direct CSS Edit)

* Explicitly edit src/index.css and adjust the @apply rules as described above.

* Ensure that no shadow-glass utility is defined or used anywhere in the codebase.

Replacement Guidance (For This Enhancement Request)

* Remove all usage of the custom Tailwind class shadow-glass from the codebase.

* Replace shadow-glass with standard Tailwind utilities: shadow-xl shadow-inner.

* Ensure the build succeeds and no custom shadow utilities remain.

* After replacement, search and update all components that previously used shadow-glass to use the new class combination (e.g., class="shadow-xl shadow-inner") to maintain the intended glassy look.

Please implement these changes directly in the codebase as described.
