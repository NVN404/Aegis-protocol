"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Database,
} from "lucide-react";

export function LiveContractsSection() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const contracts = [
    {
      name: "PasskeyAccountFactory",
      role: "Deterministic CREATE2 Smart Account Factory",
      address: "0x29373c0172c89eA61df297ca76A252815b012bd1",
      explorerUrl:
        "https://testnet.monadvision.com/address/0x29373c0172c89eA61df297ca76A252815b012bd1",
      badge: "CREATE2 Factory",
    },
    {
      name: "ProofOfPersonhoodRegistry",
      role: "Canonical 1-Device = 1-Human Anti-Sybil Registry",
      address: "0xeE575e3C061c85a14cb44152adDC5baB28Ce68a4",
      explorerUrl:
        "https://testnet.monadvision.com/address/0xeE575e3C061c85a14cb44152adDC5baB28Ce68a4",
      badge: "Anti-Sybil Registry",
    },
    {
      name: "SybilResistantFaucet",
      role: "Hardware-Gated Testnet MON Faucet (Anti-Bot Drip)",
      address: "0x5b6e24Be7714980f202e02221f5a5E9E34d0D4bD",
      explorerUrl:
        "https://testnet.monadvision.com/address/0x5b6e24Be7714980f202e02221f5a5E9E34d0D4bD",
      badge: "Faucet Dispenser",
    },
    {
      name: "Monad Precompile 0x0100",
      role: "Native NIST P-256 Elliptic Curve Hardware Precompile",
      address: "0x0000000000000000000000000000000000000100",
      explorerUrl: "https://docs.monad.xyz",
      badge: "EVM Kernel Precompile",
      isPrecompile: true,
    },
  ];

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <section id="contracts" className="relative py-20 bg-[#faf9f7] border-t border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-mono font-semibold text-neutral-800 shadow-sm mb-4">
              <Database size={15} />
              <span>ON-CHAIN VERIFICATION</span>
            </div>
            <h2
              className="text-3xl font-bold tracking-tight text-[#0a0a0a] sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Live Deployments on Monad Testnet
            </h2>
            <p className="mt-3 text-base text-neutral-600 sm:text-lg">
              All smart contracts are open-source, verified, and active on Monad Testnet (Chain ID 10143).
            </p>
          </div>

          {/* Network Spec Tag */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm font-mono text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-neutral-900">Monad Testnet (10143)</span>
            </div>
            <p className="text-neutral-500 text-[11px]">RPC: https://testnet-rpc.monad.xyz</p>
          </div>
        </div>

        {/* Contract List Cards */}
        <div className="mt-10 grid grid-cols-1 gap-4">
          {contracts.map((c) => (
            <div
              key={c.name}
              className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-base text-neutral-900">{c.name}</h3>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-mono font-bold text-neutral-700 border border-neutral-200">
                    {c.badge}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{c.role}</p>
                <p className="font-mono text-xs text-[#0a0a0a] font-bold mt-2 break-all">{c.address}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(c.address)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900"
                >
                  {copiedAddress === c.address ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                  <span>{copiedAddress === c.address ? "Copied" : "Copy"}</span>
                </button>

                <a
                  href={c.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0a0a0a] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#222]"
                >
                  <span>{c.isPrecompile ? "View Docs" : "MonadVision"}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
