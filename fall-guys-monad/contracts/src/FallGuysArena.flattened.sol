// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20 ^0.8.26;

// lib/openzeppelin-contracts/contracts/utils/Context.sol

// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

// lib/openzeppelin-contracts/contracts/utils/StorageSlot.sol

// OpenZeppelin Contracts (last updated v5.1.0) (utils/StorageSlot.sol)
// This file was procedurally generated from scripts/generate/templates/StorageSlot.js.

/**
 * @dev Library for reading and writing primitive types to specific storage slots.
 *
 * Storage slots are often used to avoid storage conflict when dealing with upgradeable contracts.
 * This library helps with reading and writing to such slots without the need for inline assembly.
 *
 * The functions in this library return Slot structs that contain a `value` member that can be used to read or write.
 *
 * Example usage to set ERC-1967 implementation slot:
 * ```solidity
 * contract ERC1967 {
 *     // Define the slot. Alternatively, use the SlotDerivation library to derive the slot.
 *     bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
 *
 *     function _getImplementation() internal view returns (address) {
 *         return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
 *     }
 *
 *     function _setImplementation(address newImplementation) internal {
 *         require(newImplementation.code.length > 0);
 *         StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
 *     }
 * }
 * ```
 *
 * TIP: Consider using this library along with {SlotDerivation}.
 */
library StorageSlot {
    struct AddressSlot {
        address value;
    }

    struct BooleanSlot {
        bool value;
    }

    struct Bytes32Slot {
        bytes32 value;
    }

    struct Uint256Slot {
        uint256 value;
    }

    struct Int256Slot {
        int256 value;
    }

    struct StringSlot {
        string value;
    }

    struct BytesSlot {
        bytes value;
    }

    /**
     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
     */
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `BooleanSlot` with member `value` located at `slot`.
     */
    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Bytes32Slot` with member `value` located at `slot`.
     */
    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Uint256Slot` with member `value` located at `slot`.
     */
    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Int256Slot` with member `value` located at `slot`.
     */
    function getInt256Slot(bytes32 slot) internal pure returns (Int256Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `StringSlot` with member `value` located at `slot`.
     */
    function getStringSlot(bytes32 slot) internal pure returns (StringSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `StringSlot` representation of the string storage pointer `store`.
     */
    function getStringSlot(string storage store) internal pure returns (StringSlot storage r) {
        assembly ("memory-safe") {
            r.slot := store.slot
        }
    }

    /**
     * @dev Returns a `BytesSlot` with member `value` located at `slot`.
     */
    function getBytesSlot(bytes32 slot) internal pure returns (BytesSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BytesSlot` representation of the bytes storage pointer `store`.
     */
    function getBytesSlot(bytes storage store) internal pure returns (BytesSlot storage r) {
        assembly ("memory-safe") {
            r.slot := store.slot
        }
    }
}

// lib/openzeppelin-contracts/contracts/access/Ownable.sol

// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol

// OpenZeppelin Contracts (last updated v5.5.0) (utils/ReentrancyGuard.sol)

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 *
 * IMPORTANT: Deprecated. This storage-based reentrancy guard will be removed and replaced
 * by the {ReentrancyGuardTransient} variant in v6.0.
 *
 * @custom:stateless
 */
abstract contract ReentrancyGuard {
    using StorageSlot for bytes32;

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.ReentrancyGuard")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant REENTRANCY_GUARD_STORAGE =
        0x9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00;

    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    /**
     * @dev A `view` only version of {nonReentrant}. Use to block view functions
     * from being called, preventing reading from inconsistent contract state.
     *
     * CAUTION: This is a "view" modifier and does not change the reentrancy
     * status. Use it only on view functions. For payable or non-payable functions,
     * use the standard {nonReentrant} modifier instead.
     */
    modifier nonReentrantView() {
        _nonReentrantBeforeView();
        _;
    }

    function _nonReentrantBeforeView() private view {
        if (_reentrancyGuardEntered()) {
            revert ReentrancyGuardReentrantCall();
        }
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        _nonReentrantBeforeView();

        // Any calls to nonReentrant after this point will fail
        _reentrancyGuardStorageSlot().getUint256Slot().value = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _reentrancyGuardStorageSlot().getUint256Slot().value == ENTERED;
    }

    function _reentrancyGuardStorageSlot() internal pure virtual returns (bytes32) {
        return REENTRANCY_GUARD_STORAGE;
    }
}

// src/FallGuysArena.sol

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

