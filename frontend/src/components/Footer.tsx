"use client";

import React from "react";
import { ShieldCheck, GithubLogo, ArrowSquareOut, Heart } from "@phosphor-icons/react";

export function Footer() {
  return (
    <footer className="border-t border-[oklch(22%_0.025_285)] bg-[oklch(12%_0.018_285)] py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Hallmark Ft5 Statement */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(20%_0.03_285)] text-xs font-mono text-[oklch(82%_0.16_195)] border border-[oklch(26%_0.035_285)]">
            <ShieldCheck size={14} weight="fill" />
            <span>ANTI-SYBIL MANIFESTO</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            1 Physical Silicon Device = 1 Sovereign Human Identity. Zero cloud custody. Zero seed phrases. Built natively for Monad.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
          <div>
            <h5 className="font-mono uppercase text-[oklch(56%_0.02_285)] text-[11px] mb-3">Protocol</h5>
            <ul className="space-y-2 text-[oklch(74%_0.015_285)]">
              <li><a href="#simulator" className="hover:text-white transition">Hardware Precompile 0x0100</a></li>
              <li><a href="#paradigm" className="hover:text-white transition">Silicon Proof of Personhood</a></li>
              <li><a href="#benchmark" className="hover:text-white transition">6,900 Gas Benchmark</a></li>
              <li><a href="#contracts" className="hover:text-white transition">Monad Testnet Contracts</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono uppercase text-[oklch(56%_0.02_285)] text-[11px] mb-3">Ecosystem</h5>
            <ul className="space-y-2 text-[oklch(74%_0.015_285)]">
              <li><a href="https://github.com/NVN404/Aegis-protocol/tree/main/extension" target="_blank" rel="noreferrer" className="hover:text-white transition">Laptop Extension (MV3)</a></li>
              <li><a href="https://github.com/NVN404/Aegis-protocol/tree/main/frontend" target="_blank" rel="noreferrer" className="hover:text-white transition">Mobile PWA &amp; APK</a></li>
              <li><a href="https://github.com/NVN404/Aegis-protocol/tree/main/fall-guys-monad" target="_blank" rel="noreferrer" className="hover:text-white transition">Fall Guys 3D Monad</a></li>
              <li><a href="https://github.com/NVN404/Aegis-protocol/tree/main/relayer" target="_blank" rel="noreferrer" className="hover:text-white transition">Gas Sponsoring Relayer</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono uppercase text-[oklch(56%_0.02_285)] text-[11px] mb-3">Developers</h5>
            <ul className="space-y-2 text-[oklch(74%_0.015_285)]">
              <li><a href="#sdk" className="hover:text-white transition">@monad-passkey/core</a></li>
              <li><a href="#sdk" className="hover:text-white transition">@monad-passkey/react</a></li>
              <li><a href="#sdk" className="hover:text-white transition">WebAuthnPrecompile.sol</a></li>
              <li><a href="https://github.com/NVN404/Aegis-protocol/tree/main/contracts" target="_blank" rel="noreferrer" className="hover:text-white transition">Foundry Tests (9/9)</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono uppercase text-[oklch(56%_0.02_285)] text-[11px] mb-3">Network</h5>
            <ul className="space-y-2 text-[oklch(74%_0.015_285)]">
              <li>
                <a href="https://testnet.monadexplorer.com" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">
                  <span>Monad Explorer</span>
                  <ArrowSquareOut size={12} />
                </a>
              </li>
              <li>
                <a href="https://testnet.monadvision.com" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">
                  <span>MonadVision</span>
                  <ArrowSquareOut size={12} />
                </a>
              </li>
              <li>
                <a href="https://docs.monad.xyz" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">
                  <span>Monad Docs</span>
                  <ArrowSquareOut size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-8 border-t border-[oklch(20%_0.025_285)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[oklch(56%_0.02_285)]">
          <div className="flex items-center gap-2">
            <span>© 2026 Aegis Protocol Contributors · MIT License</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/NVN404/Aegis-protocol"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <GithubLogo size={16} />
              <span>NVN404/Aegis-protocol</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
