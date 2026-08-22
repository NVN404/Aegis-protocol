// SPDX-License-Identifier: MIT
/**
 * @file addresses.ts
 * @package @monad-passkey/contracts
 * @notice Deployed contract addresses for Monad Passkey PoP per network.
 */

/** Contract addresses on Monad Testnet (Chain ID 10143) */
export const TESTNET_ADDRESSES = {
  /** PasskeyAccountFactory — CREATE2 factory for deterministic smart accounts */
  factory: "0x9A48b2C74618eB1761d7634032dDEf1B2b42931E",
  /** ProofOfPersonhoodRegistry — canonical human identity registry */
  popRegistry: "0xd9e6c85409d250308c31DEf3a7021889a96fBe8C",
  /** SybilResistantFaucet — hardware-gated 0.5 MON drip */
  faucet: "0x5b6e24Be7714980f202e02221f5a5E9E34d0D4bD",
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
