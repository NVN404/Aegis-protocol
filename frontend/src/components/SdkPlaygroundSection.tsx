"use client";

import React, { useState } from "react";
import {
  Code,
  Copy,
  Check,
  Play,
  Terminal,
  Loader2,
} from "lucide-react";

export function SdkPlaygroundSection() {
  const [activeTab, setActiveTab] = useState<"client" | "react" | "solidity" | "foundry">("client");
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simOutput, setSimOutput] = useState<string[] | null>(null);

  const codeSnippets = {
    client: `import { AegisClient } from "@monad-passkey/core";

// 1. Initialize client on Monad Testnet (Chain ID 10143)
const client = new AegisClient({ 
  chainId: 10143,
  rpcUrl: "https://testnet-rpc.monad.xyz"
});

// 2. 1-Tap TouchID / FaceID Login (Zero seed phrases!)
const account = await client.connect();
console.log("Sovereign Smart Account:", account.address);

// 3. Execute Transaction via Precompile 0x0100 (6,900 gas)
const tx = await client.execute({
  to: "0xD726fdedfCc747FC1Ff5E2eBE7773b9cE51F40D4",
  value: "0.1", // 0.1 MON
});

console.log("Confirmed in Monad Block in 0.04s:", tx.hash);`,

    react: `import React from "react";
import { useAegis, AegisButton } from "@monad-passkey/react";

export function ConnectWalletHeader() {
  const { account, isConnected, connect, sendTransaction } = useAegis();

  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="font-bold">My Monad dApp</h1>

      {!isConnected ? (
        <AegisButton 
          onSuccess={(acc) => console.log("Logged in with TouchID:", acc.address)}
          label="1-Tap Biometric Login"
        />
      ) : (
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm bg-stone-100 px-3 py-1 rounded-full">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </span>
          <button 
            onClick={() => sendTransaction({ to: "0x123...", value: "0.05" })}
            className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold"
          >
            Sign with Biometrics
          </button>
        </div>
      )}
    </header>
  );
}`,

    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { WebAuthnPrecompile } from "./WebAuthnPrecompile.sol";

contract PasskeyAccount {
    bytes32 public immutable pubKeyX;
    bytes32 public immutable pubKeyY;

    constructor(bytes32 _x, bytes32 _y) {
        pubKeyX = _x;
        pubKeyY = _y;
    }

    /// @notice Validates WebAuthn Passkey signature via Monad Precompile 0x0100 (6,900 gas)
    function isValidSignature(
        bytes32 hash, 
        bytes calldata signature
    ) external view returns (bytes4) {
        (bytes memory authData, bytes memory clientData, uint256 r, uint256 s) = 
            abi.decode(signature, (bytes, bytes, uint256, uint256));

        bool valid = WebAuthnPrecompile.verify(
            pubKeyX, pubKeyY, hash, authData, clientData, r, s
        );

        return valid ? bytes4(0x1626ba7e) : bytes4(0xffffffff);
    }
}`,

    foundry: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/PasskeyAccountFactory.sol";

contract PasskeyAccountTest is Test {
    PasskeyAccountFactory factory;

    function setUp() public {
        factory = new PasskeyAccountFactory();
    }

    function test_DeterministicCREATE2Deployment() public {
        bytes32 qx = bytes32(uint256(0x12345));
        bytes32 qy = bytes32(uint256(0x67890));

        address predicted = factory.getAddress(qx, qy);
        address deployed = factory.createAccount(qx, qy);

        assertEq(predicted, deployed, "CREATE2 counterfactual address mismatch");
    }

    function test_Precompile0x0100GasCost() public {
        // Flat 6,900 gas staticcall assertion on Monad EVM
        uint256 gasStart = gasleft();
        (bool ok, ) = address(0x100).staticcall(hex"00");
        uint256 gasUsed = gasStart - gasleft();
        assertTrue(gasUsed <= 6900, "Gas exceeded 6,900 flat limit");
    }
}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimOutput(null);

    setTimeout(() => {
      setSimOutput([
        "⚡ [1/4] WebAuthn biometric signature requested from Apple Enclave...",
        "🔑 [2/4] secp256r1 coordinates generated (Qx, Qy) + 160-byte payload packed",
        "📦 [3/4] CREATE2 counterfactual address: 0x94B73a7C18f45d1222CeD67BfDE52e2A3FeD7EaB",
        "✅ [4/4] Monad Precompile 0x0100 staticcall success: Valid (0x01) · 6,900 gas burned (< 0.04ms)",
        "🎉 Transaction mined on Monad Block #18,492,103 · Status: FINALIZED",
      ]);
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <section id="sdk" className="relative py-16 sm:py-20 border-t border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-mono font-semibold text-neutral-800 shadow-sm mb-3 sm:mb-4">
              <Code size={14} />
              <span>DEVELOPER SDK &amp; SMART CONTRACTS</span>
            </div>
            <h2
              className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a0a0a]"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              5 Lines of Code to Integrate
            </h2>
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-neutral-600 sm:text-lg">
              Modular TypeScript SDK, React hooks, and audited Solidity smart accounts ready for Monad.
            </p>
          </div>

          {/* Quick Install Pill */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4 shadow-sm font-mono text-xs self-start md:self-auto">
            <span className="text-neutral-400 text-[10px] block mb-1 font-bold">PACKAGE MANAGER</span>
            <code className="text-[#0a0a0a] font-bold">npm i @monad-passkey/core</code>
          </div>
        </div>

        {/* Code Editor Tabs Box */}
        <div className="mt-8 sm:mt-10 rounded-3xl border border-neutral-200/90 bg-[#111111] shadow-xl overflow-hidden">
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-3 sm:px-5 py-3 border-b border-neutral-800 bg-[#0a0a0a]">
            {/* Tab Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
              {(
                [
                  { key: "client", label: "TypeScript Client" },
                  { key: "react", label: "React Hook" },
                  { key: "solidity", label: "PasskeyAccount.sol" },
                  { key: "foundry", label: "Foundry Tests" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSimOutput(null);
                  }}
                  className={`rounded-xl px-2.5 sm:px-3.5 py-1.5 text-xs font-mono font-medium transition cursor-pointer whitespace-nowrap ${
                    activeTab === tab.key
                      ? "bg-[#222222] text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-[#181818]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded-xl bg-[#222] px-2.5 sm:px-3 py-1.5 text-xs font-mono font-medium text-neutral-300 transition hover:bg-[#333] hover:text-white cursor-pointer active:scale-95"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Code Window */}
          <div className="p-4 sm:p-6 overflow-x-auto font-mono text-[11px] sm:text-[13px] text-neutral-200 leading-relaxed max-h-[420px]">
            <pre className="whitespace-pre">
              <code>{codeSnippets[activeTab]}</code>
            </pre>
          </div>

          {/* Simulation Output Box & Run Button */}
          <div className="border-t border-neutral-800 bg-[#0d0d0d] p-3.5 sm:p-5 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <Terminal size={14} className="text-[#ff6b00]" />
                <span>Simulation Terminal</span>
              </div>

              <button
                type="button"
                onClick={runSimulation}
                disabled={isSimulating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6b00] hover:bg-[#e55e00] px-4 py-2 text-xs font-mono font-bold text-white shadow-sm transition active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isSimulating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Executing Precompile Staticcall...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" />
                    <span>Run Simulation in Sandbox</span>
                  </>
                )}
              </button>
            </div>

            {simOutput && (
              <div className="rounded-xl bg-black/60 p-3 sm:p-4 border border-neutral-800 text-[11px] sm:text-xs font-mono space-y-1 text-neutral-300">
                {simOutput.map((line, idx) => (
                  <p key={idx} className={line.includes("✅") ? "text-emerald-400 font-bold" : ""}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
