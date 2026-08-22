import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RPC_URL = process.env.MONAD_RPC || "https://testnet-rpc.monad.xyz";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

async function main() {
  console.log("Connecting to Monad Testnet RPC:", RPC_URL);
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const balance = await provider.getBalance(wallet.address);
  console.log("Deployer Address:", wallet.address);
  console.log("Deployer Balance:", ethers.formatEther(balance), "MON");

  // Read Foundry build artifacts
  const factoryArtifact = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "out/PasskeyAccountFactory.sol/PasskeyAccountFactory.json"), "utf8")
  );
  const popRegistryArtifact = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "out/ProofOfPersonhoodRegistry.sol/ProofOfPersonhoodRegistry.json"), "utf8")
  );
  const faucetArtifact = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "out/SybilResistantFaucet.sol/SybilResistantFaucet.json"), "utf8")
  );

  console.log("\n1. Deploying PasskeyAccountFactory...");
  const FactoryContract = new ethers.ContractFactory(factoryArtifact.abi, factoryArtifact.bytecode.object, wallet);
  const factory = await FactoryContract.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("PasskeyAccountFactory deployed at:", factoryAddress);

  console.log("\n2. Deploying ProofOfPersonhoodRegistry...");
  const RegistryContract = new ethers.ContractFactory(popRegistryArtifact.abi, popRegistryArtifact.bytecode.object, wallet);
  const registry = await RegistryContract.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("ProofOfPersonhoodRegistry deployed at:", registryAddress);

  console.log("\n3. Deploying SybilResistantFaucet (funded with 2.0 MON)...");
  const FaucetContract = new ethers.ContractFactory(faucetArtifact.abi, faucetArtifact.bytecode.object, wallet);
  const faucet = await FaucetContract.deploy(registryAddress, { value: ethers.parseEther("2.0") });
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log("SybilResistantFaucet deployed at:", faucetAddress);

  const deploymentData = {
    network: "Monad Testnet",
    chainId: 10143,
    deployer: wallet.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      PasskeyAccountFactory: factoryAddress,
      ProofOfPersonhoodRegistry: registryAddress,
      SybilResistantFaucet: faucetAddress,
    },
  };

  fs.writeFileSync(
    path.resolve(__dirname, "deployment.json"),
    JSON.stringify(deploymentData, null, 2)
  );

  console.log("\n==========================================");
  console.log("🎉 MONAD PASSKEY SUITE DEPLOYED TO TESTNET!");
  console.log("Saved to:", path.resolve(__dirname, "deployment.json"));
  console.log("==========================================\n");
}

main().catch(console.error);
