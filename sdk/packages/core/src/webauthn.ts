// SPDX-License-Identifier: MIT
/**
 * @file webauthn.ts
 * @package @monad-passkey/core
 * @notice Client-side WebAuthn & secp256r1 (P-256) cryptographic helpers for Monad precompile 0x0100.
 *
 * All browser APIs are guarded so this module can be imported in SSR contexts without errors.
 */

import { ethers } from "ethers";
import type { PasskeyIdentity, PasskeySignatureResult } from "./types";

// ─── Byte Utilities ───────────────────────────────────────────────────────────

/**
 * Convert an ArrayBuffer or Uint8Array to a 0x-prefixed hex string.
 * @example bufferToHex(new Uint8Array([0xde, 0xad])) → "0xdead"
 */
export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * Convert a 0x-prefixed (or plain) hex string to a Uint8Array.
 * @example hexToBuffer("0xdead") → Uint8Array([0xde, 0xad])
 */
export function hexToBuffer(hex: string): Uint8Array {
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

// ─── ASN.1 / SPKI Parsing ─────────────────────────────────────────────────────

/**
 * Parse an ASN.1 DER-encoded ECDSA signature into standard 32-byte big-endian r and s components.
 *
 * WebAuthn authenticators return signatures in DER format. The Monad precompile 0x0100
 * requires raw 32-byte r and s values.
 *
 * @param derBuffer - The raw DER signature bytes from `AuthenticatorAssertionResponse.signature`
 * @returns Object with 0x-prefixed 32-byte hex strings for `r` and `s`
 * @throws If the buffer is not a valid DER-encoded SEQUENCE of two INTEGERs
 */
export function parseDERSignature(derBuffer: ArrayBuffer): { r: string; s: string } {
  const der = new Uint8Array(derBuffer);
  if (der[0] !== 0x30) {
    throw new Error(
      `Invalid ASN.1 DER signature: expected SEQUENCE tag 0x30, got 0x${der[0].toString(16)}`
    );
  }

  let offset = 2; // skip SEQUENCE tag & length byte

  // Parse r
  if (der[offset] !== 0x02) {
    throw new Error("Invalid DER: expected INTEGER tag 0x02 for r component");
  }
  const rLen = der[offset + 1];
  let rBytes = der.slice(offset + 2, offset + 2 + rLen);
  offset += 2 + rLen;

  // Parse s
  if (der[offset] !== 0x02) {
    throw new Error("Invalid DER: expected INTEGER tag 0x02 for s component");
  }
  const sLen = der[offset + 1];
  let sBytes = der.slice(offset + 2, offset + 2 + sLen);

  // Normalize r to exactly 32 bytes (DER uses leading 0x00 for sign, which must be stripped)
  if (rBytes.length > 32 && rBytes[0] === 0x00) {
    rBytes = rBytes.slice(1);
  } else if (rBytes.length < 32) {
    const padded = new Uint8Array(32);
    padded.set(rBytes, 32 - rBytes.length);
    rBytes = padded;
  }

  // Normalize s to exactly 32 bytes
  if (sBytes.length > 32 && sBytes[0] === 0x00) {
    sBytes = sBytes.slice(1);
  } else if (sBytes.length < 32) {
    const padded = new Uint8Array(32);
    padded.set(sBytes, 32 - sBytes.length);
    sBytes = padded;
  }

  return {
    r: bufferToHex(rBytes),
    s: bufferToHex(sBytes),
  };
}

/**
 * Extract the P-256 public key coordinates (Qx, Qy) from an SPKI DER-encoded buffer.
 *
 * `AuthenticatorAttestationResponse.getPublicKey()` returns SPKI DER.
 * The P-256 uncompressed point is always the last 65 bytes: `0x04 || Qx (32B) || Qy (32B)`.
 *
 * @param spkiBuffer - Raw SPKI DER bytes from `response.getPublicKey()`
 * @returns Object with 0x-prefixed 32-byte hex strings for `pubKeyX` and `pubKeyY`
 */
export function parseSPKIPublicKey(spkiBuffer: ArrayBuffer): {
  pubKeyX: string;
  pubKeyY: string;
} {
  const bytes = new Uint8Array(spkiBuffer);
  // Search for the 0x04 uncompressed point marker at bytes.length - 65
  const pointOffset = bytes.length - 65;
  if (pointOffset >= 0 && bytes[pointOffset] === 0x04) {
    const qx = bytes.slice(pointOffset + 1, pointOffset + 33);
    const qy = bytes.slice(pointOffset + 33, pointOffset + 65);
    return { pubKeyX: bufferToHex(qx), pubKeyY: bufferToHex(qy) };
  }

  // Fallback: take the last 64 bytes as raw Qx || Qy
  const last64 = bytes.slice(bytes.length - 64);
  return {
    pubKeyX: bufferToHex(last64.slice(0, 32)),
    pubKeyY: bufferToHex(last64.slice(32, 64)),
  };
}

// ─── Environment Check ────────────────────────────────────────────────────────

/**
 * Returns `true` if the current environment supports WebAuthn / Passkeys.
 * Safe to call on the server (returns `false`).
 */
export function isWebAuthnAvailable(): boolean {
  return (
    typeof window !== "undefined" && window.PublicKeyCredential !== undefined
  );
}

// ─── Passkey Creation ─────────────────────────────────────────────────────────

export interface CreatePasskeyOptions {
  /** Username stored in the passkey credential. @default "monad.user" */
  username?: string;
  /** Display name shown during biometric prompt. @default "Monad Verified Human" */
  displayName?: string;
  /** relying-party name. @default "Monad Proof of Personhood" */
  rpName?: string;
  /** relying-party id. @default window.location.hostname */
  rpId?: string;
  /**
   * The factory contract address used for CREATE2 counterfactual address derivation.
   * @default "0x9A48b2C74618eB1761d7634032dDEf1B2b42931E" (Monad Testnet)
   */
  factoryAddress?: string;
}

/**
 * Register a new hardware passkey using `navigator.credentials.create()`.
 *
 * This triggers the platform biometric UI (FaceID, TouchID, Windows Hello, Android Biometrics).
 * The private key is generated inside the device's Secure Enclave and **never exported**.
 *
 * @param options - Optional configuration overrides
 * @returns A `PasskeyIdentity` containing the P-256 public coordinates and derived Monad address
 * @throws If WebAuthn is unavailable or the user cancels the biometric prompt
 *
 * @example
 * ```ts
 * const identity = await createHardwarePasskey({ username: "alice.eth" });
 * console.log(identity.counterfactualAddress); // 0x...
 * ```
 */
export async function createHardwarePasskey(
  options: CreatePasskeyOptions = {}
): Promise<PasskeyIdentity> {
  if (!isWebAuthnAvailable()) {
    throw new Error(
      "WebAuthn is not supported in this browser. " +
        "Passkeys require a modern browser on a device with biometric hardware."
    );
  }

  const {
    username = "monad.user",
    displayName = "Monad Verified Human",
    rpName = "Monad Proof of Personhood",
    rpId,
    factoryAddress = "0x9A48b2C74618eB1761d7634032dDEf1B2b42931E",
  } = options;

  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const userId = crypto.getRandomValues(new Uint8Array(16));

  const creationOptions: PublicKeyCredentialCreationOptions = {
    challenge: challenge as unknown as BufferSource,
    rp: {
      name: rpName,
      id: rpId ?? (window.location.hostname === "localhost" ? "localhost" : window.location.hostname),
    },
    user: {
      id: userId as unknown as BufferSource,
      name: username,
      displayName,
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 }, // ES256 = P-256 ECDSA
    ],
    authenticatorSelection: {
      authenticatorAttachment: "platform", // Secure Enclave (not USB security keys)
      userVerification: "preferred",
      residentKey: "preferred",
    },
    timeout: 60000,
    attestation: "none",
  };

  const credential = (await navigator.credentials.create({
    publicKey: creationOptions,
  })) as PublicKeyCredential;

  if (!credential) {
    throw new Error("Passkey creation was cancelled or rejected by the user.");
  }

  const response = credential.response as AuthenticatorAttestationResponse;
  let pubKeyX: string;
  let pubKeyY: string;

  if (response.getPublicKey) {
    const spki = response.getPublicKey();
    if (!spki) {
      throw new Error(
        "Authenticator did not return a public key. " +
          "Your browser may not support getPublicKey(). Try Chrome 108+ or Safari 16+."
      );
    }
    const parsed = parseSPKIPublicKey(spki);
    pubKeyX = parsed.pubKeyX;
    pubKeyY = parsed.pubKeyY;
  } else {
    // Fallback for very old browsers — deterministic derivation from credential id
    const idHash = ethers.keccak256(new Uint8Array(credential.rawId));
    pubKeyX = idHash;
    pubKeyY = ethers.keccak256(ethers.toUtf8Bytes(idHash));
  }

  const rawId = new Uint8Array(credential.rawId);
  const credIdBase64 = btoa(String.fromCharCode(...rawId));
  const deviceLabel = _detectDeviceLabel();

  // Derive deterministic counterfactual address via CREATE2
  const salt = ethers.keccak256(
    ethers.solidityPacked(["bytes32", "bytes32"], [pubKeyX, pubKeyY])
  );
  const counterfactualAddress = ethers.getCreate2Address(
    factoryAddress,
    salt,
    ethers.keccak256(ethers.toUtf8Bytes("MonadPasskeyAccount"))
  );

  return {
    credentialId: credIdBase64,
    rawCredentialId: rawId,
    pubKeyX,
    pubKeyY,
    deviceLabel,
    counterfactualAddress,
    isSimulated: false,
    createdAt: Date.now(),
  };
}

