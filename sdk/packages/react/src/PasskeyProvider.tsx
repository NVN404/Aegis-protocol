"use client";
// SPDX-License-Identifier: MIT
/**
 * @file PasskeyProvider.tsx
 * @package @monad-passkey/react
 * @notice Context provider that stores passkey identity in localStorage and
 *         makes SDK config available to all child hooks.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { PasskeyIdentity, MonadPasskeyConfig } from "@monad-passkey/core";

const STORAGE_KEY = "monad_passkey_identity";

// ─── Context Shape ────────────────────────────────────────────────────────────

interface PasskeyContextValue {
  /** The currently active passkey identity, or null if none */
  identity: PasskeyIdentity | null;
  /** Update the stored identity */
  setIdentity: (identity: PasskeyIdentity | null) => void;
  /** Clear the stored identity (logout) */
  clearIdentity: () => void;
  /** Resolved SDK configuration (merged defaults + user overrides) */
  config: Required<MonadPasskeyConfig>;
}

const PasskeyContext = createContext<PasskeyContextValue | null>(null);

// ─── Default Config ───────────────────────────────────────────────────────────

const DEFAULT_CONFIG: Required<MonadPasskeyConfig> = {
  relayerUrl: "http://localhost:3006",
  factoryAddress: "0x9A48b2C74618eB1761d7634032dDEf1B2b42931E",
  registryAddress: "0xd9e6c85409d250308c31DEf3a7021889a96fBe8C",
  faucetAddress: "0x5b6e24Be7714980f202e02221f5a5E9E34d0D4bD",
  network: "testnet",
  rpId: "",
  rpName: "Monad Proof of Personhood",
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface PasskeyProviderProps {
  children: ReactNode;
  /**
   * SDK configuration. All fields are optional — defaults point to Monad Testnet.
   *
   * @example
   * ```tsx
   * <PasskeyProvider relayerUrl="https://relayer.yourapp.com" network="testnet">
   *   <App />
   * </PasskeyProvider>
   * ```
   */
  config?: MonadPasskeyConfig;
  /**
   * If true, the identity is NOT persisted to localStorage.
   * Useful for server-side rendering or incognito demos.
   * @default false
   */
  disablePersistence?: boolean;
}

/**
 * Wrap your application (or a subtree) with `<PasskeyProvider>` to enable
 * `usePasskey` and `useRelayer` hooks for all children.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { PasskeyProvider } from "@monad-passkey/react";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <PasskeyProvider config={{ relayerUrl: "https://relayer.yourapp.com" }}>
 *           {children}
 *         </PasskeyProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function PasskeyProvider({
  children,
  config,
  disablePersistence = false,
}: PasskeyProviderProps) {
  const resolvedConfig: Required<MonadPasskeyConfig> = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const [identity, setIdentityState] = useState<PasskeyIdentity | null>(null);

  // Rehydrate from localStorage on mount (client only)
  useEffect(() => {
    if (disablePersistence || typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as PasskeyIdentity;
        // Uint8Array doesn't survive JSON round-trip — rebuild it
        if (parsed.rawCredentialId && !ArrayBuffer.isView(parsed.rawCredentialId)) {
          parsed.rawCredentialId = new Uint8Array(
            Object.values(parsed.rawCredentialId as Record<string, number>)
          );
        }
        setIdentityState(parsed);
      }
    } catch {
      // Corrupted storage — ignore
    }
  }, [disablePersistence]);

  const setIdentity = useCallback(
    (newIdentity: PasskeyIdentity | null) => {
      setIdentityState(newIdentity);
      if (disablePersistence || typeof window === "undefined") return;
      if (newIdentity) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIdentity));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
    [disablePersistence]
  );

  const clearIdentity = useCallback(() => setIdentity(null), [setIdentity]);

  return (
    <PasskeyContext.Provider
      value={{ identity, setIdentity, clearIdentity, config: resolvedConfig }}
    >
      {children}
    </PasskeyContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access the raw passkey context. Prefer `usePasskey` for most use cases.
 * @throws If called outside of a `<PasskeyProvider>`
 */
export function usePasskeyContext(): PasskeyContextValue {
  const ctx = useContext(PasskeyContext);
  if (!ctx) {
    throw new Error(
      "[monad-passkey] usePasskeyContext must be used inside a <PasskeyProvider>. " +
        "Wrap your app (or page) with <PasskeyProvider> to fix this."
    );
  }
  return ctx;
}
