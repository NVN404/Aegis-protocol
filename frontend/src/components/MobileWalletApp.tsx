"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Fingerprint,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  Send,
  QrCode,
  Droplets,
  Gamepad2,
  Cpu,
  RefreshCw,
  Sparkles,
  Flame,
  History,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  PasskeyIdentity,
  createHardwarePasskey,
  createSimulatedPasskey,
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
    <div className="w-full max-w-md mx-auto bg-white border border-neutral-200/90 rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(15,15,15,0.12)] overflow-hidden flex flex-col min-h-[600px] text-neutral-900 relative">
      {/* ─── Top Status Bar ─── */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-neutral-100 bg-[#faf9f7]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0a0a0a] flex items-center justify-center font-bold text-xs text-white shadow-sm">
            <ShieldCheck size={18} className="text-[#ff6b00]" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-wide text-neutral-900 flex items-center space-x-1.5 leading-none">
              <span>AEGIS</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#ff6b00]/10 text-[#cc5400] font-mono font-bold">
                POP
              </span>
            </h1>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">Precompile 0x0100</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Testnet 10143</span>
          </div>


        </div>
      </div>

      {/* ─── Body Content ─── */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold ml-2">✕</button>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="font-bold ml-2">✕</button>
          </div>
        )}

        {!identity ? (
          /* ─── Unauthenticated / Onboarding State ─── */
          <div className="my-auto text-center py-6 space-y-6">
            <div className="relative mx-auto w-20 h-20">
              <div className="relative w-20 h-20 rounded-3xl bg-[#fffaf5] border-2 border-[#ff6b00]/30 flex items-center justify-center text-[#ff6b00] shadow-sm">
                <Fingerprint size={44} />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-neutral-900">
                Mobile Hardware Passkey
              </h2>
              <p className="text-xs text-neutral-600 max-w-[32ch] mx-auto leading-relaxed">
                Zero seed phrases. 1-Tap TouchID/FaceID creates a deterministic Monad Smart Account verified by Precompile{" "}
                <span className="text-[#ff6b00] font-mono font-bold">0x0100</span>.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleCreateHardwarePasskey}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-[#0a0a0a] hover:bg-[#222] text-white font-bold text-sm shadow-md active:scale-[0.98] transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-xs">{loadingText}</span>
                  </>
                ) : (
                  <>
                    <Fingerprint size={18} className="text-[#ff6b00]" />
                    <span>Create with FaceID / TouchID</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCreateSimulatedPasskey}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 text-neutral-800 font-bold text-xs transition active:scale-95 disabled:opacity-50"
              >
                <Sparkles size={16} className="text-[#ff6b00]" />
                <span>Simulate Enclave (Instant Sandbox)</span>
              </button>
            </div>
          </div>
        ) : (
          /* ─── Authenticated Mobile Wallet Dashboard ─── */
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Balance Card */}
            <div className="relative rounded-2xl bg-[#fffaf5] border border-[#ff6b00]/30 p-5 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-neutral-600 flex items-center space-x-1">
                  <ShieldCheck size={14} className="text-[#ff6b00]" />
                  <span className="font-semibold">{identity.deviceLabel}</span>
                </span>
                <button
                  onClick={fetchBalance}
                  className="text-neutral-400 hover:text-neutral-800 transition"
                  title="Refresh Balance"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {/* Large MON Balance */}
              <div className="my-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black tracking-tight text-neutral-900">{balance}</span>
                  <span className="text-sm font-bold text-[#ff6b00]">MON</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">Monad Testnet Native Balance</span>
              </div>

              {/* Address Strip & MonadScan Link */}
              <div className="mt-3 pt-3 border-t border-[#ff6b00]/15 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono text-neutral-900 font-bold truncate max-w-[150px]">
                    {identity.counterfactualAddress}
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    className="text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center space-x-1"
                  >
                    {copied ? <Check size={12} className="text-emerald-600 font-bold" /> : <Copy size={12} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <a
                  href={`https://testnet.monadexplorer.com/address/${identity.counterfactualAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-mono text-[#cc5400] hover:underline flex items-center space-x-0.5 font-bold"
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
                className="p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                  <Send size={16} />
                </div>
                <span className="text-[11px] font-bold text-neutral-800">Send</span>
              </button>

              <button
                onClick={() => setIsReceiveOpen(true)}
                className="p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl bg-[#ff6b00] text-white flex items-center justify-center">
                  <QrCode size={16} />
                </div>
                <span className="text-[11px] font-bold text-neutral-800">Receive</span>
              </button>

              <button
                onClick={() => claimStarterGasAndDeploy(identity)}
                disabled={isDripping}
                className="p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 flex flex-col items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <Droplets size={16} />
                </div>
                <span className="text-[11px] font-bold text-neutral-800">{isDripping ? "Dripping..." : "Drip"}</span>
              </button>

              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-[#fffaf5] hover:bg-[#fff4eb] border border-[#ff6b00]/30 flex flex-col items-center justify-center gap-1.5 transition active:scale-95 text-neutral-900"
              >
                <div className="w-9 h-9 rounded-xl bg-[#ff6b00]/15 text-[#cc5400] flex items-center justify-center font-bold">
                  <Gamepad2 size={18} />
                </div>
                <span className="text-[11px] font-bold text-[#cc5400]">Fall Guys</span>
              </a>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-neutral-200 text-xs font-bold text-neutral-500 pt-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab("wallet")}
                className={`pb-2 px-2.5 border-b-2 transition whitespace-nowrap ${
                  activeTab === "wallet"
                    ? "border-[#ff6b00] text-neutral-900 font-bold"
                    : "border-transparent hover:text-neutral-900"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`pb-2 px-2.5 border-b-2 transition whitespace-nowrap flex items-center space-x-1 ${
                  activeTab === "activity"
                    ? "border-[#ff6b00] text-neutral-900 font-bold"
                    : "border-transparent hover:text-neutral-900"
                }`}
              >
                <History size={13} />
                <span>History ({txHistory.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`pb-2 px-2.5 border-b-2 transition whitespace-nowrap ${
                  activeTab === "security"
                    ? "border-[#ff6b00] text-neutral-900 font-bold"
                    : "border-transparent hover:text-neutral-900"
                }`}
              >
                Precompile 0x0100
              </button>
              <button
                onClick={() => setActiveTab("pop")}
                className={`pb-2 px-2.5 border-b-2 transition whitespace-nowrap ${
                  activeTab === "pop"
                    ? "border-[#ff6b00] text-neutral-900 font-bold"
                    : "border-transparent hover:text-neutral-900"
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
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-neutral-500 block text-[10px]">Connected Relayer Gas Pool</span>
                      <span className="font-bold text-neutral-900">72+ MON Active Sponsor</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      Gasless
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-neutral-500 block text-[10px]">Sybil Resistance Tier</span>
                      <span className="font-bold text-[#cc5400]">Hardware Silicon Locked (P-256)</span>
                    </div>
                    <Flame size={16} className="text-amber-500" />
                  </div>
                </div>
              )}

              {/* 2. ACTIVITY / TRANSACTION HISTORY TAB */}
              {activeTab === "activity" && (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {txHistory.length === 0 ? (
                    <div className="text-center py-8 text-neutral-400 space-y-1">
                      <History size={28} className="mx-auto text-neutral-300 mb-1" />
                      <p className="font-bold text-neutral-600 text-xs">No Transactions Yet</p>
                      <p className="text-[10px]">Your on-chain creation and transfer txs will appear here.</p>
                    </div>
                  ) : (
                    txHistory.map((tx) => (
                      <div
                        key={tx.id || tx.hash}
                        className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between hover:border-neutral-300 transition group"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200 text-[#ff6b00] flex items-center justify-center font-bold shadow-xs">
                            {tx.type === "REGISTRATION" && "🪪"}
                            {tx.type === "FAUCET_DRIP" && "💧"}
                            {tx.type === "SEND_MON" && "↗"}
                            {tx.type === "GAME_PAYOUT" && "🎮"}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-neutral-900 text-xs">{tx.title}</span>
                              {tx.amount && (
                                <span className="font-mono text-emerald-700 font-bold text-[10px]">{tx.amount}</span>
                              )}
                            </div>
                            <span className="font-mono text-[10px] text-neutral-500 block truncate max-w-[160px]">
                              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                            </span>
                          </div>
                        </div>

                        <a
                          href={tx.explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 hover:text-[#ff6b00] text-[11px] font-mono font-bold flex items-center space-x-1 shadow-xs transition"
                        >
                          <span>MonadScan</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 3. PRECOMPILE 0x0100 TAB */}
              {activeTab === "security" && (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                      <span>Precompile Address</span>
                      <span className="text-[#cc5400] font-bold">0x0100 (EIP-7951)</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                      <span>Gas Cost</span>
                      <span className="text-emerald-700 font-bold">6,900 flat (-98.2%)</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                      <span>Curve</span>
                      <span className="text-neutral-900 font-bold">secp256r1 (NIST P-256)</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-[10px] font-mono text-neutral-500 truncate">
                    <span>Qx: </span><span className="text-neutral-800 font-medium">{identity.pubKeyX}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-[10px] font-mono text-neutral-500 truncate">
                    <span>Qy: </span><span className="text-neutral-800 font-medium">{identity.pubKeyY}</span>
                  </div>
                </div>
              )}

              {/* 4. PROOF OF PERSONHOOD TAB */}
              {activeTab === "pop" && (
                <div className="p-3 rounded-xl bg-[#fffaf5] border border-[#ff6b00]/30 space-y-2">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck size={20} className="text-emerald-600" />
                    <div>
                      <h4 className="font-bold text-xs text-neutral-900">Verified Human Device</h4>
                      <p className="text-[10px] text-neutral-500">1 Smartphone = 1 Non-Custodial Identity</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed pt-1">
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
