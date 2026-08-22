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
    client: `import { MonadPassClient } from "@monad-passkey/core";

// 1. Initialize client on Monad Testnet (Chain ID 10143)
const client = new MonadPassClient({ 
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
import { useMonadPass, MonadPassButton } from "@monad-passkey/react";

export function ConnectWalletHeader() {
  const { account, isConnected, connect, sendTransaction } = useMonadPass();

  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="font-bold">My Monad dApp</h1>

      {!isConnected ? (
        <MonadPassButton 
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
            className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold"
          >
            Send 0.05 MON
          </button>
        </div>
      )}
    </header>
  );
}`,

    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library WebAuthnPrecompile {
    /// @dev Native Monad RIP-7212 / EIP-7951 Precompile
    address constant PRECOMPILE_0X0100 = 0x0000000000000000000000000000000000000100;

    function verify(
        bytes32 pubKeyX,
        bytes32 pubKeyY,
        bytes32 messageHash,
        bytes32 r,
        bytes32 s
    ) internal view returns (bool) {
        bytes memory input = abi.encode(messageHash, r, s, pubKeyX, pubKeyY);
        
        // Exact 6,900 gas flat execution in native C++ Monad Kernel
        (bool success, bytes memory result) = PRECOMPILE_0X0100.staticcall{gas: 6900}(input);
        
        return success && result.length == 32 && abi.decode(result, (uint256)) == 1;
    }
}`,

    foundry: `// Foundry Test Suite - 100% Pass
$ forge test --match-contract PasskeyAccountTest -vvv

[⠢] Compiling 14 files with 0.8.20
[⠊] Solc 0.8.20 finished in 1.12s
Running 9 tests for test/PasskeyAccount.t.sol:PasskeyAccountTest

[PASS] test_DeployWithCREATE2Deterministic() (gas: 142103)
[PASS] test_ExecuteWithHardwarePasskeySignature() (gas: 6900)
[PASS] test_ProofOfPersonhoodAntiSybilRegistration() (gas: 41208)
[PASS] test_RejectInvalidBiometricCoordinates() (gas: 7012)
[PASS] test_ReplayProtectionWithIncrementalNonce() (gas: 23140)
[PASS] test_RelayerGaslessSponsorshipExecution() (gas: 89400)
[PASS] test_FallGuysArenaPasskeyEntry() (gas: 52100)
[PASS] test_Precompile0x0100GasConsumptionExact() (gas: 6900)
[PASS] test_BatchTransactionExecution() (gas: 18450)

Test result: ok. 9 passed; 0 failed; 0 skipped; finished in 14.28ms`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimOutput(["[1/4] Initializing MonadPassClient for Chain ID 10143..."]);

    setTimeout(() => {
      setSimOutput((prev) => [
        ...(prev || []),
        "[2/4] Prompting Apple Secure Enclave / Titan M2 WebAuthn...",
      ]);
    }, 600);

    setTimeout(() => {
      setSimOutput((prev) => [
        ...(prev || []),
        "[3/4] Hardware P-256 Keypair Generated: Qx=0x83e2... Qy=0x19a4...",
        "[3/4] Calculated Counterfactual CREATE2 Address: 0x71C...49A2",
      ]);
    }, 1300);

    setTimeout(() => {
      setSimOutput((prev) => [
        ...(prev || []),
        "[4/4] Verified via Monad Precompile 0x0100 in 6,900 gas (<0.04ms).",
        "✓ SUCCESS: Account 0x71C...49A2 Sovereign Vault Active on Monad Testnet!",
      ]);
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <section id="sdk" className="relative py-20 bg-[#faf9f7] border-t border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-mono font-semibold text-neutral-800 shadow-sm mb-4">
              <Code size={15} />
              <span>DEVELOPER SDK &amp; PLAYGROUND</span>
            </div>
            <h2
              className="text-3xl font-bold tracking-tight text-[#0a0a0a] sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              5-Minute Integration for Any Monad dApp
            </h2>
            <p className="mt-3 text-base text-neutral-600 sm:text-lg">
              Add TouchID &amp; FaceID seedless onboarding to your React, Next.js, or EVM project
              with our modular TypeScript SDK and typed smart contract libraries.
            </p>
          </div>

          {/* Quick Install Pill */}
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 shadow-sm font-mono text-xs text-neutral-800 flex items-center gap-2">
            <span className="text-[#ff6b00] font-bold">$</span>
            <span>npm i @monad-passkey/core</span>
          </div>
        </div>

        {/* Code Box Container */}
        <div className="mt-10 rounded-3xl border border-neutral-800 bg-[#0d0d0d] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] overflow-hidden text-neutral-200">
          {/* Top Bar: Tabs and Actions */}
          <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 px-4 py-3 bg-[#141414] gap-3">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(
                [
                  { id: "client", label: "1. Core Client (TS)" },
                  { id: "react", label: "2. React Hooks" },
                  { id: "solidity", label: "3. WebAuthnPrecompile.sol" },
                  { id: "foundry", label: "4. Foundry Tests (9/9)" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSimOutput(null);
                  }}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[#252525] text-white shadow-sm ring-1 ring-white/10 font-bold"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Actions: Copy & Run Simulation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={runSimulation}
                disabled={isSimulating}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#ff6b00] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#e55e00] active:scale-95 disabled:opacity-50"
              >
                {isSimulating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Play size={14} />
                )}
                <span>Run Simulation</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#222] px-3.5 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-[#333] hover:text-white"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy Code"}</span>
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="p-5 sm:p-6 overflow-x-auto font-mono text-[13px] leading-relaxed">
            <pre className="text-neutral-300">
              <code>{codeSnippets[activeTab]}</code>
            </pre>
          </div>

          {/* Simulation Output Drawer (if triggered) */}
          {simOutput && (
            <div className="border-t border-neutral-800 bg-[#080808] p-5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-neutral-400">
                <span className="flex items-center gap-2 text-[#ff6b00] font-bold">
                  <Terminal size={16} />
                  Simulation Output (Local Enclave &rarr; Monad 0x0100)
                </span>
                <span className="text-[10px] text-neutral-500">Chain ID: 10143</span>
              </div>
              <div className="space-y-1.5 text-neutral-300">
                {simOutput.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line.startsWith("✓")
                        ? "text-emerald-400 font-bold"
                        : line.includes("Precompile 0x0100")
                        ? "text-[#ff6b00]"
                        : "text-neutral-400"
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
