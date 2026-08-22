"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, ArrowSquareOut, Cpu, AppWindow, GithubLogo } from "@phosphor-icons/react";

interface NavbarProps {
  onOpenWallet: () => void;
}

export function Navbar({ onOpenWallet }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center justify-between gap-4 px-4 py-2.5 rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-[oklch(18%_0.025_285/0.88)] backdrop-blur-xl border border-[oklch(30%_0.04_285)] shadow-2xl shadow-black/60"
            : "bg-[oklch(18%_0.025_285/0.65)] backdrop-blur-lg border border-[oklch(24%_0.03_285)]"
        } max-w-5xl w-full`}
      >
        {/* Brand Shield & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[oklch(62%_0.22_285/0.2)] border border-[oklch(62%_0.22_285/0.5)] flex items-center justify-center text-[oklch(82%_0.16_195)] shadow-sm">
            <ShieldCheck size={18} weight="fill" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base tracking-tight font-display">
              Aegis<span className="text-[oklch(82%_0.16_195)]">Protocol</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[oklch(24%_0.03_285)] text-[11px] font-mono text-[oklch(74%_0.015_285)] border border-[oklch(30%_0.04_285)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(78%_0.18_155)] animate-pulse"></span>
              Monad 10143
            </span>
          </div>
        </div>

        {/* Navigation Anchors */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-[oklch(74%_0.015_285)]">
          <a href="#simulator" className="hover:text-white transition-colors duration-150">
            Simulator
          </a>
          <a href="#paradigm" className="hover:text-white transition-colors duration-150">
            Why Aegis
          </a>
          <a href="#benchmark" className="hover:text-white transition-colors duration-150">
            Gas Engine
          </a>
          <a href="#ecosystem" className="hover:text-white transition-colors duration-150">
            Ecosystem
          </a>
          <a href="#sdk" className="hover:text-white transition-colors duration-150">
            SDK
          </a>
          <a href="#contracts" className="hover:text-white transition-colors duration-150">
            Deployments
          </a>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/NVN404/Aegis-protocol"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full text-[oklch(74%_0.015_285)] hover:text-white hover:bg-[oklch(24%_0.03_285)] transition-colors duration-150"
            aria-label="GitHub Repository"
          >
            <GithubLogo size={18} weight="bold" />
          </a>

          <button
            onClick={onOpenWallet}
            className="btn-primary text-xs py-1.5 px-3.5 shadow-md shadow-[oklch(62%_0.22_285/0.25)] flex items-center gap-1.5 cursor-pointer"
          >
            <AppWindow size={14} weight="bold" />
            <span>Launch Wallet</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
