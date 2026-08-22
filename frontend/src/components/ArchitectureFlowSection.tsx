"use client";

import React, { useState } from "react";
import { Cpu, CheckCircle2 } from "lucide-react";

export function ArchitectureFlowSection() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      title: "1. Silicon Hardware Signing",
      entity: "Physical Smartphone / Laptop",
      chip: "Apple Secure Enclave / Google Titan M2",
      badge: "Local Hardware",
      badgeColor: "bg-neutral-100 text-neutral-800",
      description:
        "When the user touches TouchID or FaceID, the isolated hardware enclave generates an unextractable secp256r1 (P-256) keypair. The private key never enters browser memory.",
      details: [
        "NIST P-256 Curve ($y^2 = x^3 - 3x + b$)",
        "Biometric authorization bound to hardware origin",
        "Produces (r, s) signature and clientDataJSON digest",
      ],
    },
    {
      id: 1,
      title: "2. Client & SDK Packaging",
      entity: "Aegis Client Layer",
      chip: "Extension (MV3) · Mobile PWA · TypeScript SDK",
      badge: "Packed 160-byte payload",
      badgeColor: "bg-[#ff6b00]/10 text-[#cc5400]",
      description:
        "The client formats the WebAuthn authenticatorData, clientDataJSON, and (r, s) coordinates into a lightweight 160-byte payload ready for on-chain verification.",
      details: [
        "EIP-1193 & EIP-6963 provider injection",
        "Deterministic CREATE2 counterfactual address calculation",
        "Replay protection with per-device nonces",
      ],
    },
    {
      id: 2,
      title: "3. Smart Contract Account",
      entity: "Monad Smart Contracts",
      chip: "PasskeyAccount.sol · PasskeyAccountFactory.sol",
      badge: "Solidity Account Abstraction",
      badgeColor: "bg-blue-50 text-blue-700",
      description:
        "The smart contract account receives the transaction, verifies authorization via factory bindings, and prepares a staticcall to Monad's kernel precompile.",
      details: [
        "ERC-4337 compliant user operation flow",
        "ProofOfPersonhoodRegistry canonical binding",
        "Gasless relayer sponsoring support",
      ],
    },
    {
      id: 3,
      title: "4. Native Precompile 0x0100",
      entity: "Monad EVM Kernel",
      chip: "Precompile 0x00...0100 (EIP-7951 / RIP-7212)",
      badge: "6,900 Gas · < 0.05ms",
      badgeColor: "bg-emerald-50 text-emerald-700",
      description:
        "Monad's native C++ kernel verifies the P-256 signature in hardware-accelerated machine code. Returns 0x01 (Valid) or 0x00 (Invalid) at 98.2% lower gas cost.",
      details: [
        "Sub-millisecond P-256 curve point validation",
        "Standardized across Monad, Base, and Arbitrum",
        "Eliminates 380,000 gas Solidity curve math libraries",
      ],
    },
  ];

  return (
    <section id="architecture" className="relative py-16 sm:py-20 bg-[#faf9f7] border-t border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-mono font-semibold text-neutral-800 shadow-sm mb-4">
            <span>SYSTEM ARCHITECTURE</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a0a0a]"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            How Aegis Executes in 6,900 Gas
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 sm:text-lg">
            From the physical silicon chip inside your phone to native Monad consensus in under 50 milliseconds.
          </p>
        </div>

        {/* Interactive Architecture Flow Tabs & Pipeline */}
        <div className="mt-10 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
              className={`rounded-2xl p-3.5 sm:p-5 text-left transition-all duration-300 relative border cursor-pointer ${
                activeStep === step.id
                  ? "bg-white border-[#ff6b00] shadow-[0_8px_24px_-6px_rgba(255,107,0,0.2)] ring-1 ring-[#ff6b00]"
                  : "bg-white/60 border-neutral-200/80 hover:bg-white hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className={`text-[9px] sm:text-[11px] font-bold font-mono px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-[100px] ${step.badgeColor}`}>
                  {step.badge}
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-neutral-400 font-bold">0{step.id + 1}</span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-neutral-900 leading-snug">{step.title}</h3>
              <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 sm:mt-1 font-mono truncate">{step.entity}</p>
            </button>
          ))}
        </div>

        {/* Active Step Deep-Dive View */}
        <div className="mt-5 sm:mt-6 rounded-3xl border border-neutral-200/90 bg-white p-4 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-mono text-neutral-700 mb-2.5">
                <Cpu size={14} />
                <span>{steps[activeStep].chip}</span>
              </div>

              <h3
                className="text-xl sm:text-2xl font-bold text-neutral-900"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                {steps[activeStep].title}
              </h3>

              <p className="mt-2.5 text-neutral-600 leading-relaxed text-xs sm:text-base">
                {steps[activeStep].description}
              </p>

              <div className="mt-5 space-y-2">
                {steps[activeStep].details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-800">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Cryptographic Code / Flow Visualizer */}
            <div className="lg:col-span-5 rounded-2xl bg-[#0d0d0d] p-4 sm:p-5 text-neutral-200 font-mono text-xs shadow-inner overflow-x-auto">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-800 text-[10px] sm:text-[11px] text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b00]" />
                  Pipeline Telemetry (Step 0{activeStep + 1})
                </span>
                <span>secp256r1</span>
              </div>

              {activeStep === 0 && (
                <div className="space-y-1.5 text-neutral-300 text-[11px] sm:text-xs">
                  <p className="text-neutral-500">// 1. Biometric Hardware Signature</p>
                  <p className="text-[#ff6b00]">const cred = await navigator.credentials.create(&#123;</p>
                  <p className="pl-3">publicKey: &#123;</p>
                  <p className="pl-6">challenge: random32Bytes,</p>
                  <p className="pl-6 text-neutral-400">authenticatorAttachment: &quot;platform&quot;,</p>
                  <p className="pl-6 text-neutral-400">pubKeyCredParams: [&#123; alg: -7, type: &quot;public-key&quot; &#125;]</p>
                  <p className="pl-3">&#125;</p>
                  <p className="text-[#ff6b00]">&#125;);</p>
                  <p className="text-emerald-400">// Output: Qx, Qy coords + (r,s) signature</p>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-1.5 text-neutral-300 text-[11px] sm:text-xs">
                  <p className="text-neutral-500">// 2. Pack 160-byte payload</p>
                  <p className="text-neutral-400">const payload = packWebAuthnPayload(&#123;</p>
                  <p className="pl-3">authenticatorData: &quot;0x49960de5...&quot;,</p>
                  <p className="pl-3">clientDataJSON: &quot;0x7b227479...&quot;,</p>
                  <p className="pl-3">signatureR: &quot;0x6b81b29a8f...&quot;,</p>
                  <p className="pl-3">signatureS: &quot;0x3f5c9e2b10...&quot;</p>
                  <p className="text-neutral-400">&#125;);</p>
                  <p className="text-[#ff6b00]">// Target: CREATE2 Passkey Account</p>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-1.5 text-neutral-300 text-[11px] sm:text-xs">
                  <p className="text-neutral-500">// 3. PasskeyAccount.sol execution</p>
                  <p className="text-blue-400">function execute(address dest, uint256 val, bytes calldata data) external &#123;</p>
                  <p className="pl-3">bool valid = WebAuthnPrecompile.verify(</p>
                  <p className="pl-6">pubKeyX, pubKeyY, hash, authData, clientData, r, s</p>
                  <p className="pl-3">);</p>
                  <p className="pl-3 text-emerald-400">require(valid, &quot;Invalid hardware passkey&quot;);</p>
                  <p className="text-blue-400">&#125;</p>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-1.5 text-neutral-300 text-[11px] sm:text-xs">
                  <p className="text-neutral-500">// 4. Monad Precompile staticcall</p>
                  <p className="text-neutral-400">address constant PRECOMPILE_0X0100 =</p>
                  <p className="pl-3 text-[#ff6b00]">0x0000000000000000000000000000000000000100;</p>
                  <p className="text-emerald-400">(bool ok, bytes memory res) =</p>
                  <p className="pl-3 text-emerald-400">PRECOMPILE_0X0100.staticcall&#123;gas: 6900&#125;(input);</p>
                  <p className="text-neutral-400">// Gas burned: Exactly 6,900 gas</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NIST P-256 Cryptography Equation Card */}
        <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-[#ff6b00] uppercase">Cryptographic Foundation</span>
              <h4 className="text-sm sm:text-base font-bold text-neutral-900 mt-0.5">
                NIST P-256 (secp256r1) Elliptic Curve Equation
              </h4>
            </div>
            <div className="self-start sm:self-auto rounded-xl bg-neutral-100 px-3.5 py-1.5 font-mono text-xs sm:text-sm font-bold text-neutral-900 border border-neutral-200">
              y² ≡ x³ - 3x + b (mod p)
            </div>
          </div>
          <p className="mt-2.5 text-xs text-neutral-600 leading-relaxed">
            By operating on the standard NIST P-256 curve natively in the Monad kernel, Aegis guarantees 100%
            hardware compatibility with billions of Apple Secure Enclave coprocessors and Android Titan M2 chips
            without requiring third-party MPC relayers or cloud signing servers.
          </p>
        </div>
      </div>
    </section>
  );
}
