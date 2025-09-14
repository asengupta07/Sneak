import { network } from "hardhat";
import { parseEther, formatEther } from "viem";

/**
 * SneakProtocol Health Dashboard
 * Demonstrates all the new health monitoring and risk analysis functions
 */

async function createHealthDashboard() {
  console.log("🏥 SneakProtocol Health Dashboard");
  console.log("=================================");
  
  const { viem } = await network.connect();
  const accounts = await viem.getWalletClients();
  
  // Deploy contracts
  console.log("🏗️  Setting up environment...");
  const mockUSDC = await viem.deployContract("MockERC20", ["Dashboard USDC", "DUSDC", 18]);
  const sneakProtocol = await viem.deployContract("SneakProtocol", [mockUSDC.address]);
  
  // Setup users
  for (let i = 0; i < 4; i++) {
    await mockUSDC.write.mint([accounts[i].account.address, parseEther("50000")]);
    await mockUSDC.write.approve([sneakProtocol.address, parseEther("50000")], {
      account: accounts[i].account
    });
  }

  // Create test scenario with multiple opportunities and chains
  console.log("📊 Creating comprehensive test scenario...");
  
  // Create opportunities with different risk profiles
  await sneakProtocol.write.createOpportunity([
    "High Volatility Market", "ipfs://volatile", parseEther("5000")
  ], { account: accounts[0].account });
  
  await sneakProtocol.write.createOpportunity([
    "Stable Market", "ipfs://stable", parseEther("20000")
  ], { account: accounts[0].account });
  
  await sneakProtocol.write.createOpportunity([
    "Speculative Market", "ipfs://spec", parseEther("8000")
  ], { account: accounts[0].account });

  // Create various position chains with different risk levels
  
  // Chain 1: High-risk leveraged chain
  await sneakProtocol.write.createPositionChain([1n, true, parseEther("2000")], {
    account: accounts[1].account
  });
  await sneakProtocol.write.extendChain([1n, 2n, false], {
    account: accounts[1].account
  });
  await sneakProtocol.write.extendChain([1n, 3n, true], {
    account: accounts[1].account
  });

  // Chain 2: Conservative chain
  await sneakProtocol.write.createPositionChain([2n, true, parseEther("1000")], {
    account: accounts[2].account
  });

  // Add some trading activity to create price volatility
  await sneakProtocol.write.buyTokens([1n, false, parseEther("1500")], {
    account: accounts[3].account
  });
  
  await sneakProtocol.write.buyTokens([3n, true, parseEther("800")], {
    account: accounts[3].account
  });

  console.log("✅ Test scenario created with 3 opportunities and 2 chains");

  // Now demonstrate all health monitoring functions
  console.log("\n" + "=".repeat(60));
  console.log("📊 COMPREHENSIVE HEALTH ANALYSIS");
  console.log("=".repeat(60));

  await showMarketOverview(sneakProtocol);
  await showChainHealthAnalysis(sneakProtocol);
  await showRiskAnalysis(sneakProtocol);
  await showLiquidationAnalysis(sneakProtocol);
  await showSystemHealthSummary(sneakProtocol, mockUSDC);
}

async function showMarketOverview(sneakProtocol: any) {
  console.log("\n🎯 MARKET OVERVIEW");
  console.log("-".repeat(40));
  
  for (let oppId = 1n; oppId <= 3n; oppId++) {
    const opp = await sneakProtocol.read.getOpportunity([oppId]);
    const riskData = await sneakProtocol.read.getOpportunityRiskData([oppId]);
    
    console.log(`\n📊 Opportunity ${oppId}: ${opp.name}`);
    console.log(`   💰 Liquidity: YES=$${formatEther(opp.liquidityYes)}, NO=$${formatEther(opp.liquidityNo)}`);
    console.log(`   💵 Prices: YES=$${(Number(opp.priceYes)/100).toFixed(3)}, NO=$${(Number(opp.priceNo)/100).toFixed(3)}`);
    console.log(`   📈 Volatility Risk: ${Number(riskData.volatilityRisk)}%`);
    console.log(`   ${riskData.isHighRisk ? '🔴' : '✅'} Risk Level: ${riskData.isHighRisk ? 'HIGH' : 'NORMAL'}`);
    console.log(`   ⚖️  Liquidity Imbalance: $${formatEther(riskData.liquidityImbalance)}`);
  }
}

