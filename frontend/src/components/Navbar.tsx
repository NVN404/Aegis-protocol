"use client";

import React, { useState } from "react";
import { ShieldCheck, Smartphone, Menu, X, QrCode } from "lucide-react";

interface NavbarProps {
  onOpenWallet: () => void;
  onOpenQr?: () => void;
}

export function Navbar({ onOpenWallet, onOpenQr }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Paradigm", href: "#paradigm" },
    { label: "Architecture", href: "#architecture" },
    { label: "Ecosystem", href: "#ecosystem" },
    { label: "SDK & Code", href: "#sdk" },
    { label: "Gas Benchmarks", href: "#benchmarks" },
    { label: "Live Contracts", href: "#contracts" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="fixed inset-x-0 top-2 z-[200] px-2.5 sm:top-4 sm:px-6 lg:top-5 lg:px-8">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between gap-2">
        {/* Logo Pill */}
        <a
          href="/"
          className="group relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/90 px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-[0_4px_16px_-4px_rgba(15,15,15,0.08)] backdrop-blur-md transition-all duration-300 hover:border-neutral-300 hover:bg-white active:scale-95"
        >
          <span className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center overflow-hidden rounded-lg bg-[#0a0a0a] text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
            <ShieldCheck size={16} className="text-[#ff6b00]" />
          </span>
          <div className="flex flex-col">
            <span className="text-[13px] sm:text-[14px] font-bold tracking-tight text-neutral-900 leading-none">
              Aegis Protocol
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono font-medium text-neutral-500 tracking-wider">
              MONAD 0x0100
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links Pill */}
        <div className="hidden lg:inline-flex items-center gap-1 rounded-full border border-neutral-200/90 bg-white/90 p-1.5 shadow-[0_4px_16px_-4px_rgba(15,15,15,0.08)] backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative px-3.5 py-1.5 text-[13px] font-medium text-neutral-700 transition-all duration-200 hover:text-neutral-950 hover:bg-neutral-100/80 rounded-full"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Controls Pill */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-neutral-200/90 bg-white/90 p-1 sm:p-1.5 shadow-[0_4px_16px_-4px_rgba(15,15,15,0.08)] backdrop-blur-md">
          {/* Scan QR Button for Mobile Testing on Desktop */}
          {onOpenQr && (
            <button
              type="button"
              onClick={onOpenQr}
              className="hidden md:inline-flex h-8 sm:h-9 items-center gap-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200/80 px-3 text-[12px] font-bold text-neutral-800 transition active:scale-95 cursor-pointer"
              title="Scan QR Code to open on Mobile Phone"
            >
              <QrCode size={14} className="text-[#ff6b00]" />
              <span>Scan QR</span>
            </button>
          )}

          {/* GitHub Pill (Hidden on very small screens) */}
          <a
            href="https://github.com/NVN404/Aegis-protocol"
            target="_blank"
            rel="noreferrer"
            className="group relative hidden sm:inline-flex h-8 sm:h-9 items-center gap-1.5 rounded-full bg-[#151515] px-3 text-[12px] sm:text-[13px] font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#222] active:scale-95"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-.99-.02-1.94-3.2.69-3.88-1.54-3.88-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.93 10.93 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            <span>GitHub</span>
          </a>

          {/* Launch Wallet App Button */}
          <button
            type="button"
            onClick={onOpenWallet}
            className="group relative inline-flex h-8 sm:h-9 items-center gap-1.5 rounded-full bg-[#ff6b00] px-3 sm:px-4 text-[12px] sm:text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(255,107,0,0.3)] transition-all duration-300 hover:bg-[#e55e00] active:scale-95 cursor-pointer"
          >
            <Smartphone size={14} />
            <span>Launch Wallet</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 lg:hidden hover:bg-neutral-50 active:scale-95 cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="absolute right-2 top-full mt-2 w-72 max-w-[calc(100vw-1rem)] origin-top-right rounded-3xl border border-neutral-200/90 bg-white/98 p-3 shadow-2xl backdrop-blur-2xl transition-all duration-200 lg:hidden flex flex-col gap-1 z-[300]">
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-neutral-100 px-2">
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase">Navigation</span>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Monad 10143
              </span>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition"
              >
                <span>{link.label}</span>
                <span className="text-neutral-300 text-xs">→</span>
              </a>
            ))}

            <div className="pt-2 mt-1 border-t border-neutral-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWallet();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#ff6b00] px-4 py-3 text-xs font-bold text-white shadow-md active:scale-98 transition cursor-pointer"
              >
                <Smartphone size={16} />
                <span>Open Passkey Wallet App</span>
              </button>

              <a
                href="https://github.com/NVN404/Aegis-protocol"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-neutral-100 hover:bg-neutral-200/80 px-4 py-2.5 text-xs font-bold text-neutral-800 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-.99-.02-1.94-3.2.69-3.88-1.54-3.88-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.93 10.93 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
                </svg>
                <span>View GitHub Repository</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
