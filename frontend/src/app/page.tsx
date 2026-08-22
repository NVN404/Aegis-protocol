"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ParadigmShiftSection } from "@/components/ParadigmShiftSection";
import { ArchitectureFlowSection } from "@/components/ArchitectureFlowSection";
import { EcosystemSuiteSection } from "@/components/EcosystemSuiteSection";
import { SdkPlaygroundSection } from "@/components/SdkPlaygroundSection";
import { GasBenchmarkSection } from "@/components/GasBenchmarkSection";
import { LiveContractsSection } from "@/components/LiveContractsSection";
import { FaqSection } from "@/components/FaqSection";
import { InteractiveWalletModal } from "@/components/InteractiveWalletModal";
import { Footer } from "@/components/Footer";
import { Smartphone, ExternalLink, Fingerprint } from "lucide-react";

export default function Home() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f5f4f2] text-[#0a0a0a] flex flex-col relative overflow-x-hidden pb-16 sm:pb-0">
      {/* Floating Pill Navbar */}
      <Navbar onOpenWallet={() => setIsWalletModalOpen(true)} />

      {/* Hero Section */}
      <HeroSection onOpenWallet={() => setIsWalletModalOpen(true)} />

      {/* The Paradigm Shift: Why Aegis Wins */}
      <ParadigmShiftSection />

      {/* System Architecture & Cryptography Deep-Dive */}
      <ArchitectureFlowSection />

      {/* Complete Ecosystem Product Suite */}
      <EcosystemSuiteSection onOpenWallet={() => setIsWalletModalOpen(true)} />

      {/* Developer SDK & Code Playground */}
      <SdkPlaygroundSection />

      {/* Gas Benchmarks & Latency */}
      <GasBenchmarkSection />

      {/* Live Monad Testnet Contracts */}
      <LiveContractsSection />

      {/* Technical FAQ */}
      <FaqSection />

      {/* Footer */}
      <Footer />

      {/* Interactive Live Passkey Wallet Modal */}
      <InteractiveWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />

      {/* ─── Bottom Floating Quick Launch Dock (Mobile & Desktop) ─── */}
      <aside
        aria-label="Quick launch tools"
        className="fixed bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-auto sm:right-4 z-50 flex items-center justify-between sm:justify-end gap-2 p-1.5 rounded-full bg-white/90 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none border border-neutral-200/90 sm:border-0 shadow-lg sm:shadow-none"
      >
        <button
          type="button"
          onClick={() => setIsWalletModalOpen(true)}
          className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-full bg-[#ff6b00] hover:bg-[#e55e00] text-white shadow-md transition active:scale-95 text-xs font-bold cursor-pointer"
        >
          <Fingerprint size={16} />
          <span>Launch Passkey Wallet</span>
        </button>

        <a
          href="https://testnet.monadexplorer.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-md transition active:scale-95 text-xs font-bold"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden xs:inline">Explorer</span>
          <ExternalLink size={12} className="text-neutral-400" />
        </a>
      </aside>
    </main>
  );
}
