// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/PasskeyAccountFactory.sol";
import "../src/ProofOfPersonhoodRegistry.sol";

contract DeployMonadPasskeyPoP is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80)
        );

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Factory
        PasskeyAccountFactory factory = new PasskeyAccountFactory();
        console.log("PasskeyAccountFactory deployed to:", address(factory));

        // 2. Deploy Canonical PoP Registry
        ProofOfPersonhoodRegistry registry = new ProofOfPersonhoodRegistry();
        console.log("ProofOfPersonhoodRegistry deployed to:", address(registry));

        vm.stopBroadcast();
    }
}
