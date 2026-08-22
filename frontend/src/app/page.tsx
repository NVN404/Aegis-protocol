"use client";

import React from "react";
import { MobileWalletApp } from "@/components/MobileWalletApp";
import { Lightning, ArrowSquareOut, ShieldCheck } from "@phosphor-icons/react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#03010b] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#836EF9]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#20E2D7]/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Banner on Desktop */}
      <div className="text-center mb-6 max-w-lg">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#20E2D7] text-xs font-mono font-bold mb-3 shadow-sm">
          <Lightning size={14} weight="fill" />
          <span>MONAD PRECOMPILE 0x0100 · 6,900 GAS · SUB-SECOND EVM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Monad<span className="bg-gradient-to-r from-[#836EF9] via-[#A78BFA] to-[#20E2D7] bg-clip-text text-transparent">Pass</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          The Mobile-Native Proof of Personhood &amp; Hardware Passkey Wallet for Monad
        </p>
      </div>

      {/* Mobile Wallet Screen Container */}
      <div className="w-full max-w-md z-10">
        <MobileWalletApp />
      </div>

      {/* Footer Info */}
      <footer className="mt-8 text-center text-xs text-gray-500 space-y-1">
        <p>1 Phone = 1 Verified Human · Hardware Secp256r1 Silicon Security</p>
        <p className="font-mono text-[10px] text-gray-600">Built for Monad Ecosystem &amp; Fall Guys Arena</p>
      </footer>

      {/* ─── Bottom-Right Floating Explorer Dock ─── */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        <a
          href="https://testnet.monadexplorer.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-[#0e0a26]/90 hover:bg-[#19133f] border border-[#836EF9]/40 text-white shadow-2xl backdrop-blur-xl transition active:scale-95 group text-xs font-bold"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-gray-300 group-hover:text-white">Monad Testnet Explorer</span>
          <ArrowSquareOut size={14} className="text-[#20E2D7]" />
        </a>
      </div>
    </main>
  );
}
