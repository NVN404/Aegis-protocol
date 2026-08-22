"use client";

import React, { useState } from "react";
import {
  Fingerprint,
  Cpu,
  ArrowsClockwise,
  CheckCircle,
  Lightning,
  Code,
  ShieldCheck,
  Play,
} from "@phosphor-icons/react";

export function HardwareSimulator() {
  const [stage, setStage] = useState<"idle" | "touch" | "enclave" | "payload" | "precompile" | "verified">("idle");
  const [activeStep, setActiveStep] = useState(0);

  const [simulatedData, setSimulatedData] = useState({
    qx: "0x78a42b1f899c43d920fe81a3d0b271d4b6842df391c7849e7b23cf4456910abc",
    qy: "0x3f5c901e459a11d872cb48a9018e62d49931ef55209ac7426189ef947620bcde",
    signatureR: "0xa189bc21387df92a0149bb8401ee9234fd89c7423019ab76523910ffea891042",
    signatureS: "0x4b78912ca87df21948ba01948ab8219472301984210984ba0192837461928471",
    gasUsed: 6900,
    latencyMs: 0.042,
    callResult: "0x0000000000000000000000000000000000000000000000000000000000000001",
  });

  const runSimulation = () => {
    setStage("touch");
    setActiveStep(1);

    setTimeout(() => {
      // Step 2: Enclave math
      const randomHex = () =>
        "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      setSimulatedData((prev) => ({
        ...prev,
        qx: randomHex(),
        qy: randomHex(),
        signatureR: randomHex(),
        signatureS: randomHex(),
      }));
      setStage("enclave");
      setActiveStep(2);

      setTimeout(() => {
        // Step 3: Payload packing
        setStage("payload");
        setActiveStep(3);

        setTimeout(() => {
          // Step 4: Precompile 0x0100 call
          setStage("precompile");
          setActiveStep(4);

          setTimeout(() => {
            setStage("verified");
          }, 600);
        }, 700);
      }, 700);
    }, 700);
  };

  const reset = () => {
    setStage("idle");
    setActiveStep(0);
  };

  return (
    <section id="simulator" className="py-20 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[oklch(24%_0.03_285)] text-[oklch(82%_0.16_195)] text-xs font-mono font-semibold mb-3 border border-[oklch(32%_0.04_285)]">
          <Cpu size={14} weight="fill" />
          <span>INTERACTIVE CRYPTOGRAPHY LAB</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How Precompile 0x0100 Verifies Silicon in 6,900 Gas
        </h2>
        <p className="text-sm text-[oklch(74%_0.015_285)] mt-2 max-w-2xl mx-auto">
          Experience the sub-millisecond mathematical pipeline that turns physical device hardware chips into sovereign, anti-Sybil smart accounts on Monad.
        </p>
      </div>

      {/* Simulator Card Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[oklch(18%_0.025_285)] border border-[oklch(26%_0.035_285)] rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Left Interactive Pipeline (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[oklch(56%_0.02_285)]">
                Execution Pipeline
              </span>
              <span className="text-xs font-mono text-[oklch(82%_0.16_195)]">
                Curve: NIST P-256 (secp256r1)
              </span>
            </div>

            {/* Pipeline Steps List */}
            <div className="space-y-3">
              {/* Step 1 */}
              <div
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  activeStep === 1
                    ? "bg-[oklch(26%_0.04_285)] border-[oklch(62%_0.22_285)] text-white shadow-lg"
                    : activeStep > 1
                    ? "bg-[oklch(20%_0.03_285)] border-[oklch(28%_0.03_285)] text-[oklch(74%_0.015_285)]"
                    : "bg-[oklch(16%_0.02_285)] border-[oklch(22%_0.025_285)] text-[oklch(56%_0.02_285)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[oklch(24%_0.03_285)] flex items-center justify-center font-mono text-xs font-bold text-[oklch(82%_0.16_195)]">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Biometric TouchID / FaceID</div>
                      <div className="text-[11px] opacity-75">Client WebAuthn hardware challenge</div>
                    </div>
                  </div>
                  {activeStep > 1 && <CheckCircle size={18} weight="fill" className="text-[oklch(78%_0.18_155)]" />}
                </div>
              </div>

              {/* Step 2 */}
              <div
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  activeStep === 2
                    ? "bg-[oklch(26%_0.04_285)] border-[oklch(62%_0.22_285)] text-white shadow-lg"
                    : activeStep > 2
                    ? "bg-[oklch(20%_0.03_285)] border-[oklch(28%_0.03_285)] text-[oklch(74%_0.015_285)]"
                    : "bg-[oklch(16%_0.02_285)] border-[oklch(22%_0.025_285)] text-[oklch(56%_0.02_285)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[oklch(24%_0.03_285)] flex items-center justify-center font-mono text-xs font-bold text-[oklch(82%_0.16_195)]">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Enclave Silicon Keypair</div>
                      <div className="text-[11px] opacity-75">Calculates (Qx, Qy) &amp; ECDSA (r, s)</div>
                    </div>
                  </div>
                  {activeStep > 2 && <CheckCircle size={18} weight="fill" className="text-[oklch(78%_0.18_155)]" />}
                </div>
              </div>

              {/* Step 3 */}
              <div
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  activeStep === 3
                    ? "bg-[oklch(26%_0.04_285)] border-[oklch(62%_0.22_285)] text-white shadow-lg"
                    : activeStep > 3
                    ? "bg-[oklch(20%_0.03_285)] border-[oklch(28%_0.03_285)] text-[oklch(74%_0.015_285)]"
                    : "bg-[oklch(16%_0.02_285)] border-[oklch(22%_0.025_285)] text-[oklch(56%_0.02_285)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[oklch(24%_0.03_285)] flex items-center justify-center font-mono text-xs font-bold text-[oklch(82%_0.16_195)]">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-sm">160-Byte Calldata Assembly</div>
                      <div className="text-[11px] opacity-75">Packed ABI: hash + r + s + qx + qy</div>
                    </div>
                  </div>
                  {activeStep > 3 && <CheckCircle size={18} weight="fill" className="text-[oklch(78%_0.18_155)]" />}
                </div>
              </div>

              {/* Step 4 */}
              <div
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  activeStep === 4 || stage === "verified"
                    ? "bg-[oklch(26%_0.04_285)] border-[oklch(82%_0.16_195)] text-white shadow-lg"
                    : "bg-[oklch(16%_0.02_285)] border-[oklch(22%_0.025_285)] text-[oklch(56%_0.02_285)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[oklch(24%_0.03_285)] flex items-center justify-center font-mono text-xs font-bold text-[oklch(82%_0.16_195)]">
                      4
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Monad Precompile 0x0100</div>
                      <div className="text-[11px] opacity-75">Native staticcall verification</div>
                    </div>
                  </div>
                  {stage === "verified" && <CheckCircle size={18} weight="fill" className="text-[oklch(78%_0.18_155)]" />}
                </div>
              </div>
            </div>
          </div>

          {/* Trigger Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={runSimulation}
              disabled={stage !== "idle" && stage !== "verified"}
              className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[oklch(62%_0.22_285/0.3)]"
            >
              <Fingerprint size={20} weight="bold" />
              <span>{stage === "idle" ? "Run Biometric Verification" : "Re-run Simulation"}</span>
            </button>
            {stage !== "idle" && (
              <button
                onClick={reset}
                className="btn-secondary py-3 px-4 text-xs font-mono text-[oklch(74%_0.015_285)] cursor-pointer"
                title="Reset simulation"
              >
                <ArrowsClockwise size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right Live Hex Terminal & Math Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-[oklch(14%_0.02_285)] border border-[oklch(24%_0.03_285)] rounded-xl p-5 flex flex-col justify-between font-mono text-xs overflow-x-auto">
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between border-b border-[oklch(22%_0.025_285)] pb-3 mb-4">
            <div className="flex items-center gap-2 text-[oklch(74%_0.015_285)]">
              <Code size={16} className="text-[oklch(82%_0.16_195)]" />
              <span>staticcall(0x0100, payload)</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-[oklch(56%_0.02_285)]">Gas: <strong className="text-[oklch(78%_0.18_155)] font-mono">6,900 flat</strong></span>
              <span className="text-[oklch(56%_0.02_285)]">EVM: <strong className="text-[oklch(82%_0.16_195)] font-mono">&lt; 0.05ms</strong></span>
            </div>
          </div>

          {/* Hex Details */}
          <div className="space-y-3.5 text-[11px] leading-relaxed">
            <div>
              <div className="text-[oklch(56%_0.02_285)] uppercase tracking-wider text-[10px] mb-1">
                // 1. Silicon Hardware Public Key (Qx, Qy)
              </div>
              <div className="bg-[oklch(18%_0.025_285)] p-2 rounded border border-[oklch(22%_0.025_285)] space-y-1">
                <div className="text-[oklch(74%_0.015_285)] truncate">
                  <span className="text-[oklch(62%_0.22_285)] font-bold">Q_x:</span> {simulatedData.qx}
                </div>
                <div className="text-[oklch(74%_0.015_285)] truncate">
                  <span className="text-[oklch(62%_0.22_285)] font-bold">Q_y:</span> {simulatedData.qy}
                </div>
              </div>
            </div>

            <div>
              <div className="text-[oklch(56%_0.02_285)] uppercase tracking-wider text-[10px] mb-1">
                // 2. Hardware Signature Component (r, s)
              </div>
              <div className="bg-[oklch(18%_0.025_285)] p-2 rounded border border-[oklch(22%_0.025_285)] space-y-1">
                <div className="text-[oklch(74%_0.015_285)] truncate">
                  <span className="text-[oklch(82%_0.16_195)] font-bold">r:</span> {simulatedData.signatureR}
                </div>
                <div className="text-[oklch(74%_0.015_285)] truncate">
                  <span className="text-[oklch(82%_0.16_195)] font-bold">s:</span> {simulatedData.signatureS}
                </div>
              </div>
            </div>

            <div>
              <div className="text-[oklch(56%_0.02_285)] uppercase tracking-wider text-[10px] mb-1">
                // 3. Monad Kernel staticcall Output
              </div>
              <div className={`p-2.5 rounded border transition-all duration-300 ${
                stage === "verified"
                  ? "bg-[oklch(78%_0.18_155/0.1)] border-[oklch(78%_0.18_155/0.4)] text-[oklch(78%_0.18_155)]"
                  : "bg-[oklch(18%_0.025_285)] border-[oklch(22%_0.025_285)] text-[oklch(56%_0.02_285)]"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    {stage === "verified" ? "✓ 0x01 (VALID HARDWARE SIGNATURE)" : "Pending execution..."}
                  </span>
                  <span className="text-[10px] font-mono text-[oklch(74%_0.015_285)]">
                    Target: 0x0000...0100
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Proof Footer */}
          <div className="mt-4 pt-3 border-t border-[oklch(22%_0.025_285)] flex items-center justify-between text-[10px] text-[oklch(56%_0.02_285)]">
            <span>Formula: y² ≡ x³ - 3x + b (mod p)</span>
            <span className="text-[oklch(78%_0.18_155)] font-semibold">Precompile 0x0100 (EIP-7951)</span>
          </div>
        </div>

      </div>
    </section>
  );
}
