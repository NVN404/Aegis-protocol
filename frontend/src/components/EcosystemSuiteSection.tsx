"use client";

import React from "react";
import {
  Globe,
  Smartphone,
  Code,
  FileCode,
  Fuel,
  Gamepad2,
  CheckCircle2,
  ExternalLink,
  Fingerprint,
} from "lucide-react";

interface EcosystemSuiteSectionProps {
  onOpenWallet: () => void;
}

export function EcosystemSuiteSection({ onOpenWallet }: EcosystemSuiteSectionProps) {
  const products = [
    {
      id: "extension",
      title: "Laptop Browser Extension",
      path: "/extension",
      badge: "Manifest V3",
      icon: Globe,
      description:
        "Full Chrome, Brave, Edge, and Opera support. Injects EIP-1193 & EIP-6963 window.ethereum & window.monad providers. Any DEX, NFT market, or game instantly detects hardware passkeys.",
      features: [
        "EIP-1193 & EIP-6963 Provider",
        "1-Tap TouchID / Windows Hello",
        "Auto dApp session management",
      ],
      linkText: "Explore Extension Code",
      linkHref: "https://github.com/NVN404/Aegis-protocol/tree/main/extension",
    },
    {
      id: "mobile-pwa",
      title: "Mobile Wallet PWA & APK",
      path: "/frontend",
      badge: "iOS PWA + Android APK",
      icon: Smartphone,
      description:
        "Mobile-first progressive web app with fullscreen FaceID biometric support and native Capacitor Android configuration (npm run build:apk) for direct .apk distribution.",
      features: [
        "PWA Install to Home Screen",
        "Capacitor Android APK Generator",
        "Real-Time MonadVision Tracker",
      ],
      isAction: true,
      actionText: "Launch Mobile App",
    },
    {
      id: "sdk",
      title: "Modular TypeScript SDK",
      path: "/sdk",
      badge: "NPM Packages",
      icon: Code,
      description:
        "High-level developer toolkit containing @monad-passkey/core client, @monad-passkey/react hooks, and @monad-passkey/contracts typed ABIs for 5-minute dApp integration.",
      features: [
        "@monad-passkey/core Client",
        "@monad-passkey/react Hooks",
        "Next.js Starter Template",
      ],
      linkText: "View SDK on GitHub",
      linkHref: "https://github.com/NVN404/Aegis-protocol/tree/main/sdk",
    },
    {
      id: "contracts",
      title: "Core Smart Contracts",
      path: "/contracts",
      badge: "Foundry · 9/9 Pass",
      icon: FileCode,
      description:
        "PasskeyAccount.sol, PasskeyAccountFactory.sol (CREATE2), and ProofOfPersonhoodRegistry.sol. Low-level staticcall to Precompile 0x0100 with replay protection.",
      features: [
        "WebAuthnPrecompile.sol (0x0100)",
        "Counterfactual CREATE2 Factory",
        "ProofOfPersonhoodRegistry.sol",
      ],
      linkText: "View Smart Contracts",
      linkHref: "https://github.com/NVN404/Aegis-protocol/tree/main/contracts",
    },
    {
      id: "relayer",
      title: "Gas Sponsoring Relayer",
      path: "/relayer",
      badge: "72+ MON Live Pool",
      icon: Fuel,
      description:
        "Automated gas sponsorship backend running on Monad Testnet (10143). Deploys smart accounts and funds them with starter MON in a single seamless pipeline.",
      features: [
        "Live 72+ MON Gas Pool",
        "Auto Account Deployment",
        "Sub-second Gasless Relaying",
      ],
      linkText: "View Relayer Architecture",
      linkHref: "https://github.com/NVN404/Aegis-protocol/tree/main/relayer",
    },
    {
      id: "game",
      title: "Fall Guys Arena Integration",
      path: "/fall-guys-monad",
      badge: "100% On-Chain 3D Game",
      icon: Gamepad2,
      description:
        "Real-world gaming showcase: pay 0.10 MON entry fee, race physics obstacles, and claim instant checkpoint rewards on Monad using 1-tap hardware passkeys.",
      features: [
        "Sub-second Tournament Entry",
        "Instant Prize Pool Payouts",
        "Zero Extension Popups",
      ],
      linkText: "View Fall Guys Code",
      linkHref: "https://github.com/NVN404/Aegis-protocol/tree/main/fall-guys-monad",
    },
  ];

  return (
    <section id="ecosystem" className="relative py-16 sm:py-20 border-t border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-mono font-semibold text-neutral-800 shadow-sm mb-3 sm:mb-4">
            <span>FULL PRODUCT SUITE</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a0a0a]"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            What&apos;s Inside the Aegis Ecosystem
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-neutral-600 sm:text-lg">
            A battle-tested suite of developer tools, browser extensions, mobile apps, smart contracts,
            and game integrations built for the high-throughput Monad ecosystem.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-[#0a0a0a] text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <Icon size={20} className="text-[#ff6b00]" />
                    </div>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-mono font-bold text-neutral-700 border border-neutral-200">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-bold text-neutral-900">{p.title}</h3>
                  <p className="text-[11px] sm:text-xs font-mono text-[#ff6b00] font-semibold mt-0.5">{p.path}</p>

                  <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-neutral-600">{p.description}</p>

                  <div className="mt-4 sm:mt-5 space-y-1.5 sm:space-y-2">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-neutral-100">
                  {p.isAction ? (
                    <button
                      type="button"
                      onClick={onOpenWallet}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] hover:bg-[#222] py-2.5 px-4 text-xs font-bold text-white shadow-sm transition active:scale-98 cursor-pointer"
                    >
                      <Fingerprint size={16} className="text-[#ff6b00]" />
                      <span>{p.actionText}</span>
                    </button>
                  ) : (
                    <a
                      href={p.linkHref}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between text-xs font-bold text-neutral-800 hover:text-[#ff6b00] transition"
                    >
                      <span>{p.linkText}</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
