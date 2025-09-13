import { network } from "hardhat";
import { parseEther, formatEther } from "viem";

async function main() {
  console.log("🚀 Deploying SneakProtocol to", network.config.chainId);
  
  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();
  
  console.log("👤 Deploying with account:", deployer.account.address);
  
  // Check deployer balance
  const publicClient = await viem.getPublicClient();
  const balance = await publicClient.getBalance({ address: deployer.account.address });
  console.log("💰 Account balance:", formatEther(balance), "ETH");
  
  if (balance < parseEther("0.01")) {
    console.log("⚠️  Warning: Low balance, deployment may fail");
  }

  console.log("\n📦 Deploying MockERC20 (USDC)...");
  const mockUSDC = await viem.deployContract("MockERC20", ["Mock USDC", "MUSDC", 18]);
  console.log("✅ MockERC20 deployed at:", mockUSDC.address);

  console.log("\n📦 Deploying SneakProtocol...");
  const sneakProtocol = await viem.deployContract("SneakProtocol", [mockUSDC.address]);
  console.log("✅ SneakProtocol deployed at:", sneakProtocol.address);

  // Mint initial tokens for deployer
  console.log("\n💸 Minting initial USDC for deployer...");
  const mintAmount = parseEther("1000000"); // 1M USDC
  await mockUSDC.write.mint([deployer.account.address, mintAmount]);
  console.log("✅ Minted", formatEther(mintAmount), "USDC");

  // Approve protocol to spend tokens
  console.log("\n🔓 Approving SneakProtocol to spend USDC...");
  await mockUSDC.write.approve([sneakProtocol.address, mintAmount]);
  console.log("✅ Approved spending");

  // Create a demo opportunity
  console.log("\n🎯 Creating demo opportunity...");
  const demoLiquidity = parseEther("10000"); // $10K
  await sneakProtocol.write.createOpportunity([
    "Will Ethereum reach $5,000 by 2024?",
    "ipfs://QmYourHashHere",
    demoLiquidity
  ]);
  console.log("✅ Demo opportunity created with", formatEther(demoLiquidity), "USDC liquidity");

  // Get the created opportunity
  const opportunity = await sneakProtocol.read.getOpportunity([1n]);
  console.log("📊 Opportunity details:");
  console.log("   Name:", opportunity.name);
  console.log("   YES liquidity:", formatEther(opportunity.liquidityYes), "USDC");
  console.log("   NO liquidity:", formatEther(opportunity.liquidityNo), "USDC");
  console.log("   YES price: $" + (Number(opportunity.priceYes) / 100).toFixed(2));
  console.log("   NO price: $" + (Number(opportunity.priceNo) / 100).toFixed(2));

  console.log("\n🎉 Deployment Summary:");
  console.log("=".repeat(50));
  console.log("MockERC20 (USDC):", mockUSDC.address);
  console.log("SneakProtocol:   ", sneakProtocol.address);
  console.log("Network:         ", network.config.chainId);
  console.log("Deployer:        ", deployer.account.address);
  console.log("=".repeat(50));

  // Save deployment info
  const deploymentInfo = {
    network: network.config.chainId,
    mockUSDC: mockUSDC.address,
    sneakProtocol: sneakProtocol.address,
    deployer: deployer.account.address,
    deployedAt: new Date().toISOString()
  };

  console.log("\n💾 Deployment info saved to console");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  return deploymentInfo;
}

main()
  .then((info) => {
    console.log("\n✅ Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
