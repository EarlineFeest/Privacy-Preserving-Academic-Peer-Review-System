const { ethers } = require("hardhat");

/**
 * @title Deployment Script
 * @notice Deploys the ExampleContract to the specified network
 */
async function main() {
  console.log("Starting deployment...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy ExampleContract
  console.log("Deploying ExampleContract...");
  const ExampleContract = await ethers.getContractFactory("ExampleContract");
  const exampleContract = await ExampleContract.deploy();
  await exampleContract.waitForDeployment();

  const contractAddress = await exampleContract.getAddress();
  console.log("ExampleContract deployed to:", contractAddress);

  // Display network information
  const network = await ethers.provider.getNetwork();
  console.log("\nDeployment Summary:");
  console.log("==================");
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("Contract Address:", contractAddress);
  console.log("Deployer:", deployer.address);

  // Verification instructions
  if (network.chainId === 11155111n) { // Sepolia
    console.log("\nTo verify on Etherscan:");
    console.log(`npx hardhat verify --network sepolia ${contractAddress}`);
  }

  console.log("\nDeployment complete! ✅");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
