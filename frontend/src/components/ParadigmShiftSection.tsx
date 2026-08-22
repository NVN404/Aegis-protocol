"use client";

import React from "react";
import {
  ShieldCheck,
  XCircle,
  CheckCircle2,
  Eye,
  CloudOff,
  Fingerprint,
} from "lucide-react";

interface ComparisonItem {
  text: string;
  good?: boolean;
  bad?: boolean;
}

interface ComparisonColumn {
  title: string;
  subtitle: string;
  badge: string;
  badgeClass: string;
  featured?: boolean;
  items: ComparisonItem[];
}

export function ParadigmShiftSection() {
  const comparisonColumns: ComparisonColumn[] = [
    {
      title: "Legacy EOA Wallets",
      subtitle: "MetaMask / Phantom / Rabby",
      badge: "Vulnerable & Manual",
      badgeClass: "bg-red-50 text-red-700 border-red-200",
      items: [
        { text: "12-word seed phrases written on paper", bad: true },
        { text: "Vulnerable to blind-signing & phishing", bad: true },
        { text: "Private key unencrypted in browser RAM", bad: true },
        { text: "Zero anti-bot or anti-sybil defense", bad: true },
        { text: "User must manually fund native gas", bad: true },
        { text: "Standard EVM 380,000 gas signature", bad: true },
      ],
    },
    {
      title: "Cloud WaaS Providers",
      subtitle: "Turnkey / Privy / Magic Link",
      badge: "Centralized SaaS",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      items: [
        { text: "Private keys stored inside AWS Nitro cloud", bad: true },
        { text: "Must trust centralized SaaS uptime & policy", bad: true },
        { text: "Expensive monthly B2B API fees per user", bad: true },
        { text: "Sybil vulnerability: 10,000 cloud accounts via API", bad: true },
        { text: "Slow cloud-to-chain handoff latency", bad: true },
        { text: "Vendor lock-in with closed-source relayers", bad: true },
      ],
    },
    {
      title: "Aegis Protocol",
      subtitle: "Local Silicon + Precompile 0x0100",
      badge: "Sovereign & Anti-Sybil",
      badgeClass: "bg-[#ff6b00]/10 text-[#cc5400] border-[#ff6b00]/30",
      featured: true,
      items: [
        { text: "Private key trapped in Phone Silicon (Apple Enclave / Titan M2)", good: true },
        { text: "100% phishing-proof WebAuthn origin binding", good: true },
        { text: "0 Cloud middlemen · 0 B2B SaaS monthly fees", good: true },
        { text: "1 Physical Phone = 1 Cryptographically Verified Human", good: true },
        { text: "Native Monad Gas Sponsoring & Relayer Pool", good: true },
        { text: "6,900 Flat Gas Precompile 0x0100 (< 0.05ms execution)", good: true },
      ],
    },
  ];

  const cloudVsAegisTable = [
    {
      feature: "Where is the Private Key?",
      cloud: "Stored inside Amazon AWS Cloud Data Centers.",
      aegis: "Trapped inside Your Physical Phone/Laptop Silicon Chip.",
    },
    {
      feature: "Censorship & Freezing Risk",
      cloud: "Amazon AWS or SaaS provider can freeze your account.",
      aegis: "Zero Censorship. Direct on-chain smart contract sovereign vault.",
    },
    {
      feature: "Trust Model",
      cloud: "Trust SaaS company uptime, AWS admins, and API security.",
      aegis: "Pure Mathematics, Hardware Enclave, and Monad Consensus.",
    },
    {
      feature: "Bot & Sybil Resistance",
      cloud: "Anyone can spin up 10,000 cloud accounts via automated API calls.",
      aegis: "1 Physical Device = 1 Human Account. Cryptographically unforgeable.",
    },
    {
      feature: "Transaction Cost",
      cloud: "Heavy B2B SaaS tier pricing + standard gas overhead.",
      aegis: "Flat 6,900 Gas (~$0.0001 per tx) via native kernel Precompile 0x0100.",
    },
  ];

  return (
    <section id="paradigm" className="relative py-16 sm:py-20 border-t border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-mono font-semibold text-neutral-800 shadow-sm mb-4">
            <span>THE PARADIGM SHIFT</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a0a0a]"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Why Aegis Protocol Wins
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 sm:text-lg leading-relaxed">
            A fundamental breakthrough in wallet architecture: moving private keys out of vulnerable
            browser RAM and expensive cloud data centers directly into physical silicon chips.
          </p>
        </div>

        {/* 3-Column Architecture Matrix */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {comparisonColumns.map((col) => (
            <div
              key={col.title}
              className={`relative rounded-3xl p-5 sm:p-7 transition-all duration-300 ${
                col.featured
                  ? "border-2 border-[#ff6b00] bg-[#fffaf5] text-neutral-900 shadow-[0_12px_32px_-8px_rgba(255,107,0,0.15)] ring-1 ring-[#ff6b00]/30"
                  : "border border-neutral-200/90 bg-white text-neutral-900 shadow-sm hover:border-neutral-300"
              }`}
            >
              {col.featured && (
                <div className="absolute -top-3 right-5 sm:right-6 rounded-full bg-[#ff6b00] px-3 py-0.5 text-[10px] sm:text-[11px] font-bold text-white shadow-md">
                  RECOMMENDED
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900">{col.title}</h3>
                  <p className="text-xs mt-0.5 font-mono text-neutral-500">
                    {col.subtitle}
                  </p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] sm:text-[11px] font-bold ${col.badgeClass}`}>
                  {col.badge}
                </span>
              </div>

              <div className="my-5 sm:my-6 border-t border-neutral-200/70" />

              <ul className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm">
                {col.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    {item.good ? (
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <span className={item.good ? "text-neutral-900 font-medium" : "text-neutral-600"}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Detailed Breakdown: Cloud Providers vs Aegis Protocol */}
        <div className="mt-12 sm:mt-16 rounded-3xl border border-neutral-200/90 bg-white p-4 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-neutral-100">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                Aegis vs. Centralized Cloud WaaS (Turnkey, AWS Nitro, Privy)
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Why sovereign hardware security fundamentally outperforms custodial cloud key managers
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-neutral-100 px-3 py-1.5 text-xs font-mono font-medium text-neutral-700">
              <CloudOff size={14} />
              <span>0 Cloud Dependencies</span>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200/80 text-xs uppercase tracking-wider text-neutral-500">
                  <th className="py-3 pr-4 font-semibold">Architectural Feature</th>
                  <th className="py-3 px-4 font-semibold text-neutral-700">🏢 Cloud Providers (Turnkey / AWS)</th>
                  <th className="py-3 pl-4 font-semibold text-[#ff6b00]">⚡ Aegis Protocol (Monad + Silicon)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {cloudVsAegisTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/80 transition">
                    <td className="py-4 pr-4 font-bold text-neutral-900">{row.feature}</td>
                    <td className="py-4 px-4 text-neutral-600">{row.cloud}</td>
                    <td className="py-4 pl-4 font-medium text-neutral-900 bg-[#ff6b00]/[0.03]">
                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                        {row.aegis}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="md:hidden space-y-3">
            {cloudVsAegisTable.map((row, idx) => (
              <div key={idx} className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-3.5 space-y-2">
                <h4 className="font-bold text-xs text-neutral-900 uppercase font-mono">{row.feature}</h4>
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80 text-xs">
                  <span className="text-[10px] text-neutral-400 font-bold block mb-0.5">🏢 CLOUD WAAS</span>
                  <p className="text-neutral-600">{row.cloud}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#fffaf5] border border-[#ff6b00]/30 text-xs">
                  <span className="text-[10px] text-[#cc5400] font-bold block mb-0.5">⚡ AEGIS SILICON</span>
                  <p className="text-neutral-900 font-medium flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>{row.aegis}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aegis vs Worldcoin: Privacy-Preserving Proof of Personhood */}
        <div className="mt-10 sm:mt-12 rounded-3xl border border-neutral-200/90 bg-white text-neutral-900 p-5 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#ff6b00]/10 px-3 py-1 text-[11px] font-mono text-[#cc5400] mb-3 border border-[#ff6b00]/20">
                <Fingerprint size={14} />
                <span>PRIVACY-PRESERVING SYBIL RESISTANCE</span>
              </div>
              <h3
                className="text-xl sm:text-3xl font-bold tracking-tight text-neutral-900"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Aegis vs. Worldcoin (Orb Scanners)
              </h3>
              <p className="mt-2.5 text-neutral-600 text-xs sm:text-base leading-relaxed">
                Worldcoin forces humans to stand in physical lines and scan their sensitive irises with
                metallic cameras — raising permanent biometric surveillance and data leak fears.
              </p>
              <p className="mt-2.5 text-neutral-700 text-xs sm:text-base leading-relaxed">
                <strong className="text-neutral-900 font-semibold">Aegis uses the physical hardware chip already in your pocket.</strong>{" "}
                When you touch TouchID or FaceID, the Apple/Android Secure Enclave produces an unforgeable cryptographic
                proof of a unique physical device. Zero iris scans, zero KYC, zero invasive biometric storage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl bg-neutral-50 p-4 sm:p-5 border border-neutral-200">
                <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase mb-2">
                  <Eye size={15} />
                  <span>Worldcoin (Orb)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-600">
                  <li>• Requires physical iris cameras</li>
                  <li>• Irrevocable biometric data risk</li>
                  <li>• High manufacturing cost</li>
                  <li>• Heavy centralized oversight</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-[#fffaf5] p-4 sm:p-5 border border-[#ff6b00]/40 shadow-sm">
                <div className="flex items-center gap-2 text-[#cc5400] text-xs font-bold uppercase mb-2">
                  <ShieldCheck size={15} />
                  <span>Aegis Protocol</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-800 font-medium">
                  <li>• Uses phone chip in pocket</li>
                  <li>• 0 biometric data leaves phone</li>
                  <li>• 3+ billion devices ready</li>
                  <li>• 100% on-chain Monad validation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
