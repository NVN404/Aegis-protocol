"use client";

import React, { useEffect } from "react";
import { motion } from "motion/react";
import { X, Smartphone } from "lucide-react";
import { MobileWalletApp } from "./MobileWalletApp";

interface InteractiveWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InteractiveWalletModal({ isOpen, onClose }: InteractiveWalletModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-md overflow-y-auto">
      {/* Backdrop click dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-lg rounded-t-[2.5rem] sm:rounded-3xl bg-[#f5f4f2] border border-neutral-300/80 p-3 sm:p-6 shadow-2xl max-h-[92dvh] overflow-y-auto flex flex-col"
      >
        {/* Mobile Pull Handle Indicator */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mb-2 sm:hidden shrink-0" />

        {/* Top Bar */}
        <div className="flex items-center justify-between pb-3 mb-2 sm:mb-3 border-b border-neutral-200/80 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0a0a0a] text-white">
              <Smartphone size={16} className="text-[#ff6b00]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-neutral-900">
                Monad Passkey Wallet (Chain ID 10143)
              </h3>
              <p className="text-[10px] font-mono text-neutral-500">
                Hardware Enclave &amp; Precompile 0x0100
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white border border-neutral-200 p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition shadow-xs cursor-pointer active:scale-95"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Embedded Wallet Component */}
        <div className="flex justify-center pb-2">
          <MobileWalletApp />
        </div>
      </motion.div>
    </div>
  );
}
