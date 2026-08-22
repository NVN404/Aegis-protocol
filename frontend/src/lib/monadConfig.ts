// SPDX-License-Identifier: MIT
/**
 * @file monadConfig.ts
 * @notice Monad Network, Precompile, and Smart Contract configuration for Proof of Personhood.
 */

export const MONAD_NETWORKS = {
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

export const MONAD_PRECOMPILE_0X0100 = {
  address: "0x0000000000000000000000000000000000000100",
  shortAddress: "0x0100",
  standard: "EIP-7951 / RIP-7212 (secp256r1 P-256 Curve Verification)",
  gasCost: 6900,
  solidityGasWithoutPrecompile: 320000,
  gasSavingsPercent: "97.8%",
};

// Deployed Live Monad Testnet Contract Addresses
export const CONTRACT_ADDRESSES = {
  factory: "0xf0778d3F792b8d89E603124232f335C8f496D1a6",
  popRegistry: "0xd9e6c85409d250308c31DEf3a7021889a96fBe8C",
  faucet: "0x5b6e24Be7714980f202e02221f5a5E9E34d0D4bD",
  relayerApi: "http://localhost:3006",
};

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
};
