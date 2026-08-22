// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/FallGuysArena.sol";

contract FallGuysArenaTest is Test {
    FallGuysArena public arena;
    address public host;
    address public player1;
    address public player2;

    function setUp() public {
        host = address(0x99);
        player1 = address(0x11);
        player2 = address(0x22);

        vm.deal(player1, 20 ether);
        vm.deal(player2, 20 ether);
        vm.deal(host, 10 ether);

        vm.prank(host);
        arena = new FallGuysArena(host);
    }

    function test_AutomaticCheckpointPayouts() public {
        // Player 1 and 2 join with 1 MON
        vm.prank(player1);
        arena.joinGame{value: 1 ether}();
        vm.prank(player2);
        arena.joinGame{value: 1 ether}();

        assertEq(address(arena).balance, 2 ether);

        uint256 balP1Start = player1.balance;

        // Player 1 reaches Checkpoint 1 (Auto-pays 0.25 MON)
        vm.prank(host);
        arena.recordCheckpoint(payable(player1), 1);
        assertEq(player1.balance, balP1Start + 0.25 ether);

        // Player 1 reaches Checkpoint 2 (Auto-pays another 0.25 MON, total 0.50 MON)
        vm.prank(host);
        arena.recordCheckpoint(payable(player1), 2);
        assertEq(player1.balance, balP1Start + 0.50 ether);

        // Player 1 reaches Checkpoint 3 (Auto-pays another 0.25 MON, total 0.75 MON)
        vm.prank(host);
        arena.recordCheckpoint(payable(player1), 3);
        assertEq(player1.balance, balP1Start + 0.75 ether);

        // Player 1 finishes race (Auto-pays remaining 0.25 MON, total 1.00 MON)
        vm.prank(host);
        arena.finishRace(payable(player1));
        assertEq(player1.balance, balP1Start + 1.00 ether);

        // Player 2 eliminated (no further payouts)
        vm.prank(host);
        arena.eliminatePlayer(player2);
    }
}
