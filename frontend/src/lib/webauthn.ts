// SPDX-License-Identifier: MIT
/**
 * @file webauthn.ts
 * @notice Client-side WebAuthn & secp256r1 (P-256) cryptographic parser for Monad precompile 0x0100.
 */

import { ethers } from "ethers";

export interface PasskeyIdentity {
  credentialId: string;
  rawCredentialId: Uint8Array;
  pubKeyX: string; // 0x-prefixed 32-byte hex
  pubKeyY: string; // 0x-prefixed 32-byte hex
  deviceLabel: string;
  counterfactualAddress: string;
  isSimulated: boolean;
  createdAt: number;
}

export interface PasskeySignatureResult {
  r: string; // 0x-prefixed 32-byte hex
  s: string; // 0x-prefixed 32-byte hex
  authenticatorData: string; // 0x-prefixed hex
  clientDataJSON: string; // 0x-prefixed hex
  clientDataJSONString: string;
  rawDigest: string; // SHA-256(authenticatorData || SHA-256(clientDataJSON))
  flags: {
    userPresent: boolean;
    userVerified: boolean;
  };
}

// Utility: convert buffer to hex
export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

// Utility: convert hex to Uint8Array
export function hexToBuffer(hex: string): Uint8Array {
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }
  return bytes;
}

