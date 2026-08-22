"use client";

import React, { useState } from "react";
import { ShieldCheck, Smartphone, Menu, X } from "lucide-react";

interface NavbarProps {
  onOpenWallet: () => void;
}

export function Navbar({ onOpenWallet }: NavbarProps) {
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
    <header className="pointer-events-none fixed inset-x-0 top-3 z-[200] px-3 sm:top-4 sm:px-6 lg:top-5 lg:px-8">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between gap-3">
        {/* Logo Pill */}
        <a
          href="/"
          className="group pointer-events-auto relative inline-flex shrink-0 items-center gap-2.5 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/85 px-3 py-2 shadow-[0_6px_18px_-6px_rgba(15,15,15,0.12),0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:border-neutral-300 hover:bg-white hover:shadow-[0_12px_28px_-8px_rgba(15,15,15,0.2)] active:scale-[0.98]"
        >
          <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-[#0a0a0a] text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
            <ShieldCheck size={18} className="text-[#ff6b00]" />
          </span>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold tracking-tight text-neutral-900 leading-none">
              Aegis Protocol
            </span>
            <span className="text-[10px] font-mono font-medium text-neutral-500 tracking-wider">
              MONAD 0x0100
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links Pill */}
        <div className="pointer-events-auto hidden lg:inline-flex items-center gap-1 rounded-full border border-neutral-200/90 bg-white/85 p-1.5 shadow-[0_6px_18px_-6px_rgba(15,15,15,0.1),0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md">
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
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white/85 p-1.5 shadow-[0_6px_18px_-6px_rgba(15,15,15,0.1),0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md">
          {/* GitHub Pill */}
          <a
            href="https://github.com/NVN404/Aegis-protocol"
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex h-9 items-center gap-1.5 rounded-full bg-[#151515] px-3.5 text-[13px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-300 hover:bg-[#222] active:scale-95"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-.99-.02-1.94-3.2.69-3.88-1.54-3.88-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.93 10.93 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
            <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-mono text-neutral-300">
              v2.0
            </span>
          </a>

          {/* Launch Wallet App Button */}
          <button
            type="button"
            onClick={onOpenWallet}
            className="group relative inline-flex h-9 items-center gap-1.5 rounded-full bg-[#ff6b00] px-4 text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(255,107,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:bg-[#e55e00] hover:shadow-[0_6px_20px_rgba(255,107,0,0.45)] active:scale-95 cursor-pointer"
          >
            <Smartphone size={15} />
            <span>Launch App</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 lg:hidden hover:bg-neutral-50 active:scale-95"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto absolute right-3 top-full mt-3 w-64 origin-top-right rounded-2xl border border-neutral-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-xl transition-all duration-200 lg:hidden flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition"
              >
                <span>{link.label}</span>
              </a>
            ))}
            <div className="pt-2 mt-1 border-t border-neutral-100 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWallet();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ff6b00] px-3 py-2 text-xs font-bold text-white shadow-sm"
              >
                <Smartphone size={15} />
                <span>Open Live Wallet</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
