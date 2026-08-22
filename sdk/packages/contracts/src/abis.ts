// SPDX-License-Identifier: MIT
/**
 * @file abis.ts
 * @package @monad-passkey/contracts
 * @notice Fully typed ABIs for Monad Passkey PoP smart contracts.
 *
 * These are compatible with viem's `parseAbi` format (const arrays).
 * Import into wagmi hooks or viem contract instances directly.
 */

export const ProofOfPersonhoodRegistryABI = [
  // ─── Write Functions ─────────────────────────────────────────────────────
  {
    name: "registerHuman",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "pubKeyX", type: "bytes32" },
      { name: "pubKeyY", type: "bytes32" },
      { name: "boundAccount", type: "address" },
      { name: "deviceLabel", type: "string" },
      { name: "authenticatorData", type: "bytes" },
      { name: "clientDataJSON", type: "bytes" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    outputs: [{ name: "identityId", type: "bytes32" }],
  },
  {
    name: "verifyHumanPersonhood",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "identityId", type: "bytes32" },
      { name: "authenticatorData", type: "bytes" },
      { name: "clientDataJSON", type: "bytes" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    outputs: [{ name: "valid", type: "bool" }],
  },
  // ─── Read Functions ──────────────────────────────────────────────────────
  {
    name: "isVerifiedHuman",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "totalIdentities",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getIdentity",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "identityId", type: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "identityId", type: "bytes32" },
          { name: "pubKeyX", type: "bytes32" },
          { name: "pubKeyY", type: "bytes32" },
          { name: "boundAccount", type: "address" },
          { name: "registeredAt", type: "uint64" },
          { name: "lastVerifiedAt", type: "uint64" },
          { name: "verificationCount", type: "uint32" },
          { name: "isRevoked", type: "bool" },
          { name: "deviceLabel", type: "string" },
        ],
      },
    ],
  },
  // ─── Events ──────────────────────────────────────────────────────────────
  {
    name: "HumanRegistered",
    type: "event",
    inputs: [
      { name: "identityId", type: "bytes32", indexed: true },
      { name: "boundAccount", type: "address", indexed: true },
      { name: "pubKeyX", type: "bytes32", indexed: false },
      { name: "pubKeyY", type: "bytes32", indexed: false },
      { name: "deviceLabel", type: "string", indexed: false },
    ],
  },
  {
    name: "PersonhoodVerified",
    type: "event",
    inputs: [
      { name: "identityId", type: "bytes32", indexed: true },
      { name: "verifierApp", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
      { name: "newVerificationCount", type: "uint32", indexed: false },
    ],
  },
] as const;

export const SybilResistantFaucetABI = [
  // ─── Write Functions ─────────────────────────────────────────────────────
  {
    name: "claimWithPasskey",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "identityId", type: "bytes32" },
      { name: "recipient", type: "address" },
      { name: "authenticatorData", type: "bytes" },
      { name: "clientDataJSON", type: "bytes" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    outputs: [],
  },
  // ─── Read Functions ──────────────────────────────────────────────────────
  {
    name: "getRemainingCooldown",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "identityId", type: "bytes32" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "dripAmount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalClaims",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalDispensed",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "botAttemptsBlocked",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // ─── Events ──────────────────────────────────────────────────────────────
  {
    name: "FaucetClaimed",
    type: "event",
    inputs: [
      { name: "identityId", type: "bytes32", indexed: true },
      { name: "recipient", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    name: "BotAttackPrevented",
    type: "event",
    inputs: [
      { name: "attacker", type: "address", indexed: true },
      { name: "reason", type: "string", indexed: false },
    ],
  },
] as const;

export const PasskeyAccountABI = [
  {
    name: "execute",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "target", type: "address" },
      { name: "value", type: "uint256" },
      { name: "data", type: "bytes" },
      { name: "msgHash", type: "bytes32" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    outputs: [],
  },
  {
    name: "isValidSignature",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "hash", type: "bytes32" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [{ name: "magicValue", type: "bytes4" }],
  },
  {
    name: "pubKeyX",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
  },
  {
    name: "pubKeyY",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
  },
] as const;

export const PasskeyAccountFactoryABI = [
  {
    name: "createAccount",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "pubKeyX", type: "bytes32" },
      { name: "pubKeyY", type: "bytes32" },
    ],
    outputs: [{ name: "account", type: "address" }],
  },
  {
    name: "getAddress",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "pubKeyX", type: "bytes32" },
      { name: "pubKeyY", type: "bytes32" },
    ],
    outputs: [{ name: "", type: "address" }],
  },
] as const;

/** Minimal ABI for the Monad precompile 0x0100 (secp256r1 verifier) */
export const WebAuthnPrecompileABI = [
  {
    name: "verify",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "message", type: "bytes32" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
      { name: "qx", type: "bytes32" },
      { name: "qy", type: "bytes32" },
    ],
    outputs: [{ name: "success", type: "bool" }],
  },
] as const;
