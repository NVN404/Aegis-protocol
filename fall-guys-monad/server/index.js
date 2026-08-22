const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createWalletClient, createPublicClient, http: viemHttp, parseAbi, parseEther } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Monad Testnet Configuration
const MONAD_CHAIN = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: { default: { http: ['https://testnet-rpc.monad.xyz'] } },
};

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x129D936cfbBe50FA0Ce7e61b36B33A35d8D08DCa';
const HOST_PRIVATE_KEY = process.env.HOST_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001';

const account = privateKeyToAccount(HOST_PRIVATE_KEY);
const publicClient = createPublicClient({
  chain: MONAD_CHAIN,
  transport: viemHttp('https://testnet-rpc.monad.xyz'),
});
const walletClient = createWalletClient({
  account,
  chain: MONAD_CHAIN,
  transport: viemHttp('https://testnet-rpc.monad.xyz'),
});

console.log(`[⚡ Monad Blitz Relayer] Initialized for Host: ${account.address}`);
console.log(`[⚡ Monad Blitz Relayer] Target Contract: ${CONTRACT_ADDRESS}`);

const ARENA_ABI = parseAbi([
  'function startGame() external',
  'function recordCheckpoint(address player, uint8 checkpoint) external',
  'function eliminatePlayer(address player) external',
  'function finishRace(address player) external',
  'function endGame() external',
  'function resetGame() external',
]);

// ─── Instant 1-Tap Passkey Faucet Auto-Funder ──────────────────────────────
app.post('/api/faucet-claim', async (req, res) => {
  const { recipient, deviceLabel } = req.body;
  if (!recipient || !recipient.startsWith('0x')) {
    return res.status(400).json({ error: 'Invalid recipient address' });
  }

  try {
    console.log(`[🪪 Passkey Faucet] Sponsoring starter gas 0.5 MON to ${recipient} (${deviceLabel || 'Enclave'})...`);
    const hash = await walletClient.sendTransaction({
      to: recipient,
      value: parseEther('0.5'),
    });
    console.log(`[🪪 Passkey Faucet Confirmed] Tx Hash: ${hash}`);
    return res.json({ success: true, hash });
  } catch (err) {
    console.warn(`[Passkey Faucet Note]:`, err.shortMessage || err.message);
    return res.json({ success: false, error: err.message });
  }
});

// Game state
const gameState = {
  players: {},
  gamePhase: 'WAITING',
  hostId: null,
};

// Safe On-Chain Tx Execution Wrapper
async function sendOnChainTx(functionName, args = []) {
  try {
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: ARENA_ABI,
      functionName,
      args,
    });
    console.log(`[⚡ On-Chain Monad Direct Payout Tx] ${functionName} confirmed! Hash: ${hash}`);
    io.emit('onchain:tx', {
      functionName,
      hash,
      explorerUrl: `https://testnet.monadexplorer.com/tx/${hash}`,
      timestamp: Date.now(),
    });
    return hash;
  } catch (err) {
    console.warn(`[On-Chain Note] ${functionName}:`, err.shortMessage || err.message);
    return null;
  }
}

io.on('connection', (socket) => {
  console.log(`[+] Socket connected: ${socket.id}`);

  socket.emit('game:state', {
    players: gameState.players,
    gamePhase: gameState.gamePhase,
    contractAddress: CONTRACT_ADDRESS,
  });

  socket.on('player:join', ({ address, name, color }) => {
    const cleanAddress = (address && address.startsWith('0x')) ? address : `0x${socket.id.slice(0, 40).padEnd(40, '0')}`;
    gameState.players[cleanAddress] = {
      address: cleanAddress,
      name: name || 'Runner',
      color: color || '#836EF9',
      x: 0, y: 0.5, z: -3,
      checkpoint: 0,
      eliminated: false,
      finished: false,
      socketId: socket.id,
    };
    socket.data.address = cleanAddress;
    console.log(`[join] ${name} (${cleanAddress})`);

    io.emit('players:update', gameState.players);
    io.emit('game:phase', gameState.gamePhase);
  });

  socket.on('player:position', ({ address, x, y, z, ry, animState }) => {
    if (gameState.players[address]) {
      gameState.players[address].x = x;
      gameState.players[address].y = y;
      gameState.players[address].z = z;
      gameState.players[address].ry = ry;
      gameState.players[address].animState = animState;
    }
    socket.broadcast.emit('player:moved', { address, x, y, z, ry, animState });
  });

  // Host starts game
  socket.on('host:start', async () => {
    gameState.gamePhase = 'COUNTDOWN';
    io.emit('game:phase', 'COUNTDOWN');

    sendOnChainTx('startGame');

    let count = 3;
    const interval = setInterval(() => {
      io.emit('game:countdown', count);
      count--;
      if (count < 0) {
        clearInterval(interval);
        gameState.gamePhase = 'ACTIVE';
        io.emit('game:phase', 'ACTIVE');
        io.emit('game:started', { timestamp: Date.now() });
      }
    }, 1000);
  });

  // Checkpoint Trigger -> Broadcasts on-chain recordCheckpoint tx + AUTOMATIC MON PAYOUT TO WALLET!
  socket.on('host:checkpoint', async ({ address, checkpoint }) => {
    if (gameState.players[address]) {
      gameState.players[address].checkpoint = checkpoint;
      io.emit('player:checkpoint', { address, checkpoint });
      io.emit('players:update', gameState.players);

      if (address && address.startsWith('0x') && address.length === 42) {
        sendOnChainTx('recordCheckpoint', [address, checkpoint]);
      }
    }
  });

  // Elimination Trigger -> Broadcasts on-chain eliminatePlayer tx!
  socket.on('host:eliminate', async ({ address }) => {
    if (gameState.players[address]) {
      gameState.players[address].eliminated = true;
      io.emit('player:eliminated', { address });
      io.emit('players:update', gameState.players);

      if (address && address.startsWith('0x') && address.length === 42) {
        sendOnChainTx('eliminatePlayer', [address]);
      }
    }
  });

  // Finish Race Trigger -> Broadcasts on-chain finishRace tx + AUTOMATIC WINNER PAYOUT TO WALLET!
  socket.on('host:finish', async ({ address }) => {
    if (gameState.players[address]) {
      gameState.players[address].finished = true;
      gameState.players[address].checkpoint = 4;
      io.emit('player:finished', { address });
      io.emit('players:update', gameState.players);

      if (address && address.startsWith('0x') && address.length === 42) {
        sendOnChainTx('finishRace', [address]);
      }
    }
  });

  socket.on('disconnect', () => {
    const address = socket.data.address;
    if (address && gameState.players[address]) {
      delete gameState.players[address];
      io.emit('players:update', gameState.players);
    }
    console.log(`[-] Socket disconnected: ${socket.id}`);
  });
});

app.get('/health', (_, res) => res.json({
  status: 'ok',
  network: 'Monad Testnet (10143)',
  contract: CONTRACT_ADDRESS,
  host: account.address,
}));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🎮 Fall Guys Monad Relayer Server running on port ${PORT}`);
});
