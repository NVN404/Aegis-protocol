"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is Monad Precompile 0x0100 (EIP-7951 / RIP-7212)?",
      a: "Precompile 0x0100 is a native cryptographic instruction inside the Monad EVM execution engine that validates NIST P-256 (secp256r1) elliptic curve signatures in a single 6,900 gas staticcall (< 0.05ms). Because smartphones (Apple Secure Enclave, Android Titan M2) sign with secp256r1, Monad can verify biometric hardware signatures natively without expensive Solidity math or third-party cloud relayers.",
    },
    {
      q: "How does Aegis prevent private keys from being extracted or phished?",
      a: "Unlike legacy browser extension wallets that hold unencrypted private keys in computer RAM, Aegis generates keys directly inside the hardware chip of your phone or laptop. The private key never leaves the isolated silicon coprocessor. Furthermore, WebAuthn origin binding guarantees that malicious phishing websites cannot trick you into signing for a fake domain.",
    },
    {
      q: "How does Silicon Proof of Personhood prevent bot farms without invasive KYC?",
      a: "Each physical smartphone or laptop hardware security module possesses a unique manufacturer-certified silicon identity. The ProofOfPersonhoodRegistry contract binds 1 physical hardware key to 1 human on Monad. While a bot operator can spin up 100,000 cloud accounts on AWS, they cannot forge 100,000 physical iPhones, making Sybil attacks economically impossible.",
    },
    {
      q: "Can I connect Aegis to existing Web3 dApps?",
      a: "Yes. The Aegis Laptop Extension is Manifest V3 compliant and injects standard EIP-1193 and EIP-6963 providers (window.ethereum and window.monad). Any DEX, NFT marketplace, or game automatically detects 'Aegis' and allows 1-tap TouchID login.",
    },
    {
      q: "How does Aegis differ from Worldcoin?",
      a: "Worldcoin requires humans to stand in physical queues and scan their biological eyeballs/irises with metallic Orb cameras, raising severe biometric privacy and irrevocable data leak concerns. Aegis requires ZERO iris scans, ZERO facial uploads, and ZERO KYC. It simply uses the cryptographic hardware chip already sitting in your pocket.",
    },
    {
      q: "Are there any B2B subscription fees or centralized cloud costs?",
      a: "Zero. Unlike cloud wallet providers (Turnkey, Privy, Magic) that charge monthly B2B SaaS fees per monthly active user, Aegis is completely open-source (MIT), non-custodial, and executes directly on-chain via smart contracts.",
    },
  ];

  return (
    <section id="faq" className="relative py-20 border-t border-neutral-200/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-mono font-semibold text-neutral-800 shadow-sm mb-4">
            <HelpCircle size={15} />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2
            className="text-3xl font-bold tracking-tight text-[#0a0a0a] sm:text-4xl"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Everything You Need to Know
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Got questions about hardware passkeys, precompile 0x0100, or Monad deployment? We&apos;ve got answers.
          </p>
        </div>

        {/* Accordion FAQ List */}
        <div className="mt-12 space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-neutral-200/90 bg-white shadow-sm overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-neutral-900 hover:text-[#ff6b00] transition"
              >
                <span className="text-[15px] pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-neutral-400 transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180 text-[#ff6b00]" : ""
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="px-5 pb-5 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
