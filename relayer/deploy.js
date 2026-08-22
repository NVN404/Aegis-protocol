import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RPC_URL = process.env.MONAD_RPC || "https://testnet-rpc.monad.xyz";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

async function main() {
  console.log("Connecting to Monad Testnet:", RPC_URL);
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const balance = await provider.getBalance(wallet.address);
  console.log("Deployer Address:", wallet.address);
  console.log("Deployer Balance:", ethers.formatEther(balance), "MON");

  const contractsDir = path.resolve(__dirname, "../contracts/out");

  const factoryArtifact = JSON.parse(
    fs.readFileSync(path.join(contractsDir, "PasskeyAccountFactory.sol/PasskeyAccountFactory.json"), "utf8")
  );
  const registryArtifact = JSON.parse(
    fs.readFileSync(path.join(contractsDir, "ProofOfPersonhoodRegistry.sol/ProofOfPersonhoodRegistry.json"), "utf8")
  );
  const faucetArtifact = JSON.parse(
    fs.readFileSync(path.join(contractsDir, "SybilResistantFaucet.sol/SybilResistantFaucet.json"), "utf8")
  );

  console.log("\n1. Deploying PasskeyAccountFactory...");
  const Factory = new ethers.ContractFactory(factoryArtifact.abi, factoryArtifact.bytecode.object, wallet);
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("PasskeyAccountFactory deployed at:", factoryAddress);

  console.log("\n2. Deploying ProofOfPersonhoodRegistry...");
  const Registry = new ethers.ContractFactory(registryArtifact.abi, registryArtifact.bytecode.object, wallet);
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("ProofOfPersonhoodRegistry deployed at:", registryAddress);

  console.log("\n3. Deploying SybilResistantFaucet (funded with 1.0 MON)...");
  const Faucet = new ethers.ContractFactory(faucetArtifact.abi, faucetArtifact.bytecode.object, wallet);
  const faucet = await Faucet.deploy(registryAddress, { value: ethers.parseEther("1.0") });
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log("SybilResistantFaucet deployed at:", faucetAddress);

  const result = {
    factory: factoryAddress,
    popRegistry: registryAddress,
    faucet: faucetAddress,
  };
  fs.writeFileSync(path.join(__dirname, "deployed-contracts.json"), JSON.stringify(result, null, 2));
  console.log("\nSaved new contracts to deployed-contracts.json:", result);
}

main().catch(console.error);
