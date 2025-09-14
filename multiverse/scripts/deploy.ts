import { network } from "hardhat";
import { parseEther, formatEther } from "viem";
import "dotenv/config";

async function main() {
  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  const chainId = publicClient.chain?.id ?? 0;

  console.log("� Deploying SneakProtocol to", chainId);
  
  console.log("�👤 Deploying with account:", deployer.account.address);
  
  // Check deployer balance
  const balance = await publicClient.getBalance({ address: deployer.account.address });
  console.log("💰 Account balance:", formatEther(balance), "ETH");
  
  if (balance < parseEther("0.01")) {
    console.log("⚠️  Warning: Low balance, deployment may fail");
  }

  // Decide base token: use EXISTING_BASE_TOKEN on mainnet if provided, otherwise deploy MockERC20
  let baseTokenAddress: `0x${string}`;
  let mockUSDC: any = null;
  const isAvalancheMainnet = chainId === 43114;

  if (isAvalancheMainnet && process.env.EXISTING_BASE_TOKEN) {
    baseTokenAddress = process.env.EXISTING_BASE_TOKEN as `0x${string}`;
    console.log("\n🪙 Using existing base token:", baseTokenAddress);
  } else {
    console.log("\n📦 Deploying MockERC20 (USDC)...");
    mockUSDC = await viem.deployContract("MockERC20", ["Mock USDC", "MUSDC", 18]);
    baseTokenAddress = mockUSDC.address;
    console.log("✅ MockERC20 deployed at:", baseTokenAddress);
  }

  console.log("\n📦 Deploying SneakProtocol...");
  const sneakProtocol = await viem.deployContract("SneakProtocol", [baseTokenAddress]);
  console.log("✅ SneakProtocol deployed at:", sneakProtocol.address);

  // Mint initial tokens for deployer
  if (mockUSDC) {
    console.log("\n💸 Minting initial USDC for deployer...");
    const mintAmount = parseEther("1000000"); // 1M USDC
    await mockUSDC.write.mint([deployer.account.address, mintAmount]);
    console.log("✅ Minted", formatEther(mintAmount), "USDC");

    // Approve protocol to spend tokens
    console.log("\n🔓 Approving SneakProtocol to spend USDC...");
    await mockUSDC.write.approve([sneakProtocol.address, mintAmount]);
    console.log("✅ Approved spending");
  } else {
    console.log("\nℹ️ Skipping mint/approve: using existing base token.");
  }

  // Create a demo opportunity
  console.log("\n🎯 Creating demo opportunity...");
  if (mockUSDC) {
    const demoLiquidity = parseEther("10000"); // $10K
    await sneakProtocol.write.createOpportunity([
      "Will Ethereum reach $5,000 by 2024?",
      "ipfs://QmYourHashHere",
      demoLiquidity
    ]);
    console.log("✅ Demo opportunity created with", formatEther(demoLiquidity), "USDC liquidity");
  } else {
    console.log("ℹ️ Skipping demo opportunity creation on mainnet.");
  }

  // Get the created opportunity
  const opportunity = await sneakProtocol.read.getOpportunity([1n]) as {
    name: string;
    liquidityYes: bigint;
    liquidityNo: bigint;
    priceYes: bigint;
    priceNo: bigint;
  };
  console.log("📊 Opportunity details:");
  console.log("   Name:", opportunity.name);
  console.log("   YES liquidity:", formatEther(opportunity.liquidityYes), "USDC");
  console.log("   NO liquidity:", formatEther(opportunity.liquidityNo), "USDC");
  console.log("   YES price: $" + (Number(opportunity.priceYes) / 100).toFixed(2));
  console.log("   NO price: $" + (Number(opportunity.priceNo) / 100).toFixed(2));

  console.log("\n🎉 Deployment Summary:");
  console.log("=".repeat(50));
  console.log("Base Token:", baseTokenAddress);
  console.log("SneakProtocol:   ", sneakProtocol.address);
  console.log("Network:         ", chainId);
  console.log("Deployer:        ", deployer.account.address);
  console.log("=".repeat(50));

  // Save deployment info
  const deploymentInfo = {
  network: chainId,
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
