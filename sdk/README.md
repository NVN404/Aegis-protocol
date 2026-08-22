# @monad-passkey/sdk

> **Hardware Proof of Personhood SDK for Monad** — FaceID / TouchID passkeys verified natively via Monad precompile `0x0100` (EIP-7951 / RIP-7212) at 6,900 gas. No seed phrases. 400ms finality.

[![Monad Testnet](https://img.shields.io/badge/Network-Monad%20Testnet%20(10143)-836EF9?style=flat-square)](https://testnet.monadexplorer.com/)
[![npm](https://img.shields.io/npm/v/@monad-passkey/react?style=flat-square&color=836EF9)](https://www.npmjs.com/package/@monad-passkey/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## Packages

| Package | Description |
|---|---|
| [`@monad-passkey/core`](./packages/core) | Pure TS — WebAuthn helpers, P-256 DER parsing, simulated signing, network config |
| [`@monad-passkey/react`](./packages/react) | React hooks & provider — `usePasskey`, `useRelayer`, `<PasskeyProvider>` |
| [`@monad-passkey/contracts`](./packages/contracts) | Typed ABIs and deployed addresses (viem + ethers compatible) |

---

## Quick Start (React / Next.js)

### 1. Install

```bash
npm install @monad-passkey/react ethers
# or
pnpm add @monad-passkey/react ethers
```

### 2. Wrap your app with `<PasskeyProvider>`

```tsx
// app/layout.tsx (Next.js App Router)
import { PasskeyProvider } from "@monad-passkey/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PasskeyProvider
          config={{
            relayerUrl: "https://your-relayer.yourapp.com", // your deployed relayer
            network: "testnet",
            rpName: "Your App Name",
          }}
        >
          {children}
        </PasskeyProvider>
      </body>
    </html>
  );
}
```

### 3. Use the hooks

```tsx
"use client";
import { usePasskey, useRelayer } from "@monad-passkey/react";

export function ConnectButton() {
  const {
    identity,
    isLoading,
    error,
    isWebAuthnSupported,
    createHardwarePasskey,
    createSimulatedPasskey,
    signChallenge,
    reset,
  } = usePasskey();

  const { claimFaucet, isPending, lastClaimResult } = useRelayer();

  // Connected state
  if (identity) {
    return (
      <div>
        <p>✓ Connected: {identity.counterfactualAddress}</p>
        <p>Device: {identity.deviceLabel}</p>
        <button
          onClick={async () => {
            const challenge = crypto.getRandomValues(new Uint8Array(32));
            const sig = await signChallenge(challenge);
            if (sig) await claimFaucet(identity, sig);
          }}
          disabled={isPending}
        >
          {isPending ? "Claiming..." : "Claim 0.5 MON"}
        </button>
        {lastClaimResult?.explorerUrl && (
          <a href={lastClaimResult.explorerUrl} target="_blank">View TX →</a>
        )}
        <button onClick={reset}>Disconnect</button>
      </div>
    );
  }

  // Not connected
  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={() => createHardwarePasskey({ username: "alice.eth" })}
        disabled={isLoading || !isWebAuthnSupported}
      >
        {isLoading ? "Generating..." : "Connect with FaceID"}
      </button>
      {/* Desktop / browser without biometrics */}
      <button onClick={() => createSimulatedPasskey()}>
        Simulate (Dev)
      </button>
    </div>
  );
}
```

---

## Vanilla TypeScript (no React)

```ts
import {
  createHardwarePasskey,
  signWithHardwarePasskey,
  isWebAuthnAvailable,
  MONAD_NETWORKS,
} from "@monad-passkey/core";

if (isWebAuthnAvailable()) {
  const identity = await createHardwarePasskey({ username: "alice" });
  console.log("Monad Address:", identity.counterfactualAddress);
  console.log("Qx:", identity.pubKeyX);
  console.log("Qy:", identity.pubKeyY);

  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const sig = await signWithHardwarePasskey(identity.rawCredentialId, challenge);
  console.log("r:", sig.r, "s:", sig.s);
  // → send (sig.r, sig.s, sig.authenticatorData, sig.clientDataJSON) to your contract
}
```

---

## Contract ABIs (viem / wagmi)

```ts
import { ProofOfPersonhoodRegistryABI, TESTNET_ADDRESSES } from "@monad-passkey/contracts";
import { createPublicClient, http } from "viem";

const client = createPublicClient({
  chain: { id: 10143, /* ... */ },
  transport: http("https://testnet-rpc.monad.xyz"),
});

const isHuman = await client.readContract({
  address: TESTNET_ADDRESSES.popRegistry,
  abi: ProofOfPersonhoodRegistryABI,
  functionName: "isVerifiedHuman",
  args: ["0xYourAddress"],
});
```

---

## Configuration Options

### `<PasskeyProvider config={...}>`

| Option | Type | Default | Description |
|---|---|---|---|
| `relayerUrl` | `string` | `"http://localhost:3006"` | URL of your deployed gasless relayer |
| `network` | `"testnet" \| "mainnet"` | `"testnet"` | Monad network |
| `factoryAddress` | `string` | Monad Testnet factory | Override factory contract address |
| `registryAddress` | `string` | Monad Testnet registry | Override PoP registry address |
| `faucetAddress` | `string` | Monad Testnet faucet | Override faucet address |
| `rpId` | `string` | `window.location.hostname` | WebAuthn relying-party ID |
| `rpName` | `string` | `"Monad Proof of Personhood"` | Name shown in biometric prompt |

---

## Deploying the Relayer

The relayer sponsors gas so your users don't need MON to register or claim:

```bash
cd relayer/          # in the monad-passkey-pop root (not the sdk folder)
cp .env.example .env # add your funded wallet private key
node index.js
```

> ⚠️ **Never commit your private key.** The relayer wallet only needs a small amount of MON to pay gas for registrations and faucet drips.

Set `NEXT_PUBLIC_RELAYER_URL=https://your-relayer.com` in your Next.js app's `.env.local`.

---

## Precompile 0x0100

Monad natively supports `secp256r1` (P-256) elliptic curve verification at address `0x0000000000000000000000000000000000000100`:

| Method | Gas | Notes |
|---|---|---|
| **Monad precompile `0x0100`** | **6,900** | Flat cost, native C++ |
| Pure Solidity EVM verifier | ~320,000 | 46× more expensive |

This is what makes passkey-based biometric identity practical on-chain.

---

## Monorepo Setup (Contributing)

```bash
# Requires pnpm v9+
cd sdk/
pnpm install
pnpm build          # builds all packages
pnpm example        # runs the example Next.js app on :3010
```

---

## License

MIT © Monad Passkey PoP Authors
