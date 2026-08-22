import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aegis Protocol — Hardware Passkey Smart Account & Silicon Proof of Personhood",
  description:
    "The Sovereign, Seedless Hardware Wallet & Anti-Sybil Protocol for Monad — powered natively by Precompile 0x0100 (EIP-7951 / RIP-7212) in 6,900 gas.",
  keywords: [
    "Monad",
    "Aegis Protocol",
    "Passkeys",
    "WebAuthn",
    "Proof of Personhood",
    "P-256",
    "secp256r1",
    "Precompile 0x0100",
    "EIP-7951",
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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-[#836EF9]/30 selection:text-[#20E2D7]">
        {children}
      </body>
    </html>
  );
}
