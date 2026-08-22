# @monad-passkey/react

> React hooks and provider for Monad Passkey Proof of Personhood.

## Install

```bash
npm install @monad-passkey/react ethers
```

## Exports

### `<PasskeyProvider>`
Wrap your app to enable hooks. Accepts a `config` prop.

### `usePasskey()`
Primary lifecycle hook. Returns `{ identity, createHardwarePasskey, createSimulatedPasskey, signChallenge, reset, isLoading, error, isWebAuthnSupported }`.

### `useRelayer()`
Gasless relayer hook. Returns `{ claimFaucet, relay, checkHealth, isPending, status, error, lastClaimResult }`.

### `usePasskeyContext()`
Low-level context access. Prefer `usePasskey()`.

See the [SDK README](../../README.md) for full usage examples.
