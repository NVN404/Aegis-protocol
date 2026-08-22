// SPDX-License-Identifier: MIT
/**
 * @monad-passkey/react
 *
 * React hooks, context provider, and headless UI primitives for
 * Monad Passkey Proof of Personhood.
 *
 * Peer dependencies: react@^18||^19, ethers@^6
 */

export { PasskeyProvider, usePasskeyContext } from "./PasskeyProvider";
export { usePasskey } from "./usePasskey";
export { useRelayer } from "./useRelayer";

// Re-export types that consumers need from core
export type {
  PasskeyIdentity,
  PasskeySignatureResult,
  MonadPasskeyConfig,
  FaucetClaimResponse,
  RelayResponse,
  RelayerHealthStatus,
  RelayerTxStatus,
} from "@monad-passkey/core";
