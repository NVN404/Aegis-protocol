"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Warning,
  XCircle,
  CheckCircle,
  Eye,
  CloudSlash,
  DeviceMobile,
  LockKey,
} from "@phosphor-icons/react";

export function ParadigmMatrix() {
  const [activeTab, setActiveTab] = useState<"all" | "waas" | "worldcoin">("all");

  return (
    <section id="paradigm" className="py-20 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[oklch(24%_0.03_285)] text-[oklch(82%_0.16_195)] text-xs font-mono font-semibold mb-3 border border-[oklch(32%_0.04_285)]">
          <LockKey size={14} weight="fill" />
          <span>PARADIGM SHIFT</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Why Physical Silicon Destroys Cloud WaaS &amp; Eyeball Scans
        </h2>
        <p className="text-sm text-[oklch(74%_0.015_285)] mt-2 max-w-2xl mx-auto">
          Existing solutions force a compromise between seed phrase complexity, centralized AWS cloud custody, or dystopian biometric orb scans. Aegis eliminates all three.
        </p>

        {/* Filter View Selector */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === "all"
                ? "bg-[oklch(62%_0.22_285)] text-white"
                : "bg-[oklch(20%_0.03_285)] text-[oklch(74%_0.015_285)] hover:text-white"
            }`}
          >
            Complete Matrix
          </button>
          <button
            onClick={() => setActiveTab("waas")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === "waas"
                ? "bg-[oklch(62%_0.22_285)] text-white"
                : "bg-[oklch(20%_0.03_285)] text-[oklch(74%_0.015_285)] hover:text-white"
            }`}
          >
            vs. Cloud WaaS (Privy / Turnkey)
          </button>
          <button
            onClick={() => setActiveTab("worldcoin")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === "worldcoin"
                ? "bg-[oklch(62%_0.22_285)] text-white"
                : "bg-[oklch(20%_0.03_285)] text-[oklch(74%_0.015_285)] hover:text-white"
            }`}
          >
            vs. Worldcoin
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      {activeTab === "all" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse bg-[oklch(18%_0.025_285)] border border-[oklch(26%_0.035_285)] rounded-xl shadow-xl overflow-hidden">
            <thead>
              <tr className="border-b border-[oklch(26%_0.035_285)] bg-[oklch(15%_0.02_285)] text-[oklch(74%_0.015_285)] font-mono uppercase text-[11px]">
                <th className="py-4 px-5">Vector</th>
                <th className="py-4 px-5">🦊 Legacy EOA (MetaMask)</th>
                <th className="py-4 px-5">🏢 Cloud WaaS (Privy/Turnkey)</th>
                <th className="py-4 px-5 bg-[oklch(62%_0.22_285/0.15)] text-white font-bold">
                  ⚡ Aegis Protocol (Silicon + Monad)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[oklch(24%_0.03_285)]">
              <tr>
                <td className="py-3.5 px-5 font-semibold text-white">Private Key Storage</td>
                <td className="py-3.5 px-5 text-[oklch(74%_0.015_285)]">Raw 12-word seed in browser disk/memory</td>
                <td className="py-3.5 px-5 text-[oklch(65%_0.22_25)]">Amazon AWS Cloud Nitro Enclaves</td>
                <td className="py-3.5 px-5 bg-[oklch(62%_0.22_285/0.05)] text-[oklch(78%_0.18_155)] font-semibold">
                  Trapped in Physical Apple/Android Silicon
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-white">Phishing Vulnerability</td>
                <td className="py-3.5 px-5 text-[oklch(65%_0.22_25)]">High (Blind signing &amp; fake seed inputs)</td>
                <td className="py-3.5 px-5 text-[oklch(74%_0.015_285)]">Moderate (OAuth token theft &amp; SIM swaps)</td>
                <td className="py-3.5 px-5 bg-[oklch(62%_0.22_285/0.05)] text-[oklch(78%_0.18_155)] font-semibold">
                  100% Phishing-Proof (WebAuthn Domain Bound)
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-white">Sybil / Anti-Bot Defense</td>
                <td className="py-3.5 px-5 text-[oklch(65%_0.22_25)]">Zero (1 person can script 100,000 wallets)</td>
                <td className="py-3.5 px-5 text-[oklch(65%_0.22_25)]">Zero (Mass programmatic API wallets)</td>
                <td className="py-3.5 px-5 bg-[oklch(62%_0.22_285/0.05)] text-[oklch(78%_0.18_155)] font-semibold">
                  1 Hardware Silicon Chip = 1 Human Identity
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-white">Fee Structure &amp; Cost</td>
                <td className="py-3.5 px-5 text-[oklch(74%_0.015_285)]">User pays full gas (no starter sponsoring)</td>
                <td className="py-3.5 px-5 text-[oklch(65%_0.22_25)]">Heavy Monthly B2B SaaS API subscription</td>
                <td className="py-3.5 px-5 bg-[oklch(62%_0.22_285/0.05)] text-[oklch(78%_0.18_155)] font-semibold">
                  Flat 6,900 Gas (~$0.0001 per verification)
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-white">Censorship &amp; Uptime Risk</td>
                <td className="py-3.5 px-5 text-[oklch(74%_0.015_285)]">RPC dependencies</td>
                <td className="py-3.5 px-5 text-[oklch(65%_0.22_25)]">Provider or AWS outage locks all user accounts</td>
                <td className="py-3.5 px-5 bg-[oklch(62%_0.22_285/0.05)] text-[oklch(78%_0.18_155)] font-semibold">
                  Zero Censorship (Direct On-Chain Smart Account)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed Side-by-Side: Aegis vs Cloud WaaS */}
      {activeTab === "waas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[oklch(16%_0.02_285)] border border-[oklch(24%_0.03_285)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[oklch(65%_0.22_25/0.15)] flex items-center justify-center text-[oklch(65%_0.22_25)]">
                <CloudSlash size={20} weight="bold" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Centralized Cloud WaaS (Turnkey / Privy)</h3>
                <p className="text-xs text-[oklch(74%_0.015_285)]">Keys held in AWS data centers</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-[oklch(74%_0.015_285)]">
              <li className="flex items-start gap-2">
                <XCircle size={16} weight="fill" className="text-[oklch(65%_0.22_25)] shrink-0 mt-0.5" />
                <span>Centralized single point of failure (Amazon AWS cloud outages lock user funds).</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle size={16} weight="fill" className="text-[oklch(65%_0.22_25)] shrink-0 mt-0.5" />
                <span>Zero Sybil defense: developers can generate 10,000 wallets in seconds via API for airdrop farming.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle size={16} weight="fill" className="text-[oklch(65%_0.22_25)] shrink-0 mt-0.5" />
                <span>High monthly recurring B2B developer subscription fees.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-[oklch(20%_0.03_285)] border border-[oklch(62%_0.22_285/0.4)] space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[oklch(62%_0.22_285/0.2)] flex items-center justify-center text-[oklch(82%_0.16_195)]">
                <ShieldCheck size={20} weight="fill" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Aegis Protocol (Silicon Enclave + 0x0100)</h3>
                <p className="text-xs text-[oklch(82%_0.16_195)]">Keys held in physical phone/laptop hardware</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-[oklch(96%_0.005_285)]">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)] shrink-0 mt-0.5" />
                <span>Non-custodial: Private keys never leave the physical Apple or Android secure enclave silicon.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)] shrink-0 mt-0.5" />
                <span>Anti-Sybil Proof of Personhood: 1 physical device = 1 unique on-chain verified identity.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)] shrink-0 mt-0.5" />
                <span>Zero SaaS fees. Executed directly on Monad via Precompile 0x0100 in 6,900 gas.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Detailed Side-by-Side: Aegis vs Worldcoin */}
      {activeTab === "worldcoin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[oklch(16%_0.02_285)] border border-[oklch(24%_0.03_285)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[oklch(65%_0.22_25/0.15)] flex items-center justify-center text-[oklch(65%_0.22_25)]">
                <Eye size={20} weight="bold" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Worldcoin (Metallic Orb Scanning)</h3>
                <p className="text-xs text-[oklch(74%_0.015_285)]">Physical biometric iris capture</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-[oklch(74%_0.015_285)]">
              <li className="flex items-start gap-2">
                <XCircle size={16} weight="fill" className="text-[oklch(65%_0.22_25)] shrink-0 mt-0.5" />
                <span>Requires users to stand in lines at physical locations and scan their biological eyeballs.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle size={16} weight="fill" className="text-[oklch(65%_0.22_25)] shrink-0 mt-0.5" />
                <span>Invasive biometric data concerns and heavy regulatory friction worldwide.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle size={16} weight="fill" className="text-[oklch(65%_0.22_25)] shrink-0 mt-0.5" />
                <span>Requires multi-million dollar physical metallic camera hardware deployment.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-[oklch(20%_0.03_285)] border border-[oklch(62%_0.22_285/0.4)] space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[oklch(62%_0.22_285/0.2)] flex items-center justify-center text-[oklch(82%_0.16_195)]">
                <DeviceMobile size={20} weight="fill" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Aegis Protocol (Phone Silicon)</h3>
                <p className="text-xs text-[oklch(82%_0.16_195)]">Hardware already in 3+ billion pockets</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-[oklch(96%_0.005_285)]">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)] shrink-0 mt-0.5" />
                <span>Zero lines, zero orbs: uses the Apple Secure Enclave &amp; Google Titan M2 chip already in your pocket.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)] shrink-0 mt-0.5" />
                <span>Zero biometric collection: biometrics never leave the phone; only unforgeable cryptographic ECDSA proofs are submitted on-chain.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)] shrink-0 mt-0.5" />
                <span>Zero hardware cost: 100% software protocol utilizing existing consumer silicon.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
