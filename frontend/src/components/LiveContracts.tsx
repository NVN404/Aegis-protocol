"use client";

import React, { useState } from "react";
import { ShieldCheck, Copy, Check, ArrowSquareOut, Cpu, Sparkle } from "@phosphor-icons/react";

export function LiveContracts() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const contracts = [
    {
      name: "PasskeyAccountFactory",
      role: "Counterfactual CREATE2 Smart Account Factory",
      address: "0x29373c0172c89eA61df297ca76A252815b012bd1",
      explorerUrl: "https://testnet.monadvision.com/address/0x29373c0172c89eA61df297ca76A252815b012bd1",
      network: "Monad Testnet (10143)",
    },
    {
      name: "ProofOfPersonhoodRegistry",
      role: "Canonical Silicon Anti-Sybil Identity Registry",
      address: "0xeE575e3C061c85a14cb44152adDC5baB28Ce68a4",
      explorerUrl: "https://testnet.monadvision.com/address/0xeE575e3C061c85a14cb44152adDC5baB28Ce68a4",
      network: "Monad Testnet (10143)",
    },
    {
      name: "Precompile 0x0100",
      role: "Native NIST P-256 (secp256r1) Signature Verifier",
      address: "0x0000000000000000000000000000000000000100",
      explorerUrl: "https://docs.monad.xyz",
      network: "Native Monad Kernel (EIP-7951)",
    },
  ];

  const handleCopy = (address: string, index: number) => {
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="contracts" className="py-20 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[oklch(24%_0.03_285)] text-[oklch(82%_0.16_195)] text-xs font-mono font-semibold mb-3 border border-[oklch(32%_0.04_285)]">
          <ShieldCheck size={14} weight="fill" />
          <span>ON-CHAIN VERIFICATION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Live Smart Contract Deployments
        </h2>
        <p className="text-sm text-[oklch(74%_0.015_285)] mt-2 max-w-2xl mx-auto">
          All contracts are verified and operating live on Monad Testnet (Chain ID 10143).
        </p>
      </div>

      {/* Contract Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contracts.map((contract, idx) => (
          <div
            key={contract.name}
            className="p-6 rounded-2xl bg-[oklch(18%_0.025_285)] border border-[oklch(26%_0.035_285)] flex flex-col justify-between space-y-4 hover:border-[oklch(38%_0.06_285)] transition-colors shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[oklch(24%_0.03_285)] text-[oklch(74%_0.015_285)] border border-[oklch(30%_0.04_285)]">
                  {contract.network}
                </span>
                <span className="w-2 h-2 rounded-full bg-[oklch(78%_0.18_155)]"></span>
              </div>
              <h3 className="font-bold text-base text-white">{contract.name}</h3>
              <p className="text-xs text-[oklch(74%_0.015_285)] mt-1">{contract.role}</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-2.5 rounded-lg bg-[oklch(14%_0.02_285)] border border-[oklch(22%_0.025_285)] flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-[oklch(82%_0.16_195)] truncate">
                  {contract.address}
                </span>
                <button
                  onClick={() => handleCopy(contract.address, idx)}
                  className="text-[oklch(74%_0.015_285)] hover:text-white p-1 rounded transition cursor-pointer shrink-0"
                  title="Copy address"
                >
                  {copiedIndex === idx ? (
                    <Check size={14} className="text-[oklch(78%_0.18_155)]" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <a
                href={contract.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-[oklch(22%_0.03_285)] hover:bg-[oklch(26%_0.04_285)] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition"
              >
                <span>View on Explorer</span>
                <ArrowSquareOut size={13} className="text-[oklch(82%_0.16_195)]" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Relayer & Gas Pool Banner */}
      <div className="mt-8 p-6 rounded-2xl bg-[oklch(20%_0.03_285)] border border-[oklch(62%_0.22_285/0.35)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[oklch(62%_0.22_285/0.2)] flex items-center justify-center text-[oklch(82%_0.16_195)] shrink-0">
            <Sparkle size={20} weight="fill" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Live Monad Gas Sponsoring Pool</h4>
            <p className="text-xs text-[oklch(74%_0.015_285)]">
              The Aegis Relayer automatically funds each new passkey smart account with 0.50 MON starter gas.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono text-[oklch(78%_0.18_155)] font-bold">
            72+ MON Active Pool
          </span>
          <a
            href="https://testnet.monadexplorer.com"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1"
          >
            <span>Monad Explorer</span>
            <ArrowSquareOut size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
