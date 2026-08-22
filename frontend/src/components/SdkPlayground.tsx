"use client";

import React, { useState } from "react";
import { Code, Copy, Check, Terminal, FileCode } from "@phosphor-icons/react";

export function SdkPlayground() {
  const [activeTab, setActiveTab] = useState<"react" | "core" | "solidity" | "foundry">("react");
  const [copied, setCopied] = useState(false);

  const snippets = {
    react: `// 1. Install packages
// npm install @monad-passkey/react @monad-passkey/core

import React from "react";
import { useMonadPass, MonadPassButton } from "@monad-passkey/react";

export function App() {
  const { account, isConnected, executeTransaction } = useMonadPass({
    chainId: 10143, // Monad Testnet
  });

  const handleSendMon = async () => {
    // 1-Tap TouchID / FaceID Biometric Signature (6,900 gas via 0x0100)
    await executeTransaction({
      to: "0xD726fdedfCc747FC1Ff5E2eBE7773b9cE51F40D4",
      value: "0.1",
    });
  };

  return (
    <div>
      {!isConnected ? (
        <MonadPassButton label="Sign in with FaceID / TouchID" />
      ) : (
        <div>
          <p>Smart Account: {account.address}</p>
          <button onClick={handleSendMon}>Send 0.1 MON (6,900 Gas)</button>
        </div>
      )}
    </div>
  );
}`,

    core: `import { MonadPassClient } from "@monad-passkey/core";

// 1. Initialize client on Monad Testnet (Chain ID 10143)
const client = new MonadPassClient({
  chainId: 10143,
  rpcUrl: "https://testnet-rpc.monad.xyz",
});

// 2. 1-Tap Biometric Hardware Authentication (Zero seed phrases!)
const account = await client.connect();
console.log("Counterfactual Smart Account Address:", account.address);
console.log("Hardware Secp256r1 Public Key:", account.publicKey);

// 3. Execute Transaction via Monad Precompile 0x0100
const tx = await client.execute({
  to: "0xD726fdedfCc747FC1Ff5E2eBE7773b9cE51F40D4",
  value: "0.1", // 0.1 MON
  data: "0x",
});

console.log("Transaction Hash on MonadVision:", tx.hash);`,

    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Low-level bridge executing staticcall to Monad Precompile 0x0100 (EIP-7951)
library WebAuthnPrecompile {
    address constant PRECOMPILE_0x0100 = address(0x0000000000000000000000000000000000000100);

    function verifySignature(
        bytes32 messageHash,
        uint256 r,
        uint256 s,
        uint256 qx,
        uint256 qy
    ) internal view returns (bool) {
        // Pack 160-byte payload (hash[32] + r[32] + s[32] + qx[32] + qy[32])
        bytes memory input = abi.encodePacked(messageHash, r, s, qx, qy);
        bytes memory output = new bytes(32);

        // Precompile 0x0100 executes in 6,900 flat gas (<0.05ms)
        (bool success, ) = PRECOMPILE_0x0100.staticcall(input);
        if (!success || output.length != 32) return false;

        return abi.decode(output, (uint256)) == 1;
    }
}`,

    foundry: `# 1. Clone repository
git clone https://github.com/NVN404/Aegis-protocol.git
cd Aegis-protocol/contracts

# 2. Run test suite with Monad precompile mock
forge test -vvv

# Output:
# [PASS] testCREATE2AddressMatches() (gas: 14210)
# [PASS] testExecuteWithValidPasskey() (gas: 21980)
# [PASS] testPrecompileRejection() (gas: 7120)
# [PASS] testProofOfPersonhoodUniqueness() (gas: 28450)
# Test result: ok. 9 passed; 0 failed; 0 skipped`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="sdk" className="py-20 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[oklch(24%_0.03_285)] text-[oklch(82%_0.16_195)] text-xs font-mono font-semibold mb-3 border border-[oklch(32%_0.04_285)]">
          <Terminal size={14} weight="fill" />
          <span>DEVELOPER PLAYGROUND</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          3 Lines of Code to Add Passkeys to Monad dApps
        </h2>
        <p className="text-sm text-[oklch(74%_0.015_285)] mt-2 max-w-2xl mx-auto">
          Integrate biometric smart contract accounts directly into your React, Next.js, or backend application without relying on centralized SaaS providers.
        </p>
      </div>

      {/* Code Editor Container */}
      <div className="bg-[oklch(14%_0.02_285)] border border-[oklch(26%_0.035_285)] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Editor Tab Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[oklch(22%_0.025_285)] px-4 py-2 bg-[oklch(16%_0.02_285)]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("react")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                activeTab === "react"
                  ? "bg-[oklch(24%_0.03_285)] text-white font-bold border border-[oklch(32%_0.04_285)]"
                  : "text-[oklch(74%_0.015_285)] hover:text-white"
              }`}
            >
              React Hook (@monad-passkey/react)
            </button>

            <button
              onClick={() => setActiveTab("core")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                activeTab === "core"
                  ? "bg-[oklch(24%_0.03_285)] text-white font-bold border border-[oklch(32%_0.04_285)]"
                  : "text-[oklch(74%_0.015_285)] hover:text-white"
              }`}
            >
              TypeScript Core (@monad-passkey/core)
            </button>

            <button
              onClick={() => setActiveTab("solidity")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                activeTab === "solidity"
                  ? "bg-[oklch(24%_0.03_285)] text-white font-bold border border-[oklch(32%_0.04_285)]"
                  : "text-[oklch(74%_0.015_285)] hover:text-white"
              }`}
            >
              Solidity (WebAuthnPrecompile.sol)
            </button>

            <button
              onClick={() => setActiveTab("foundry")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                activeTab === "foundry"
                  ? "bg-[oklch(24%_0.03_285)] text-white font-bold border border-[oklch(32%_0.04_285)]"
                  : "text-[oklch(74%_0.015_285)] hover:text-white"
              }`}
            >
              Foundry Test Suite
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[oklch(20%_0.03_285)] hover:bg-[oklch(26%_0.04_285)] text-[oklch(74%_0.015_285)] hover:text-white border border-[oklch(28%_0.03_285)] text-xs font-mono transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} className="text-[oklch(78%_0.18_155)]" />
                <span className="text-[oklch(78%_0.18_155)] font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Snippet</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content Area */}
        <div className="p-5 font-mono text-xs sm:text-sm text-[oklch(96%_0.005_285)] overflow-x-auto leading-relaxed max-h-[460px]">
          <pre>{snippets[activeTab]}</pre>
        </div>

      </div>
    </section>
  );
}