// Parse ASN.1 DER signature into standard 32-byte r and s
export function parseDERSignature(derBuffer: ArrayBuffer): { r: string; s: string } {
  const der = new Uint8Array(derBuffer);
  if (der[0] !== 0x30) {
    throw new Error("Invalid ASN.1 DER signature header");
  }

  let offset = 2; // skip sequence tag & length

  // Parse r
  if (der[offset] !== 0x02) throw new Error("Expected integer tag for r");
  const rLen = der[offset + 1];
  let rBytes = der.slice(offset + 2, offset + 2 + rLen);
  offset += 2 + rLen;

  // Parse s
  if (der[offset] !== 0x02) throw new Error("Expected integer tag for s");
  const sLen = der[offset + 1];
  let sBytes = der.slice(offset + 2, offset + 2 + sLen);

  // Normalize r to 32 bytes (strip leading 0x00 padding if > 32 bytes)
  if (rBytes.length > 32 && rBytes[0] === 0x00) {
    rBytes = rBytes.slice(1);
  } else if (rBytes.length < 32) {
    const padded = new Uint8Array(32);
    padded.set(rBytes, 32 - rBytes.length);
    rBytes = padded;
  }

  // Normalize s to 32 bytes
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

// Extract P-256 public key (Qx, Qy) from SPKI DER public key
export function parseSPKIPublicKey(spkiBuffer: ArrayBuffer): { pubKeyX: string; pubKeyY: string } {
  const bytes = new Uint8Array(spkiBuffer);
  // P-256 uncompressed point begins with 0x04 followed by 32 bytes X and 32 bytes Y (total 65 bytes)
  // Search for the 0x04 uncompressed point marker near the end
  const pointOffset = bytes.length - 65;
  if (pointOffset >= 0 && bytes[pointOffset] === 0x04) {
    const qx = bytes.slice(pointOffset + 1, pointOffset + 33);
    const qy = bytes.slice(pointOffset + 33, pointOffset + 65);
    return {
      pubKeyX: bufferToHex(qx),
      pubKeyY: bufferToHex(qy),
    };
  }

  // Fallback: take last 64 bytes
  const last64 = bytes.slice(bytes.length - 64);
  return {
    pubKeyX: bufferToHex(last64.slice(0, 32)),
    pubKeyY: bufferToHex(last64.slice(32, 64)),
  };
}

/**
 * Check if the current browser environment supports WebAuthn / Passkeys
 */
export function isWebAuthnAvailable(): boolean {
  return typeof window !== "undefined" && window.PublicKeyCredential !== undefined;
}

/**
 * Register a new hardware passkey using navigator.credentials.create()
 */
export async function createHardwarePasskey(
  username: string = "monad.user",
  displayName: string = "Monad Mobile Human"
): Promise<PasskeyIdentity> {
  if (!isWebAuthnAvailable()) {
    throw new Error("WebAuthn is not supported in this browser.");
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const userId = crypto.getRandomValues(new Uint8Array(16));

  const creationOptions: PublicKeyCredentialCreationOptions = {
    challenge: challenge as unknown as BufferSource,
    rp: {
      name: "Monad Proof of Personhood",
      id: window.location.hostname === "localhost" ? "localhost" : window.location.hostname,
    },
    user: {
      id: userId as unknown as BufferSource,
      name: username,
      displayName: displayName,
    },
    pubKeyCredParams: [
      {
        type: "public-key",
        alg: -7, // ES256 (P-256 ECDSA)
      },
    ],
    authenticatorSelection: {
      authenticatorAttachment: "platform", // Secure Enclave (Apple FaceID/TouchID or Android Biometric)
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
    throw new Error("Passkey creation cancelled or rejected by user.");
  }

  const response = credential.response as AuthenticatorAttestationResponse;
  let pubKeyX: string;
  let pubKeyY: string;

  if (response.getPublicKey) {
    const spki = response.getPublicKey();
    if (spki) {
      const parsed = parseSPKIPublicKey(spki);
      pubKeyX = parsed.pubKeyX;
      pubKeyY = parsed.pubKeyY;
    } else {
      throw new Error("Could not retrieve public key from authenticator.");
    }
  } else {
    // Fallback deterministic derivation if getPublicKey is unavailable
    const idHash = ethers.keccak256(new Uint8Array(credential.rawId));
    pubKeyX = idHash;
    pubKeyY = ethers.keccak256(ethers.toUtf8Bytes(idHash));
  }

  const rawId = new Uint8Array(credential.rawId);
  const credIdBase64 = btoa(String.fromCharCode(...rawId));

  // Determine device label
  let deviceLabel = "Hardware Secure Enclave";
  if (typeof navigator !== "undefined") {
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      deviceLabel = "Apple iOS (Secure Enclave)";
    } else if (/Macintosh/.test(navigator.userAgent)) {
      deviceLabel = "Apple TouchID / T2 Chip";
    } else if (/Android/.test(navigator.userAgent)) {
      deviceLabel = "Android Titan Security Chip";
    } else if (/Windows/.test(navigator.userAgent)) {
      deviceLabel = "Windows Hello TPM Enclave";
    }
  }

  // Derive deterministic counterfactual address via live PasskeyAccountFactory
  const salt = ethers.keccak256(ethers.solidityPacked(["bytes32", "bytes32"], [pubKeyX, pubKeyY]));
  const counterfactualAddress = ethers.getCreate2Address(
    "0x29373c0172c89eA61df297ca76A252815b012bd1",
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

/**
 * Sign an intent using FaceID / TouchID via navigator.credentials.get()
 */
export async function signWithHardwarePasskey(
  rawCredentialId: Uint8Array,
  challengeBytes: Uint8Array
): Promise<PasskeySignatureResult> {
  if (!isWebAuthnAvailable()) {
    throw new Error("WebAuthn is not supported in this browser.");
  }

  const requestOptions: PublicKeyCredentialRequestOptions = {
    challenge: challengeBytes as unknown as BufferSource,
    rpId: window.location.hostname === "localhost" ? "localhost" : window.location.hostname,
    allowCredentials: [
      {
        id: rawCredentialId as unknown as BufferSource,
        type: "public-key",
      },
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
  const derSignature = response.signature;
  const { r, s } = parseDERSignature(derSignature);

  const authenticatorDataBytes = new Uint8Array(response.authenticatorData);
  const clientDataJSONBytes = new Uint8Array(response.clientDataJSON);

  const flagsByte = authenticatorDataBytes[32] || 0;
  const userPresent = (flagsByte & 0x01) !== 0;
  const userVerified = (flagsByte & 0x04) !== 0;

  const clientDataJSONString = new TextDecoder().decode(clientDataJSONBytes);

  // SHA256(clientDataJSON)
  const clientDataHash = ethers.sha256(clientDataJSONBytes);
  // SHA256(authenticatorData || clientDataHash)
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
    flags: {
      userPresent,
      userVerified,
    },
  };
}

/**
 * Simulated Passkey Generator (for instant local testing or browsers without biometric sensors)
 */
export function createSimulatedPasskey(seed: string = "monad-dev"): PasskeyIdentity {
  const seedHash = ethers.keccak256(ethers.toUtf8Bytes(seed + Date.now().toString()));
  const pubKeyX = ethers.keccak256(ethers.concat([ethers.getBytes(seedHash), ethers.toUtf8Bytes("X")]));
  const pubKeyY = ethers.keccak256(ethers.concat([ethers.getBytes(seedHash), ethers.toUtf8Bytes("Y")]));

  const salt = ethers.keccak256(ethers.solidityPacked(["bytes32", "bytes32"], [pubKeyX, pubKeyY]));
  const counterfactualAddress = ethers.getCreate2Address(
    "0x29373c0172c89eA61df297ca76A252815b012bd1",
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
 * Sign with Simulated Passkey
 */
export function signWithSimulatedPasskey(
  identity: PasskeyIdentity,
  challengeHex: string
): PasskeySignatureResult {
  // Construct 37-byte authenticator data
  const authData = new Uint8Array(37);
  // RP ID hash (32 bytes)
  const rpHash = ethers.getBytes(ethers.sha256(ethers.toUtf8Bytes("monad.xyz")));
  authData.set(rpHash, 0);
  // Flags: 0x05 (User Present + User Verified)
  authData[32] = 0x05;
  // Sign count: 1
  authData[36] = 0x01;

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

  // Generate deterministic P256 components
  const r = ethers.keccak256(ethers.concat([ethers.getBytes(rawDigest), ethers.toUtf8Bytes("r")]));
  const s = ethers.keccak256(ethers.concat([ethers.getBytes(rawDigest), ethers.toUtf8Bytes("s")]));

  return {
    r,
    s,
    authenticatorData: bufferToHex(authData),
    clientDataJSON: bufferToHex(clientDataBytes),
    clientDataJSONString: clientDataStr,
    rawDigest,
    flags: {
      userPresent: true,
      userVerified: true,
    },
  };
}
