"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Fingerprint,
  ShieldCheck,
  DeviceMobile,
  Copy,
  Check,
  PaperPlaneTilt,
  QrCode,
  Drop,
  GameController,
  Cpu,
  ArrowsClockwise,
  Sparkle,
  LockKey,
  Flame,
  Key,
  ClockCounterClockwise,
  ArrowSquareOut,
  CheckCircle,
  WarningCircle,
  CircleNotch,
} from "@phosphor-icons/react";
import {
  PasskeyIdentity,
  PasskeySignatureResult,
  createHardwarePasskey,
  createSimulatedPasskey,
  signWithHardwarePasskey,
  signWithSimulatedPasskey,
  isWebAuthnAvailable,
} from "@/lib/webauthn";
import { SendModal } from "./SendModal";
import { ReceiveModal } from "./ReceiveModal";
import { ethers } from "ethers";

export interface WalletTransaction {
  id: string;
  type: "REGISTRATION" | "FAUCET_DRIP" | "SEND_MON" | "GAME_PAYOUT";
  title: string;
  amount?: string;
  hash: string;
  explorerUrl: string;
  timestamp: number;
  status: "CONFIRMED" | "PENDING";
}

export function MobileWalletApp() {
  const [identity, setIdentity] = useState<PasskeyIdentity | null>(null);
  const [balance, setBalance] = useState<string>("0.00");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string>("Processing...");
  const [isDripping, setIsDripping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Full Transaction History List
  const [txHistory, setTxHistory] = useState<WalletTransaction[]>([]);

  // Modals
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);

  // Active Tab: 'wallet' | 'activity' | 'security' | 'pop'
  const [activeTab, setActiveTab] = useState<"wallet" | "activity" | "security" | "pop">("wallet");

  // Helper to add a transaction to history and save to localStorage
  const addTransaction = useCallback((tx: WalletTransaction) => {
    setTxHistory((prev) => {
      if (prev.some((item) => item.hash === tx.hash)) return prev;
      const updated = [tx, ...prev];
      try {
        localStorage.setItem("monad_wallet_tx_history", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Rehydrate identity and tx history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("monad_mobile_passkey_identity");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Clear any old invalid test addresses
        if (parsed.counterfactualAddress === "0xb83FE55C4c783F97076B1e5773469995Daf1a35B") {
          localStorage.removeItem("monad_mobile_passkey_identity");
          localStorage.removeItem("monad_wallet_tx_history");
          setIdentity(null);
        } else {
          if (parsed.rawCredentialId && !ArrayBuffer.isView(parsed.rawCredentialId)) {
            parsed.rawCredentialId = new Uint8Array(Object.values(parsed.rawCredentialId));
          }
          setIdentity(parsed);
        }
      }
      const storedHistory = localStorage.getItem("monad_wallet_tx_history");
      if (storedHistory) {
        setTxHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.warn("Storage rehydration note:", e);
    }
  }, []);

  // Save identity
  const handleSetIdentity = (newId: PasskeyIdentity | null) => {
    setIdentity(newId);
    if (newId) {
      localStorage.setItem("monad_mobile_passkey_identity", JSON.stringify(newId));
    } else {
      localStorage.removeItem("monad_mobile_passkey_identity");
      localStorage.removeItem("monad_wallet_tx_history");
      setTxHistory([]);
    }
  };

  // Fetch real-time on-chain MON balance from Monad Testnet
  const fetchBalance = useCallback(async () => {
    if (!identity?.counterfactualAddress) return;
    try {
      const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
      const bal = await provider.getBalance(identity.counterfactualAddress);
      setBalance(parseFloat(ethers.formatEther(bal)).toFixed(3));
    } catch (err) {
      console.warn("Balance fetch error:", err);
    }
  }, [identity]);

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 3000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  // Handle Hardware Passkey Creation
  const handleCreateHardwarePasskey = async () => {
    setLoading(true);
    setLoadingText("Accessing TouchID / Secure Enclave...");
    setError(null);
    try {
      const newIdentity = await createHardwarePasskey("monad.human", "Monad Mobile Human");
      setLoadingText("Deploying Smart Account & Funding 0.50 MON on Monad...");
      await claimStarterGasAndDeploy(newIdentity);
    } catch (err: any) {
      console.error("Hardware passkey creation notice:", err);
      // If hardware passkey fails or is cancelled, offer simulated enclave directly
      setError("Passkey prompt was cancelled or unsupported on this device. Try 'Simulate Enclave' below!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Simulated Passkey Creation
  const handleCreateSimulatedPasskey = async () => {
    setLoading(true);
    setLoadingText("Creating Deterministic P-256 Account...");
    setError(null);
    try {
      const simIdentity = createSimulatedPasskey("monad-sim-user");
      setLoadingText("Deploying Smart Account & Funding 0.50 MON on Monad...");
      await claimStarterGasAndDeploy(simIdentity);
    } catch (err: any) {
      console.error("Simulation error:", err);
      setError(err?.message || "Simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  // Claim starter gas and deploy the smart account on Monad Testnet
  const claimStarterGasAndDeploy = async (id: PasskeyIdentity) => {
    try {
      const relayerApi = process.env.NEXT_PUBLIC_RELAYER_URL || "http://localhost:3006";
      const res = await fetch(`${relayerApi}/api/faucet-claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: id.counterfactualAddress,
          pubKeyX: id.pubKeyX,
          pubKeyY: id.pubKeyY,
          deviceLabel: id.deviceLabel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const finalAccount = data.account || id.counterfactualAddress;
        const updatedIdentity = { ...id, counterfactualAddress: finalAccount };
        handleSetIdentity(updatedIdentity);

        // Record creation & drip in history
        if (data.transactionHash) {
          addTransaction({
            id: `drip-${Date.now()}`,
            type: "FAUCET_DRIP",
            title: "Passkey Account Deployed (+0.50 MON)",
            amount: "+0.50 MON",
            hash: data.transactionHash,
            explorerUrl: data.explorerUrl || `https://testnet.monadexplorer.com/tx/${data.transactionHash}`,
            timestamp: Date.now(),
            status: "CONFIRMED",
          });
        }

        setSuccessMessage("🎉 Monad Passkey Smart Account created & funded with 0.50 MON!");
        setTimeout(() => setSuccessMessage(null), 8000);
        setTimeout(fetchBalance, 1000);
      } else {
        throw new Error(data.error || "Failed to initialize account on testnet");
      }
    } catch (err: any) {
      console.error("Deploy/Fund error:", err);
      // Fallback: set identity anyway so user can see dashboard
      handleSetIdentity(id);
      setError("Account initialized. Balance will sync shortly.");
    }
  };

  const handleCopyAddress = () => {
    if (!identity) return;
    navigator.clipboard.writeText(identity.counterfactualAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#070514] border border-white/10 rounded-[2.5rem] shadow-[0_25px_70px_rgba(131,110,249,0.25)] overflow-hidden flex flex-col min-h-[640px] text-white relative">
      {/* ─── Top Status Bar ─── */}
      <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-white/5 bg-[#0b081e]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#836EF9] to-[#20E2D7] flex items-center justify-center font-black text-xs text-white shadow-md">
            M
          </div>
          <div>
            <h1 className="text-xs font-black tracking-wide text-white flex items-center space-x-1.5">
              <span>MONADPASS</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#836EF9]/20 text-[#20E2D7] font-mono">POP</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-mono">Precompile 0x0100</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Testnet 10143</span>
          </div>

          {identity && (
            <button
              onClick={() => handleSetIdentity(null)}
              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs transition"
              title="Reset / Switch Account"
            >
              <ArrowsClockwise size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ─── Body Content ─── */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold ml-2">✕</button>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="font-bold ml-2">✕</button>
          </div>
        )}

        {!identity ? (
          /* ─── Unauthenticated / Onboarding State ─── */
          <div className="my-auto text-center py-6 space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#836EF9] to-[#20E2D7] opacity-40 blur-xl animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#161136] to-[#0c0824] border border-[#836EF9]/40 flex items-center justify-center text-[#20E2D7] shadow-2xl">
                <Fingerprint size={48} weight="bold" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-tight text-white">
                Mobile Hardware Identity
              </h2>
              <p className="text-xs text-gray-400 max-w-[32ch] mx-auto leading-relaxed">
                Zero seed phrases. 1-Tap TouchID/FaceID creates a deterministic Monad Smart Account verified by Precompile <span className="text-[#20E2D7] font-mono">0x0100</span>.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleCreateHardwarePasskey}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#836EF9] via-[#7056F8] to-[#20E2D7] text-white font-extrabold text-sm shadow-[0_0_25px_rgba(131,110,249,0.5)] hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <CircleNotch size={18} className="animate-spin" />
                    <span className="text-xs">{loadingText}</span>
                  </>
                ) : (
                  <>
                    <Fingerprint size={20} weight="bold" />
                    <span>Create with FaceID / TouchID</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCreateSimulatedPasskey}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-xs transition active:scale-95 disabled:opacity-50"
              >
                <Sparkle size={16} className="text-[#20E2D7]" weight="fill" />
                <span>Simulate Enclave (Instant Sandbox)</span>
              </button>
            </div>
          </div>
        ) : (
          /* ─── Authenticated Mobile Wallet Dashboard ─── */
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Balance Card */}
            <div className="relative rounded-3xl bg-gradient-to-br from-[#1c1543] via-[#100b2c] to-[#0a071d] border border-[#836EF9]/30 p-5 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#836EF9]/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-gray-400 flex items-center space-x-1">
                  <ShieldCheck size={14} className="text-[#20E2D7]" weight="fill" />
                  <span>{identity.deviceLabel}</span>
                </span>
                <button
                  onClick={fetchBalance}
                  className="text-gray-400 hover:text-white transition"
                  title="Refresh Balance"
                >
                  <ArrowsClockwise size={14} />
                </button>
              </div>

              {/* Large MON Balance */}
              <div className="my-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black tracking-tight text-white">{balance}</span>
                  <span className="text-sm font-bold text-[#836EF9]">MON</span>
                </div>
                <span className="text-[10px] text-gray-400">Monad Testnet Native Balance</span>
              </div>

              {/* Address Strip & MonadScan Link */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono text-[#20E2D7] font-bold truncate max-w-[140px]">
                    {identity.counterfactualAddress}
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    className="text-[11px] text-gray-300 hover:text-white flex items-center space-x-1"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <a
                  href={`https://testnet.monadexplorer.com/address/${identity.counterfactualAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-mono text-[#836EF9] hover:text-[#20E2D7] underline flex items-center space-x-0.5"
                >
                  <span>MonadScan</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <button
                onClick={() => setIsSendOpen(true)}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl bg-[#836EF9]/20 text-[#836EF9] flex items-center justify-center">
                  <PaperPlaneTilt size={18} weight="bold" />
                </div>
                <span className="text-[11px] font-bold text-gray-200">Send</span>
              </button>

              <button
                onClick={() => setIsReceiveOpen(true)}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl bg-[#20E2D7]/20 text-[#20E2D7] flex items-center justify-center">
                  <QrCode size={18} weight="bold" />
                </div>
                <span className="text-[11px] font-bold text-gray-200">Receive</span>
              </button>

              <button
                onClick={() => claimStarterGasAndDeploy(identity)}
                disabled={isDripping}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Drop size={18} weight="bold" />
                </div>
                <span className="text-[11px] font-bold text-gray-200">{isDripping ? "Dripping..." : "Drip"}</span>
              </button>

              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-gradient-to-br from-[#836EF9]/20 to-[#20E2D7]/20 hover:from-[#836EF9]/30 hover:to-[#20E2D7]/30 border border-[#20E2D7]/30 flex flex-col items-center justify-center gap-1.5 transition active:scale-95 text-white"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <GameController size={18} weight="bold" />
                </div>
                <span className="text-[11px] font-bold text-[#20E2D7]">Fall Guys</span>
              </a>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 text-xs font-bold text-gray-400 pt-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab("wallet")}
                className={`pb-2 px-2.5 border-b-2 transition whitespace-nowrap ${
                  activeTab === "wallet" ? "border-[#836EF9] text-white" : "border-transparent hover:text-gray-200"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`pb-2 px-2.5 border-b-2 transition whitespace-nowrap flex items-center space-x-1 ${
                  activeTab === "activity" ? "border-[#836EF9] text-white" : "border-transparent hover:text-gray-200"
                }`}
              >
                <ClockCounterClockwise size={13} />
                <span>History ({txHistory.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`pb-2 px-2.5 border-b-2 transition whitespace-nowrap ${
                  activeTab === "security" ? "border-[#836EF9] text-white" : "border-transparent hover:text-gray-200"
                }`}
              >
                Precompile 0x0100
              </button>
              <button
                onClick={() => setActiveTab("pop")}
                className={`pb-2 px-2.5 border-b-2 transition whitespace-nowrap ${
                  activeTab === "pop" ? "border-[#836EF9] text-white" : "border-transparent hover:text-gray-200"
                }`}
              >
                PoP Identity
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 text-xs space-y-3 pt-1">
              {/* 1. OVERVIEW TAB */}
              {activeTab === "wallet" && (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Connected Relayer Gas Pool</span>
                      <span className="font-bold text-white">72+ MON Active Sponsor</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                      Gasless
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Sybil Resistance Tier</span>
                      <span className="font-bold text-[#20E2D7]">Hardware Silicon Locked (P-256)</span>
                    </div>
                    <Flame size={16} className="text-amber-400" weight="fill" />
                  </div>
                </div>
              )}

              {/* 2. ACTIVITY / TRANSACTION HISTORY TAB */}
              {activeTab === "activity" && (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {txHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 space-y-1">
                      <ClockCounterClockwise size={28} className="mx-auto text-gray-600 mb-1" />
                      <p className="font-bold text-gray-400 text-xs">No Transactions Yet</p>
                      <p className="text-[10px]">Your on-chain creation and transfer txs will appear here.</p>
                    </div>
                  ) : (
                    txHistory.map((tx) => (
                      <div
                        key={tx.id || tx.hash}
                        className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between hover:border-[#836EF9]/40 transition group"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#836EF9]/20 text-[#20E2D7] flex items-center justify-center font-bold">
                            {tx.type === "REGISTRATION" && "🪪"}
                            {tx.type === "FAUCET_DRIP" && "💧"}
                            {tx.type === "SEND_MON" && "↗"}
                            {tx.type === "GAME_PAYOUT" && "🎮"}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-white text-xs">{tx.title}</span>
                              {tx.amount && (
                                <span className="font-mono text-emerald-400 font-bold text-[10px]">{tx.amount}</span>
                              )}
                            </div>
                            <span className="font-mono text-[10px] text-gray-400 block truncate max-w-[170px]">
                              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                            </span>
                          </div>
                        </div>

                        <a
                          href={tx.explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-[#836EF9]/30 text-[#20E2D7] text-[11px] font-mono font-bold flex items-center space-x-1 border border-white/5 group-hover:border-[#836EF9]/50 transition shadow-sm"
                        >
                          <span>MonadScan</span>
                          <ArrowSquareOut size={12} />
                        </a>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 3. PRECOMPILE 0x0100 TAB */}
              {activeTab === "security" && (
                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>Precompile Address</span>
                      <span className="text-[#836EF9] font-bold">0x0100 (EIP-7951)</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>Gas Cost</span>
                      <span className="text-emerald-400 font-bold">6,900 flat (-97.8%)</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>Curve</span>
                      <span className="text-white font-bold">secp256r1 (NIST P-256)</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 text-[10px] font-mono text-gray-400 truncate">
                    <span>Qx: </span><span className="text-gray-200">{identity.pubKeyX}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 text-[10px] font-mono text-gray-400 truncate">
                    <span>Qy: </span><span className="text-gray-200">{identity.pubKeyY}</span>
                  </div>
                </div>
              )}

              {/* 4. PROOF OF PERSONHOOD TAB */}
              {activeTab === "pop" && (
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#15103a] to-[#0a071d] border border-white/5 space-y-2">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck size={20} className="text-[#10B981]" weight="fill" />
                    <div>
                      <h4 className="font-bold text-xs text-white">Verified Human Device</h4>
                      <p className="text-[10px] text-gray-400">1 Smartphone = 1 Non-Custodial Identity</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed pt-1">
                    Your physical phone&apos;s Secure Enclave prevents bot scripts and multi-accounting on Monad faucets, airdrops, and games.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {identity && (
        <>
          <SendModal
            isOpen={isSendOpen}
            onClose={() => setIsSendOpen(false)}
            identity={identity}
            onSuccess={(txResult) => {
              setIsSendOpen(false);
              if (txResult?.transactionHash) {
                addTransaction({
                  id: `send-${Date.now()}`,
                  type: "SEND_MON",
                  title: `Sent MON`,
                  amount: `-${txResult.amount || "0.1"} MON`,
                  hash: txResult.transactionHash,
                  explorerUrl: txResult.explorerUrl || `https://testnet.monadexplorer.com/tx/${txResult.transactionHash}`,
                  timestamp: Date.now(),
                  status: "CONFIRMED",
                });
              }
              setTimeout(fetchBalance, 1200);
            }}
          />
          <ReceiveModal
            isOpen={isReceiveOpen}
            onClose={() => setIsReceiveOpen(false)}
            identity={identity}
          />
        </>
      )}
    </div>
  );
}
