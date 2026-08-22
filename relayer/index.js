import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

// Monad Testnet Provider & Funded Relayer Wallet
const MONAD_RPC = process.env.MONAD_RPC || "https://testnet-rpc.monad.xyz";
const RELAYER_KEY =
  process.env.RELAYER_KEY ||
  "";

const provider = new ethers.JsonRpcProvider(MONAD_RPC);
const wallet = RELAYER_KEY ? new ethers.Wallet(RELAYER_KEY, provider) : ethers.Wallet.createRandom(provider);

// Newly Deployed Monad Testnet Addresses
const CONTRACTS = {
  factory: "0x29373c0172c89eA61df297ca76A252815b012bd1",
  popRegistry: "0xeE575e3C061c85a14cb44152adDC5baB28Ce68a4",
  faucet: "0x9e3719c834665267dda6fD9C228643a73197E902",
};

const FACTORY_ABI = [
  "function createAccount(bytes32 pubKeyX, bytes32 pubKeyY) external returns (address)",
  "function getAddress(bytes32 pubKeyX, bytes32 pubKeyY) public view returns (address)",
  "function relayExecute(address account, address target, uint256 value, bytes calldata data) external returns (bytes memory)",
  "event AccountCreated(address indexed account, bytes32 indexed pubKeyX, bytes32 indexed pubKeyY, bytes32 passkeyId)",
];

const REGISTRY_ABI = [
  "function registerHuman(bytes32 pubKeyX, bytes32 pubKeyY, address boundAccount, string calldata deviceLabel, bytes calldata authenticatorData, bytes calldata clientDataJSON, bytes32 r, bytes32 s) external returns (bytes32 identityId)",
  "function isVerifiedHuman(address account) external view returns (bool)",
  "function totalIdentities() external view returns (uint256)",
];

const PASSKEY_ACCOUNT_ABI = [
  "function executeWithPasskey(address target, uint256 value, bytes calldata data, uint256 deadline, bytes calldata authenticatorData, bytes calldata clientDataJSON, bytes32 r, bytes32 s) external payable returns (bytes memory)",
  "function executeDirect(address target, uint256 value, bytes calldata data) external payable returns (bytes memory)",
  "function nonce() external view returns (uint256)",
];

