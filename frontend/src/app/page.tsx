"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HardwareSimulator } from "@/components/HardwareSimulator";
import { ParadigmMatrix } from "@/components/ParadigmMatrix";
import { GasBenchmark } from "@/components/GasBenchmark";
import { EcosystemTabs } from "@/components/EcosystemTabs";
import { SdkPlayground } from "@/components/SdkPlayground";
import { LiveContracts } from "@/components/LiveContracts";
import { Footer } from "@/components/Footer";
import { MobileSandboxModal } from "@/components/MobileSandboxModal";
import {
  Fingerprint,
  ShieldCheck,
  Lightning,
  Cpu,
  ArrowRight,
  Code,
  CheckCircle,
  DeviceMobile,
  LockKey,
} from "@phosphor-icons/react";

export default function Home() {
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[oklch(14%_0.02_285)] text-[oklch(96%_0.005_285)] selection:bg-[oklch(62%_0.22_285/0.3)] selection:text-[oklch(82%_0.16_195)]">
      {/* Floating Pill Navigation */}
      <Navbar onOpenWallet={() => setIsSandboxOpen(true)} />

      {/* ─── 1. HIGH-PRECISION WORKBENCH HERO ─── */}
      <section className="pt-32 pb-20 px-4 max-w-6xl mx-auto relative">
        {/* Subtle Background Radial Anchor */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[oklch(62%_0.22_285/0.12)] rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Kernel Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[oklch(18%_0.025_285)] border border-[oklch(28%_0.035_285)] text-[oklch(82%_0.16_195)] text-xs font-mono font-semibold shadow-sm">
            <Lightning size={14} weight="fill" />
            <span>MONAD PRECOMPILE 0x0100 · 6,900 FLAT GAS · EIP-7951</span>
          </div>

          {/* Solid Roman Display Headline (Hallmark rule: No AI gradient text, no italic headers) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display leading-[1.08]">
            The Sovereign, Seedless Hardware Wallet for Monad.
          </h1>

          {/* Lede Text */}
          <p className="text-base sm:text-lg text-[oklch(74%_0.015_285)] max-w-2xl mx-auto leading-relaxed">
            Turns the Apple Secure Enclave &amp; Android Titan M2 silicon in 3+ billion phones into sovereign smart contract accounts. Verified on-chain in 6,900 gas. Zero seed phrases. Zero cloud middlemen. Zero iris scans.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => setIsSandboxOpen(true)}
              className="btn-primary py-3 px-6 text-sm flex items-center gap-2 cursor-pointer shadow-xl shadow-[oklch(62%_0.22_285/0.3)]"
            >
              <Fingerprint size={20} weight="bold" />
              <span>Launch Live Passkey Wallet</span>
              <ArrowRight size={16} />
            </button>

            <a
              href="#sdk"
              className="btn-secondary py-3 px-6 text-sm flex items-center gap-2"
            >
              <Code size={18} />
              <span>Explore TypeScript SDK</span>
            </a>
          </div>

          {/* 4 Proof Metric Anchors */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 text-left">
            <div className="p-4 rounded-xl bg-[oklch(18%_0.025_285)] border border-[oklch(24%_0.03_285)]">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">6,900</div>
              <div className="text-xs text-[oklch(74%_0.015_285)] mt-0.5">Flat Gas Cost (-98.2%)</div>
              <div className="text-[10px] text-[oklch(56%_0.02_285)] mt-1 font-mono">Precompile 0x0100</div>
            </div>

            <div className="p-4 rounded-xl bg-[oklch(18%_0.025_285)] border border-[oklch(24%_0.03_285)]">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[oklch(82%_0.16_195)]">&lt; 0.05ms</div>
              <div className="text-xs text-[oklch(74%_0.015_285)] mt-0.5">Verification Latency</div>
              <div className="text-[10px] text-[oklch(56%_0.02_285)] mt-1 font-mono">10,000 TPS Monad EVM</div>
            </div>

            <div className="p-4 rounded-xl bg-[oklch(18%_0.025_285)] border border-[oklch(24%_0.03_285)]">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[oklch(78%_0.18_155)]">1 Device</div>
              <div className="text-xs text-[oklch(74%_0.015_285)] mt-0.5">= 1 Verified Human</div>
              <div className="text-[10px] text-[oklch(56%_0.02_285)] mt-1 font-mono">Silicon Anti-Sybil Registry</div>
            </div>

            <div className="p-4 rounded-xl bg-[oklch(18%_0.025_285)] border border-[oklch(24%_0.03_285)]">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">0 SaaS</div>
              <div className="text-xs text-[oklch(74%_0.015_285)] mt-0.5">Zero Cloud Middlemen</div>
              <div className="text-[10px] text-[oklch(56%_0.02_285)] mt-1 font-mono">Pure Smart Accounts</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. INTERACTIVE CRYPTOGRAPHY SIMULATOR ─── */}
      <HardwareSimulator />

      {/* ─── 3. PARADIGM MATRIX: AEGIS VS CLOUD WAAS VS WORLDCOIN ─── */}
      <ParadigmMatrix />

      {/* ─── 4. GAS & LATENCY BENCHMARK ENGINE ─── */}
      <GasBenchmark />

      {/* ─── 5. ECOSYSTEM SHOWCASE ─── */}
      <EcosystemTabs onOpenWallet={() => setIsSandboxOpen(true)} />

      {/* ─── 6. DEVELOPER QUICKSTART / SDK PLAYGROUND ─── */}
      <SdkPlayground />

      {/* ─── 7. LIVE CONTRACT DEPLOYMENTS ─── */}
      <LiveContracts />

      {/* ─── 8. STATEMENT FOOTER (Ft5) ─── */}
      <Footer />

      {/* ─── 9. INTERACTIVE LIVE WALLET MODAL SANDBOX ─── */}
      <MobileSandboxModal
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
      />
    </div>
  );
}
