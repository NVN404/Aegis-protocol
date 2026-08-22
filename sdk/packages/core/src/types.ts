// SPDX-License-Identifier: MIT
/**
 * @file types.ts
 * @package @monad-passkey/core
 * @notice Shared TypeScript interfaces for the Monad Passkey SDK.
 */

/** Represents a hardware or simulated passkey identity on Monad. */
export interface PasskeyIdentity {
  /** Base64-encoded credential ID from the authenticator */
  credentialId: string;
  /** Raw binary credential ID (used for subsequent signing) */
  rawCredentialId: Uint8Array;
  /** 0x-prefixed 32-byte hex — secp256r1 public key X coordinate (Qx) */
  pubKeyX: string;
  /** 0x-prefixed 32-byte hex — secp256r1 public key Y coordinate (Qy) */
  pubKeyY: string;
  /** Human-readable label for the device (e.g. "Apple iOS (Secure Enclave)") */
  deviceLabel: string;
  /** CREATE2-derived Monad smart account address for this passkey */
  counterfactualAddress: string;
  /** True when using the built-in software simulator (no hardware biometrics) */
  isSimulated: boolean;
  /** Unix timestamp (ms) when the identity was created */
  createdAt: number;
}

/** The parsed output from a WebAuthn signing operation. */
export interface PasskeySignatureResult {
  /** 0x-prefixed 32-byte hex — ECDSA signature component r */
  r: string;
  /** 0x-prefixed 32-byte hex — ECDSA signature component s */
  s: string;
  /** 0x-prefixed hex — raw authenticatorData bytes from the authenticator */
  authenticatorData: string;
  /** 0x-prefixed hex — raw clientDataJSON bytes */
  clientDataJSON: string;
  /** UTF-8 decoded clientDataJSON string */
  clientDataJSONString: string;
  /**
   * SHA-256(authenticatorData || SHA-256(clientDataJSON))
   * This is the exact 32-byte digest that the Monad precompile 0x0100 verifies.
   */
  rawDigest: string;
  /** Parsed WebAuthn flags from authenticatorData */
  flags: {
    /** User was physically present during signing */
    userPresent: boolean;
    /** User was biometrically verified (FaceID/TouchID passed) */
    userVerified: boolean;
  };
}

/** Monad network configuration */
export interface MonadNetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockTimeMs: number;
  explorerUrl: string;
  symbol: string;
}

/** SDK configuration options passed to hooks/providers */
export interface MonadPasskeyConfig {
  /**
   * URL of your deployed gasless relayer server.
   * @example "https://relayer.yourapp.com"
   * @default "http://localhost:3006" (local development)
   */
  relayerUrl?: string;
  /**
   * Override the factory contract address used for counterfactual address derivation.
   * Defaults to the Monad Testnet deployment.
   */
  factoryAddress?: string;
  /**
   * Override the ProofOfPersonhoodRegistry contract address.
   */
  registryAddress?: string;
  /**
   * Override the SybilResistantFaucet contract address.
   */
  faucetAddress?: string;
  /**
   * The Monad network to connect to.
   * @default "testnet"
   */
  network?: "testnet" | "mainnet";
  /**
   * Custom rp.id for WebAuthn. Defaults to `window.location.hostname`.
   */
  rpId?: string;
  /**
   * Custom rp.name displayed during passkey creation.
   * @default "Monad Proof of Personhood"
   */
  rpName?: string;
}

/** Status of a relayer transaction */
export type RelayerTxStatus = "idle" | "pending" | "success" | "error";

/** Response from the relayer /api/faucet-claim endpoint */
export interface FaucetClaimResponse {
  success: boolean;
  transactionHash?: string;
  registrationTxHash?: string | null;
  recipient?: string;
  amount?: string;
  blockNumber?: number;
  gasUsed?: string;
  explorerUrl?: string;
  error?: string;
}

/** Response from the relayer /api/relay endpoint */
export interface RelayResponse {
  success: boolean;
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  explorerUrl?: string;
  error?: string;
}

/** Health status returned by the relayer /health endpoint */
export interface RelayerHealthStatus {
  status: "online" | "error";
  network?: string;
  blockNumber?: number;
  relayerAddress?: string;
  relayerBalanceMon?: string;
  faucetAddress?: string;
  faucetBalanceMon?: string;
  precompileSupport?: string;
}
