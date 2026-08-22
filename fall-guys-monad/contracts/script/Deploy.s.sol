// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/FallGuysArena.sol";

contract DeployFallGuys is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        FallGuysArena arena = new FallGuysArena(deployer);
        console.log("FallGuysArena deployed at:", address(arena));
        console.log("Host set to:", deployer);

        vm.stopBroadcast();
    }
}