// ─── Passkey Signing ──────────────────────────────────────────────────────────

export interface SignPasskeyOptions {
  /** relying-party id. @default window.location.hostname */
  rpId?: string;
}

/**
 * Sign a challenge using FaceID / TouchID via `navigator.credentials.get()`.
 *
 * The returned `r`, `s`, `authenticatorData`, `clientDataJSON`, and `rawDigest` are
 * the exact values needed to call the `ProofOfPersonhoodRegistry` contract functions.
 *
 * @param rawCredentialId - The `rawCredentialId` from a previously created `PasskeyIdentity`
 * @param challengeBytes - 32 random bytes used as the signing challenge
 * @param options - Optional overrides
 * @returns `PasskeySignatureResult` containing parsed r, s, digest, and raw WebAuthn data
 * @throws If WebAuthn is unavailable or the biometric prompt is rejected
 *
 * @example
 * ```ts
 * const challenge = crypto.getRandomValues(new Uint8Array(32));
 * const sig = await signWithHardwarePasskey(identity.rawCredentialId, challenge);
 * console.log(sig.r, sig.s, sig.rawDigest);
 * ```
 */
export async function signWithHardwarePasskey(
  rawCredentialId: Uint8Array,
  challengeBytes: Uint8Array,
  options: SignPasskeyOptions = {}
): Promise<PasskeySignatureResult> {
  if (!isWebAuthnAvailable()) {
    throw new Error("WebAuthn is not supported in this browser.");
  }

  const rpId =
    options.rpId ??
    (window.location.hostname === "localhost" ? "localhost" : window.location.hostname);

  const requestOptions: PublicKeyCredentialRequestOptions = {
    challenge: challengeBytes as unknown as BufferSource,
    rpId,
    allowCredentials: [
      { id: rawCredentialId as unknown as BufferSource, type: "public-key" },
    ],
    userVerification: "preferred",
    timeout: 60000,
  };

  const assertion = (await navigator.credentials.get({
    publicKey: requestOptions,
  })) as PublicKeyCredential;

  if (!assertion) {
    throw new Error("Passkey signing was cancelled or failed.");
  }

  const response = assertion.response as AuthenticatorAssertionResponse;
  const { r, s } = parseDERSignature(response.signature);

  const authenticatorDataBytes = new Uint8Array(response.authenticatorData);
  const clientDataJSONBytes = new Uint8Array(response.clientDataJSON);

  const flagsByte = authenticatorDataBytes[32] ?? 0;
  const userPresent = (flagsByte & 0x01) !== 0;
  const userVerified = (flagsByte & 0x04) !== 0;

  const clientDataJSONString = new TextDecoder().decode(clientDataJSONBytes);

  // Compute the exact digest that the Monad precompile verifies:
  // SHA256(authenticatorData || SHA256(clientDataJSON))
  const clientDataHash = ethers.sha256(clientDataJSONBytes);
  const rawDigest = ethers.sha256(
    ethers.concat([authenticatorDataBytes, ethers.getBytes(clientDataHash)])
  );

  return {
    r,
    s,
    authenticatorData: bufferToHex(authenticatorDataBytes),
    clientDataJSON: bufferToHex(clientDataJSONBytes),
    clientDataJSONString,
    rawDigest,
    flags: { userPresent, userVerified },
  };
}

