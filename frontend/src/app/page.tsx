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
import { Smartphone, ExternalLink } from "lucide-react";

export default function Home() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f5f4f2] text-[#0a0a0a] flex flex-col relative overflow-x-hidden">
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

      {/* ─── Bottom-Right Floating Quick Launch Dock ─── */}
      <aside aria-label="Quick launch tools" className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsWalletModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-[#222] text-white shadow-xl border border-neutral-700 transition active:scale-95 text-xs font-bold"
        >
          <Smartphone size={16} className="text-[#ff6b00]" />
          <span>Launch Wallet</span>
        </button>

        <a
          href="https://testnet.monadexplorer.com"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2.5 rounded-full bg-white/90 hover:bg-white border border-neutral-200 text-neutral-800 shadow-md backdrop-blur-md transition active:scale-95 text-xs font-bold"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Monad Explorer</span>
          <ExternalLink size={13} className="text-neutral-500" />
        </a>
      </aside>
    </main>
  );
}
