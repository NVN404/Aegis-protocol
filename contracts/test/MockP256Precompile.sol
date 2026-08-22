// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MockP256Precompile
 * @notice Mock implementation of Monad's 0x0100 precompile for Foundry unit testing.
 */
contract MockP256Precompile {
    fallback(bytes calldata input) external returns (bytes memory) {
        if (input.length != 160) {
            return "";
        }

        // Decode: hash (32), r (32), s (32), qx (32), qy (32)
        bytes32 r;
        bytes32 s;
        bytes32 qx;
        bytes32 qy;

        assembly {
            r := calldataload(32)
            s := calldataload(64)
            qx := calldataload(96)
            qy := calldataload(128)
        }

        // Simulate invalid signature marker
        if (r == bytes32(uint256(0xdead)) || s == bytes32(uint256(0xdead))) {
            return abi.encode(uint256(0));
        }

        // If valid coordinates and non-zero components, return 1
        if (uint256(r) > 0 && uint256(s) > 0 && uint256(qx) > 0 && uint256(qy) > 0) {
            return abi.encode(uint256(1));
        }

        return abi.encode(uint256(0));
    }
}
