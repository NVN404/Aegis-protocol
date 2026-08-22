"use client";
// SPDX-License-Identifier: MIT
/**
 * @file useRelayer.ts
 * @package @monad-passkey/react
 * @notice React hook for interacting with the Monad Passkey gasless relayer.
 *
 * The relayer sponsors gas so users don't need MON to register or claim from the faucet.
 * You must deploy your own relayer server (see the `relayer/` directory in the repo).
 */

import { useState, useCallback } from "react";
import {
  type PasskeyIdentity,
  type PasskeySignatureResult,
  type FaucetClaimResponse,
  type RelayResponse,
  type RelayerHealthStatus,
  type RelayerTxStatus,
} from "@monad-passkey/core";
import { usePasskeyContext } from "./PasskeyProvider";

// ─── Hook Return Type ─────────────────────────────────────────────────────────

export interface UseRelayerReturn {
  /** True while a relayer HTTP request is in-flight */
  isPending: boolean;
  /** Status of the last relayer operation */
  status: RelayerTxStatus;
  /** Latest error message, or null */
  error: string | null;
  /** Result of the last successful faucet claim */
  lastClaimResult: FaucetClaimResponse | null;
  /** Result of the last successful relay call */
  lastRelayResult: RelayResponse | null;

  /**
   * Claim MON from the sybil-resistant faucet.
   *
   * The relayer auto-registers the identity in the PoP registry if it hasn't been
   * registered yet, then transfers 0.5 MON to the passkey's counterfactual address.
   *
   * @param identity - The active `PasskeyIdentity`
   * @param signature - A `PasskeySignatureResult` from `usePasskey().signChallenge()`
   * @returns `FaucetClaimResponse` with the transaction hash on success
   *
   * @example
   * ```ts
   * const challenge = crypto.getRandomValues(new Uint8Array(32));
   * const sig = await signChallenge(challenge);
   * if (sig) await claimFaucet(identity, sig);
   * ```
   */
  claimFaucet: (
    identity: PasskeyIdentity,
    signature: PasskeySignatureResult
  ) => Promise<FaucetClaimResponse | null>;

  /**
   * Send a generic sponsored transaction through the relayer.
   *
   * @param target - The contract address to call
   * @param data - ABI-encoded calldata
   * @param value - Optional ETH value to send (as string, e.g. "0.01")
   * @returns `RelayResponse` with the transaction hash on success
   */
  relay: (
    target: string,
    data: string,
    value?: string
  ) => Promise<RelayResponse | null>;

  /**
   * Check the relayer's health (connectivity, balance, block number).
   *
   * @returns `RelayerHealthStatus` or null if the relayer is unreachable
   */
  checkHealth: () => Promise<RelayerHealthStatus | null>;

  /** Reset error and status back to idle */
  reset: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * `useRelayer` — hook for interacting with the Monad Passkey gasless relayer.
 *
 * Must be used inside a `<PasskeyProvider>`.
 *
 * @example
 * ```tsx
 * function FaucetButton({ identity }: { identity: PasskeyIdentity }) {
 *   const { signChallenge } = usePasskey();
 *   const { claimFaucet, isPending, lastClaimResult } = useRelayer();
 *
 *   const handleClaim = async () => {
 *     const challenge = crypto.getRandomValues(new Uint8Array(32));
 *     const sig = await signChallenge(challenge);
 *     if (sig) await claimFaucet(identity, sig);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleClaim} disabled={isPending}>
 *         {isPending ? "Claiming..." : "Claim 0.5 MON"}
 *       </button>
 *       {lastClaimResult?.transactionHash && (
 *         <a href={lastClaimResult.explorerUrl} target="_blank">View TX</a>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useRelayer(): UseRelayerReturn {
  const { config } = usePasskeyContext();
  const relayerUrl = config.relayerUrl;

  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<RelayerTxStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastClaimResult, setLastClaimResult] =
    useState<FaucetClaimResponse | null>(null);
  const [lastRelayResult, setLastRelayResult] = useState<RelayResponse | null>(
    null
  );

  // ── claimFaucet ───────────────────────────────────────────────────────────

  const claimFaucet = useCallback(
    async (
      identity: PasskeyIdentity,
      signature: PasskeySignatureResult
    ): Promise<FaucetClaimResponse | null> => {
      setIsPending(true);
      setStatus("pending");
      setError(null);

      try {
        const body = {
          recipient: identity.counterfactualAddress,
          pubKeyX: identity.pubKeyX,
          pubKeyY: identity.pubKeyY,
          deviceLabel: identity.deviceLabel,
          authenticatorData: signature.authenticatorData,
          clientDataJSON: signature.clientDataJSON,
          r: signature.r,
          s: signature.s,
        };

        const res = await fetch(`${relayerUrl}/api/faucet-claim`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data: FaucetClaimResponse = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error ?? `Relayer returned HTTP ${res.status}`);
        }

        setLastClaimResult(data);
        setStatus("success");
        return data;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Relayer faucet claim failed. Is the relayer running?";
        setError(message);
        setStatus("error");
        return null;
      } finally {
        setIsPending(false);
      }
    },
    [relayerUrl]
  );

  // ── relay ─────────────────────────────────────────────────────────────────

  const relay = useCallback(
    async (
      target: string,
      data: string,
      value = "0"
    ): Promise<RelayResponse | null> => {
      setIsPending(true);
      setStatus("pending");
      setError(null);

      try {
        const res = await fetch(`${relayerUrl}/api/relay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target, data, value }),
        });

        const result: RelayResponse = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.error ?? `Relayer returned HTTP ${res.status}`);
        }

        setLastRelayResult(result);
        setStatus("success");
        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Relay transaction failed.";
        setError(message);
        setStatus("error");
        return null;
      } finally {
        setIsPending(false);
      }
    },
    [relayerUrl]
  );

  // ── checkHealth ───────────────────────────────────────────────────────────

  const checkHealth = useCallback(async (): Promise<RelayerHealthStatus | null> => {
    try {
      const res = await fetch(`${relayerUrl}/health`);
      if (!res.ok) return null;
      return (await res.json()) as RelayerHealthStatus;
    } catch {
      return null;
    }
  }, [relayerUrl]);

  // ── reset ─────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setError(null);
    setStatus("idle");
  }, []);

  return {
    isPending,
    status,
    error,
    lastClaimResult,
    lastRelayResult,
    claimFaucet,
    relay,
    checkHealth,
    reset,
  };
}
