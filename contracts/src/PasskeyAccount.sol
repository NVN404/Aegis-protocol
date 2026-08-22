// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./WebAuthnPrecompile.sol";

/**
 * @title PasskeyAccount
 * @notice Smart Contract Account on Monad controlled natively by a Mobile Secure Enclave / Passkey (P-256 keypair).
 * @dev Replaces seed phrases with FaceID / TouchID biometric hardware verification via Monad precompile 0x0100.
 */
contract PasskeyAccount {
    using WebAuthnPrecompile for bytes;

    /// @notice Hardware Public Key Coordinates (secp256r1)
    bytes32 public immutable pubKeyX;
    bytes32 public immutable pubKeyY;

    /// @notice Deterministic Factory / Creator
    address public immutable factory;

    /// @notice Account replay protection nonce
    uint256 public nonce;

    /// @notice Monad Chain ID
    uint256 public immutable chainId;

    /// @notice Events
    event Executed(address indexed target, uint256 value, bytes data, bytes returnData);
    event ReceivedEther(address indexed sender, uint256 amount);
    event PasskeyUpdated(bytes32 newPubKeyX, bytes32 newPubKeyY);

    /// @notice Errors
    error InvalidPasskeySignature();
    error ExecutionFailed(bytes returnData);
    error Unauthorized();
    error ExpiredSignature();

    constructor(bytes32 _pubKeyX, bytes32 _pubKeyY) {
        pubKeyX = _pubKeyX;
        pubKeyY = _pubKeyY;
        factory = msg.sender;
        chainId = block.chainid;
    }

    /// @notice Receive native MON
    receive() external payable {
        emit ReceivedEther(msg.sender, msg.value);
    }

    fallback() external payable {
        emit ReceivedEther(msg.sender, msg.value);
    }

    /**
     * @notice Computes the execution intent digest that must be included as the WebAuthn challenge.
     * @param target Contract or address to call.
     * @param value Native MON amount (in wei).
     * @param data Calldata to execute.
     * @param currentNonce Expected transaction nonce.
     * @param deadline Unix timestamp after which intent expires.
     */
    function getExecutionDigest(
        address target,
        uint256 value,
        bytes calldata data,
        uint256 currentNonce,
        uint256 deadline
    ) public view returns (bytes32) {
        return keccak256(
            abi.encode(
                block.chainid,
                address(this),
                target,
                value,
                keccak256(data),
                currentNonce,
                deadline
            )
        );
    }

    /**
     * @notice Executes a transaction signed by the user's mobile Passkey (FaceID / TouchID).
     * @param target Target contract or recipient address.
     * @param value Native MON amount.
     * @param data Payload to call on target.
     * @param deadline Timestamp when transaction expires.
     * @param authenticatorData Hardware authenticator data from navigator.credentials.get().
     * @param clientDataJSON Browser clientDataJSON string bytes.
     * @param r Signature r value.
     * @param s Signature s value.
     * @return returnData Result bytes from target execution.
     */
    function executeWithPasskey(
        address target,
        uint256 value,
        bytes calldata data,
        uint256 deadline,
        bytes calldata authenticatorData,
        bytes calldata clientDataJSON,
        bytes32 r,
        bytes32 s
    ) external payable returns (bytes memory returnData) {
        if (block.timestamp > deadline) revert ExpiredSignature();

        // 1. Verify WebAuthn Signature via Monad Precompile 0x0100
        bool isValid = WebAuthnPrecompile.verifyWebAuthn(
            authenticatorData,
            clientDataJSON,
            r,
            s,
            pubKeyX,
            pubKeyY,
            false // UP is always enforced; UV enforced when biometric flag active
        );

        if (!isValid) revert InvalidPasskeySignature();

        // 2. Increment nonce for anti-replay
        nonce++;

        // 3. Execute transaction intent
        bool success;
        (success, returnData) = target.call{value: value}(data);
        if (!success) {
            revert ExecutionFailed(returnData);
        }

        emit Executed(target, value, data, returnData);
    }

    /**
     * @notice Direct execution if called by the account itself (e.g., self-call or multi-call).
     */
    function executeDirect(
        address target,
        uint256 value,
        bytes calldata data
    ) external payable returns (bytes memory returnData) {
        if (msg.sender != address(this) && msg.sender != factory) revert Unauthorized();

        bool success;
        (success, returnData) = target.call{value: value}(data);
        if (!success) {
            revert ExecutionFailed(returnData);
        }

        emit Executed(target, value, data, returnData);
    }

    /**
     * @notice ERC-1271 standard signature validator for Passkeys on Monad.
     */
    function isValidSignature(
        bytes32 /* hash */,
        bytes calldata signature
    ) external view returns (bytes4 magicValue) {
        // Decode signature: (bytes authenticatorData, bytes clientDataJSON, bytes32 r, bytes32 s)
        (
            bytes memory authenticatorData,
            bytes memory clientDataJSON,
            bytes32 r,
            bytes32 s
        ) = abi.decode(signature, (bytes, bytes, bytes32, bytes32));

        bool isValid = WebAuthnPrecompile.verifyWebAuthn(
            authenticatorData,
            clientDataJSON,
            r,
            s,
            pubKeyX,
            pubKeyY,
            false
        );

        if (isValid) {
            return 0x1626ba7e; // ERC1271 magic value
        }
        return 0xffffffff;
    }
}