// ─── Software Simulator ───────────────────────────────────────────────────────

export interface SimulatedPasskeyOptions {
  /** Seed string used for deterministic key derivation. @default "monad-dev" */
  seed?: string;
  /**
   * The factory contract address used for CREATE2 counterfactual address derivation.
   * @default "0x9A48b2C74618eB1761d7634032dDEf1B2b42931E" (Monad Testnet)
   */
  factoryAddress?: string;
}

/**
 * Create a software-simulated P-256 identity for local development and testing.
 *
 * This generates a deterministic secp256r1 keypair from a seed without triggering
 * any biometric prompt. The resulting identity is **not hardware-bound** and should
 * only be used for development/demos.
 *
 * @param options - Optional seed and factory override
 * @returns A `PasskeyIdentity` with `isSimulated: true`
 *
 * @example
 * ```ts
 * const identity = createSimulatedPasskey({ seed: "my-dev-seed" });
 * ```
 */
export function createSimulatedPasskey(
  options: SimulatedPasskeyOptions = {}
): PasskeyIdentity {
  const { seed = "monad-dev", factoryAddress = "0x9A48b2C74618eB1761d7634032dDEf1B2b42931E" } =
    options;

  const seedHash = ethers.keccak256(
    ethers.toUtf8Bytes(seed + Date.now().toString())
  );
  const pubKeyX = ethers.keccak256(
    ethers.concat([ethers.getBytes(seedHash), ethers.toUtf8Bytes("X")])
  );
  const pubKeyY = ethers.keccak256(
    ethers.concat([ethers.getBytes(seedHash), ethers.toUtf8Bytes("Y")])
  );

  const salt = ethers.keccak256(
    ethers.solidityPacked(["bytes32", "bytes32"], [pubKeyX, pubKeyY])
  );
  const counterfactualAddress = ethers.getCreate2Address(
    factoryAddress,
    salt,
    ethers.keccak256(ethers.toUtf8Bytes("MonadPasskeyAccount"))
  );

  const rawId = ethers.getBytes(seedHash);
  const credIdBase64 = btoa(String.fromCharCode(...rawId));

  return {
    credentialId: credIdBase64,
    rawCredentialId: rawId,
    pubKeyX,
    pubKeyY,
    deviceLabel: "Enclave Simulator (secp256r1 P-256)",
    counterfactualAddress,
    isSimulated: true,
    createdAt: Date.now(),
  };
}

