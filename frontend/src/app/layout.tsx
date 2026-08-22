import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f5f4f2",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://aegis-protocol-sand-gamma.vercel.app"),
  title: "Aegis Protocol | Hardware Passkey Smart Account & Silicon Proof of Personhood",
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
    "RIP-7212",
    "Account Abstraction",
  ],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Aegis Protocol — Hardware Passkey Smart Account on Monad",
    description: "6,900 Gas. Trapped in Silicon. Zero Seed Phrases.",
    url: "https://aegis-protocol-sand-gamma.vercel.app",
    siteName: "Aegis Protocol",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Aegis Protocol Logo",
      },
    ],
    locale: "en_US",
    type: "website",
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
      <body className="bg-[#f5f4f2] text-[#0a0a0a] font-sans antialiased selection:bg-[#ff6b00]/20 selection:text-[#cc5400] overflow-x-hidden min-h-screen">
        {/* Subtle TasteSkill noise texture overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-[100] opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
