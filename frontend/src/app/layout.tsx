import type { Metadata } from "next";
import { Manrope, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aegis Protocol | Hardware Passkey Smart Account & Silicon Proof of Personhood",
  description:
    "The Sovereign, Seedless Hardware Wallet & Anti-Sybil Protocol for Monad — powered natively by Precompile 0x0100 (EIP-7951 / RIP-7212) in 6,900 gas.",
  keywords: [
    "Aegis Protocol",
    "Monad",
    "Passkeys",
    "Hardware Wallet",
    "Proof of Personhood",
    "EIP-7951",
    "RIP-7212",
    "Precompile 0x0100",
    "P-256",
    "Secure Enclave",
    "Account Abstraction",
  ],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${playfair.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-dvh bg-[#f5f4f2] text-[#0a0a0a] antialiased selection:bg-[#ff6b00]/20 selection:text-[#0a0a0a]">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
