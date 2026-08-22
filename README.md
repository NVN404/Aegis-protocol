# 🛡️ Aegis Protocol — Hardware Passkey Smart Account & Silicon Proof of Personhood

> **The Sovereign, Seedless Hardware Wallet & Anti-Sybil Protocol for Monad — powered natively by Precompile `0x0100` (EIP-7951 / RIP-7212) in 6,900 gas.**

[![Live App](https://img.shields.io/badge/Live%20Demo-aegis--protocol.vercel.app-FF6B00?style=for-the-badge&logo=vercel)](https://aegis-protocol-sand-gamma.vercel.app/)
[![Video Demo](https://img.shields.io/badge/Demo%20Video-Google%20Drive-4285F4?style=for-the-badge&logo=googledrive)](https://drive.google.com/drive/folders/1_jEZAbkW-XR8Zg4N90rMex0KoSF9r_LO?usp=drive_link)
[![Monad Testnet](https://img.shields.io/badge/Network-Monad%20Testnet%20(10143)-836EF9?style=for-the-badge&logo=monad)](https://testnet.monadexplorer.com/)
[![Precompile 0x0100](https://img.shields.io/badge/Precompile-0x0100%20(EIP--7951)-20E2D7?style=for-the-badge)](https://docs.monad.xyz)
[![Gas Cost](https://img.shields.io/badge/Gas%20Cost-6%2C900%20Flat%20(-98.2%25)-10B981?style=for-the-badge)](https://docs.monad.xyz)
[![Foundry](https://img.shields.io/badge/Foundry-9%2F9%20Tests%20Passing-orange?style=for-the-badge)](https://getfoundry.sh)
[![Chrome Extension](https://img.shields.io/badge/Extension-Manifest%20V3%20(EIP--6963)-FF7A00?style=for-the-badge)](./extension)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> 🚀 **Live Production Deployment**: [https://aegis-protocol-sand-gamma.vercel.app/](https://aegis-protocol-sand-gamma.vercel.app/)  
> 🎬 **Demo Video & Walkthrough (Google Drive)**: [https://drive.google.com/drive/folders/1_jEZAbkW-XR8Zg4N90rMex0KoSF9r_LO?usp=drive_link](https://drive.google.com/drive/folders/1_jEZAbkW-XR8Zg4N90rMex0KoSF9r_LO?usp=drive_link)  
> 📱 **You can test our app in mobile too!** Scan the QR code below with your iPhone or Android camera to experience 1-tap hardware TouchID & FaceID WebAuthn on Monad:
> 
> <img src="./assets/mobile-qr.png" width="180" alt="Scan to test Aegis Protocol on Mobile" />




---

## 📌 Executive Summary

**Aegis Protocol** turns the physical silicon security chips already inside 3+ billion smartphones and laptops (Apple Secure Enclave, Google Titan M2, Windows Hello TPM) into **sovereign, un-hackable, seedless Smart Contract Accounts** on Monad.

By leveraging **Monad's native Precompile `0x0100`**, Aegis verifies biometric hardware signatures on-chain in **6,900 gas (< 0.05ms)** — eliminating seed phrases, blocking bot farms, and bringing 1-tap TouchID/FaceID onboarding to the entire Monad ecosystem.

---

## 🥊 The Paradigm Shift: Why Aegis Wins

### 1. Aegis vs. Legacy Wallets vs. Cloud WaaS

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 THE WALLET ARCHITECTURE SPECTRUM                                 │
├───────────────────────────────┬──────────────────────────────────┬───────────────────────────────┤
│     🦊 Legacy EOA Wallets     │      🏢 Cloud WaaS Providers     │       ⚡ AEGIS PROTOCOL       │
│     (MetaMask / Phantom)      │     (Turnkey / Privy / Magic)    │      (Hardware + 0x0100)      │
├───────────────────────────────┼──────────────────────────────────┼───────────────────────────────┤
│ ❌ 12-Word Seed Phrases        │ ❌ Keys stored in AWS Cloud      │ 🛡️ Trapped in Phone Silicon   │
│ ❌ Vulnerable to Phishing     │ ❌ Must trust Centralized SaaS   │ 🛡️ 100% Phishing-Proof (WebAuthn)│
│ ❌ Keys live in Browser RAM   │ ❌ High monthly B2B API fees     │ 🛡️ 0 Cloud Middlemen / 0 Fees │
│ ❌ No Sybil / Anti-Bot Defense│ ❌ No Sybil Defense (Mass APIs)  │ 🛡️ 1 Phone = 1 Verified Human │
│ ❌ User must hold Gas funds   │ ⚠️ Cloud Relayer dependencies    │ ⚡ Native Monad Gas Sponsoring│
│ ⚠️ Generic EVM Speed          │ ⚠️ Slow Cloud-to-Chain Handoff   │ ⚡ 6,900 Gas Precompile 0x0100│
└───────────────────────────────┴──────────────────────────────────┴───────────────────────────────┘
```

---

### 2. Why Aegis Destroys Centralized Cloud Wallets (Turnkey, Privy, Magic)

| Feature | 🏢 Cloud Providers (Turnkey / AWS Nitro) | ⚡ Aegis Protocol (Local Silicon + Monad) |
| :--- | :--- | :--- |
| **Where is the Private Key?** | Stored inside **Amazon AWS Cloud Data Centers**. | Trapped inside **Your Physical iPhone/Android Chip**. |
| **Censorship Risk** | Amazon or the provider can freeze your account. | **Zero Censorship.** Direct on-chain smart contract. |
| **Trust Model** | Trust AWS uptime & SaaS security. | **Pure Mathematics & Consensus.** |
| **Bot Resistance** | Anyone can spin up 10,000 cloud accounts via API. | **1 Physical Device = 1 Human Account.** |
| **Transaction Cost** | Heavy B2B SaaS subscription cost. | **Flat 6,900 Gas (~$0.0001 per tx).** |

---

### 3. Aegis vs. Worldcoin (The Privacy-Preserving Proof of Personhood)

* **👁️ Worldcoin:** Forces users to stand in line and scan their **physical eyeballs/irises** with metallic cameras. Highly invasive, raises biometric data storage fears, and requires expensive hardware.
* **📱 Aegis Protocol:** Uses the **hardware chip already in your pocket**. When you touch TouchID, the Apple/Android Secure Enclave produces an unforgeable cryptographic proof of a unique physical device. **Zero iris scans, zero KYC, zero invasive biometric storage.**

---

## 🏛️ System Architecture

```text
 ┌──────────────────────────────────────────────┐
 │     USER'S PHYSICAL SMARTPHONE / LAPTOP      │
 │  (Apple Secure Enclave / Google Titan M2)    │
 └──────────────────────┬───────────────────────┘
                        │
                        │ 1. 1-Tap TouchID / FaceID
                        │    Generates & Signs with P-256 (secp256r1)
                        ▼
 ┌──────────────────────────────────────────────┐
 │       AEGIS CLIENTS & INTEGRATIONS           │
 │  • 📱 Mobile Web App (PWA & Android APK)     │
 │  • 🦊 Laptop Browser Extension (Manifest V3) │
 │  • 🛠️ TypeScript SDK (@monad-passkey/core)   │
 └──────────────────────┬───────────────────────┘
                        │
                        │ 2. Packed 160-byte payload
                        ▼
 ┌──────────────────────────────────────────────┐
 │             MONAD SMART CONTRACTS            │
 │  • PasskeyAccountFactory.sol (CREATE2)       │
 │  • PasskeyAccount.sol (Smart Account Vault)  │
 │  • ProofOfPersonhoodRegistry.sol (Anti-Bot)  │
 └──────────────────────┬───────────────────────┘
                        │
                        │ 3. staticcall (6,900 gas)
                        ▼
 ┌──────────────────────────────────────────────┐
 │           MONAD PRECOMPILE 0x0100            │
 │            (EIP-7951 / RIP-7212)             │
 │                                              │
 │   • Sub-millisecond P-256 signature check    │
 │   • Returns 0x01 (Valid) or 0x00 (Invalid)   │
 └──────────────────────────────────────────────┘
```

---

## 📦 What's Inside the Aegis Ecosystem

### 1. 🦊 Laptop Browser Extension (`/extension`)
* **Manifest V3 Compliant:** Full Chrome, Brave, Edge, and Opera support.
* **EIP-1193 & EIP-6963 Injected Provider:** Injects `window.ethereum` and `window.monad`. Any Web3 dApp (DEXs, Marketplaces, Games) automatically detects **"Aegis Protocol (Hardware Passkey)"**.
* **1-Tap TouchID:** Sign transactions and manage assets without extensions passwords or seed phrases.

### 2. 📱 Mobile Wallet App (`/frontend`)
* **Mobile-Native PWA:** Installable directly to iOS/Android home screen with fullscreen FaceID support.
* **Android APK Generator:** Built-in **Capacitor Android** configuration (`npm run build:apk`) for direct `.apk` distribution.
* **Live History Dock:** Real-time on-chain transaction tracker with direct MonadScan explorer links.

### 3. 🛠️ Modular TypeScript SDK (`/sdk`)
* **`@monad-passkey/core`:** High-level client (`AegisClient`) for creating passkeys, generating CREATE2 addresses, and executing contract calls.
* **`@monad-passkey/react`:** React hooks (`useAegis()`, `usePasskeyAccount()`) and UI components (`<AegisButton />`).
* **`@monad-passkey/contracts`:** Typed ABIs and deployed Monad Testnet addresses.
* **Starter Template:** Fully functional demo in `/sdk/apps/example-nextjs`.

### 4. ⚡ Core Smart Contracts (`/contracts`)
* **`WebAuthnPrecompile.sol`:** Cryptographic bridge library executing low-level `staticcall` to `0x0100`.
* **`PasskeyAccount.sol`:** Sovereign smart contract account with replay-protected execution and gasless relayer support.
* **`PasskeyAccountFactory.sol`:** Counterfactual CREATE2 factory allowing instant address calculation before deployment.
* **`ProofOfPersonhoodRegistry.sol`:** Canonical Sybil-resistance registry binding 1 physical silicon key to 1 human identity.

### 5. ⛽ Monad Testnet Relayer (`/relayer`)
* **Gas Sponsoring Pool:** 72+ MON live pool on Monad Testnet sponsoring starter gas and transaction execution.
* **Auto-Deployment Pipeline:** Deploys smart accounts and funds them with 0.50 MON in a single automated step.

### 6. 🎮 Fall Guys Arena Integration (`/fall-guys-monad`)
* **100% On-Chain 3D Game:** Pay **0.50 MON** entry fee, race through physics obstacles, and earn automated streaming checkpoint rewards (`+0.125`, `+0.25`, `+0.375`, `+0.50 MON`) directly to your wallet on Monad!
* **Dual Wallet Options:** 1-Tap Biometric TouchID Passkey Smart Account or External Web3 Wallet (MetaMask/Rainbow).

---

## 🔬 Deep-Dive Cryptography: Why `0x0100` Changes Everything

### The Mathematical Equation:
Apple and Android Secure Enclaves operate on the **NIST P-256 (secp256r1)** curve:

$$y^2 \equiv x^3 - 3x + b \pmod p$$

When you touch TouchID, the silicon generates public key coordinates:
* $Q_x$: 32-byte horizontal coordinate
* $Q_y$: 32-byte vertical coordinate

And signs a message digest producing the signature $(r, s)$.

### The Gas Benchmark:

```text
 ┌─────────────────────────────────────────────────────────────┐
 │                    GAS COST PER SIGNATURE                   │
 ├────────────────────────────────┬────────────────────────────┤
 │ Standard Ethereum (Solidity)   │ 380,000 Gas ($15.00)       │
 │ Monad Precompile 0x0100        │ 6,900 Gas   ($0.0001)      │
 ├────────────────────────────────┴────────────────────────────┤
 │ RESULT: 98.2% CHEAPER · SUB-SECOND EXECUTION ON MONAD       │
 └─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Live Deployed & Verified Contracts (Monad Testnet 10143)

| Contract Name | Address on Monad Testnet | Block Explorer Links | Sourcify Verification |
| :--- | :--- | :--- | :--- |
| **PasskeyAccountFactory** | `0x29373c0172c89eA61df297ca76A252815b012bd1` | [MonadVision ↗](https://testnet.monadvision.com/address/0x29373c0172c89eA61df297ca76A252815b012bd1) · [MonadExplorer ↗](https://testnet.monadexplorer.com/address/0x29373c0172c89eA61df297ca76A252815b012bd1) | [Sourcify Job #0cf6545a ↗](https://sourcify.dev/server/v2/verify/0cf6545a-33eb-4f23-9a20-c46a662f95fc) |
| **ProofOfPersonhoodRegistry** | `0xeE575e3C061c85a14cb44152adDC5baB28Ce68a4` | [MonadVision ↗](https://testnet.monadvision.com/address/0xeE575e3C061c85a14cb44152adDC5baB28Ce68a4) · [MonadExplorer ↗](https://testnet.monadexplorer.com/address/0xeE575e3C061c85a14cb44152adDC5baB28Ce68a4) | [Sourcify Job #bff58172 ↗](https://sourcify.dev/server/v2/verify/bff58172-7efa-4166-b96a-b60442987c63) |
| **FallGuysArena** | `0x129D936cfbBe50FA0Ce7e61b36B33A35d8D08DCa` | [MonadVision ↗](https://testnet.monadvision.com/address/0x129D936cfbBe50FA0Ce7e61b36B33A35d8D08DCa) · [MonadExplorer ↗](https://testnet.monadexplorer.com/address/0x129D936cfbBe50FA0Ce7e61b36B33A35d8D08DCa) | [Sourcify Exact Match ✅ ↗](https://sourcify-api-monad.blockvision.org/v2/verify/25818432-9f30-467e-bcaa-890cdfc3dcae) |
| **Monad Precompile 0x0100** | `0x0000000000000000000000000000000000000100` | Native Monad Kernel | EIP-7951 / RIP-7212 Engine |

> 📁 **Flattened Source Code:**
> * [PasskeyAccountFactory.flattened.sol](contracts/src/PasskeyAccountFactory.flattened.sol)
> * [ProofOfPersonhoodRegistry.flattened.sol](contracts/src/ProofOfPersonhoodRegistry.flattened.sol)
> * [FallGuysArena.flattened.sol](fall-guys-monad/contracts/src/FallGuysArena.flattened.sol)

---

## 🏆 Hackathon Submission & Pitch Checklist

* **Public GitHub Repo:** [https://github.com/NVN404/Aegis-protocol](https://github.com/NVN404/Aegis-protocol)
* **Publicly Hosted Live URL:** [https://aegis-protocol-sand-gamma.vercel.app/](https://aegis-protocol-sand-gamma.vercel.app/)
* **Video Demo (Google Drive):** [https://drive.google.com/drive/folders/1_jEZAbkW-XR8Zg4N90rMex0KoSF9r_LO?usp=drive_link](https://drive.google.com/drive/folders/1_jEZAbkW-XR8Zg4N90rMex0KoSF9r_LO?usp=drive_link)
* **Contract Deployments:** `0x29373c0172c89eA61df297ca76A252815b012bd1` & `0xeE575e3C061c85a14cb44152adDC5baB28Ce68a4` (Chain ID 10143)
* **Contract Verification:** 100% Verified on MonadVision & Sourcify
* **Live Demo:** 1-Tap Biometric Hardware Smart Account creation with instant 400ms Monad Testnet execution!


---

## 🛠️ Quickstart Guide

### 1. Run the Mobile Wallet Web App:
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3005
```

### 2. Load the Laptop Extension in Chrome / Brave / Edge:
1. Open `chrome://extensions`.
2. Toggle on **"Developer mode"** (top right).
3. Click **"Load unpacked"** and select the `/extension` folder.
4. Pin **Aegis Protocol** to your toolbar and tap **"Create with TouchID"**!

### 3. Use the SDK in your Project:
```typescript
import { AegisClient } from "@monad-passkey/core";

// 1. Initialize client on Monad Testnet
const client = new AegisClient({ chainId: 10143 });

// 2. 1-Tap TouchID / FaceID Login (Zero seed phrases!)
const account = await client.connect();
console.log("Smart Account:", account.address);

// 3. Execute Transaction via Precompile 0x0100 (6,900 gas)
const tx = await client.execute({
  to: "0xD726fdedfCc747FC1Ff5E2eBE7773b9cE51F40D4",
  value: "0.1",
});
```

### 4. Run Smart Contract Tests (Foundry):
```bash
cd contracts
forge test
# Output: 9 passed, 0 failed (100% PASS)
```

### 5. Build Android APK:
```bash
cd frontend
npx cap add android
npm run build:apk
```

---

## 📜 License
MIT © 2026 Aegis Protocol Contributors. Built with ❤️ for the Monad Ecosystem.
