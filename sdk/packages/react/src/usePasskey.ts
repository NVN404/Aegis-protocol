"use client";
// SPDX-License-Identifier: MIT
/**
 * @file usePasskey.ts
 * @package @monad-passkey/react
 * @notice Primary React hook — manages the full passkey identity lifecycle.
 */

import { useState, useCallback } from "react";
import {
  createHardwarePasskey,
  createSimulatedPasskey,
  signWithHardwarePasskey,
  signWithSimulatedPasskey,
  isWebAuthnAvailable,
  type PasskeyIdentity,
  type PasskeySignatureResult,
  type CreatePasskeyOptions,
} from "@monad-passkey/core";
import { usePasskeyContext } from "./PasskeyProvider";

// ─── Hook Return Type ─────────────────────────────────────────────────────────

export interface UsePasskeyReturn {
  /** The currently active passkey identity, or null if none is registered */
  identity: PasskeyIdentity | null;
  /** True while a biometric prompt is open or keys are being generated */
  isLoading: boolean;
  /** Latest error message, or null if no error */
  error: string | null;
  /** True if the current browser/device supports hardware passkeys */
  isWebAuthnSupported: boolean;

  /**
   * Trigger the native biometric prompt to create a new hardware passkey.
   * On iOS/macOS this shows FaceID/TouchID. On Android it shows biometric unlock.
   * On desktop browsers it may show a security key or platform authenticator dialog.
   *
   * @param options - Optional overrides for username, rpName, factoryAddress, etc.
   * @returns The created `PasskeyIdentity` on success
   * @throws On cancellation or unsupported device
   */
  createHardwarePasskey: (options?: CreatePasskeyOptions) => Promise<PasskeyIdentity | null>;

  /**
   * Create a software-simulated passkey for local development (no biometrics needed).
   * The identity is marked `isSimulated: true` and is not hardware-bound.
   *
   * @param seed - Optional deterministic seed string. @default "monad-dev"
   */
  createSimulatedPasskey: (seed?: string) => PasskeyIdentity;

  /**
   * Sign an arbitrary 32-byte challenge using the current identity.
   * If the identity is hardware, triggers the biometric prompt.
   * If the identity is simulated, returns deterministic pseudo-signatures.
   *
   * @param challengeBytes - 32 random bytes as the signing challenge
   * @returns `PasskeySignatureResult` with r, s, authenticatorData, clientDataJSON, rawDigest
   */
  signChallenge: (challengeBytes: Uint8Array) => Promise<PasskeySignatureResult | null>;

  /**
   * Manually set the active identity (e.g. after restoring from a different source).
   */
  setIdentity: (identity: PasskeyIdentity | null) => void;

  /**
   * Clear the current identity and remove it from localStorage.
   * Equivalent to "disconnect" or "logout".
   */
  reset: () => void;

  /** Clear the error state */
  clearError: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * `usePasskey` — the primary hook for Monad Passkey Proof of Personhood.
 *
 * Manages the full passkey lifecycle: creation, signing, state, and errors.
 * Must be used inside a `<PasskeyProvider>`.
 *
 * @example
 * ```tsx
 * function ConnectButton() {
 *   const { identity, isLoading, createHardwarePasskey, reset } = usePasskey();
 *
 *   if (identity) {
 *     return (
 *       <div>
 *         <p>Connected: {identity.counterfactualAddress}</p>
 *         <button onClick={reset}>Disconnect</button>
 *       </div>
 *     );
 *   }
 *
 *   return (
 *     <button onClick={() => createHardwarePasskey()} disabled={isLoading}>
 *       {isLoading ? "Scanning..." : "Connect with FaceID"}
 *     </button>
 *   );
 * }
 * ```
 */
export function usePasskey(): UsePasskeyReturn {
  const { identity, setIdentity, clearIdentity, config } = usePasskeyContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // ── createHardwarePasskey ─────────────────────────────────────────────────

  const handleCreateHardwarePasskey = useCallback(
    async (options?: CreatePasskeyOptions): Promise<PasskeyIdentity | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const newIdentity = await createHardwarePasskey({
          rpName: config.rpName,
          rpId: config.rpId || undefined,
          factoryAddress: config.factoryAddress,
          ...options,
        });
        setIdentity(newIdentity);
        return newIdentity;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Passkey creation failed.";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [config, setIdentity]
  );

  // ── createSimulatedPasskey ────────────────────────────────────────────────

  const handleCreateSimulatedPasskey = useCallback(
    (seed?: string): PasskeyIdentity => {
      setError(null);
      const simIdentity = createSimulatedPasskey({
        seed: seed ?? "monad-dev",
        factoryAddress: config.factoryAddress,
      });
      setIdentity(simIdentity);
      return simIdentity;
    },
    [config.factoryAddress, setIdentity]
  );

  // ── signChallenge ─────────────────────────────────────────────────────────

  const signChallenge = useCallback(
    async (
      challengeBytes: Uint8Array
    ): Promise<PasskeySignatureResult | null> => {
      if (!identity) {
        setError("No active passkey identity. Create a passkey first.");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        if (identity.isSimulated) {
          // Synchronous simulated signing
          const { ethers } = await import("ethers");
          const sig = signWithSimulatedPasskey(
            identity,
            ethers.hexlify(challengeBytes)
          );
          return sig;
        } else {
          // Hardware biometric signing — triggers platform UI
          const sig = await signWithHardwarePasskey(
            identity.rawCredentialId,
            challengeBytes,
            { rpId: config.rpId || undefined }
          );
          return sig;
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Signing failed.";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [identity, config.rpId]
  );

  // ── reset ─────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    clearIdentity();
    setError(null);
  }, [clearIdentity]);

  return {
    identity,
    isLoading,
    error,
    isWebAuthnSupported: isWebAuthnAvailable(),
    createHardwarePasskey: handleCreateHardwarePasskey,
    createSimulatedPasskey: handleCreateSimulatedPasskey,
    signChallenge,
    setIdentity,
    reset,
    clearError,
  };
}
