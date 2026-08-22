"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { QrCode, X, Copy, Check, ShieldCheck } from "@phosphor-icons/react";
import { PasskeyIdentity } from "@/lib/webauthn";

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  identity: PasskeyIdentity;
}

export function ReceiveModal({ isOpen, onClose, identity }: ReceiveModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(identity.counterfactualAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl bg-[#0e0a26] border border-white/10 p-6 text-white shadow-2xl relative text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#20E2D7] to-[#10B981] flex items-center justify-center text-slate-950 mx-auto mb-3 shadow-lg">
          <QrCode size={24} weight="bold" />
        </div>

        <h3 className="font-extrabold text-base">Receive Monad (MON)</h3>
        <p className="text-xs text-gray-400 mb-4">Send testnet MON or tokens to this hardware address</p>

        {/* QR Simulation Box */}
        <div className="p-4 rounded-2xl bg-white mx-auto w-48 h-48 flex flex-col items-center justify-center shadow-inner mb-4">
          <div className="w-full h-full border-4 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-900 p-2 text-center">
            <QrCode size={80} className="text-[#836EF9]" weight="fill" />
            <span className="text-[9px] font-mono font-bold text-slate-700 mt-1">MONAD PASSKEY WALLET</span>
          </div>
        </div>

        {/* Address Display */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-left mb-4">
          <span className="text-[10px] text-gray-400 font-mono block mb-1">Your Monad Smart Address:</span>
          <p className="text-xs font-mono text-[#20E2D7] font-bold break-all">
            {identity.counterfactualAddress}
          </p>
        </div>

        <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#10B981] mb-4">
          <ShieldCheck size={14} weight="fill" />
          <span>Secured by {identity.deviceLabel}</span>
        </div>

        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#836EF9] hover:bg-[#725aeb] text-white font-bold text-xs shadow-lg transition"
        >
          {copied ? <Check size={16} weight="bold" /> : <Copy size={16} />}
          <span>{copied ? "Address Copied!" : "Copy Address"}</span>
        </button>
      </motion.div>
    </div>
  );
}
