# @monad-passkey/contracts

> Typed ABIs and deployed addresses for Monad Passkey PoP smart contracts. Compatible with viem, wagmi, and ethers.js v6.

## Install

```bash
npm install @monad-passkey/contracts
```

## Exports

### ABIs
- `ProofOfPersonhoodRegistryABI`
- `SybilResistantFaucetABI`
- `PasskeyAccountABI`
- `PasskeyAccountFactoryABI`
- `WebAuthnPrecompileABI`

### Addresses
- `TESTNET_ADDRESSES` — Monad Testnet (Chain ID 10143)
- `MAINNET_ADDRESSES` — Monad Mainnet (Chain ID 143)
- `getAddresses(network)` — helper

## Usage

```ts
import { ProofOfPersonhoodRegistryABI, TESTNET_ADDRESSES } from "@monad-passkey/contracts";

// With viem
const isHuman = await publicClient.readContract({
  address: TESTNET_ADDRESSES.popRegistry,
  abi: ProofOfPersonhoodRegistryABI,
  functionName: "isVerifiedHuman",
  args: ["0xYourAddress"],
});
```
