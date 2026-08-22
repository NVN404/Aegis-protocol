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
      title: "Precompile Gas",
      value: "6,900 Gas",
      subtext: "Exact flat staticcall cost",
      icon: Zap,
      badge: "-98.2%",
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
      title: "Monthly SaaS Fees",
      value: "$0.00",
      subtext: "0 Cloud key SaaS fees",
      icon: Coins,
      badge: "0 Custodians",
      badgeColor: "bg-[#ff6b00]/10 text-[#cc5400] border-[#ff6b00]/30",
    },
    {
      title: "Global Ready",
      value: "3+ Billion",
      subtext: "Apple & Android devices",
      icon: Cpu,
      badge: "Zero Installs",
      badgeColor: "bg-neutral-100 text-neutral-800 border-neutral-200",
    },
  ];

  return (
    <section id="benchmarks" className="relative py-16 sm:py-20 border-t border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-mono font-semibold text-neutral-800 shadow-sm mb-3 sm:mb-4">
            <TrendingDown size={14} />
            <span>GAS BENCHMARK &amp; LATENCY</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a0a0a]"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            98.2% Cheaper Gas. Sub-Second Finality.
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-neutral-600 sm:text-lg">
            Verifying NIST P-256 elliptic curves in standard Solidity costs up to 380,000 gas.
            Monad&apos;s native Precompile 0x0100 slashes it to a deterministic 6,900 gas.
          </p>
        </div>

        {/* 4 Metric Cards (2x2 on Mobile, 4-col on Desktop) */}
        <div className="mt-8 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-white p-3.5 sm:p-6 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#0a0a0a] text-white">
                    <Icon size={16} className="text-[#ff6b00]" />
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] sm:text-[11px] font-mono font-bold ${m.badgeColor}`}
                  >
                    {m.badge}
                  </span>
                </div>

                <div className="mt-3.5 sm:mt-5">
                  <h3 className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 truncate">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-xl sm:text-3xl font-black text-neutral-900 tracking-tight">{m.value}</p>
                  <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-neutral-600 truncate">{m.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Gas Comparison Box */}
        <div className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-white p-4 sm:p-8 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-4 sm:mb-6">
            Gas Consumption per Signature Verification
          </h3>

          <div className="space-y-4 sm:space-y-6">
            {/* Standard EVM */}
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
                <span className="font-semibold text-neutral-700 truncate pr-2">Standard Ethereum (Solidity Math)</span>
                <span className="font-mono font-bold text-rose-600 shrink-0">380,000 Gas</span>
              </div>
              <div className="h-5 sm:h-6 w-full rounded-full bg-neutral-100 overflow-hidden p-1">
                <div className="h-full rounded-full bg-rose-500 w-full transition-all duration-1000" />
              </div>
            </div>

            {/* Monad Precompile 0x0100 */}
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
                <span className="font-bold text-neutral-900 flex items-center gap-1 sm:gap-1.5 truncate pr-2">
                  <Zap size={15} className="text-[#ff6b00] shrink-0" />
                  <span className="truncate">Monad Precompile 0x0100</span>
                </span>
                <span className="font-mono font-bold text-emerald-600 shrink-0">6,900 Gas</span>
              </div>
              <div className="h-5 sm:h-6 w-full rounded-full bg-neutral-100 overflow-hidden p-1">
                <div className="h-full rounded-full bg-[#ff6b00] w-[2.8%] min-w-[28px] transition-all duration-1000 flex items-center justify-end pr-1 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 rounded-xl sm:rounded-2xl bg-neutral-50 p-3.5 sm:p-4 border border-neutral-200/70 text-[11px] sm:text-xs text-neutral-600 leading-relaxed">
            <strong className="text-neutral-900">Why this matters:</strong> At 6,900 gas, a dApp relayer can sponsor
            hundreds of thousands of user biometric logins and in-game signatures for a fraction of a dollar,
            creating a completely frictionless Web2-style UX with true Web3 cryptographic sovereignty.
          </div>
        </div>
      </div>
    </section>
  );
}
