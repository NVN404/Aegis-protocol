"use client";

import React, { useState } from "react";
import {
  AppWindow,
  DeviceMobile,
  Code,
  FileCode,
  GameController,
  CheckCircle,
  ArrowSquareOut,
  DownloadSimple,
} from "@phosphor-icons/react";

interface EcosystemTabsProps {
  onOpenWallet: () => void;
}

export function EcosystemTabs({ onOpenWallet }: EcosystemTabsProps) {
  const [activeTab, setActiveTab] = useState<"extension" | "mobile" | "sdk" | "contracts" | "game">("extension");

  return (
    <section id="ecosystem" className="py-20 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[oklch(24%_0.03_285)] text-[oklch(82%_0.16_195)] text-xs font-mono font-semibold mb-3 border border-[oklch(32%_0.04_285)]">
          <AppWindow size={14} weight="fill" />
          <span>COMPLETE MONAD STACK</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          What’s Inside the Aegis Ecosystem
        </h2>
        <p className="text-sm text-[oklch(74%_0.015_285)] mt-2 max-w-2xl mx-auto">
          From consumer mobile apps and browser extensions to modular developer SDKs and on-chain gaming integrations.
        </p>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setActiveTab("extension")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === "extension"
                ? "bg-[oklch(62%_0.22_285)] text-white shadow-lg"
                : "bg-[oklch(18%_0.025_285)] text-[oklch(74%_0.015_285)] hover:text-white border border-[oklch(24%_0.03_285)]"
            }`}
          >
            <AppWindow size={16} />
            <span>Browser Extension</span>
          </button>

          <button
            onClick={() => setActiveTab("mobile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === "mobile"
                ? "bg-[oklch(62%_0.22_285)] text-white shadow-lg"
                : "bg-[oklch(18%_0.025_285)] text-[oklch(74%_0.015_285)] hover:text-white border border-[oklch(24%_0.03_285)]"
            }`}
          >
            <DeviceMobile size={16} />
            <span>Mobile PWA &amp; APK</span>
          </button>

          <button
            onClick={() => setActiveTab("sdk")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === "sdk"
                ? "bg-[oklch(62%_0.22_285)] text-white shadow-lg"
                : "bg-[oklch(18%_0.025_285)] text-[oklch(74%_0.015_285)] hover:text-white border border-[oklch(24%_0.03_285)]"
            }`}
          >
            <Code size={16} />
            <span>TypeScript SDK</span>
          </button>

          <button
            onClick={() => setActiveTab("contracts")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === "contracts"
                ? "bg-[oklch(62%_0.22_285)] text-white shadow-lg"
                : "bg-[oklch(18%_0.025_285)] text-[oklch(74%_0.015_285)] hover:text-white border border-[oklch(24%_0.03_285)]"
            }`}
          >
            <FileCode size={16} />
            <span>Smart Contracts</span>
          </button>

          <button
            onClick={() => setActiveTab("game")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === "game"
                ? "bg-[oklch(62%_0.22_285)] text-white shadow-lg"
                : "bg-[oklch(18%_0.025_285)] text-[oklch(74%_0.015_285)] hover:text-white border border-[oklch(24%_0.03_285)]"
            }`}
          >
            <GameController size={16} />
            <span>Fall Guys Monad</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="bg-[oklch(18%_0.025_285)] border border-[oklch(26%_0.035_285)] rounded-2xl p-6 sm:p-8 shadow-xl">
        
        {/* Tab 1: Extension */}
        {activeTab === "extension" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[oklch(24%_0.03_285)] text-xs font-mono text-[oklch(82%_0.16_195)]">
                <span>Directory: /extension</span>
                <span>·</span>
                <span>Manifest V3 Compliant</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Laptop Chrome &amp; Brave Browser Extension
              </h3>
              <p className="text-sm text-[oklch(74%_0.015_285)] leading-relaxed">
                Injects standard <code className="text-white font-mono bg-[oklch(14%_0.02_285)] px-1.5 py-0.5 rounded">window.ethereum</code> and <code className="text-white font-mono bg-[oklch(14%_0.02_285)] px-1.5 py-0.5 rounded">window.monad</code> with full EIP-6963 and EIP-1193 multi-wallet discovery. Any DEX, NFT marketplace, or dApp detects MonadPass seamlessly.
              </p>
              <ul className="space-y-2 text-xs text-[oklch(96%_0.005_285)] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)]" />
                  <span>1-Tap TouchID login directly inside Chrome/Brave/Edge extension popup.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)]" />
                  <span>Automatic transaction simulation and CREATE2 counterfactual smart account deployment.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)]" />
                  <span>Zero extension master passwords or vulnerable seed phrases stored in browser storage.</span>
                </li>
              </ul>
              <div className="pt-4 flex flex-wrap gap-3">
                <a
                  href="https://github.com/NVN404/Aegis-protocol/tree/main/extension"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-xs flex items-center gap-1.5"
                >
                  <DownloadSimple size={15} />
                  <span>View Extension Source</span>
                  <ArrowSquareOut size={13} />
                </a>
              </div>
            </div>
            <div className="lg:col-span-5 bg-[oklch(14%_0.02_285)] border border-[oklch(24%_0.03_285)] rounded-xl p-5 font-mono text-xs text-[oklch(74%_0.015_285)] space-y-3">
              <div className="text-[11px] text-[oklch(56%_0.02_285)] uppercase">Quick Install (Developer Mode)</div>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-white">
                <li>Open <span className="text-[oklch(82%_0.16_195)]">chrome://extensions</span></li>
                <li>Enable <span className="text-[oklch(82%_0.16_195)]">"Developer mode"</span></li>
                <li>Click <span className="text-[oklch(82%_0.16_195)]">"Load unpacked"</span></li>
                <li>Select the <span className="text-[oklch(82%_0.16_195)]">/extension</span> directory</li>
              </ol>
              <div className="p-3 bg-[oklch(18%_0.025_285)] rounded border border-[oklch(22%_0.025_285)] text-[10px] text-[oklch(78%_0.18_155)]">
                ✓ Provider Announced: "MonadPass (Hardware Passkey)" (EIP-6963 uuid: 9b1deb4d)
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Mobile App */}
        {activeTab === "mobile" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[oklch(24%_0.03_285)] text-xs font-mono text-[oklch(82%_0.16_195)]">
                <span>Directory: /frontend</span>
                <span>·</span>
                <span>PWA &amp; Capacitor Android</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Mobile-Native Wallet &amp; Android APK Generator
              </h3>
              <p className="text-sm text-[oklch(74%_0.015_285)] leading-relaxed">
                Full-featured mobile wallet with FaceID/TouchID biometric smart account creation, live MON testnet balance tracking, send/receive modals, and transaction history dock.
              </p>
              <ul className="space-y-2 text-xs text-[oklch(96%_0.005_285)] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)]" />
                  <span>Pre-configured Capacitor Android bridge for native APK builds (<code className="font-mono text-[oklch(82%_0.16_195)]">npm run build:apk</code>).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)]" />
                  <span>Real-time on-chain history feed with instant MonadScan explorer deep links.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)]" />
                  <span>Automated relayer gas starter faucet sponsoring first 0.50 MON.</span>
                </li>
              </ul>
              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={onOpenWallet}
                  className="btn-primary text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <AppWindow size={15} />
                  <span>Test Mobile Wallet in Sandbox</span>
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 bg-[oklch(14%_0.02_285)] border border-[oklch(24%_0.03_285)] rounded-xl p-5 font-mono text-xs text-[oklch(74%_0.015_285)] space-y-3">
              <div className="text-[11px] text-[oklch(56%_0.02_285)] uppercase">Build Android APK</div>
              <pre className="p-3 bg-[oklch(18%_0.025_285)] rounded border border-[oklch(22%_0.025_285)] text-[11px] text-[oklch(82%_0.16_195)] overflow-x-auto">
{`cd frontend
npm install
npx cap add android
npm run build:apk`}
              </pre>
              <div className="text-[10px] text-[oklch(78%_0.18_155)]">
                ✓ Syncs WebAuthn credential bridge with Android BiometricPrompt API
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: TypeScript SDK */}
        {activeTab === "sdk" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[oklch(24%_0.03_285)] text-xs font-mono text-[oklch(82%_0.16_195)]">
                <span>Directory: /sdk</span>
                <span>·</span>
                <span>Turborepo Monorepo</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Modular TypeScript SDK Packages
              </h3>
              <p className="text-sm text-[oklch(74%_0.015_285)] leading-relaxed">
                Add seedless passkey smart accounts to any Web3 dApp with 3 lines of code. Built on Viem and ethers.js with zero cloud vendor lock-in.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-[oklch(15%_0.02_285)] border border-[oklch(24%_0.03_285)]">
                  <div className="font-mono font-bold text-xs text-white">@monad-passkey/core</div>
                  <div className="text-[11px] text-[oklch(56%_0.02_285)] mt-1">High-level MonadPassClient &amp; WebAuthn driver</div>
                </div>
                <div className="p-3 rounded-lg bg-[oklch(15%_0.02_285)] border border-[oklch(24%_0.03_285)]">
                  <div className="font-mono font-bold text-xs text-white">@monad-passkey/react</div>
                  <div className="text-[11px] text-[oklch(56%_0.02_285)] mt-1">useMonadPass() hook &amp; UI components</div>
                </div>
                <div className="p-3 rounded-lg bg-[oklch(15%_0.02_285)] border border-[oklch(24%_0.03_285)]">
                  <div className="font-mono font-bold text-xs text-white">@monad-passkey/contracts</div>
                  <div className="text-[11px] text-[oklch(56%_0.02_285)] mt-1">Typed ABIs &amp; verified addresses</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 bg-[oklch(14%_0.02_285)] border border-[oklch(24%_0.03_285)] rounded-xl p-5 font-mono text-xs text-[oklch(74%_0.015_285)] space-y-2">
              <div className="text-[11px] text-[oklch(56%_0.02_285)] uppercase">Quick Install</div>
              <pre className="p-3 bg-[oklch(18%_0.025_285)] rounded border border-[oklch(22%_0.025_285)] text-[11px] text-[oklch(82%_0.16_195)]">
{`npm install @monad-passkey/core @monad-passkey/react`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Smart Contracts */}
        {activeTab === "contracts" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[oklch(24%_0.03_285)] text-xs font-mono text-[oklch(82%_0.16_195)]">
                <span>Directory: /contracts</span>
                <span>·</span>
                <span>Foundry &amp; Solidity 0.8.24</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Foundry-Tested Smart Account Architecture
              </h3>
              <p className="text-sm text-[oklch(74%_0.015_285)] leading-relaxed">
                Battle-tested smart contracts compiling directly to Monad Testnet with full staticcall 0x0100 verification, counterfactual CREATE2 factories, and Sybil resistance.
              </p>
              <ul className="space-y-2 text-xs text-[oklch(96%_0.005_285)] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)]" />
                  <span><strong>WebAuthnPrecompile.sol:</strong> Low-level staticcall bridge to precompile 0x0100.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)]" />
                  <span><strong>PasskeyAccount.sol:</strong> Replay-protected smart account vault with gasless execution.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)]" />
                  <span><strong>PasskeyAccountFactory.sol:</strong> CREATE2 factory for zero-cost address derivation.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)]" />
                  <span><strong>ProofOfPersonhoodRegistry.sol:</strong> Canonical registry binding silicon keys to humans.</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-5 bg-[oklch(14%_0.02_285)] border border-[oklch(24%_0.03_285)] rounded-xl p-5 font-mono text-xs text-[oklch(74%_0.015_285)] space-y-3">
              <div className="text-[11px] text-[oklch(56%_0.02_285)] uppercase">Foundry Test Suite</div>
              <pre className="p-3 bg-[oklch(18%_0.025_285)] rounded border border-[oklch(22%_0.025_285)] text-[11px] text-[oklch(78%_0.18_155)] overflow-x-auto">
{`[PASS] testCREATE2AddressMatches() (gas: 14210)
[PASS] testExecuteWithValidPasskey() (gas: 21980)
[PASS] testPrecompileRejection() (gas: 7120)
[PASS] testProofOfPersonhoodUniqueness() (gas: 28450)

