// SPDX-License-Identifier: MIT
/**
 * @file config.ts
 * @package @monad-passkey/core
 * @notice Monad network configuration and deployed contract addresses for Passkey PoP.
 */

import type { MonadNetworkConfig } from "./types";

/** Monad network configurations */
export const MONAD_NETWORKS: Record<"testnet" | "mainnet", MonadNetworkConfig> =
  {
    testnet: {
      chainId: 10143,
      name: "Monad Testnet",
      rpcUrl: "https://testnet-rpc.monad.xyz",
      blockTimeMs: 400,
      explorerUrl: "https://testnet.monadexplorer.com",
      symbol: "MON",
    },
    mainnet: {
      chainId: 143,
      name: "Monad Mainnet",
      rpcUrl: "https://rpc.monad.xyz",
      blockTimeMs: 400,
      explorerUrl: "https://monadscan.com",
      symbol: "MON",
    },
  };

/**
 * Monad native secp256r1 precompile at address 0x0100.
 * Implements EIP-7951 / RIP-7212 — verifies P-256 signatures for a flat 6,900 gas.
 */
export const MONAD_PRECOMPILE_0X0100 = {
  address: "0x0000000000000000000000000000000000000100" as const,
  shortAddress: "0x0100" as const,
  standard: "EIP-7951 / RIP-7212 (secp256r1 P-256 Curve Verification)" as const,
  gasCost: 6900,
  solidityGasWithoutPrecompile: 320000,
  gasSavingsPercent: "97.8%" as const,
};

/**
 * Deployed Monad Passkey PoP contract addresses per network.
 *
 * Replace or extend these if you deploy your own contract instances.
 */
export const CONTRACT_ADDRESSES = {
  testnet: {
    factory: "0x29373c0172c89eA61df297ca76A252815b012bd1",
    popRegistry: "0xeE575e3C061c85a14cb44152adDC5baB28Ce68a4",
    faucet: "0x9e3719c834665267dda6fD9C228643a73197E902",
  },
  mainnet: {
    factory: "" as string, // populate when mainnet deploys
    popRegistry: "" as string,
    faucet: "" as string,
  },
} as const;

/**
 * ABI fragments for Monad Passkey PoP contracts (as ethers.js human-readable ABI).
 * Use `@monad-passkey/contracts` for fully typed viem-compatible ABIs.
 */
export const CONTRACT_ABIS = {
  ProofOfPersonhoodRegistry: [
    "function registerHuman(bytes32 pubKeyX, bytes32 pubKeyY, address boundAccount, string deviceLabel, bytes authenticatorData, bytes clientDataJSON, bytes32 r, bytes32 s) external returns (bytes32 identityId)",
    "function verifyHumanPersonhood(bytes32 identityId, bytes authenticatorData, bytes clientDataJSON, bytes32 r, bytes32 s) external returns (bool)",
    "function isVerifiedHuman(address account) external view returns (bool)",
    "function totalIdentities() external view returns (uint256)",
    "function getIdentity(bytes32 identityId) external view returns (tuple(bytes32 identityId, bytes32 pubKeyX, bytes32 pubKeyY, address boundAccount, uint64 registeredAt, uint64 lastVerifiedAt, uint32 verificationCount, bool isRevoked, string deviceLabel))",
    "event HumanRegistered(bytes32 indexed identityId, address indexed boundAccount, bytes32 pubKeyX, bytes32 pubKeyY, string deviceLabel)",
    "event PersonhoodVerified(bytes32 indexed identityId, address indexed verifierApp, uint256 timestamp, uint32 newVerificationCount)",
  ],
  SybilResistantFaucet: [
    "function claimWithPasskey(bytes32 identityId, address payable recipient, bytes authenticatorData, bytes clientDataJSON, bytes32 r, bytes32 s) external",
    "function getRemainingCooldown(bytes32 identityId) external view returns (uint256)",
    "function dripAmount() external view returns (uint256)",
    "function totalClaims() external view returns (uint256)",
    "function totalDispensed() external view returns (uint256)",
    "function botAttemptsBlocked() external view returns (uint256)",
    "event FaucetClaimed(bytes32 indexed identityId, address indexed recipient, uint256 amount)",
    "event BotAttackPrevented(address indexed attacker, string reason)",
  ],
  PasskeyAccount: [
    "function execute(address target, uint256 value, bytes calldata data, bytes32 msgHash, bytes32 r, bytes32 s) external",
    "function isValidSignature(bytes32 hash, bytes calldata signature) external view returns (bytes4)",
    "function pubKeyX() external view returns (bytes32)",
    "function pubKeyY() external view returns (bytes32)",
  ],
  PasskeyAccountFactory: [
    "function createAccount(bytes32 pubKeyX, bytes32 pubKeyY) external returns (address account)",
    "function getAddress(bytes32 pubKeyX, bytes32 pubKeyY) external view returns (address)",
  ],
} as const;
