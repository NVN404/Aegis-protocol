"use client";

import React from "react";
import { PasskeyProvider } from "@monad-passkey/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PasskeyProvider
      config={{
        relayerUrl: process.env.NEXT_PUBLIC_RELAYER_URL ?? "http://localhost:3006",
        network: "testnet",
        rpName: "Monad Passkey SDK Example",
      }}
    >
      {children}
    </PasskeyProvider>
  );
}
