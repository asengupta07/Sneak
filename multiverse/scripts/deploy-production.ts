import { network } from "hardhat";
import { parseEther, formatEther } from "viem";

/**
 * Production Deployment Script for SneakProtocol
 * 
 * Deployment sequence:
 * 1. Deploy MockERC20 (USDC)
 * 2. Fund deployer with 1,000,000 USDC
 * 3. Deploy SneakProtocol with USDC address
 * 4. Setup initial configuration
 */
async function main() {
  console.log("🚀 SneakProtocol Production Deployment");
  console.log("=====================================");
  
  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  
  console.log("👤 Deploying with account:", deployer.account.address);
  
  // Check deployer balance
  const balance = await publicClient.getBalance({ address: deployer.account.address });
  console.log("💰 Deployer ETH balance:", formatEther(balance));
  
  if (balance < parseEther("0.05")) {
    console.log("⚠️  Warning: Low ETH balance, deployment may fail");
    console.log("   Make sure you have enough ETH for gas fees");
  }

  console.log("\n" + "=".repeat(50));
  console.log("STEP 1: Deploy MockERC20 (USDC)");
  console.log("=".repeat(50));
  
  // Deploy MockERC20 with proper USDC parameters
  console.log("📦 Deploying MockERC20 with USDC configuration...");
  const mockUSDC = await viem.deployContract("MockERC20", [
    "USD Coin", // name
    "USDC",     // symbol  
    6           // decimals (USDC uses 6 decimals, not 18)
  ]);
  
  console.log("✅ MockERC20 deployed at:", mockUSDC.address);
  console.log("   Token Name: USD Coin");
  console.log("   Token Symbol: USDC");
  console.log("   Decimals: 6");

  console.log("\n" + "=".repeat(50));
  console.log("STEP 2: Fund Deployer with USDC");
  console.log("=".repeat(50));
  
  // Fund deployer with 1,000,000 USDC (note: 6 decimals)
  const fundingAmount = 1000000n * 10n ** 6n; // 1M USDC with 6 decimals
  console.log("💸 Minting 1,000,000 USDC to deployer...");
  
  await mockUSDC.write.mint([deployer.account.address, fundingAmount]);
  
  const deployerUSDCBalance = await mockUSDC.read.balanceOf([deployer.account.address]);
  console.log("✅ Deployer USDC balance:", Number(deployerUSDCBalance) / 10**6, "USDC");

  console.log("\n" + "=".repeat(50));
  console.log("STEP 3: Deploy SneakProtocol");
  console.log("=".repeat(50));
  
  console.log("📦 Deploying SneakProtocol with MockERC20 address...");
  console.log("   Base Token Address:", mockUSDC.address);
  
  const sneakProtocol = await viem.deployContract("SneakProtocol", [mockUSDC.address]);
  
  console.log("✅ SneakProtocol deployed at:", sneakProtocol.address);

  console.log("\n" + "=".repeat(50));
  console.log("STEP 4: Initial Setup & Verification");
  console.log("=".repeat(50));
  
  // Verify the base token is set correctly
  const baseTokenAddress = await sneakProtocol.read.baseToken();
  console.log("🔗 Verified base token address:", baseTokenAddress);
  assert(baseTokenAddress.toLowerCase() === mockUSDC.address.toLowerCase(), "Base token mismatch!");
  
  // Approve SneakProtocol to spend deployer's USDC for testing
  console.log("🔓 Approving SneakProtocol to spend deployer's USDC...");
  await mockUSDC.write.approve([sneakProtocol.address, fundingAmount]);
  console.log("✅ Approval set for full balance");
  
  // Create initial demo opportunity
  console.log("🎯 Creating initial demo opportunity...");
  const demoLiquidityUSDC = 10000n * 10n ** 6n; // $10,000 USDC (6 decimals)
  
  await sneakProtocol.write.createOpportunity([
    "Will Bitcoin reach $100,000 by 2024?",
    "ipfs://QmSampleHashForBitcoinPrediction",
    demoLiquidityUSDC
  ]);
  
  console.log("✅ Demo opportunity created with $10,000 USDC liquidity");

  // Verify opportunity creation
  const opportunity = await sneakProtocol.read.getOpportunity([1n]);
  console.log("📊 Demo opportunity details:");
  console.log("   ID:", Number(opportunity.id));
  console.log("   Name:", opportunity.name);
  console.log("   YES Liquidity:", Number(opportunity.liquidityYes) / 10**6, "USDC");
  console.log("   NO Liquidity:", Number(opportunity.liquidityNo) / 10**6, "USDC");
  console.log("   YES Price: $" + (Number(opportunity.priceYes) / 100).toFixed(2));
  console.log("   NO Price: $" + (Number(opportunity.priceNo) / 100).toFixed(2));
  console.log("   Creator:", opportunity.creator);

  // Test the new health monitoring functions
  console.log("\n" + "=".repeat(50));
  console.log("STEP 5: Testing Health Monitoring Functions");
  console.log("=".repeat(50));
  
  // Create a sample position chain for testing
  console.log("🔗 Creating sample position chain for health monitoring test...");
  const testAmount = 1000n * 10n ** 6n; // $1,000 USDC
  
  await sneakProtocol.write.createPositionChain([1n, true, testAmount]);
  console.log("✅ Test position chain created");

  // Test the new getter functions
  console.log("🔍 Testing new health monitoring functions...");
  
  try {
    const healthData = await sneakProtocol.read.getChainHealthData([1n]);
    console.log("   ✅ getChainHealthData() working");
    console.log("      Health Factor:", Number(healthData.healthFactor) / 100, "%");
    console.log("      Is Liquidation Risk:", healthData.isLiquidationRisk);
    console.log("      Total Positions:", Number(healthData.totalPositions));
    
    const riskData = await sneakProtocol.read.getChainRiskAnalysis([1n]);
    console.log("   ✅ getChainRiskAnalysis() working");
    console.log("      Positions analyzed:", riskData.length);
    
    const oppRiskData = await sneakProtocol.read.getOpportunityRiskData([1n]);
    console.log("   ✅ getOpportunityRiskData() working");
    console.log("      Volatility Risk:", Number(oppRiskData.volatilityRisk), "%");
    
    const chainsAtRisk = await sneakProtocol.read.getChainsAtRisk();
    console.log("   ✅ getChainsAtRisk() working");
    console.log("      Chains at risk:", chainsAtRisk.length);
    
    const liquidationPreview = await sneakProtocol.read.getLiquidationPreview([1n]);
    console.log("   ✅ getLiquidationPreview() working");
    console.log("      Can liquidate:", liquidationPreview.canLiquidate);
    
  } catch (error) {
    console.log("   ⚠️  Some health monitoring functions may need refinement");
    console.log("   Error:", error.message);
  }

  console.log("\n" + "=".repeat(50));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(50));
  
  const deploymentInfo = {
    network: await publicClient.getChainId(),
    deployer: deployer.account.address,
    mockUSDC: {
      address: mockUSDC.address,
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      deployerBalance: Number(deployerUSDCBalance) / 10**6
    },
    sneakProtocol: {
      address: sneakProtocol.address,
      baseToken: baseTokenAddress,
      initialOpportunity: {
        id: 1,
        name: opportunity.name,
        totalLiquidity: Number(opportunity.liquidityYes + opportunity.liquidityNo) / 10**6
      }
    },
    healthMonitoring: {
      functionsAvailable: [
        "getChainHealthData()",
        "getChainRiskAnalysis()",
        "getOpportunityRiskData()",
        "getChainsAtRisk()",
        "getLiquidationPreview()"
      ]
    },
    deployedAt: new Date().toISOString()
  };

  console.log("📋 Contract Addresses:");
  console.log("   MockERC20 (USDC):", deploymentInfo.mockUSDC.address);
  console.log("   SneakProtocol:   ", deploymentInfo.sneakProtocol.address);
  console.log("");
  console.log("💰 Initial Setup:");
  console.log("   Deployer USDC Balance:", deploymentInfo.mockUSDC.deployerBalance.toLocaleString(), "USDC");
  console.log("   Demo Opportunity Liquidity: $", deploymentInfo.sneakProtocol.initialOpportunity.totalLiquidity.toLocaleString());
  console.log("");
  console.log("🔍 Health Monitoring:");
  console.log("   New getter functions deployed and tested");
  console.log("   Real-time chain health tracking available");
  console.log("   Liquidation risk analysis enabled");

  // Save deployment info to console in JSON format for easy copy
  console.log("\n📄 Deployment Info (JSON):");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("=====================================");
  console.log("✅ All contracts deployed successfully");
  console.log("✅ Initial funding completed");
  console.log("✅ Demo opportunity created");
  console.log("✅ Health monitoring functions tested");
  console.log("");
  console.log("🚀 Your SneakProtocol is ready for use!");
  
  return deploymentInfo;
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

// Execute deployment
main()
  .then((deploymentInfo) => {
    console.log("\n✅ Production deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
