// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title WebAuthnPrecompile
 * @notice Cryptographic helper library for Monad's native secp256r1 (P-256) precompile at address 0x0100 (EIP-7951 / RIP-7212).
 * @dev On Monad, the P-256 precompile verifies ECDSA signatures in a single staticcall costing only 6,900 gas.
 */
library WebAuthnPrecompile {
    /// @dev The canonical address of the secp256r1 (P256) precompile on Monad
    address internal constant P256_PRECOMPILE = address(0x0100);

    /// @dev Curve order N for secp256r1 (P-256)
    uint256 internal constant P256_N = 0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551;
    uint256 internal constant P256_N_DIV_2 = P256_N / 2;

    /// @dev Error codes
    error InvalidSignatureComponents();
    error PrecompileCallFailed();
    error InvalidAuthenticatorData();
    error UserNotPresent();
    error UserNotVerified();

    /**
     * @notice Verifies a standard P-256 ECDSA signature directly via precompile 0x0100.
     * @param messageHash 32-byte SHA-256 digest of the signed payload.
     * @param r Signature r parameter (32 bytes).
     * @param s Signature s parameter (32 bytes).
     * @param qx Public key X coordinate (32 bytes).
     * @param qy Public key Y coordinate (32 bytes).
     * @return isValid True if the signature is cryptographically valid.
     */
    function verifyP256Signature(
        bytes32 messageHash,
        bytes32 r,
        bytes32 s,
        bytes32 qx,
        bytes32 qy
    ) internal view returns (bool isValid) {
        // Enforce basic signature ranges (prevent malleability and 0 points)
        if (uint256(r) == 0 || uint256(r) >= P256_N || uint256(s) == 0 || uint256(s) >= P256_N) {
            return false;
        }

        // Low-s enforcement (BIP-62 / EIP-2 style)
        if (uint256(s) > P256_N_DIV_2) {
            s = bytes32(P256_N - uint256(s));
        }

        // Pack the 160-byte payload expected by EIP-7951 / RIP-7212 precompile
        bytes memory input = abi.encodePacked(messageHash, r, s, qx, qy);

        // Staticcall precompile 0x0100
        (bool success, bytes memory output) = P256_PRECOMPILE.staticcall{gas: 20000}(input);

        if (success && output.length == 32) {
            uint256 result = abi.decode(output, (uint256));
            return result == 1;
        }

        return false;
    }

    /**
     * @notice Verifies a complete WebAuthn / Passkey assertion payload.
     * @dev WebAuthn signs sha256(authenticatorData || sha256(clientDataJSON)).
     * @param authenticatorData Raw authenticator data bytes from navigator.credentials.get().
     * @param clientDataJSON Raw clientDataJSON string bytes from browser WebAuthn API.
     * @param r Signature r value.
     * @param s Signature s value.
     * @param qx Public key X coordinate.
     * @param qy Public key Y coordinate.
     * @param requireUserVerification If true, requires biometric verification flag (UV bit = 1).
     * @return isValid True if the WebAuthn signature matches the public key and flags pass.
     */
    function verifyWebAuthn(
        bytes memory authenticatorData,
        bytes memory clientDataJSON,
        bytes32 r,
        bytes32 s,
        bytes32 qx,
        bytes32 qy,
        bool requireUserVerification
    ) internal view returns (bool isValid) {
        // Authenticator data must be at least 37 bytes: 32 bytes rpIdHash + 1 byte flags + 4 bytes signCount
        if (authenticatorData.length < 37) {
            return false;
        }

        // Extract flags byte (byte index 32)
        uint8 flags = uint8(authenticatorData[32]);

        // Bit 0 is "User Present" (UP)
        if ((flags & 0x01) == 0) {
            return false;
        }

        // Bit 2 is "User Verified" (UV) - e.g. FaceID / TouchID / biometric check
        if (requireUserVerification && (flags & 0x04) == 0) {
            return false;
        }

        // Compute WebAuthn message digest: SHA256(authenticatorData || SHA256(clientDataJSON))
        bytes32 clientDataHash = sha256(clientDataJSON);
        bytes32 messageHash = sha256(abi.encodePacked(authenticatorData, clientDataHash));

        return verifyP256Signature(messageHash, r, s, qx, qy);
    }

    /**
     * @notice Helper to compute the WebAuthn message digest off-chain or for inspection.
     */
    function computeWebAuthnDigest(
        bytes memory authenticatorData,
        bytes memory clientDataJSON
    ) internal pure returns (bytes32) {
        bytes32 clientDataHash = sha256(clientDataJSON);
        return sha256(abi.encodePacked(authenticatorData, clientDataHash));
    }
}
