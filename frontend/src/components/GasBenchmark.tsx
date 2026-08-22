"use client";

import React, { useState } from "react";
import { Lightning, TrendDown, Gauge, Calculator } from "@phosphor-icons/react";

export function GasBenchmark() {
  const [txVolume, setTxVolume] = useState<number>(10000);

  const ethSolidityGas = 380000;
  const monadPrecompileGas = 6900;

  const totalEthGas = txVolume * ethSolidityGas;
  const totalMonadGas = txVolume * monadPrecompileGas;
  const gasSaved = totalEthGas - totalMonadGas;
  const percentSaved = ((ethSolidityGas - monadPrecompileGas) / ethSolidityGas) * 100;

  // Assuming $0.00000002 per gas unit on typical L1 vs sub-cent Monad
  const ethEstimatedCostUsd = (totalEthGas * 0.000000035 * 3000).toFixed(2);
  const monadEstimatedCostUsd = (totalMonadGas * 0.0000000001 * 10).toFixed(4);

  return (
    <section id="benchmark" className="py-20 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[oklch(24%_0.03_285)] text-[oklch(82%_0.16_195)] text-xs font-mono font-semibold mb-3 border border-[oklch(32%_0.04_285)]">
          <Lightning size={14} weight="fill" />
          <span>GAS &amp; THROUGHPUT BENCHMARK</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          98.2% Cheaper. Sub-Millisecond Execution.
        </h2>
        <p className="text-sm text-[oklch(74%_0.015_285)] mt-2 max-w-2xl mx-auto">
          Precompile 0x0100 replaces expensive multi-exponentiation Solidity loops with native C++ kernel-level curve arithmetic on Monad.
        </p>
      </div>

      {/* Benchmark Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Gas Comparison Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Solidity EVM Card */}
          <div className="p-6 rounded-2xl bg-[oklch(18%_0.025_285)] border border-[oklch(26%_0.035_285)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-[oklch(74%_0.015_285)]">
                Standard Ethereum EVM (Solidity P-256)
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[oklch(65%_0.22_25/0.15)] text-[oklch(65%_0.22_25)] border border-[oklch(65%_0.22_25/0.3)]">
                Slow &amp; Expensive
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[oklch(74%_0.015_285)]">
                380,000
              </span>
              <span className="text-sm text-[oklch(56%_0.02_285)] font-mono">gas / signature</span>
            </div>
            <p className="text-xs text-[oklch(56%_0.02_285)] mt-2">
              Requires 100+ modular multiplications in bytecode. High latency, unacceptable for gaming and high-frequency dApps.
            </p>
          </div>

          {/* Monad Precompile 0x0100 Card */}
          <div className="p-6 rounded-2xl bg-[oklch(20%_0.03_285)] border border-[oklch(62%_0.22_285/0.5)] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[oklch(62%_0.22_285/0.1)] rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-white font-bold">
                  Monad Precompile 0x0100 (EIP-7951)
                </span>
                <span className="w-2 h-2 rounded-full bg-[oklch(78%_0.18_155)] animate-ping"></span>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[oklch(78%_0.18_155/0.15)] text-[oklch(78%_0.18_155)] border border-[oklch(78%_0.18_155/0.4)] font-bold">
                -98.2% GAS
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white">
                6,900
              </span>
              <span className="text-sm text-[oklch(82%_0.16_195)] font-mono font-bold">gas / signature</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-[oklch(26%_0.035_285)] text-xs">
              <div>
                <div className="text-[oklch(56%_0.02_285)]">Verification Latency</div>
                <div className="font-mono font-bold text-white text-sm">&lt; 0.05 ms</div>
              </div>
              <div>
                <div className="text-[oklch(56%_0.02_285)]">Monad TPS Capacity</div>
                <div className="font-mono font-bold text-[oklch(78%_0.18_155)] text-sm">10,000 TPS Ready</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Interactive Gas Savings Calculator (5 cols) */}
        <div className="lg:col-span-5 bg-[oklch(18%_0.025_285)] border border-[oklch(26%_0.035_285)] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calculator size={18} className="text-[oklch(82%_0.16_195)]" />
              <h3 className="font-bold text-base text-white">Interactive Scale Calculator</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[oklch(74%_0.015_285)]">Simulated Transaction Volume:</span>
                  <span className="font-mono font-bold text-white">{txVolume.toLocaleString()} txs</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="1000000"
                  step="1000"
                  value={txVolume}
                  onChange={(e) => setTxVolume(Number(e.target.value))}
                  className="w-full h-1.5 bg-[oklch(24%_0.03_285)] rounded-lg appearance-none cursor-pointer accent-[oklch(62%_0.22_285)]"
                />
                <div className="flex justify-between text-[10px] text-[oklch(56%_0.02_285)] font-mono mt-1">
                  <span>1k</span>
                  <span>100k</span>
                  <span>500k</span>
                  <span>1M txs</span>
                </div>
              </div>

              {/* Stat Boxes */}
              <div className="space-y-2.5 pt-2">
                <div className="p-3 rounded-xl bg-[oklch(15%_0.02_285)] border border-[oklch(24%_0.03_285)] flex justify-between items-center">
                  <span className="text-xs text-[oklch(74%_0.015_285)]">Gas Units Saved:</span>
                  <span className="text-sm font-mono font-bold text-[oklch(78%_0.18_155)]">
                    {(gasSaved / 1e6).toFixed(1)}M Gas
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[oklch(15%_0.02_285)] border border-[oklch(24%_0.03_285)] flex justify-between items-center">
                  <span className="text-xs text-[oklch(74%_0.015_285)]">Estimated Solidity Cost:</span>
                  <span className="text-sm font-mono font-bold text-[oklch(65%_0.22_25)]">
                    ${Number(ethEstimatedCostUsd).toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[oklch(22%_0.03_285)] border border-[oklch(62%_0.22_285/0.4)] flex justify-between items-center shadow-md">
                  <span className="text-xs text-white font-medium">Monad 0x0100 Cost:</span>
                  <span className="text-sm font-mono font-bold text-[oklch(82%_0.16_195)]">
                    &lt; ${monadEstimatedCostUsd}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[oklch(24%_0.03_285)] text-[11px] text-[oklch(56%_0.02_285)] flex items-center gap-2">
            <TrendDown size={16} className="text-[oklch(78%_0.18_155)] shrink-0" />
            <span>Enables gasless passkey transactions for high-frequency games, DEXs, and social apps on Monad.</span>
          </div>
        </div>

      </div>
    </section>
  );
}