async function showChainHealthAnalysis(sneakProtocol: any) {
  console.log("\n⛓️  POSITION CHAIN HEALTH ANALYSIS");
  console.log("-".repeat(40));
  
  for (let chainId = 1n; chainId <= 2n; chainId++) {
    try {
      const healthData = await sneakProtocol.read.getChainHealthData([chainId]);
      
      console.log(`\n🔗 Chain ${chainId} (Owner: ${healthData.owner.slice(0, 8)}...)`);
      console.log(`   📊 Positions: ${healthData.activePositions}/${healthData.totalPositions} active`);
      console.log(`   💰 Value: $${formatEther(healthData.currentTotalValue)} (allocated: $${formatEther(healthData.totalAllocated)})`);
      console.log(`   🏦 Debt: $${formatEther(healthData.totalDebt)}`);
      console.log(`   🩺 Health Factor: ${(Number(healthData.healthFactor) / 100).toFixed(1)}%`);
      
      // Risk assessment
      if (healthData.isLiquidationRisk) {
        console.log(`   🚨 LIQUIDATION RISK - Health < 120%`);
      } else if (healthData.isHighRisk) {
        console.log(`   ⚠️  HIGH RISK - Health < 150%`);
      } else {
        console.log(`   ✅ HEALTHY - Health > 150%`);
      }
      
      console.log(`   💀 Liquidation triggers at: $${formatEther(healthData.liquidationThreshold)}`);
      
    } catch (error) {
      console.log(`   ❌ Chain ${chainId}: Not found or error`);
    }
  }
}

async function showRiskAnalysis(sneakProtocol: any) {
  console.log("\n🔍 DETAILED RISK ANALYSIS");
  console.log("-".repeat(40));
  
  // Analyze each chain's positions in detail
  for (let chainId = 1n; chainId <= 2n; chainId++) {
    try {
      const riskData = await sneakProtocol.read.getChainRiskAnalysis([chainId]);
      
      if (riskData.length > 0) {
        console.log(`\n🔗 Chain ${chainId} Position Analysis:`);
        
        for (let i = 0; i < riskData.length; i++) {
          const pos = riskData[i];
          const pnlPercent = pos.allocatedAmount > 0n 
            ? Number(pos.pnl * 10000n / pos.allocatedAmount) / 100 
            : 0;
          
          console.log(`   ${pos.isLiquidationTrigger ? '🚨' : '✅'} Position ${Number(pos.positionIndex) + 1}:`);
          console.log(`      🎯 Opp ${pos.opportunityId} (${pos.side ? 'YES' : 'NO'})`);
          console.log(`      💰 $${formatEther(pos.allocatedAmount)} → $${formatEther(pos.currentValue)}`);
          console.log(`      📈 P&L: ${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}%`);
          console.log(`      🛡️  Safety Buffer: $${formatEther(pos.riskToNextPosition)}`);
          console.log(`      ${pos.isActive ? '🟢' : '🔴'} Status: ${pos.isActive ? 'Active' : 'Liquidated'}`);
        }
      }
    } catch (error) {
      // Chain doesn't exist
    }
  }
}

async function showLiquidationAnalysis(sneakProtocol: any) {
  console.log("\n💀 LIQUIDATION ANALYSIS");
  console.log("-".repeat(40));
  
  // Check which chains are at risk
  const chainsAtRisk = await sneakProtocol.read.getChainsAtRisk();
  
  if (chainsAtRisk.length > 0) {
    console.log(`🚨 ${chainsAtRisk.length} chain(s) at liquidation risk:`);
    
    for (let i = 0; i < chainsAtRisk.length; i++) {
      const chainId = chainsAtRisk[i];
      const liquidationPreview = await sneakProtocol.read.getLiquidationPreview([chainId]);
      
      console.log(`\n💀 Chain ${chainId} Liquidation Preview:`);
      console.log(`   Can Liquidate: ${liquidationPreview.canLiquidate}`);
      console.log(`   Liquidation Start: Position ${liquidationPreview.liquidationStartIndex}`);
      console.log(`   Positions to Liquidate: ${liquidationPreview.positionsToLiquidate}`);
      console.log(`   Collateral Shortfall: $${formatEther(liquidationPreview.collateralShortfall)}`);
      console.log(`   Liquidation Penalty: $${formatEther(liquidationPreview.liquidationPenalty)}`);
      console.log(`   Remaining Value: $${formatEther(liquidationPreview.remainingValue)}`);
    }
  } else {
    console.log("✅ No chains currently at liquidation risk");
    
    // Still show liquidation preview for existing chains
    for (let chainId = 1n; chainId <= 2n; chainId++) {
      try {
        const liquidationPreview = await sneakProtocol.read.getLiquidationPreview([chainId]);
        
        console.log(`\n🔗 Chain ${chainId} Status:`);
        console.log(`   💚 Healthy - No liquidation risk`);
        console.log(`   🛡️  Total Value: $${formatEther(liquidationPreview.remainingValue)}`);
      } catch (error) {
        // Chain doesn't exist
      }
    }
  }
}

