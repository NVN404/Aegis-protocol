"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { QrCode, X, Copy, Check } from "lucide-react";
import { PasskeyIdentity } from "@/lib/webauthn";

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  identity: PasskeyIdentity;
}

export function ReceiveModal({ isOpen, onClose, identity }: ReceiveModalProps) {
  const [copied, setCopied] = useState(false);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    identity.counterfactualAddress
  )}&color=0a0a0a&bgcolor=ffffff&margin=6`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(identity.counterfactualAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl bg-white border border-neutral-200/90 p-6 text-neutral-900 shadow-2xl relative text-center"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] flex items-center justify-center text-white mx-auto mb-3 shadow-sm">
          <QrCode size={24} className="text-[#ff6b00]" />
        </div>

        <h3 className="font-bold text-base text-neutral-900">Receive Monad (MON)</h3>
        <p className="text-xs text-neutral-500 mb-3">Send testnet MON or tokens to this hardware address</p>

        {/* Real Dynamic QR Code */}
        <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 mx-auto w-48 h-48 flex flex-col items-center justify-center mb-4 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrCodeUrl}
            alt="Receive Address QR Code"
            width={160}
            height={160}
            className="rounded-xl shadow-xs"
          />
        </div>

        {/* Address Display */}
        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-left mb-4">
          <span className="text-[10px] text-neutral-500 font-mono block mb-1">Your Monad Smart Address:</span>
          <p className="text-xs font-mono text-neutral-900 font-bold break-all">
            {identity.counterfactualAddress}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-3 rounded-xl bg-[#0a0a0a] hover:bg-[#222] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition active:scale-95 cursor-pointer"
        >
          {copied ? <Check size={16} className="text-emerald-400 font-bold" /> : <Copy size={16} />}
          <span>{copied ? "Copied to Clipboard!" : "Copy Address"}</span>
        </button>
      </motion.div>
    </div>
  );
}
