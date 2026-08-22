// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PasskeyAccount.sol";

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
