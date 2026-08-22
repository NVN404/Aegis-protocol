import type { Metadata } from "next";
import { PasskeyProvider } from "@monad-passkey/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monad Passkey SDK — Example",
  description:
    "A minimal Next.js demo showing @monad-passkey/react integration: FaceID/TouchID passkeys verified natively on Monad via precompile 0x0100.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PasskeyProvider
          config={{
            relayerUrl: process.env.NEXT_PUBLIC_RELAYER_URL ?? "http://localhost:3006",
            network: "testnet",
            rpName: "Monad Passkey SDK Example",
          }}
        >
          {children}
        </PasskeyProvider>
      </body>
    </html>
  );
}
