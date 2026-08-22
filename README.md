# 📱 Monad Passkey PoP — Mobile-Native Proof of Personhood

> **Decentralized, non-invasive Proof of Personhood using Apple Secure Enclave & Android Titan Passkeys (secp256r1 / P-256), verified natively on Monad via Precompile `0x0100` (EIP-7951 / RIP-7212) in 6,900 gas.**

[![Monad Testnet](https://img.shields.io/badge/Network-Monad%20Testnet%20(10143)-836EF9?style=flat-square)](https://testnet.monadexplorer.com/)
[![Precompile 0x0100](https://img.shields.io/badge/Precompile-0x0100%20(EIP--7951)-20E2D7?style=flat-square)](https://docs.monad.xyz/developer-essentials/precompiles)
[![Gas Cost](https://img.shields.io/badge/Gas%20Cost-6%2C900%20Flat%20(-97.8%25)-10B981?style=flat-square)](https://docs.monad.xyz)
[![Foundry](https://img.shields.io/badge/Foundry-13%2F13%20Tests%20Passing-orange?style=flat-square)](https://getfoundry.sh)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## 💡 Executive Summary & Why It Matters

Traditional "Proof of Personhood" (PoP) systems force users into a dystopian trade-off: either surrender biometric data to centralized iris scanners (e.g. Worldcoin) or complete cumbersome centralized KYC.

**Monad Passkey PoP** replaces invasive scans and 12-word seed phrases with the **hardware Secure Enclave** already inside 3+ billion smartphones:
1. **Zero Centralized Issuers / Zero Iris Scans**: Biometric keys never leave the phone's hardware chip.
2. **Native EVM Precompile Verification (`0x0100`)**: Monad includes native precompile support for the `secp256r1` (P-256) curve.
3. **97.8% Gas Reduction**: While Ethereum or non-precompile EVM chains burn **~320,000 gas** in pure Solidity elliptic math, Monad verifies hardware signatures for a flat **6,900 gas**.
4. **400ms Sub-Second Finality**: 1 tap with FaceID or TouchID executes instant sybil-resistant actions on Monad.

---

## 🏗️ System Architecture

```
┌────────────────────────────────┐
│   User Mobile Hardware Device   │  • Apple iPhone (Secure Enclave) / Android (Titan M2)
│   (FaceID / TouchID Biometrics) │  • Generates secp256r1 (P-256) Private Key (never exported)
└───────────────┬────────────────┘
                │  navigator.credentials.create() / get()
                ▼
┌────────────────────────────────┐
│   WebAuthn Frontend Client     │  • Extracts Public Key (Qx, Qy) & ASN.1 DER (r, s)
│   (Next.js 15 + Viem + Ethers) │  • Computes SHA256(authenticatorData || SHA256(clientData))
└───────────────┬────────────────┘
                │  Packed Payload (160 Bytes: hash, r, s, Qx, Qy)
                ▼
┌────────────────────────────────┐
│   Monad Smart Account / PoP    │  • PasskeyAccount.sol / ProofOfPersonhoodRegistry.sol
│   (Contracts on Monad EVM)     │  • Direct staticcall to address(0x0100)
└───────────────┬────────────────┘
                │  staticcall (6,900 Gas)
                ▼
┌────────────────────────────────┐
│   Monad Precompile 0x0100      │  • EIP-7951 / RIP-7212 Native C++ Kernel Verification
│   (secp256r1 P-256 Engine)     │  • Returns 0x01 (Valid) in < 1ms
└────────────────────────────────┘
```

---

## 🚀 4 Killer Real-World Use Cases

### 1. 🛡️ Sybil-Resistant Airdrops & Faucets
- **The Crisis**: Airdrop farmers write Python scripts to generate 50,000 standard Ethereum keys and drain testnet faucets or game reward pools.
- **The Monad Fix**: Attackers cannot mass-script physical hardware chips. By requiring a Passkey assertion verified via `0x0100`, claims are tied 1:1 to physical devices.

### 2. 🎮 The "Seedless" Consumer Crypto App (SocialFi & Gaming)
- **The Crisis**: 90% of mainstream users abandon Web3 apps during 12-word seed phrase onboarding.
- **The Monad Fix**: Users tap "Create Account," scan FaceID, and immediately have a non-custodial Smart Account on Monad. In-game actions and micro-tips sign with a thumbprint in 400ms.

### 3. 🗳️ 1-Phone = 1-Vote Democratic DAO Governance
- **The Crisis**: Token-weighted DAOs degrade into whale oligarchies, and quadratic voting fails when whales split funds into 10,000 burner wallets.
- **The Monad Fix**: DAO votes are weighted by verified hardware devices. 1 Phone = 1 Democratic Voice.

### 4. 🐋 Hardware-Level 2FA for Whales & High-Value Vaults
- **The Crisis**: Hot wallet seed phrases get compromised by PC malware or clipboard hijackers.
- **The Monad Fix**: Smart contract allows small transfers (< 5 MON) seamlessly, but mandates a physical FaceID Passkey signature for high-value transactions. A hacker cannot move whale funds without holding the victim's physical phone.

---

## 📜 Smart Contract Suite

All smart contracts are located in `contracts/src/`:

| Contract | Description |
|---|---|
| [`WebAuthnPrecompile.sol`](./contracts/src/WebAuthnPrecompile.sol) | Solidity library interface for Monad `0x0100` precompile, ASN.1 parsing, and WebAuthn SHA-256 digest computation. |
| [`PasskeyAccount.sol`](./contracts/src/PasskeyAccount.sol) | Smart contract account controlled by P-256 hardware public key $(Q_x, Q_y)$ with replay protection. |
| [`PasskeyAccountFactory.sol`](./contracts/src/PasskeyAccountFactory.sol) | Deterministic CREATE2 factory for counterfactual account derivation. |
| [`ProofOfPersonhoodRegistry.sol`](./contracts/src/ProofOfPersonhoodRegistry.sol) | Canonical registry tracking verified human hardware credentials. |
| [`SybilResistantFaucet.sol`](./contracts/src/SybilResistantFaucet.sol) | Faucet dispensing tokens strictly to hardware-verified human identities. |
| [`QuadraticDaoVoting.sol`](./contracts/src/QuadraticDaoVoting.sol) | 1-Phone = 1-Vote quadratic governance chamber. |
| [`SeedlessSocialFi.sol`](./contracts/src/SeedlessSocialFi.sol) | Seedless creator hub with biometric micro-tipping. |
| [`Hardware2FAWhaleGuard.sol`](./contracts/src/Hardware2FAWhaleGuard.sol) | Dual-signature vault requiring FaceID 2FA for large transfers. |

---

## 🧪 Automated Test Suite (100% Pass)

Run Foundry unit and cryptographic integration tests:

```bash
cd contracts
forge test -vvv
```

### Test Output
```
Ran 3 tests for test/PasskeyAccount.t.sol:PasskeyAccountTest
[PASS] test_DeterministicAddressDerivationAndDeployment()
[PASS] test_ERC1271Validation()
[PASS] test_ExecuteWithPasskeyBiometrics()

Ran 4 tests for test/WebAuthnPrecompile.t.sol:WebAuthnPrecompileTest
[PASS] test_RejectInvalidSignature()
[PASS] test_RejectMissingUserPresent()
[PASS] test_VerifyP256Direct()
[PASS] test_WebAuthnPayloadVerification()

Ran 6 tests for test/ProofOfPersonhood.t.sol:ProofOfPersonhoodTest
[PASS] test_Hardware2FAWhaleGuard()
[PASS] test_PreventDuplicateHardwareRegistration()
[PASS] test_QuadraticDaoVotingOnePhoneOneVote()
[PASS] test_RegisterHumanPersonhood()
[PASS] test_SeedlessSocialFiCreatePostAndTip()
[PASS] test_SybilResistantFaucetClaimAndCooldown()

Suite result: ok. 13 passed; 0 failed; 0 skipped
```

---

## 💻 Running the Web Application Locally

```bash
# 1. Enter the frontend directory
cd frontend

# 2. Run the development server
npm run dev

# 3. Open your browser
# Visit http://localhost:3005
```

---

## ⚡ Gas Comparison Benchmark

| Verification Method | Gas Consumed | Notes |
|---|---|---|
| **Monad Native Precompile `0x0100`** | **6,900 gas** | **Flat cost, instant C++ execution** |
| Vanilla EVM Solidity Verifier | ~320,000 gas | Pure EVM elliptic multiplication |
| **Monad Gas Savings** | **97.8% Reduction** | **Enables micro-transactions & biometrics** |
