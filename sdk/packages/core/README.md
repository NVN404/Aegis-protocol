# @monad-passkey/core

> Pure TypeScript — WebAuthn & secp256r1 (P-256) utilities for Monad Passkey PoP. Zero React dependency, SSR-safe.

## Install

```bash
npm install @monad-passkey/core ethers
```

## API

### `createHardwarePasskey(options?)`
Triggers the native biometric prompt. Returns a `PasskeyIdentity` with `pubKeyX`, `pubKeyY`, and `counterfactualAddress`.

### `signWithHardwarePasskey(rawCredentialId, challengeBytes, options?)`
Signs a challenge via biometrics. Returns `PasskeySignatureResult` with `r`, `s`, `rawDigest`.

### `createSimulatedPasskey(options?)`
Software-only simulator for local dev (no biometrics required).

### `signWithSimulatedPasskey(identity, challengeHex)`
Returns deterministic pseudo-signatures for simulated identities.

### `parseDERSignature(derBuffer)`
Parses ASN.1 DER into 32-byte `r` and `s`.

### `parseSPKIPublicKey(spkiBuffer)`
Extracts `pubKeyX` and `pubKeyY` from an SPKI DER public key.

### `isWebAuthnAvailable()`
Returns `true` in browsers with WebAuthn support (safe to call on server).

### Constants
- `MONAD_NETWORKS` — testnet & mainnet config
- `MONAD_PRECOMPILE_0X0100` — precompile address, gas cost, standard
- `CONTRACT_ADDRESSES` — deployed addresses per network
- `CONTRACT_ABIS` — ethers.js human-readable ABI strings
