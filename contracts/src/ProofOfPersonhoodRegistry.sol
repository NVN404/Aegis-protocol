// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./WebAuthnPrecompile.sol";

/**
 * @title ProofOfPersonhoodRegistry
 * @notice Canonical Decentralized Proof of Personhood (PoP) Registry on Monad.
 * @dev Replaces invasive iris scans (e.g. Worldcoin) with hardware-enforced biometrics (Apple Secure Enclave / Android Titan chip)
 *      verified natively via Monad's 0x0100 precompile.
 */
contract ProofOfPersonhoodRegistry {
    using WebAuthnPrecompile for bytes;

    struct HumanIdentity {
        bytes32 identityId;
        bytes32 pubKeyX;
        bytes32 pubKeyY;
        address boundAccount;
        uint64 registeredAt;
        uint64 lastVerifiedAt;
        uint32 verificationCount;
        bool isRevoked;
        string deviceLabel; // e.g. "iPhone 16 Pro (Secure Enclave)"
    }

    /// @notice Total registered human identities
    uint256 public totalIdentities;

    /// @notice Identity mapping: identityId => HumanIdentity
    mapping(bytes32 => HumanIdentity) public identities;

    /// @notice Public Key hash => identityId (prevents duplicate hardware registrations)
    mapping(bytes32 => bytes32) public hardwareKeyToIdentity;

    /// @notice Bound Smart Account => identityId
    mapping(address => bytes32) public accountToIdentity;

    /// @notice Nonce tracker for challenges
    mapping(bytes32 => uint256) public identityNonces;

    /// @notice Events
    event HumanRegistered(
        bytes32 indexed identityId,
        address indexed boundAccount,
        bytes32 pubKeyX,
        bytes32 pubKeyY,
        string deviceLabel
    );
    event PersonhoodVerified(
        bytes32 indexed identityId,
        address indexed verifierApp,
        uint256 timestamp,
        uint32 newVerificationCount
    );
    event IdentityRevoked(bytes32 indexed identityId);

    /// @notice Errors
    error HardwareAlreadyRegistered();
    error IdentityNotFound();
    error IdentityRevokedError();
    error InvalidWebAuthnProof();
    error ZeroAddressNotAllowed();

    /**
     * @notice Registers a new human hardware identity on Monad.
     * @param pubKeyX P-256 public key X coordinate from WebAuthn credential.
     * @param pubKeyY P-256 public key Y coordinate from WebAuthn credential.
     * @param boundAccount Monad smart account or EOA linked to this identity.
     * @param deviceLabel Human-readable device tag (e.g., "Apple iPhone / Secure Enclave").
     * @param authenticatorData WebAuthn authenticator data bytes.
     * @param clientDataJSON WebAuthn clientDataJSON string bytes.
     * @param r Signature r value proving possession of hardware key.
     * @param s Signature s value.
     */
    function registerHuman(
        bytes32 pubKeyX,
        bytes32 pubKeyY,
        address boundAccount,
        string calldata deviceLabel,
        bytes calldata authenticatorData,
        bytes calldata clientDataJSON,
        bytes32 r,
        bytes32 s
    ) external returns (bytes32 identityId) {
        if (boundAccount == address(0)) revert ZeroAddressNotAllowed();

        bytes32 keyHash = keccak256(abi.encodePacked(pubKeyX, pubKeyY));
        if (hardwareKeyToIdentity[keyHash] != bytes32(0)) {
            revert HardwareAlreadyRegistered();
        }

        // Verify that the registrant physically possesses the Secure Enclave hardware key
        bool isValid = WebAuthnPrecompile.verifyWebAuthn(
            authenticatorData,
            clientDataJSON,
            r,
            s,
            pubKeyX,
            pubKeyY,
            false // UP verified
        );
        if (!isValid) revert InvalidWebAuthnProof();

        identityId = keccak256(
            abi.encodePacked(keyHash, boundAccount, block.timestamp, totalIdentities)
        );

        HumanIdentity storage newIdentity = identities[identityId];
        newIdentity.identityId = identityId;
        newIdentity.pubKeyX = pubKeyX;
        newIdentity.pubKeyY = pubKeyY;
        newIdentity.boundAccount = boundAccount;
        newIdentity.registeredAt = uint64(block.timestamp);
        newIdentity.lastVerifiedAt = uint64(block.timestamp);
        newIdentity.verificationCount = 1;
        newIdentity.isRevoked = false;
        newIdentity.deviceLabel = deviceLabel;

        hardwareKeyToIdentity[keyHash] = identityId;
        accountToIdentity[boundAccount] = identityId;
        totalIdentities++;

        emit HumanRegistered(identityId, boundAccount, pubKeyX, pubKeyY, deviceLabel);
    }

    /**
     * @notice Performs a real-time on-chain Proof of Personhood biometric verification.
     * @dev Called by third-party dApps (faucets, DAOs, DeFi) to guarantee a human is interacting.
     */
    function verifyHumanPersonhood(
        bytes32 identityId,
        bytes calldata authenticatorData,
        bytes calldata clientDataJSON,
        bytes32 r,
        bytes32 s
    ) external returns (bool) {
        HumanIdentity storage identity = identities[identityId];
        if (identity.registeredAt == 0) revert IdentityNotFound();
        if (identity.isRevoked) revert IdentityRevokedError();

        bool isValid = WebAuthnPrecompile.verifyWebAuthn(
            authenticatorData,
            clientDataJSON,
            r,
            s,
            identity.pubKeyX,
            identity.pubKeyY,
            false
        );
        if (!isValid) revert InvalidWebAuthnProof();

        identity.lastVerifiedAt = uint64(block.timestamp);
        identity.verificationCount++;
        identityNonces[identityId]++;

        emit PersonhoodVerified(
            identityId,
            msg.sender,
            block.timestamp,
            identity.verificationCount
        );

        return true;
    }

    /**
     * @notice Check if an address has a registered and active Proof of Personhood.
     */
    function isVerifiedHuman(address account) external view returns (bool) {
        bytes32 id = accountToIdentity[account];
        if (id == bytes32(0)) return false;
        return !identities[id].isRevoked;
    }

    /**
     * @notice Returns complete identity profile.
     */
    function getIdentity(bytes32 identityId) external view returns (HumanIdentity memory) {
        return identities[identityId];
    }
}
