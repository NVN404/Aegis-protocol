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
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Subtle Warm Background Glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 z-0 h-96 w-[700px] rounded-full bg-[#ff6b00]/[0.06] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Typography, Copy, and CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Version & Precompile Badge */}
            <div className="group mb-5 inline-flex items-center gap-2 rounded-full border border-[#ff6b00]/30 bg-[#ff6b00]/[0.08] px-3.5 py-1.5 text-[12px] font-medium tracking-tight text-[#cc5400] transition-all hover:border-[#ff6b00]/50 hover:bg-[#ff6b00]/[0.12]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#ff6b00]/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff6b00]" />
              </span>
              <span className="font-semibold">Monad Precompile 0x0100</span>
              <span className="text-neutral-400">·</span>
              <span>Flat 6,900 Gas</span>
              <span className="text-neutral-400">·</span>
              <span className="font-mono text-[11px]">EIP-7951 / RIP-7212</span>
            </div>

            {/* Main Title */}
            <h1 className="text-[44px] font-bold leading-[1.02] tracking-tight text-[#0a0a0a] sm:text-6xl lg:text-[72px]">
              Aegis Protocol
            </h1>

            {/* Editorial Display Subtitle */}
            <p
              className="mt-4 max-w-2xl text-xl font-normal leading-snug tracking-tight text-neutral-800 sm:mt-5 sm:text-2xl lg:text-3xl"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              The Sovereign, Seedless Hardware Wallet &amp; Silicon Proof of Personhood
            </p>

            {/* Punchy Tagline */}
            <p className="mt-3 text-[16px] font-semibold text-[#ff6b00] sm:text-lg">
              Trapped in Silicon. 6,900 Gas. Zero Seed Phrases.
            </p>

            {/* Narrative Summary */}
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-600 sm:text-base">
              Aegis turns the physical silicon chips already inside 3+ billion smartphones &amp;
              laptops (<strong className="text-neutral-900 font-semibold">Apple Secure Enclave</strong>,{" "}
              <strong className="text-neutral-900 font-semibold">Google Titan M2</strong>) into sovereign
              Smart Contract Accounts on Monad. Cryptographically verified in{" "}
              <span className="font-mono font-bold text-neutral-900">6,900 gas (&lt; 0.05ms)</span>.
            </p>

            {/* Interactive Terminal Command Box */}
            <div className="mt-8 w-full max-w-xl">
              {/* Tab Selector */}
              <div className="flex items-center gap-1 mb-2 px-1">
                {(["npm", "npx", "forge"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveCommandTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
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
                className="group relative flex w-full cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-2xl bg-[#111111] px-4 py-3.5 text-neutral-100 shadow-[0_14px_30px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-black/30 transition-all hover:bg-[#1a1a1a] active:scale-[0.99]"
              >
                <div className="flex min-w-0 items-center gap-2.5 truncate font-mono text-[13px] text-neutral-200">
                  <span className="text-[#ff6b00] font-bold">$</span>
                  <span className="truncate">{commands[activeCommandTab]}</span>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400 transition-colors group-hover:text-neutral-100">
                  <span>{copied ? "Copied" : "Copy"}</span>
                  {copied ? (
                    <Check size={16} className="text-emerald-400" />
                  ) : (
                    <Copy size={16} className="text-neutral-400 transition-transform group-hover:-translate-y-0.5" />
                  )}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex w-full max-w-xl flex-col gap-3.5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onOpenWallet}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#0a0a0a] px-7 py-4 text-[15px] font-bold text-white shadow-[0_14px_32px_-8px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.14)] ring-1 ring-black/40 transition-all hover:bg-[#181818] hover:shadow-[0_20px_40px_-8px_rgba(255,107,0,0.3)] active:scale-[0.98]"
              >
                <Smartphone size={18} className="text-[#ff6b00]" />
                <span>Launch Interactive Wallet</span>
                <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-neutral-300">
                  Live
                </span>
              </button>

              <a
                href="#paradigm"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-[15px] font-semibold text-neutral-900 shadow-[0_3px_10px_-2px_rgba(0,0,0,0.06)] transition-all hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] active:scale-[0.98]"
              >
                <span>Why Aegis Wins</span>
                <span className="text-neutral-400">→</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Hardware Silicon Visualizer */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-[0_20px_50px_-15px_rgba(15,15,15,0.12),0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0a0a0a] text-white">
                    <Cpu size={18} className="text-[#ff6b00]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">Hardware Silicon Enclave</h3>
                    <p className="text-[11px] font-mono text-neutral-500">NIST P-256 (secp256r1)</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Precompile 0x0100
                </span>
              </div>

              {/* Interactive Biometric Trigger Box */}
              <div className="my-6 rounded-2xl bg-[#0e0e0e] p-6 text-white text-center relative overflow-hidden shadow-inner">
                {/* Background Grid Accent */}
                <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={runSimulatedEnclave}
                    className={`group relative flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-300 ${
                      simulatedState === "touching"
                        ? "bg-[#ff6b00] scale-95 shadow-[0_0_30px_rgba(255,107,0,0.8)]"
                        : simulatedState === "verified"
                        ? "bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.8)]"
                        : "bg-[#1e1e1e] hover:bg-[#282828] border border-neutral-700"
                    }`}
                  >
                    <Fingerprint
                      size={44}
                      className={`transition-transform duration-300 ${
                        simulatedState === "touching"
                          ? "scale-110 text-white animate-pulse"
                          : simulatedState === "verified"
                          ? "scale-110 text-white"
                          : "text-[#ff6b00] group-hover:scale-105"
                      }`}
                    />
                  </button>

                  <p className="mt-4 text-xs font-medium text-neutral-300">
                    {simulatedState === "touching"
                      ? "Verifying with Apple Secure Enclave..."
                      : simulatedState === "verified"
                      ? "Hardware Biometric Signature Valid!"
                      : "Tap to simulate Biometric Silicon Signature"}
                  </p>

                  <div className="mt-3 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-mono text-neutral-300">
                    <span>Target:</span>
                    <span className="text-[#ff6b00] font-bold">Monad 0x0100 (6,900 Gas)</span>
                  </div>
                </div>
              </div>

              {/* Cryptographic Signature Telemetry */}
              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2 border border-neutral-200/80">
                  <span className="text-neutral-500">Public Key (Qx, Qy)</span>
                  <span className="font-bold text-neutral-800">
                    {simulatedState === "verified" ? "0x789a...b142" : "Trapped in Device"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2 border border-neutral-200/80">
                  <span className="text-neutral-500">Gas Verification Cost</span>
                  <span className="font-bold text-emerald-600">6,900 flat gas (-98.2%)</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2 border border-neutral-200/80">
                  <span className="text-neutral-500">Proof of Personhood</span>
                  <span className="font-bold text-[#ff6b00]">1 Device = 1 Human Identity</span>
                </div>
              </div>

              {/* Action Trigger inside card */}
              <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[12px] font-medium text-neutral-600">
                  Ready to test on Monad Testnet?
                </span>
                <button
                  type="button"
                  onClick={onOpenWallet}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#ff6b00] hover:text-[#cc5400] transition"
                >
                  <span>Open Full Wallet</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
