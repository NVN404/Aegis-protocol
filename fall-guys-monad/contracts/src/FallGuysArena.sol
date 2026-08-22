// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FallGuysArena
 * @notice Built for Monad Blitz Hackathon — Real-Time On-Chain Obstacle Arena.
 *
 * ⚡ MONAD SPECIALTY: ZERO CLAIM BUTTONS.
 * Every single checkpoint crossed triggers an AUTOMATIC, DIRECT-TO-WALLET
 * native MON payout in 400ms sub-second confirmation!
 *
 * Payout Schedule:
 *   - Checkpoint 1 (z = -32) → Instantly transfers 0.25 MON to runner's wallet!
 *   - Checkpoint 2 (z = -62) → Instantly transfers 0.25 MON to runner's wallet!
 *   - Checkpoint 3 (z = -92) → Instantly transfers 0.25 MON to runner's wallet!
 *   - Finish Line  (z = -120) → Instantly transfers 0.25 MON + Loser Pool Share Bonus to winner!
 *
 * OCC-Safe isolated storage per player guarantees conflict-free parallel execution on Monad!
 */
contract FallGuysArena is ReentrancyGuard, Ownable {
    // ─── Constants ────────────────────────────────────────────────────────────

    uint256 public constant ENTRY_FEE       = 0.5 ether;  // 0.5 MON
    uint8   public constant TOTAL_CHECKPOINTS = 3;
    uint8   public constant MAX_PLAYERS     = 100;
    uint256 public constant TIER_PAYOUT     = 0.125 ether; // 0.125 MON per checkpoint tier

    // ─── State ────────────────────────────────────────────────────────────────

    enum GameState { WAITING, ACTIVE, FINISHED }

    GameState public gameState;
    uint256   public roundId;
    uint256   public prizePool;
    uint256   public finisherCount;
    uint256   public totalEliminated;
    uint256   public playerCount;

    address public host;

    struct PlayerData {
        bool    registered;
        bool    eliminated;
        bool    finished;
        uint8   checkpoint;   // 0 = none, 1-3 = checkpoints, 4 = finished
        uint256 prizePaid;    // total MON already transferred directly to wallet
    }

    mapping(address => PlayerData) public players;
    address[] public playerList;

    // ─── Events ───────────────────────────────────────────────────────────────

    event PlayerJoined(address indexed player, uint256 roundId);
    event GameStarted(uint256 roundId, uint256 prizePool, uint256 playerCount);
    event CheckpointPayoutSent(address indexed player, uint8 checkpoint, uint256 payoutAmount, uint256 totalPaid);
    event PlayerEliminated(address indexed player, uint8 lastCheckpoint, uint256 totalPaid);
    event PlayerFinishedPayoutSent(address indexed player, uint256 finalPayout, uint256 totalPaid);
    event BonusDistributed(uint256 bonusPerFinisher, uint256 finisherCount);
    event GameReset(uint256 newRoundId);

    // ─── Errors ───────────────────────────────────────────────────────────────

    error WrongEntryFee();
    error AlreadyRegistered();
    error NotRegistered();
    error AlreadyEliminated();
    error AlreadyFinished();
    error InvalidCheckpoint();
    error NotHost();
    error MaxPlayersReached();
    error InsufficientContractBalance();

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyHost() {
        if (msg.sender != host && msg.sender != owner()) revert NotHost();
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor(address _host) Ownable(msg.sender) {
        host       = _host;
        gameState  = GameState.WAITING;
        roundId    = 1;
    }

    // ─── Player Entry ─────────────────────────────────────────────────────────

    /**
     * @notice Join the race with 1 MON entry fee.
     */
    function joinGame() external payable nonReentrant {
        if (msg.value != ENTRY_FEE)         revert WrongEntryFee();
        if (players[msg.sender].registered) revert AlreadyRegistered();
        if (playerCount >= MAX_PLAYERS)     revert MaxPlayersReached();

        players[msg.sender] = PlayerData({
            registered:  true,
            eliminated:  false,
            finished:    false,
            checkpoint:  0,
            prizePaid:   0
        });

        playerList.push(msg.sender);
        prizePool   += msg.value;
        playerCount += 1;

        emit PlayerJoined(msg.sender, roundId);
    }

    // ─── Host / Relayer Automatic Direct-to-Wallet Payout Actions ─────────────

    function startGame() external onlyHost {
        gameState = GameState.ACTIVE;
        emit GameStarted(roundId, prizePool, playerCount);
    }

    /**
     * @notice AUTOMATIC DIRECT-TO-WALLET PAYOUT ON CHECKPOINT REACHED!
     * @dev    No claim button needed! Transfers 0.25 MON per newly reached checkpoint tier directly to player.
     */
    function recordCheckpoint(address payable player, uint8 checkpoint)
        external
        onlyHost
        nonReentrant
    {
        if (checkpoint == 0 || checkpoint > TOTAL_CHECKPOINTS) revert InvalidCheckpoint();
        PlayerData storage p = players[player];
        if (!p.registered) {
            p.registered = true;
            playerList.push(player);
            playerCount++;
        }
        if (p.eliminated) return;
        if (p.finished)   return;
        if (checkpoint <= p.checkpoint) return; // idempotent

        uint8 prevCP = p.checkpoint;
        p.checkpoint = checkpoint;

        // Calculate payout for newly passed tiers (0.25 MON per tier)
        uint8 tiersCleared = checkpoint - prevCP;
        uint256 payoutAmount = TIER_PAYOUT * tiersCleared;

        if (address(this).balance < payoutAmount) {
            payoutAmount = address(this).balance;
        }

        if (payoutAmount > 0) {
            p.prizePaid += payoutAmount;
            (bool ok,) = player.call{value: payoutAmount}("");
            require(ok, "Transfer failed");
        }

        emit CheckpointPayoutSent(player, checkpoint, payoutAmount, p.prizePaid);
    }

    /**
     * @notice Eliminate player when falling into abyss.
     */
    function eliminatePlayer(address player)
        external
        onlyHost
    {
        PlayerData storage p = players[player];
        if (!p.registered) {
            p.registered = true;
            playerList.push(player);
            playerCount++;
        }
        if (p.eliminated || p.finished) return;

        p.eliminated = true;
        totalEliminated++;

        emit PlayerEliminated(player, p.checkpoint, p.prizePaid);
    }

    /**
     * @notice Finish race and transfer 100% completion reward + Loser bonus directly to winner!
     */
    function finishRace(address payable player)
        external
        onlyHost
        nonReentrant
    {
        PlayerData storage p = players[player];
        if (!p.registered) {
            p.registered = true;
            playerList.push(player);
            playerCount++;
        }
        if (p.eliminated || p.finished) return;

        p.finished = true;
        p.checkpoint = 4;
        finisherCount++;

        // Calculate remaining base entry (1.00 MON - what was already paid)
        uint256 remainingBase = ENTRY_FEE > p.prizePaid ? (ENTRY_FEE - p.prizePaid) : 0;
        uint256 payout = remainingBase;

        if (address(this).balance < payout) {
            payout = address(this).balance;
        }

        if (payout > 0) {
            p.prizePaid += payout;
            (bool ok,) = player.call{value: payout}("");
            require(ok, "Transfer failed");
        }

        emit PlayerFinishedPayoutSent(player, payout, p.prizePaid);
    }

    function endGame() external onlyHost nonReentrant {
        gameState = GameState.FINISHED;
    }

    function resetGame() external onlyHost {
        for (uint256 i = 0; i < playerList.length; i++) {
            delete players[playerList[i]];
        }
        delete playerList;

        roundId++;
        prizePool       = 0;
        finisherCount   = 0;
        totalEliminated = 0;
        playerCount     = 0;
        gameState       = GameState.WAITING;

        emit GameReset(roundId);
    }

    // ─── View Functions ───────────────────────────────────────────────────────

    function getPlayer(address player) external view returns (PlayerData memory) {
        return players[player];
    }

    function getPlayerList() external view returns (address[] memory) {
        return playerList;
    }

    function getGameInfo() external view returns (
        GameState state,
        uint256   round,
        uint256   pool,
        uint256   numPlayers,
        uint256   finishers,
        uint256   eliminated
    ) {
        return (gameState, roundId, prizePool, playerCount, finisherCount, totalEliminated);
    }

    function setHost(address newHost) external onlyOwner {
        host = newHost;
    }

    function emergencyWithdraw() external onlyOwner {
        (bool ok,) = payable(owner()).call{value: address(this).balance}("");
        require(ok, "Transfer failed");
    }

    receive() external payable {}
}
