// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/ProofOfPersonhoodRegistry.sol";
import "./MockP256Precompile.sol";

contract ProofOfPersonhoodTest is Test {
    ProofOfPersonhoodRegistry registry;

    bytes32 constant PUBKEY_X1 = 0x5b38da6a701c568545dcfcb03fcb875f56beddc4ecc9144415fa9d1d198f2812;
    bytes32 constant PUBKEY_Y1 = 0x8a924b6f120199042b36a1936c39546059c25607a972c3d0c3c261e4a3b7c251;

    bytes32 constant PUBKEY_X2 = 0x1111111111111111111111111111111111111111111111111111111111111111;
    bytes32 constant PUBKEY_Y2 = 0x2222222222222222222222222222222222222222222222222222222222222222;

    bytes32 constant R = 0x3a1098b671ef3b64835bc4561081a293d0cfdc4149e390c524021239014b23c1;
    bytes32 constant S = 0x1f09831980324810238120381028301820381203812038120381203812038120;

    address humanWallet1 = address(0x101);
    address humanWallet2 = address(0x202);

    bytes authData;
    bytes clientDataJSON;

    function setUp() public {
        MockP256Precompile mock = new MockP256Precompile();
        vm.etch(address(0x0100), address(mock).code);

        authData = new bytes(37);
        authData[32] = bytes1(0x05); // UP + UV
        clientDataJSON = bytes('{"type":"webauthn.get","challenge":"bW9uYWQ"}');

        registry = new ProofOfPersonhoodRegistry();
    }

    function test_RegisterHumanPersonhood() public {
        bytes32 id = registry.registerHuman(
            PUBKEY_X1,
            PUBKEY_Y1,
            humanWallet1,
            "iPhone 16 Pro (Secure Enclave)",
            authData,
            clientDataJSON,
            R,
            S
        );

        assertTrue(registry.isVerifiedHuman(humanWallet1));
        assertEq(registry.totalIdentities(), 1);
        assertEq(registry.accountToIdentity(humanWallet1), id);
    }

    function test_RevertOnSybilDuplicateHuman() public {
        registry.registerHuman(
            PUBKEY_X1,
            PUBKEY_Y1,
            humanWallet1,
            "iPhone 16 Pro",
            authData,
            clientDataJSON,
            R,
            S
        );

        // Attempting to register another account with the SAME silicon key
        vm.expectRevert(ProofOfPersonhoodRegistry.HardwareAlreadyRegistered.selector);
        registry.registerHuman(
            PUBKEY_X1,
            PUBKEY_Y1,
            humanWallet2,
            "Cloned Bot Identity",
            authData,
            clientDataJSON,
            R,
            S
        );
    }
}