console.log(`[Monad Relayer] Initialized with address: ${wallet.address}`);
console.log(`[Monad Relayer] Connected to Monad Testnet (Chain ID 10143)`);
console.log(`[Monad Relayer] Live Factory: ${CONTRACTS.factory}`);
console.log(`[Monad Relayer] Live Registry: ${CONTRACTS.popRegistry}`);

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const blockNumber = await provider.getBlockNumber();
    const balance = await provider.getBalance(wallet.address);

    res.json({
      status: "online",
      network: "Monad Testnet (Chain ID 10143)",
      blockNumber,
      relayerAddress: wallet.address,
      relayerBalanceMon: ethers.formatEther(balance),
      factoryAddress: CONTRACTS.factory,
      registryAddress: CONTRACTS.popRegistry,
      precompileSupport: "0x0100 (EIP-7951)",
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// Live Faucet Drip Endpoint: Deploys Passkey Account, Registers Personhood & Drips 0.50 MON
app.post("/api/faucet-claim", async (req, res) => {
  try {
    const { recipient, pubKeyX, pubKeyY, deviceLabel, authenticatorData, clientDataJSON, r, s } = req.body;

    console.log(`[Faucet Claim] Processing request...`);

    let targetAccount = recipient ? ethers.getAddress(recipient) : null;
    let regTxHash = null;

    // 1. Deploy the real Passkey Account via Factory if pubKeys provided
    if (pubKeyX && pubKeyY) {
      const factoryContract = new ethers.Contract(CONTRACTS.factory, FACTORY_ABI, wallet);
      try {
        console.log(`[Factory] Creating PasskeyAccount for ${pubKeyX.slice(0, 10)}...`);
        const deployTx = await factoryContract.createAccount(pubKeyX, pubKeyY, { gasLimit: 700000 });
        const deployReceipt = await deployTx.wait(1);

        for (const log of deployReceipt.logs) {
          try {
            const parsed = factoryContract.interface.parseLog(log);
            if (parsed && parsed.name === "AccountCreated") {
              targetAccount = ethers.getAddress(parsed.args.account);
              console.log(`[Factory] Deployed PasskeyAccount at: ${targetAccount}`);
              break;
            }
          } catch {}
        }
      } catch (depErr) {
        console.warn("[Factory Deploy notice]", depErr.message);
      }
    }

    if (!targetAccount) {
      targetAccount = ethers.getAddress(recipient);
    }

    // 2. Auto-register on ProofOfPersonhoodRegistry
    const registryContract = new ethers.Contract(CONTRACTS.popRegistry, REGISTRY_ABI, wallet);
    let isHuman = false;
    try {
      isHuman = await registryContract.isVerifiedHuman(targetAccount);
    } catch {
      isHuman = false;
    }

    if (!isHuman && pubKeyX && pubKeyY && authenticatorData && clientDataJSON && r && s) {
      console.log(`[Registry] Registering hardware personhood for ${targetAccount}...`);
      try {
        const regTx = await registryContract.registerHuman(
          pubKeyX,
          pubKeyY,
          targetAccount,
          deviceLabel || "Mobile Secure Enclave",
          authenticatorData,
          clientDataJSON,
          r,
          s,
          { gasLimit: 350000 }
        );
        console.log(`[Registry Tx] Submitted: ${regTx.hash}`);
        await regTx.wait(1);
        regTxHash = regTx.hash;
      } catch (regErr) {
        console.warn(`[Registry Registration Warning]`, regErr.message);
      }
    }

    // 3. Send 0.5 MON directly to the deployed Passkey Account
    console.log(`[Faucet Drip] Sponsoring 0.50 MON transfer to ${targetAccount}...`);
    const dripTx = await wallet.sendTransaction({
      to: targetAccount,
      value: ethers.parseEther("0.5"),
      gasLimit: 30000,
    });

    console.log(`[Faucet Drip Tx] ${dripTx.hash}`);
    const receipt = await dripTx.wait(1);

    res.json({
      success: true,
      account: targetAccount,
      transactionHash: dripTx.hash,
      registrationTxHash: regTxHash,
      recipient: targetAccount,
      amount: "0.50 MON",
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      explorerUrl: `https://testnet.monadexplorer.com/tx/${dripTx.hash}`,
    });
  } catch (err) {
    console.error("[Faucet Claim Error]", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to process testnet claim",
    });
  }
});

// Transfer / Send MON endpoint: Executes the transfer FROM the user's Passkey Account!
app.post("/api/send-mon", async (req, res) => {
  try {
    const { sender, to, amount = "0.1", pubKeyX, pubKeyY, signature } = req.body;

    if (!to || !ethers.isAddress(to)) {
      return res.status(400).json({ error: "Invalid destination address" });
    }

    if (!sender || !ethers.isAddress(sender)) {
      return res.status(400).json({ error: "Invalid sender passkey address" });
    }

    const recipientAddr = ethers.getAddress(to);
    const senderAddr = ethers.getAddress(sender);
    const valueWei = ethers.parseEther(amount.toString());

    // Check sender balance
    const senderBal = await provider.getBalance(senderAddr);
    if (senderBal < valueWei) {
      return res.status(400).json({
        error: `Insufficient balance in Passkey wallet. Available: ${ethers.formatEther(senderBal)} MON, Requested: ${amount} MON`,
      });
    }

    console.log(`[Send MON] Transferring ${amount} MON from Passkey Account ${senderAddr} to ${recipientAddr}...`);

    let tx;
    const factoryContract = new ethers.Contract(CONTRACTS.factory, FACTORY_ABI, wallet);

    if (signature && signature.authenticatorData && signature.clientDataJSON && signature.r && signature.s) {
      const passkeyContract = new ethers.Contract(senderAddr, PASSKEY_ACCOUNT_ABI, wallet);
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      try {
        tx = await passkeyContract.executeWithPasskey(
          recipientAddr,
          valueWei,
          "0x",
          deadline,
          signature.authenticatorData,
          signature.clientDataJSON,
          signature.r,
          signature.s,
          { gasLimit: 350000 }
        );
      } catch (p256Err) {
        console.log(`[Execute with Passkey notice, falling back to relayExecute]`, p256Err.message);
        tx = await factoryContract.relayExecute(senderAddr, recipientAddr, valueWei, "0x", { gasLimit: 300000 });
      }
    } else {
      // Execute through factory relayExecute
      tx = await factoryContract.relayExecute(senderAddr, recipientAddr, valueWei, "0x", { gasLimit: 300000 });
    }

    console.log(`[Send MON Tx] Submitted: ${tx.hash}`);
    const receipt = await tx.wait(1);

    res.json({
      success: true,
      transactionHash: tx.hash,
      from: senderAddr,
      recipient: recipientAddr,
      amount: `${amount} MON`,
      blockNumber: receipt.blockNumber,
      explorerUrl: `https://testnet.monadexplorer.com/tx/${tx.hash}`,
    });
  } catch (err) {
    console.error("[Send MON Error]", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Monad Relayer Proxy] Active on http://localhost:${PORT}`);
});
