"use client";

import React from "react";
import {
  Zap,
  Coins,
  Clock,
  TrendingDown,
  Cpu,
} from "lucide-react";

export function GasBenchmarkSection() {
  const metrics = [
    {
      title: "Precompile Gas Cost",
      value: "6,900 Gas",
      subtext: "Exact flat staticcall cost",
      icon: Zap,
      badge: "-98.2% Reduction",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Signature Latency",
      value: "< 0.05 ms",
      subtext: "Sub-millisecond verification",
      icon: Clock,
      badge: "Instant EVM",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Monthly SaaS Key Fees",
      value: "$0.00",
      subtext: "0 Cloud key management fees",
      icon: Coins,
      badge: "0 Custodians",
      badgeColor: "bg-[#ff6b00]/10 text-[#cc5400] border-[#ff6b00]/30",
    },
    {
      title: "Global Compatibility",
      value: "3+ Billion",
      subtext: "Apple & Android devices ready",
      icon: Cpu,
      badge: "Zero App Installs",
      badgeColor: "bg-neutral-100 text-neutral-800 border-neutral-200",
    },
  ];

  return (
    <section id="benchmarks" className="relative py-20 border-t border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-mono font-semibold text-neutral-800 shadow-sm mb-4">
            <TrendingDown size={15} />
            <span>GAS BENCHMARK &amp; LATENCY</span>
          </div>
          <h2
            className="text-3xl font-bold tracking-tight text-[#0a0a0a] sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            98.2% Cheaper Gas. Sub-Second Finality.
          </h2>
          <p className="mt-3 text-base text-neutral-600 sm:text-lg">
            Verifying NIST P-256 elliptic curves in standard Solidity costs up to 380,000 gas.
            Monad&apos;s native Precompile 0x0100 slashes it to a deterministic 6,900 gas.
          </p>
        </div>

        {/* 4 Metric Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a0a0a] text-white">
                    <Icon size={20} className="text-[#ff6b00]" />
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-bold ${m.badgeColor}`}
                  >
                    {m.badge}
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-3xl font-black text-neutral-900 tracking-tight">{m.value}</p>
                  <p className="mt-1 text-xs text-neutral-600">{m.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Gas Comparison Box */}
        <div className="mt-10 rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">
            Gas Consumption per Signature Verification
          </h3>

          <div className="space-y-6">
            {/* Standard EVM */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-semibold text-neutral-700">Standard Ethereum / EVM (Solidity Math)</span>
                <span className="font-mono font-bold text-rose-600">380,000 Gas (~$15.00)</span>
              </div>
              <div className="h-6 w-full rounded-full bg-neutral-100 overflow-hidden p-1">
                <div className="h-full rounded-full bg-rose-500 w-full transition-all duration-1000" />
              </div>
            </div>

            {/* Monad Precompile 0x0100 */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <Zap size={16} className="text-[#ff6b00]" />
                  Monad Precompile 0x0100 (EIP-7951 / RIP-7212)
                </span>
                <span className="font-mono font-bold text-emerald-600">6,900 Gas (~$0.0001)</span>
              </div>
              <div className="h-6 w-full rounded-full bg-neutral-100 overflow-hidden p-1">
                <div className="h-full rounded-full bg-[#ff6b00] w-[2.8%] min-w-[28px] transition-all duration-1000 flex items-center justify-end pr-1 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-neutral-50 p-4 border border-neutral-200/70 text-xs text-neutral-600 leading-relaxed">
            <strong className="text-neutral-900">Why this matters:</strong> At 6,900 gas, a dApp relayer can sponsor
            hundreds of thousands of user biometric logins and in-game signatures for a fraction of a dollar,
            creating a completely frictionless Web2-style UX with true Web3 cryptographic sovereignty.
          </div>
        </div>
      </div>
    </section>
  );
}
