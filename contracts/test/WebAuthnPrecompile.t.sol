// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/WebAuthnPrecompile.sol";
import "./MockP256Precompile.sol";

contract WebAuthnPrecompileTest is Test {
    using WebAuthnPrecompile for bytes;

    bytes32 constant DUMMY_PUBKEY_X = 0x5b38da6a701c568545dcfcb03fcb875f56beddc4ecc9144415fa9d1d198f2812;
    bytes32 constant DUMMY_PUBKEY_Y = 0x8a924b6f120199042b36a1936c39546059c25607a972c3d0c3c261e4a3b7c251;
    bytes32 constant DUMMY_R = 0x3a1098b671ef3b64835bc4561081a293d0cfdc4149e390c524021239014b23c1;
    bytes32 constant DUMMY_S = 0x1f09831980324810238120381028301820381203812038120381203812038120;

    function setUp() public {
        // Etch mock precompile bytecode to Monad 0x0100 precompile address
        MockP256Precompile mock = new MockP256Precompile();
        vm.etch(address(0x0100), address(mock).code);
    }

    function test_VerifyP256Direct() public view {
        bytes32 hash = sha256("test-monad-intent");
        bool valid = WebAuthnPrecompile.verifyP256Signature(
            hash,
            DUMMY_R,
            DUMMY_S,
            DUMMY_PUBKEY_X,
            DUMMY_PUBKEY_Y
        );
        assertTrue(valid, "P-256 signature should verify successfully via precompile 0x0100");
    }

    function test_RejectInvalidSignature() public view {
        bytes32 hash = sha256("test-monad-intent");
        bytes32 badR = bytes32(uint256(0xdead));
        bool valid = WebAuthnPrecompile.verifyP256Signature(
            hash,
            badR,
            DUMMY_S,
            DUMMY_PUBKEY_X,
            DUMMY_PUBKEY_Y
        );
        assertFalse(valid, "Invalid signature must be rejected");
    }

    function test_WebAuthnPayloadVerification() public view {
        // Construct standard 37-byte authenticator data: 32 bytes rpIdHash + 1 byte flags (0x05 = UP + UV) + 4 bytes signCount
        bytes memory authData = new bytes(37);
        authData[32] = bytes1(0x05); // User Present (bit 0) & User Verified (bit 2)

        bytes memory clientDataJSON = bytes('{"type":"webauthn.get","challenge":"bW9uYWQtcG9w","origin":"https://monad.xyz"}');

        bool valid = WebAuthnPrecompile.verifyWebAuthn(
            authData,
            clientDataJSON,
            DUMMY_R,
            DUMMY_S,
            DUMMY_PUBKEY_X,
            DUMMY_PUBKEY_Y,
            true // require biometric
        );
        assertTrue(valid, "WebAuthn assertion should succeed with UP & UV flags");
    }

    function test_RejectMissingUserPresent() public view {
        bytes memory authData = new bytes(37);
        authData[32] = bytes1(0x00); // UP flag missing

        bytes memory clientDataJSON = bytes('{"type":"webauthn.get","challenge":"bW9uYWQtcG9w"}');

        bool valid = WebAuthnPrecompile.verifyWebAuthn(
            authData,
            clientDataJSON,
            DUMMY_R,
            DUMMY_S,
            DUMMY_PUBKEY_X,
            DUMMY_PUBKEY_Y,
            false
        );
        assertFalse(valid, "Should reject when User Present flag is 0");
    }
}
