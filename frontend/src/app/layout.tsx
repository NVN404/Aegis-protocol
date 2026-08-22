import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

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
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased selection:bg-[#836EF9]/30 selection:text-[#20E2D7]">
        {children}
      </body>
    </html>
  );
}
