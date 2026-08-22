// SPDX-License-Identifier: MIT
/**
 * @file addresses.ts
 * @package @monad-passkey/contracts
 * @notice Deployed contract addresses for Monad Passkey PoP per network.
 */

/** Contract addresses on Monad Testnet (Chain ID 10143) */
export const TESTNET_ADDRESSES = {
  /** PasskeyAccountFactory — CREATE2 factory for deterministic smart accounts */
  factory: "0x29373c0172c89eA61df297ca76A252815b012bd1",
  /** ProofOfPersonhoodRegistry — canonical human identity registry */
  popRegistry: "0xeE575e3C061c85a14cb44152adDC5baB28Ce68a4",
  /** SybilResistantFaucet — hardware-gated 0.5 MON drip */
  faucet: "0x9e3719c834665267dda6fD9C228643a73197E902",
  /** Monad secp256r1 precompile — EIP-7951 / RIP-7212 */
  precompile: "0x0000000000000000000000000000000000000100",
} as const;

/** Contract addresses on Monad Mainnet (Chain ID 143) — populate after mainnet launch */
export const MAINNET_ADDRESSES = {
  factory: "" as `0x${string}`,
  popRegistry: "" as `0x${string}`,
  faucet: "" as `0x${string}`,
  precompile: "0x0000000000000000000000000000000000000100" as const,
} as const;

/** Helper: get addresses by network name */
export function getAddresses(network: "testnet" | "mainnet") {
  return network === "mainnet" ? MAINNET_ADDRESSES : TESTNET_ADDRESSES;
}
