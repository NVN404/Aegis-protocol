// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/PasskeyAccount.sol";
import "../src/PasskeyAccountFactory.sol";
import "./MockP256Precompile.sol";

contract MockTarget {
    uint256 public counter;
    event TargetCalled(uint256 val);

    function increment(uint256 val) external payable {
        counter += val;
        emit TargetCalled(val);
    }
}

contract PasskeyAccountTest is Test {
    PasskeyAccountFactory factory;
    MockTarget target;

    bytes32 constant PUBKEY_X = 0x5b38da6a701c568545dcfcb03fcb875f56beddc4ecc9144415fa9d1d198f2812;
    bytes32 constant PUBKEY_Y = 0x8a924b6f120199042b36a1936c39546059c25607a972c3d0c3c261e4a3b7c251;
    bytes32 constant R = 0x3a1098b671ef3b64835bc4561081a293d0cfdc4149e390c524021239014b23c1;
    bytes32 constant S = 0x1f09831980324810238120381028301820381203812038120381203812038120;

    function setUp() public {
        MockP256Precompile mock = new MockP256Precompile();
        vm.etch(address(0x0100), address(mock).code);

        factory = new PasskeyAccountFactory();
        target = new MockTarget();
    }

    function test_DeterministicAddressDerivationAndDeployment() public {
        address predicted = factory.getAddress(PUBKEY_X, PUBKEY_Y);
        assertTrue(predicted != address(0), "Predicted address must not be zero");

        address deployed = factory.createAccount(PUBKEY_X, PUBKEY_Y);
        assertEq(predicted, deployed, "Deployed address must match predicted counterfactual address");
        assertTrue(factory.isAccount(deployed), "Factory registry should record account");
    }

    function test_ExecuteWithPasskeyBiometrics() public {
        address accountAddr = factory.createAccount(PUBKEY_X, PUBKEY_Y);
        PasskeyAccount account = PasskeyAccount(payable(accountAddr));

        // Fund the passkey account with 10 MON
        vm.deal(accountAddr, 10 ether);
        assertEq(accountAddr.balance, 10 ether);

        bytes memory callData = abi.encodeWithSelector(MockTarget.increment.selector, 42);

        bytes memory authData = new bytes(37);
        authData[32] = bytes1(0x05); // UP + UV
        bytes memory clientDataJSON = bytes('{"type":"webauthn.get","challenge":"bW9uYWQ"}');

        uint256 deadline = block.timestamp + 1 hours;

        account.executeWithPasskey(
            address(target),
            0,
            callData,
            deadline,
            authData,
            clientDataJSON,
            R,
            S
        );

        assertEq(target.counter(), 42, "Target function should be executed by PasskeyAccount");
        assertEq(account.nonce(), 1, "Nonce must increment after execution");
    }

    function test_ERC1271Validation() public {
        PasskeyAccount account = new PasskeyAccount(PUBKEY_X, PUBKEY_Y);

        bytes memory authData = new bytes(37);
        authData[32] = bytes1(0x05);
        bytes memory clientDataJSON = bytes('{"type":"webauthn.get","challenge":"bW9uYWQ"}');

        bytes memory signaturePayload = abi.encode(authData, clientDataJSON, R, S);

        bytes4 magic = account.isValidSignature(bytes32(0), signaturePayload);
        assertEq(uint32(magic), uint32(0x1626ba7e), "ERC-1271 magic value must match on valid passkey signature");
    }
}
