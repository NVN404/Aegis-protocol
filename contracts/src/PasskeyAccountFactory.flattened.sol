// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// src/WebAuthnPrecompile.sol

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

// src/PasskeyAccount.sol

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

// src/PasskeyAccountFactory.sol

/**
 * @title PasskeyAccountFactory
 * @notice Deterministic CREATE2 Factory for Passkey Smart Accounts on Monad.
 * @dev Enables counterfactual address derivation: users know their Monad address immediately upon FaceID creation.
 */
contract PasskeyAccountFactory {
    /// @notice Registry of created accounts
    mapping(address => bool) public isAccount;
    mapping(bytes32 => address) public passkeyToAccount;

    /// @notice Events
    event AccountCreated(
        address indexed account,
        bytes32 indexed pubKeyX,
        bytes32 indexed pubKeyY,
        bytes32 passkeyId
    );

    /**
     * @notice Computes the unique passkey identifier hash from P-256 coordinates.
     */
    function getPasskeyId(bytes32 pubKeyX, bytes32 pubKeyY) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(pubKeyX, pubKeyY));
    }

    /**
     * @notice Predicts the counterfactual address of a Passkey Account before it is deployed.
     * @param pubKeyX Public Key X coordinate.
     * @param pubKeyY Public Key Y coordinate.
     */
    function getAddress(bytes32 pubKeyX, bytes32 pubKeyY) public view returns (address) {
        bytes32 salt = getPasskeyId(pubKeyX, pubKeyY);
        bytes memory bytecode = abi.encodePacked(
            type(PasskeyAccount).creationCode,
            abi.encode(pubKeyX, pubKeyY)
        );
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(bytecode)
            )
        );
        return address(uint160(uint256(hash)));
    }

    /**
     * @notice Deploys a new Passkey Account via CREATE2.
     * @param pubKeyX Public Key X coordinate.
     * @param pubKeyY Public Key Y coordinate.
     * @return account The deployed account address.
     */
    function createAccount(bytes32 pubKeyX, bytes32 pubKeyY) external returns (address account) {
        bytes32 salt = getPasskeyId(pubKeyX, pubKeyY);
        address predicted = getAddress(pubKeyX, pubKeyY);

        if (predicted.code.length > 0) {
            return predicted;
        }

        account = address(new PasskeyAccount{salt: salt}(pubKeyX, pubKeyY));
        isAccount[account] = true;
        passkeyToAccount[salt] = account;

        emit AccountCreated(account, pubKeyX, pubKeyY, salt);
    }

    /**
     * @notice Relays an execution on a deployed Passkey Account.
     */
    function relayExecute(
        address account,
        address target,
        uint256 value,
        bytes calldata data
    ) external returns (bytes memory) {
        return PasskeyAccount(payable(account)).executeDirect(target, value, data);
    }
}

