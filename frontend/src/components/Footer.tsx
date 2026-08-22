"use client";

import React from "react";
import { ShieldCheck, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[#eeece8] border-t border-neutral-300/70 py-12 text-neutral-800 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-neutral-300/80">
          {/* Logo & Description */}
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0a0a0a] text-white">
                <ShieldCheck size={18} className="text-[#ff6b00]" />
              </div>
              <span className="font-bold text-base text-neutral-900">Aegis Protocol</span>
              <span className="rounded-full bg-[#ff6b00]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[#cc5400] border border-[#ff6b00]/20">
                v2.0 Monad
              </span>
            </div>
            <p className="mt-3 text-xs text-neutral-600 leading-relaxed">
              The Sovereign, Seedless Hardware Wallet &amp; Silicon Proof of Personhood for Monad — powered
              natively by Precompile 0x0100 in 6,900 gas (&lt; 0.05ms).
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-8 text-xs font-semibold text-neutral-700">
            <div className="space-y-2.5">
              <span className="font-mono text-[10px] uppercase text-neutral-400 font-bold block">Protocol</span>
              <a href="#paradigm" className="block hover:text-[#ff6b00] transition">
                The Paradigm Shift
              </a>
              <a href="#architecture" className="block hover:text-[#ff6b00] transition">
                System Architecture
              </a>
              <a href="#benchmarks" className="block hover:text-[#ff6b00] transition">
                Gas Benchmarks
              </a>
            </div>

            <div className="space-y-2.5">
              <span className="font-mono text-[10px] uppercase text-neutral-400 font-bold block">Ecosystem</span>
              <a href="#ecosystem" className="block hover:text-[#ff6b00] transition">
                Product Suite
              </a>
              <a href="#sdk" className="block hover:text-[#ff6b00] transition">
                Developer SDK
              </a>
              <a href="#contracts" className="block hover:text-[#ff6b00] transition">
                Live Testnet Contracts
              </a>
            </div>

            <div className="space-y-2.5">
              <span className="font-mono text-[10px] uppercase text-neutral-400 font-bold block">Community</span>
              <a
                href="https://github.com/NVN404/Aegis-protocol"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[#ff6b00] transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-.99-.02-1.94-3.2.69-3.88-1.54-3.88-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.93 10.93 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
                </svg>
                <span>GitHub Repository</span>
              </a>
              <a
                href="https://testnet.monadexplorer.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-[#ff6b00] transition"
              >
                <span>Monad Explorer</span>
                <ExternalLink size={12} />
              </a>
              <a
                href="https://docs.monad.xyz"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-[#ff6b00] transition"
              >
                <span>Monad Docs</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Monad Testnet (Chain ID 10143) · Precompile 0x0100 Online</span>
          </div>

          <p>
            MIT © 2026 Aegis Protocol Contributors. Built with ❤️ for the Monad Ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
}