Test result: ok. 9 passed; 0 failed`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 5: Fall Guys Game */}
        {activeTab === "game" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[oklch(24%_0.03_285)] text-xs font-mono text-[oklch(82%_0.16_195)]">
                <span>Directory: /fall-guys-monad</span>
                <span>·</span>
                <span>Three.js &amp; On-Chain Physics</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Fall Guys 3D Monad Arena Integration
              </h3>
              <p className="text-sm text-[oklch(74%_0.015_285)] leading-relaxed">
                A 100% on-chain 3D obstacle racing game on Monad Testnet showcasing 1-tap passkey biometric tournament entry and sub-second prize payouts.
              </p>
              <ul className="space-y-2 text-xs text-[oklch(96%_0.005_285)] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)]" />
                  <span>0.10 MON entry fee settled instantly through the Aegis smart account.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)]" />
                  <span>Zero seed phrase or wallet popups during active gaming sessions.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[oklch(78%_0.18_155)]" />
                  <span>Anti-bot Proof of Personhood ensures real human player tournaments.</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-5 bg-[oklch(14%_0.02_285)] border border-[oklch(24%_0.03_285)] rounded-xl p-5 font-mono text-xs text-[oklch(74%_0.015_285)] space-y-3">
              <div className="text-[11px] text-[oklch(56%_0.02_285)] uppercase">Game Architecture</div>
              <div className="space-y-2 text-[11px] text-white">
                <div className="p-2 rounded bg-[oklch(18%_0.025_285)] border border-[oklch(22%_0.025_285)]">
                  🕹️ <strong>Engine:</strong> Three.js + Cannon.js Physics
                </div>
                <div className="p-2 rounded bg-[oklch(18%_0.025_285)] border border-[oklch(22%_0.025_285)]">
                  ⚡ <strong>Speed:</strong> Sub-second on-chain checkpoint settlement
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