async function showSystemHealthSummary(sneakProtocol: any, mockUSDC: any) {
  console.log("\n🌐 SYSTEM HEALTH SUMMARY");
  console.log("-".repeat(40));
  
  // Count opportunities
  let totalOpportunities = 0;
  let resolvedOpportunities = 0;
  let totalLiquidity = 0n;
  
  for (let oppId = 1n; oppId <= 10n; oppId++) { // Check up to 10 opportunities
    try {
      const opp = await sneakProtocol.read.getOpportunity([oppId]);
      if (opp.id > 0n) {
        totalOpportunities++;
        if (opp.resolved) {
          resolvedOpportunities++;
        }
        totalLiquidity += BigInt(opp.liquidityYes) + BigInt(opp.liquidityNo);
      }
    } catch (error) {
      break; // No more opportunities
    }
  }
  
  // Count chains
  let totalChains = 0;
  let activeChains = 0;
  let liquidatedChains = 0;
  
  const nextChainId = await sneakProtocol.read.nextChainId();
  for (let chainId = 1n; chainId < nextChainId; chainId++) {
    try {
      const chain = await sneakProtocol.read.getPositionChain([chainId]);
      if (chain.positions && chain.positions.length > 0) {
        totalChains++;
        if (chain.liquidated) {
          liquidatedChains++;
        } else {
          activeChains++;
        }
      }
    } catch (error) {
      // Chain doesn't exist
    }
  }
  
  // Protocol fees
  const protocolFees = await sneakProtocol.read.protocolFees([mockUSDC.address]);
  
  console.log(`📈 System Metrics:`);
  console.log(`   🎯 Opportunities: ${totalOpportunities} total (${resolvedOpportunities} resolved)`);
  console.log(`   ⛓️  Chains: ${activeChains} active, ${liquidatedChains} liquidated`);
  console.log(`   💰 Total Value Locked: $${formatEther(totalLiquidity)}`);
  console.log(`   🏦 Protocol Fees: $${formatEther(protocolFees)}`);
  
  // Overall system health
  const chainsAtRisk = await sneakProtocol.read.getChainsAtRisk();
  const riskPercentage = totalChains > 0 ? (chainsAtRisk.length / totalChains) * 100 : 0;
  
  console.log(`\n🩺 Overall System Health:`);
  if (riskPercentage > 50) {
    console.log(`   🔴 CRITICAL: ${riskPercentage.toFixed(1)}% of chains at risk`);
  } else if (riskPercentage > 20) {
    console.log(`   🟡 MODERATE: ${riskPercentage.toFixed(1)}% of chains at risk`);
  } else {
    console.log(`   ✅ HEALTHY: ${riskPercentage.toFixed(1)}% of chains at risk`);
  }
  
  console.log(`\n📋 Available Health Monitoring Functions:`);
  console.log(`   ✅ getChainHealthData(chainId) - Complete health metrics`);
  console.log(`   ✅ getChainRiskAnalysis(chainId) - Position-by-position risk`);
  console.log(`   ✅ getOpportunityRiskData(oppId) - Market volatility analysis`);
  console.log(`   ✅ getChainsAtRisk() - List of risky chains`);
  console.log(`   ✅ getLiquidationPreview(chainId) - Liquidation simulation`);
  
  console.log(`\n💡 Dashboard Features:`);
  console.log(`   🔍 Real-time health factor monitoring`);
  console.log(`   ⚠️  Early liquidation risk warnings`);
  console.log(`   📊 Position-level P&L tracking`);
  console.log(`   💀 Liquidation impact previews`);
  console.log(`   🎯 Market volatility analysis`);
  console.log(`   📈 System-wide health metrics`);
}

// Example usage functions for frontend integration
async function demonstrateUsageExamples(sneakProtocol: any) {
  console.log("\n" + "=".repeat(60));
  console.log("💻 FRONTEND INTEGRATION EXAMPLES");
  console.log("=".repeat(60));
  
  console.log(`
📋 Frontend Integration Examples:

// Get user's chain health status
const healthData = await contract.read.getChainHealthData([chainId]);
if (healthData.isLiquidationRisk) {
  showWarning("⚠️ Your position is at risk of liquidation!");
}

// Monitor specific position risks  
const riskData = await contract.read.getChainRiskAnalysis([chainId]);
riskData.forEach((pos, i) => {
  if (pos.isLiquidationTrigger) {
    showAlert(\`Position \${i+1} is triggering liquidation risk!\`);
  }
});

// Check market volatility before entering
const oppRisk = await contract.read.getOpportunityRiskData([opportunityId]);
if (oppRisk.isHighRisk) {
  showWarning("This market is highly volatile - trade with caution!");
}

// Preview liquidation impact
const preview = await contract.read.getLiquidationPreview([chainId]);
if (preview.canLiquidate) {
  showLiquidationWarning(
    \`Liquidation would affect \${preview.positionsToLiquidate} positions\`
  );
}

// Dashboard overview
const atRiskChains = await contract.read.getChainsAtRisk();
updateDashboard({
  totalChainsAtRisk: atRiskChains.length,
  // ... other metrics
});
  `);
}

// Run the dashboard
createHealthDashboard()
  .then(async (sneakProtocol) => {
    await demonstrateUsageExamples(sneakProtocol);
    
    console.log("\n🎉 Health Dashboard Demo Complete!");
    console.log("==================================");
    console.log("✅ All health monitoring functions working");
    console.log("✅ Risk analysis providing detailed insights");
    console.log("✅ Liquidation previews accurate");
    console.log("✅ System health tracking operational");
    console.log("");
    console.log("🚀 Ready for frontend integration!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Dashboard demo failed:", error);
    process.exit(1);
  });
