"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Smartphone } from "lucide-react";
import { MobileWalletApp } from "./MobileWalletApp";

interface InteractiveWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InteractiveWalletModal({ isOpen, onClose }: InteractiveWalletModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 10 }}
        className="relative w-full max-w-lg rounded-3xl bg-[#f5f4f2] border border-neutral-300/80 p-4 sm:p-6 shadow-2xl my-auto"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200/80">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0a0a0a] text-white">
              <Smartphone size={16} className="text-[#ff6b00]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-neutral-900">
                Live Interactive Passkey Wallet (Monad 10143)
              </h3>
              <p className="text-[10px] font-mono text-neutral-500">
                Hardware Enclave &amp; Precompile 0x0100 Testing Sandbox
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white border border-neutral-200 p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition shadow-xs"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Embedded Wallet Component */}
        <div className="flex justify-center">
          <MobileWalletApp />
        </div>
      </motion.div>
    </div>
  );
}
