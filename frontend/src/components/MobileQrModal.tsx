"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Smartphone, Copy, Check, ExternalLink, Sparkles } from "lucide-react";

interface MobileQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileQrModal({ isOpen, onClose }: MobileQrModalProps) {
  const [copied, setCopied] = useState(false);
  const liveUrl = "https://aegis-protocol-sand-gamma.vercel.app/";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative z-10 w-full max-w-sm rounded-3xl bg-white border border-neutral-200/90 p-6 text-neutral-900 shadow-2xl text-center"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
          aria-label="Close QR Modal"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] flex items-center justify-center text-white mx-auto mb-3 shadow-sm">
          <Smartphone size={22} className="text-[#ff6b00]" />
        </div>

        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ff6b00]/10 text-[#cc5400] text-[11px] font-mono font-bold mb-2">
          <Sparkles size={12} />
          <span>Mobile Experience</span>
        </div>

        <h3 className="font-bold text-lg text-neutral-900">You can test our app in mobile too!</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-[28ch] mx-auto leading-relaxed">
          Scan with your iPhone or Android camera to experience 1-tap hardware TouchID &amp; FaceID on Monad.
        </p>

        {/* Real Scannable QR Code Image */}
        <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/90 mx-auto w-56 h-56 flex flex-col items-center justify-center my-4 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mobile-qr.png"
            alt="Scan QR code to test Aegis Protocol on Mobile"
            width={200}
            height={200}
            className="rounded-xl shadow-xs"
          />
        </div>

        {/* URL Pill & Copy Button */}
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs font-mono mb-4 text-neutral-700">
          <span className="truncate pr-2">{liveUrl}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
            title="Copy URL"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>

        <a
          href={liveUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full py-3 rounded-xl bg-[#0a0a0a] hover:bg-[#222] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition active:scale-95 cursor-pointer"
        >
          <span>Open Direct Link</span>
          <ExternalLink size={14} />
        </a>
      </motion.div>
    </div>
  );
}
