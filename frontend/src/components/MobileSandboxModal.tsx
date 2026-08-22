"use client";

import React from "react";
import { MobileWalletApp } from "@/components/MobileWalletApp";
import { X, Lightning, ShieldCheck, ArrowSquareOut } from "@phosphor-icons/react";

interface MobileSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSandboxModal({ isOpen, onClose }: MobileSandboxModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Container Card */}
      <div className="relative w-full max-w-md bg-[oklch(14%_0.02_285)] border border-[oklch(28%_0.035_285)] rounded-3xl p-5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[oklch(22%_0.025_285)] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[oklch(62%_0.22_285/0.2)] flex items-center justify-center text-[oklch(82%_0.16_195)]">
              <ShieldCheck size={14} weight="fill" />
            </div>
            <span className="font-bold text-sm text-white">Aegis Wallet Sandbox</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[oklch(20%_0.03_285)] hover:bg-[oklch(26%_0.04_285)] text-[oklch(74%_0.015_285)] hover:text-white transition cursor-pointer"
            aria-label="Close Sandbox"
          >
            <X size={16} />
          </button>
        </div>

        {/* Embedded Wallet */}
        <div className="overflow-y-auto flex-1 pr-1">
          <MobileWalletApp />
        </div>

        {/* Modal Footer Note */}
        <div className="pt-3 mt-3 border-t border-[oklch(22%_0.025_285)] flex items-center justify-between text-[10px] text-[oklch(56%_0.02_285)] shrink-0">
          <span>Connected to Monad Testnet (10143)</span>
          <a
            href="https://testnet.monadexplorer.com"
            target="_blank"
            rel="noreferrer"
            className="text-[oklch(82%_0.16_195)] hover:underline flex items-center gap-1"
          >
            <span>Monad Explorer</span>
            <ArrowSquareOut size={10} />
          </a>
        </div>
      </div>
    </div>
  );
}
