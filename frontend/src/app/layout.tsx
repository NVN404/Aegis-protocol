import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monad Passkey PoP | Mobile-Native Proof of Personhood",
  description:
    "Decentralized mobile-native Proof of Personhood using Passkeys and Secure Enclave biometrics, verified natively via Monad's 0x0100 P-256 precompile.",
  keywords: ["Monad", "Passkeys", "WebAuthn", "Proof of Personhood", "P-256", "Precompile 0x0100", "EIP-7951", "Account Abstraction"],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-[#836EF9]/30 selection:text-[#20E2D7]">
        {children}
      </body>
    </html>
  );
}