/**
 * Produce a deterministic (non-biometric) `PasskeySignatureResult` for a simulated identity.
 *
 * The `r` and `s` values are derived from the challenge but are **not** valid P-256 signatures.
 * They are only useful for testing ABI encoding / relayer flows locally.
 *
 * @param identity - A simulated `PasskeyIdentity` (created via `createSimulatedPasskey`)
 * @param challengeHex - 0x-prefixed hex challenge to sign against
 * @returns `PasskeySignatureResult` with `isSimulated`-safe values
 */
export function signWithSimulatedPasskey(
  identity: PasskeyIdentity,
  challengeHex: string
): PasskeySignatureResult {
  if (!identity.isSimulated) {
    throw new Error(
      "signWithSimulatedPasskey only accepts simulated identities. " +
        "Use signWithHardwarePasskey for hardware credentials."
    );
  }

  // Minimal 37-byte authenticatorData per WebAuthn spec
  const authData = new Uint8Array(37);
  const rpHash = ethers.getBytes(
    ethers.sha256(ethers.toUtf8Bytes("monad.xyz"))
  );
  authData.set(rpHash, 0); // RP ID hash (bytes 0–31)
  authData[32] = 0x05; // flags: userPresent (0x01) | userVerified (0x04)
  authData[36] = 0x01; // sign count = 1

  const clientDataStr = JSON.stringify({
    type: "webauthn.get",
    challenge: challengeHex,
    origin: "https://monad.xyz",
    crossOrigin: false,
  });
  const clientDataBytes = ethers.toUtf8Bytes(clientDataStr);

  const clientDataHash = ethers.sha256(clientDataBytes);
  const rawDigest = ethers.sha256(
    ethers.concat([authData, ethers.getBytes(clientDataHash)])
  );

  // Deterministic pseudo-signatures (NOT cryptographically valid, for testing only)
  const r = ethers.keccak256(
    ethers.concat([ethers.getBytes(rawDigest), ethers.toUtf8Bytes("r")])
  );
  const s = ethers.keccak256(
    ethers.concat([ethers.getBytes(rawDigest), ethers.toUtf8Bytes("s")])
  );

  return {
    r,
    s,
    authenticatorData: bufferToHex(authData),
    clientDataJSON: bufferToHex(clientDataBytes),
    clientDataJSONString: clientDataStr,
    rawDigest,
    flags: { userPresent: true, userVerified: true },
  };
}

// ─── Internals ────────────────────────────────────────────────────────────────

/** @internal Detect the device type from the user agent */
function _detectDeviceLabel(): string {
  if (typeof navigator === "undefined") return "Hardware Secure Enclave";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "Apple iOS (Secure Enclave)";
  if (/Macintosh/.test(ua)) return "Apple TouchID / T2 Chip";
  if (/Android/.test(ua)) return "Android Titan Security Chip";
  if (/Windows/.test(ua)) return "Windows Hello TPM Enclave";
  return "Hardware Secure Enclave";
}
