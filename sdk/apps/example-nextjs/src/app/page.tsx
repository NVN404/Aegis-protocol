"use client";

import { useState } from "react";
import { usePasskey, useRelayer } from "@monad-passkey/react";
import { MONAD_NETWORKS, MONAD_PRECOMPILE_0X0100 } from "@monad-passkey/core";

export default function Home() {
  const {
    identity,
    isLoading,
    error: passkeyError,
    isWebAuthnSupported,
    createHardwarePasskey,
    createSimulatedPasskey,
    signChallenge,
    reset,
    clearError,
  } = usePasskey();

  const { claimFaucet, isPending, status, error: relayerError, lastClaimResult } =
    useRelayer();

  const [sigResult, setSigResult] = useState<{
    r: string;
    s: string;
    rawDigest: string;
    flags: { userPresent: boolean; userVerified: boolean };
  } | null>(null);

  const testnet = MONAD_NETWORKS.testnet;
  const precompile = MONAD_PRECOMPILE_0X0100;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSign = async () => {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const sig = await signChallenge(challenge);
    if (sig) {
      setSigResult({
        r: sig.r,
        s: sig.s,
        rawDigest: sig.rawDigest,
        flags: sig.flags,
      });
    }
  };

  const handleClaimFaucet = async () => {
    if (!identity) return;
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const sig = await signChallenge(challenge);
    if (sig) {
      await claimFaucet(identity, sig);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="container">
      {/* Header */}
      <header className="header">
        <div className="header-badge">
          <span className="pulse-dot" />
          Monad Passkey SDK · Live Demo
        </div>
        <h1>Hardware Identity on Monad</h1>
        <p>
          FaceID / TouchID passkeys verified natively via Monad precompile{" "}
          <code
            style={{
              background: "rgba(131,110,249,0.15)",
              borderRadius: "4px",
              padding: "0.1em 0.4em",
              color: "#c4b5fd",
            }}
          >
            0x0100
          </code>{" "}
          (EIP-7951). 6,900 gas flat. 400ms finality. No seed phrases.
        </p>
      </header>

      {/* ── Step 1: Network Info ────────────────────────────────────────── */}
      <section className="card">
        <p className="section-title">⚡ Monad Testnet</p>
        <div>
          <div className="stat-row">
            <span className="stat-label">Network</span>
            <span className="stat-value">{testnet.name} ({testnet.chainId})</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Block Time</span>
            <span className="stat-value green">{testnet.blockTimeMs}ms</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Precompile</span>
            <span className="stat-value purple">{precompile.shortAddress} ({precompile.standard.split(" ")[0]})</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Gas Cost</span>
            <span className="stat-value cyan">{precompile.gasCost.toLocaleString()} (saves {precompile.gasSavingsPercent})</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">WebAuthn Available</span>
            <span className={`stat-value ${isWebAuthnSupported ? "green" : "stat-value"}`} style={!isWebAuthnSupported ? { color: "#f87171" } : {}}>
              {isWebAuthnSupported ? "✓ Yes" : "✗ No (use simulator)"}
            </span>
          </div>
        </div>
      </section>

      {/* ── Step 2: Create Passkey ──────────────────────────────────────── */}
      <section className="card">
        <p className="section-title">
          {identity ? "✓ Step 1 Complete — Identity Active" : "Step 1 — Create Passkey Identity"}
        </p>

        {passkeyError && (
          <div className="alert alert-error mb-3">
            <strong>Error:</strong> {passkeyError}{" "}
            <button
              onClick={clearError}
              style={{ float: "right", background: "none", border: "none", color: "inherit", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
        )}

        {identity ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="pulse-dot" />
                <span className="text-sm font-bold" style={{ color: "#fff" }}>
                  {identity.deviceLabel}
                </span>
                {identity.isSimulated && (
                  <span className="pill pill-amber">Simulated</span>
                )}
              </div>
              <button className="btn btn-danger" onClick={reset}>
                Disconnect
              </button>
            </div>

            <p className="section-title">Counterfactual Monad Address</p>
            <div className="address">{identity.counterfactualAddress}</div>

            <hr className="divider" />

            <div className="stat-row">
              <span className="stat-label">Qx (pubKeyX)</span>
              <span className="stat-value truncate" style={{ maxWidth: "55%", color: "#c4b5fd" }}>
                {identity.pubKeyX}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Qy (pubKeyY)</span>
              <span className="stat-value truncate" style={{ maxWidth: "55%", color: "#c4b5fd" }}>
                {identity.pubKeyY}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted mb-3" style={{ lineHeight: 1.6 }}>
              Generate a hardware-bound secp256r1 keypair inside your device&apos;s Secure
              Enclave. The private key never leaves your chip. On browsers without
              biometrics, use the instant simulator.
            </p>
            <div className="btn-row">
              <button
                className="btn btn-primary"
                onClick={() => createHardwarePasskey({ username: "sdk.demo.user" })}
                disabled={isLoading}
              >
                {isLoading ? <span className="spinner" /> : "🪪"}
                {isLoading ? "Generating..." : "Tap FaceID / Passkey"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => createSimulatedPasskey("sdk-demo-seed")}
                disabled={isLoading}
              >
                ⚡ Simulate Enclave
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Step 3: Sign a Challenge ────────────────────────────────────── */}
      {identity && (
        <section className="card">
          <p className="section-title">Step 2 — Sign a Challenge (Precompile 0x0100)</p>
          <p className="text-sm text-muted mb-3" style={{ lineHeight: 1.6 }}>
            Trigger your biometric authenticator to sign a random 32-byte challenge.
            The resulting <code style={{ color: "#c4b5fd" }}>r</code>, <code style={{ color: "#c4b5fd" }}>s</code>,
            and <code style={{ color: "#c4b5fd" }}>rawDigest</code> are the exact inputs
            verified by the Monad precompile at 6,900 gas.
          </p>

          <button
            className="btn btn-secondary"
            onClick={handleSign}
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner" /> : "🔏"}
            {isLoading ? "Scanning biometrics..." : "Test Biometric Sign"}
          </button>

          {sigResult && (
            <div className="mt-4">
              <div className="alert alert-success mb-3">
                ✓ Signature valid &nbsp;·&nbsp; User Present:{" "}
                {sigResult.flags.userPresent ? "✓" : "✗"} &nbsp;·&nbsp; User Verified:{" "}
                {sigResult.flags.userVerified ? "✓" : "✗"}
              </div>
              <div className="stat-row">
                <span className="stat-label">r</span>
                <span className="stat-value truncate purple" style={{ maxWidth: "70%" }}>{sigResult.r}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">s</span>
                <span className="stat-value truncate purple" style={{ maxWidth: "70%" }}>{sigResult.s}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">rawDigest</span>
                <span className="stat-value truncate cyan" style={{ maxWidth: "65%" }}>{sigResult.rawDigest}</span>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Step 4: Claim Faucet ────────────────────────────────────────── */}
      {identity && (
        <section className="card">
          <p className="section-title">Step 3 — Claim from Sybil-Resistant Faucet</p>
          <p className="text-sm text-muted mb-3" style={{ lineHeight: 1.6 }}>
            The relayer verifies your hardware signature, registers your identity in the
            PoP registry if needed, and transfers <strong style={{ color: "#fff" }}>0.5 MON</strong>{" "}
            to your counterfactual address — gaslessly.
          </p>

          {relayerError && (
            <div className="alert alert-error mb-3">
              <strong>Relayer Error:</strong> {relayerError}
            </div>
          )}

          {status === "success" && lastClaimResult?.transactionHash && (
            <div className="alert alert-success mb-3">
              ✓ <strong>0.5 MON sent!</strong> TX:{" "}
              <a
                href={lastClaimResult.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--monad-cyan)", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}
              >
                {lastClaimResult.transactionHash.slice(0, 18)}…
              </a>
            </div>
          )}

          <button
            className="btn btn-success"
            onClick={handleClaimFaucet}
            disabled={isPending || isLoading}
          >
            {isPending ? <span className="spinner" /> : "💧"}
            {isPending ? "Submitting to Monad..." : "Claim 0.5 MON"}
          </button>
        </section>
      )}

      {/* ── SDK Usage Code ─────────────────────────────────────────────── */}
      <section className="card mt-4">
        <p className="section-title">SDK Integration — Copy & Paste</p>
        <div className="code-block">{`npm install @monad-passkey/react

// 1. Wrap your app
import { PasskeyProvider } from "@monad-passkey/react";

<PasskeyProvider config={{ relayerUrl: "https://your-relayer.com" }}>
  <App />
</PasskeyProvider>

// 2. Use the hooks
import { usePasskey, useRelayer } from "@monad-passkey/react";

function ConnectButton() {
  const { identity, createHardwarePasskey, isLoading } = usePasskey();
  const { claimFaucet, isPending } = useRelayer();

  if (!identity) {
    return (
      <button onClick={() => createHardwarePasskey()} disabled={isLoading}>
        Connect with FaceID
      </button>
    );
  }

  return <p>Address: {identity.counterfactualAddress}</p>;
}`}</div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: "center", marginTop: "3rem", color: "#475569", fontSize: "0.78rem" }}>
        <p>
          @monad-passkey/sdk · MIT License ·{" "}
          <a href="https://github.com/monad-passkey/sdk" style={{ color: "var(--monad-purple)" }}>
            GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}
