"use client";

import React, { useState } from "react";
import {
  Fingerprint,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  Smartphone,
  Cpu,
  Terminal,
} from "lucide-react";

interface HeroSectionProps {
  onOpenWallet: () => void;
}

export function HeroSection({ onOpenWallet }: HeroSectionProps) {
  const [activeCommandTab, setActiveCommandTab] = useState<"npm" | "npx" | "forge">("npm");
  const [copied, setCopied] = useState(false);
  const [simulatedState, setSimulatedState] = useState<"idle" | "touching" | "verified">("idle");

  const commands = {
    npm: "npm i @monad-passkey/core @monad-passkey/react",
    npx: "npx @monad-passkey/cli init aegis-wallet",
    forge: "forge test --match-contract PasskeyAccountTest -vvv",
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runSimulatedEnclave = () => {
    if (simulatedState === "touching") return;
    setSimulatedState("touching");
    setTimeout(() => {
      setSimulatedState("verified");
      setTimeout(() => setSimulatedState("idle"), 4000);
    }, 1200);
  };

  return (
    <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Subtle Warm Background Glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 z-0 h-72 sm:h-96 w-full max-w-[700px] rounded-full bg-[#ff6b00]/[0.06] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Typography, Copy, and CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Version & Precompile Badge */}
            <div className="group mb-4 sm:mb-5 inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#ff6b00]/30 bg-[#ff6b00]/[0.08] px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-[12px] font-medium tracking-tight text-[#cc5400] transition-all hover:border-[#ff6b00]/50 hover:bg-[#ff6b00]/[0.12] flex-wrap">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#ff6b00]/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff6b00]" />
              </span>
              <span className="font-semibold">Monad Precompile 0x0100</span>
              <span className="text-neutral-400">·</span>
              <span>6,900 Gas</span>
              <span className="text-neutral-400">·</span>
              <span className="font-mono text-[10px] sm:text-[11px]">RIP-7212 / EIP-7951</span>
            </div>

            {/* Main Title */}
            <h1 className="text-[36px] sm:text-6xl lg:text-[72px] font-bold leading-[1.05] tracking-tight text-[#0a0a0a]">
              Aegis Protocol
            </h1>

            {/* Editorial Display Subtitle */}
            <p
              className="mt-3 sm:mt-4 max-w-2xl text-lg sm:text-2xl lg:text-3xl font-normal leading-snug tracking-tight text-neutral-800"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              The Sovereign, Seedless Hardware Wallet &amp; Silicon Proof of Personhood
            </p>

            {/* Punchy Tagline */}
            <p className="mt-2.5 sm:mt-3 text-[14px] sm:text-lg font-semibold text-[#ff6b00]">
              Trapped in Silicon. 6,900 Gas. Zero Seed Phrases.
            </p>

            {/* Narrative Summary */}
            <p className="mt-3 sm:mt-4 max-w-xl text-[14px] sm:text-[15px] leading-relaxed text-neutral-600">
              Aegis turns the physical silicon chips already inside 3+ billion smartphones &amp;
              laptops (<strong className="text-neutral-900 font-semibold">Apple Secure Enclave</strong>,{" "}
              <strong className="text-neutral-900 font-semibold">Google Titan M2</strong>) into sovereign
              Smart Contract Accounts on Monad. Cryptographically verified in{" "}
              <span className="font-mono font-bold text-neutral-900">6,900 gas (&lt; 0.05ms)</span>.
            </p>

            {/* Mobile-First 1-Tap Launch Button */}
            <div className="w-full mt-5 sm:hidden">
              <button
                type="button"
                onClick={onOpenWallet}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#ff6b00] hover:bg-[#e55e00] px-5 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(255,107,0,0.35)] active:scale-98 transition cursor-pointer"
              >
                <Fingerprint size={20} />
                <span>Open Passkey Wallet (TouchID / FaceID)</span>
              </button>
            </div>

            {/* Interactive Terminal Command Box */}
            <div className="mt-6 sm:mt-8 w-full max-w-xl">
              {/* Tab Selector */}
              <div className="flex items-center gap-1 mb-2 px-1 overflow-x-auto no-scrollbar">
                {(["npm", "npx", "forge"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveCommandTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                      activeCommandTab === tab
                        ? "bg-[#151515] text-white shadow-sm"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60"
                    }`}
                  >
                    {tab === "npm" ? "npm install" : tab === "npx" ? "npx cli" : "foundry test"}
                  </button>
                ))}
              </div>

              {/* Command Pill */}
              <div
                onClick={() => handleCopy(commands[activeCommandTab])}
                className="group relative flex w-full cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-2xl bg-[#111111] px-3.5 py-3 sm:px-4 sm:py-3.5 text-neutral-100 shadow-md ring-1 ring-black/30 transition-all hover:bg-[#1a1a1a] active:scale-[0.99]"
              >
                <div className="flex min-w-0 items-center gap-2 truncate font-mono text-[12px] sm:text-[13px] text-neutral-200">
                  <span className="text-[#ff6b00] font-bold">$</span>
                  <span className="truncate">{commands[activeCommandTab]}</span>
                </div>

                <div className="flex shrink-0 items-center gap-1 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-neutral-400 transition-colors group-hover:text-neutral-100">
                  <span>{copied ? "Copied" : "Copy"}</span>
                  {copied ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <Copy size={14} className="text-neutral-400 transition-transform group-hover:-translate-y-0.5" />
                  )}
                </div>
              </div>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden sm:flex mt-8 w-full max-w-xl flex-row items-center gap-3.5">
              <button
                type="button"
                onClick={onOpenWallet}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#0a0a0a] px-7 py-4 text-[15px] font-bold text-white shadow-[0_14px_32px_-8px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.14)] ring-1 ring-black/40 transition-all hover:bg-[#181818] hover:shadow-[0_20px_40px_-8px_rgba(255,107,0,0.3)] active:scale-[0.98] cursor-pointer"
              >
                <Smartphone size={18} className="text-[#ff6b00]" />
                <span>Launch Interactive Wallet</span>
                <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-neutral-300">
                  Live
                </span>
              </button>

              <a
                href="#paradigm"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-[15px] font-semibold text-neutral-900 shadow-sm transition-all hover:border-neutral-400 hover:bg-neutral-50 active:scale-[0.98]"
              >
                <span>Why Aegis Wins</span>
                <span className="text-neutral-400">→</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Hardware Silicon Visualizer */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <div className="w-full max-w-md rounded-3xl border border-neutral-200/90 bg-white p-4 sm:p-6 shadow-[0_16px_40px_-15px_rgba(15,15,15,0.1)] relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0a0a0a] text-white">
                    <Cpu size={16} className="text-[#ff6b00]" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900">Hardware Silicon Enclave</h3>
                    <p className="text-[10px] sm:text-[11px] font-mono text-neutral-500">NIST P-256 (secp256r1)</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Precompile 0x0100
                </span>
              </div>

              {/* Silicon Visual Display */}
              <div className="my-4 sm:my-5 rounded-2xl bg-neutral-50 p-4 sm:p-5 border border-neutral-200/80 text-center relative overflow-hidden">
                <div className="flex justify-center mb-3">
                  <div
                    className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl transition-all duration-500 ${
                      simulatedState === "touching"
                        ? "bg-[#ff6b00] text-white scale-110 shadow-lg shadow-[#ff6b00]/30 animate-pulse"
                        : simulatedState === "verified"
                        ? "bg-emerald-500 text-white scale-105 shadow-md shadow-emerald-500/20"
                        : "bg-[#0a0a0a] text-white shadow-sm"
                    }`}
                  >
                    <Fingerprint size={28} className={simulatedState === "idle" ? "text-[#ff6b00]" : "text-white"} />
                  </div>
                </div>

                <div className="text-xs font-mono">
                  {simulatedState === "idle" && (
                    <>
                      <p className="font-bold text-neutral-800">Biometric Sensor Ready</p>
                      <p className="text-neutral-500 text-[11px] mt-0.5">Private key isolated in phone silicon</p>
                    </>
                  )}
                  {simulatedState === "touching" && (
                    <>
                      <p className="font-bold text-[#cc5400]">Signing inside Enclave (NIST P-256)...</p>
                      <p className="text-neutral-500 text-[11px] mt-0.5">Generating unforgeable 160-byte payload</p>
                    </>
                  )}
                  {simulatedState === "verified" && (
                    <>
                      <p className="font-bold text-emerald-700">✓ 6,900 Gas Verification Confirmed</p>
                      <p className="text-neutral-500 text-[11px] mt-0.5">0.03ms Latency · Monad Native Staticcall</p>
                    </>
                  )}
                </div>

                {/* Key specs row */}
                <div className="mt-4 grid grid-cols-3 gap-1.5 pt-3 border-t border-neutral-200/70 text-[10px] font-mono">
                  <div className="rounded-lg bg-white p-1.5 border border-neutral-200">
                    <span className="text-neutral-400 block text-[9px]">CURVE</span>
                    <span className="font-bold text-neutral-800">P-256</span>
                  </div>
                  <div className="rounded-lg bg-white p-1.5 border border-neutral-200">
                    <span className="text-neutral-400 block text-[9px]">GAS COST</span>
                    <span className="font-bold text-emerald-600">6,900</span>
                  </div>
                  <div className="rounded-lg bg-white p-1.5 border border-neutral-200">
                    <span className="text-neutral-400 block text-[9px]">LATENCY</span>
                    <span className="font-bold text-neutral-800">&lt; 0.05ms</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={runSimulatedEnclave}
                  disabled={simulatedState === "touching"}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white py-2.5 sm:py-3 text-xs font-bold transition active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  <Fingerprint size={16} className="text-[#ff6b00]" />
                  <span>{simulatedState === "touching" ? "Verifying..." : "Simulate Biometric Signing"}</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenWallet}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ff6b00]/10 hover:bg-[#ff6b00]/15 text-[#cc5400] border border-[#ff6b00]/30 py-2.5 sm:py-3 text-xs font-bold transition active:scale-98 cursor-pointer"
                >
                  <Smartphone size={16} />
                  <span>Launch Live Monad Wallet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
