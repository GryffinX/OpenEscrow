import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Search, Wallet, Shield, ExternalLink, Clock, Copy, Check, User } from "lucide-react"

function Dashboard({ escrows, setSelectedEscrow }) {
  /* -------------------- STATE -------------------- */
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [search, setSearch] = useState("")
  const [walletBalance, setWalletBalance] = useState("—")
  const [networkName, setNetworkName] = useState("—")
  const [lastSynced, setLastSynced] = useState(new Date())
  const [copiedId, setCopiedId] = useState(null)

  /* -------------------- NETWORK -------------------- */
  useEffect(() => {
    async function fetchNetwork() {
      if (!window.ethereum) return

      const provider = new ethers.BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()
      const chainId = Number(network.chainId)

      const NETWORKS = {
        1: "Ethereum Mainnet",
        11155111: "Sepolia Testnet",
        5: "Goerli Testnet",
        8082: "Shardeum Liberty Testnet",
        8081: "Shardeum Sphinx Testnet",
        8119: "Shardeum EVM Testnet",
      }

      setNetworkName(NETWORKS[chainId] || `Unknown (${chainId})`)
    }

    fetchNetwork()
    window.ethereum?.on("chainChanged", () => fetchNetwork())

    return () => {
      window.ethereum?.removeListener("chainChanged", fetchNetwork)
    }
  }, [])

  /* -------------------- WALLET BALANCE -------------------- */
  useEffect(() => {
    async function fetchBalance() {
      if (!window.ethereum) return

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const balance = await provider.getBalance(await signer.getAddress())

      setWalletBalance(`${ethers.formatEther(balance).slice(0, 10)} SHM`)
    }

    fetchBalance()
    window.ethereum?.on("accountsChanged", fetchBalance)

    return () => {
      window.ethereum?.removeListener("accountsChanged", fetchBalance)
    }
  }, [])

  /* -------------------- HELPERS -------------------- */
  const totalValueLocked = escrows
    .filter((e) => e.state === "FUNDED" || e.state === "COMPLETED")
    .reduce((sum, e) => {
      const val = Number.parseFloat(e.totalValue)
      return sum + (isNaN(val) ? 0 : val)
    }, 0)

  const filteredEscrows = escrows.filter((e) => {
    const q = search.toLowerCase()
    const matchesSearch =
      e.freelancer?.toLowerCase().includes(q) ||
      e.title?.toLowerCase().includes(q) ||
      e.id?.toString().toLowerCase().includes(q)

    if (!matchesSearch) return false
    if (statusFilter === "ALL") return true
    if (statusFilter === "ACTIVE") {
      return e.state === "AWAITING_PAYMENT" || e.state === "FUNDED"
    }
    if (statusFilter === "COMPLETED") return e.state === "COMPLETED"
    if (statusFilter === "DISPUTED") return e.state === "DISPUTED"
    return true
  })

  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes} MINUTES AGO`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} HOURS AGO`
    return `${Math.floor(hours / 24)} DAYS AGO`
  }

  const truncateAddress = (addr) => {
    if (!addr) return ""
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRefresh = () => {
    setSearch("")
    setStatusFilter("ALL")
    setLastSynced(new Date())
  }

  const formatSyncTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getStatusLabel = (state) => {
    if (state === "AWAITING_PAYMENT" || state === "FUNDED") return "ACTIVE"
    return state
  }

  const getStatusColor = (state) => {
    switch (state) {
      case "COMPLETED":
        return "bg-slate-700/50 text-slate-300 border-slate-600"
      case "DISPUTED":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      default:
        return "bg-[#1a3a2a] text-emerald-400 border-emerald-500/30"
    }
  }

  const getProgressColor = (state) => {
    switch (state) {
      case "COMPLETED":
        return "bg-emerald-500"
      case "DISPUTED":
        return "bg-amber-500"
      default:
        return "bg-cyan-500"
    }
  }

  /* -------------------- UI -------------------- */
  return (
    
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px" }}>Escrow Registry</h1>
        <p style={{ color: "#9ca3af", fontSize: "14px" }}>
          Protocol Network: <b>Sepolia Testnet</b>
        </p>
      </div>
    <input
      placeholder="Search Escrow registry..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "12px",
        background: "#0b1220",
        border: "1px solid #1f2933",
        color: "#fff",
        marginBottom: "20px"
      }}
    />
    <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
      <div className="kpi">
        <p>Total Value Locked</p>
        <h2>{totalValueLocked} ETH</h2>
      </div>

      <div className="p-6 lg:p-8">
        {/* TOTAL VALUE LOCKED */}
        <div className="mb-10 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5">
            <Shield className="text-cyan-400" size={32} />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Total Value Locked</p>
            <h2 className="font-mono text-4xl font-bold tracking-tight">
              {totalValueLocked.toFixed(4)} <span className="text-xl text-slate-500">SHM</span>
            </h2>
          </div>
        </div>
        

        {/* HEADER */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500">
              <span className="text-xl font-black text-black">S</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Shard Registry</h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <User size={12} />
              <span className="uppercase tracking-wide">{networkName}</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              <span className="uppercase tracking-wide">Last Synced: {formatSyncTime(lastSynced)}</span>
            </span>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            placeholder="Filter by Title or Contract Address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#151a25] bg-[#0b1018] py-4 pl-12 pr-4 text-sm text-white placeholder-slate-600 transition focus:border-cyan-500/50 focus:outline-none"
          />
        </div>

        {/* STATUS FILTERS */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {[
            { label: "ALL", color: "cyan" },
            { label: "ACTIVE", color: "cyan" },
            { label: "COMPLETED", color: "emerald" },
            { label: "DISPUTED", color: "amber" },
          ].map(({ label, color }) => (
            <button
              key={label}
              onClick={() => setStatusFilter(label)}
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition
                ${
                  statusFilter === label
                    ? color === "cyan"
                      ? "bg-cyan-500 text-black"
                      : color === "emerald"
                        ? "bg-emerald-500 text-black"
                        : "bg-amber-500 text-black"
                    : "border border-[#1a1f2e] bg-transparent text-slate-500 hover:border-slate-600 hover:text-slate-300"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ESCROW CARDS */}
        {filteredEscrows.length === 0 ? (
          <div className="mt-20 rounded-2xl border border-dashed border-[#1a1f2e] p-20 text-center">
            <h3 className="mb-2 text-xl font-semibold text-slate-400">Genesis Pending</h3>
            <p className="text-sm text-slate-600">No escrows found for this filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredEscrows.map((escrow) => (
              <div
                key={escrow.id}
                className="group rounded-2xl border border-[#151a25] bg-[#0b1018] p-5 transition hover:border-cyan-500/20"
              >
                {/* Status Badge + Address */}
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(
                      escrow.state,
                    )}`}
                  >
                    {getStatusLabel(escrow.state)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(escrow.freelancer, escrow.id)}
                    className="flex items-center gap-1.5 rounded bg-[#151a25] px-2 py-1 text-slate-500 transition hover:text-slate-300"
                  >
                    <span className="font-mono text-[11px]">{truncateAddress(escrow.freelancer)}</span>
                    {copiedId === escrow.id ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  </button>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold tracking-tight">{escrow.title}</h3>

                {/* Contractor */}
                <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                  <User size={13} />
                  <span className="font-medium">Contractor</span>
                </div>

                {/* On-Chain Balance */}
                <div className="mb-4 rounded-xl bg-[#080c14] p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                      On-Chain Balance
                    </span>
                    {escrow.fundsLocked === "0.00000000" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                        No Funds Locked
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-2xl font-bold">
                    {escrow.totalValue} <span className="text-sm text-slate-500">SHM</span>
                  </p>
                  <p className="font-mono text-xs text-slate-600">{escrow.fundsLocked} SHM</p>
                </div>

                {/* Progress */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500">Progress</span>
                    <span className="font-mono font-bold text-slate-400">{escrow.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#151a25]">
                    <div
                      className={`h-full rounded-full transition-all ${getProgressColor(escrow.state)}`}
                      style={{ width: `${escrow.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[#151a25] pt-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                    <Clock size={12} />
                    {formatTimeAgo(escrow.createdAt)}
                  </span>
                  <button
                    onClick={() => setSelectedEscrow(escrow)}
                    className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black transition hover:bg-cyan-400"
                  >
                    Inspect Escrow
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-red-500 text-white p-6 text-3xl">
  TAILWIND TEST
</div>
    </div>
    
  )
}

export default Dashboard
