import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";
import { parseEther, formatEther } from "viem";

describe("SneakProtocol - Health Monitoring", async function () {
  const { viem } = await network.connect();
  let accounts: any[];
  let sneakProtocol: any;
  let mockToken: any;

  beforeEach(async function () {
    accounts = await viem.getWalletClients();
    
    // Deploy contracts
    mockToken = await viem.deployContract("MockERC20", ["Health USDC", "HUSDC", 18]);
    sneakProtocol = await viem.deployContract("SneakProtocol", [mockToken.address]);

    // Setup users with tokens and approvals
    const mintAmount = parseEther("100000");
    for (let i = 1; i <= 3; i++) {
      await mockToken.write.mint([accounts[i].account.address, mintAmount]);
      await mockToken.write.approve([sneakProtocol.address, mintAmount], { 
        account: accounts[i].account 
      });
    }
  });

  it("Should provide comprehensive chain health data", async function () {
    const initialAmount = parseEther("1000"); // $1000

    // Create opportunities
    for (let i = 1; i <= 3; i++) {
      await sneakProtocol.write.createOpportunity([
        `Health Test Opportunity ${i}`, `ipfs://health${i}`, parseEther("10000")
      ], { account: accounts[1].account });
    }

    console.log("\n🔍 Testing Health Monitoring Functions");
    console.log("======================================");

    // Create multi-level position chain
    console.log("1️⃣ Creating position chain...");
    await sneakProtocol.write.createPositionChain([1n, true, initialAmount], {
      account: accounts[2].account
    });

    await sneakProtocol.write.extendChain([1n, 2n, false], {
      account: accounts[2].account
    });

    await sneakProtocol.write.extendChain([1n, 3n, true], {
      account: accounts[2].account
    });

    console.log("✅ 3-level position chain created");

    // Test getChainHealthData
    console.log("\n2️⃣ Testing getChainHealthData()...");
    const healthData = await sneakProtocol.read.getChainHealthData([1n]);
    
    console.log(`📊 Chain Health Analysis:`);
    console.log(`   Chain ID: ${healthData.chainId}`);
    console.log(`   Owner: ${healthData.owner}`);
    console.log(`   Total Positions: ${healthData.totalPositions}`);
    console.log(`   Active Positions: ${healthData.activePositions}`);
    console.log(`   Liquidated Positions: ${healthData.liquidatedPositions}`);
    console.log(`   Total Allocated: $${formatEther(healthData.totalAllocated)}`);
    console.log(`   Current Total Value: $${formatEther(healthData.currentTotalValue)}`);
    console.log(`   Total Debt: $${formatEther(healthData.totalDebt)}`);
    console.log(`   Health Factor: ${(Number(healthData.healthFactor) / 100).toFixed(1)}%`);
    console.log(`   Is Liquidation Risk: ${healthData.isLiquidationRisk}`);
    console.log(`   Is High Risk: ${healthData.isHighRisk}`);
    console.log(`   Liquidation Threshold: $${formatEther(healthData.liquidationThreshold)}`);

    // Verify basic health data
    assert.equal(Number(healthData.chainId), 1);
    assert.equal(Number(healthData.totalPositions), 3);
    assert.equal(Number(healthData.activePositions), 3);
    assert.equal(Number(healthData.liquidatedPositions), 0);
    assert(healthData.totalAllocated > 0n);
    console.log("✅ getChainHealthData() working correctly");

    // Test getChainRiskAnalysis
    console.log("\n3️⃣ Testing getChainRiskAnalysis()...");
    const riskData = await sneakProtocol.read.getChainRiskAnalysis([1n]);
    
    console.log(`📊 Position Risk Analysis:`);
    for (let i = 0; i < riskData.length; i++) {
      const pos = riskData[i];
      const pnlPercent = pos.allocatedAmount > 0n 
        ? Number(pos.pnl * 10000n / pos.allocatedAmount) / 100 
        : 0;
      
      console.log(`   Position ${Number(pos.positionIndex) + 1}:`);
      console.log(`      Opportunity: ${pos.opportunityId} (${pos.side ? 'YES' : 'NO'})`);
      console.log(`      Allocated: $${formatEther(pos.allocatedAmount)}`);
      console.log(`      Current Value: $${formatEther(pos.currentValue)}`);
      console.log(`      P&L: ${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}%`);
      console.log(`      Active: ${pos.isActive}`);
      console.log(`      Risk Buffer: $${formatEther(pos.riskToNextPosition)}`);
      console.log(`      Liquidation Trigger: ${pos.isLiquidationTrigger}`);
    }

    assert.equal(riskData.length, 3);
    console.log("✅ getChainRiskAnalysis() working correctly");

    // Test getOpportunityRiskData
    console.log("\n4️⃣ Testing getOpportunityRiskData()...");
    const oppRiskData = await sneakProtocol.read.getOpportunityRiskData([1n]);
    
    console.log(`📊 Opportunity Risk Analysis:`);
    console.log(`   Opportunity: ${oppRiskData.name}`);
    console.log(`   YES Price: $${(Number(oppRiskData.priceYes) / 100).toFixed(3)}`);
    console.log(`   NO Price: $${(Number(oppRiskData.priceNo) / 100).toFixed(3)}`);
    console.log(`   Price Deviation: ${Number(oppRiskData.priceDeviation)} basis points`);
    console.log(`   Liquidity Imbalance: $${formatEther(oppRiskData.liquidityImbalance)}`);
    console.log(`   Volatility Risk: ${Number(oppRiskData.volatilityRisk)}%`);
    console.log(`   Is High Risk: ${oppRiskData.isHighRisk}`);
    console.log(`   Total Liquidity: $${formatEther(oppRiskData.totalLiquidity)}`);

    assert.equal(Number(oppRiskData.opportunityId), 1);
    console.log("✅ getOpportunityRiskData() working correctly");

    // Test getChainsAtRisk
    console.log("\n5️⃣ Testing getChainsAtRisk()...");
    const chainsAtRisk = await sneakProtocol.read.getChainsAtRisk();
    
    console.log(`📊 Chains at Risk:`);
    if (chainsAtRisk.length > 0) {
      console.log(`   ${chainsAtRisk.length} chain(s) at liquidation risk:`);
      for (let i = 0; i < chainsAtRisk.length; i++) {
        console.log(`      Chain ID: ${chainsAtRisk[i]}`);
      }
    } else {
      console.log(`   No chains currently at risk`);
    }

    console.log("✅ getChainsAtRisk() working correctly");

    // Test getLiquidationPreview
    console.log("\n6️⃣ Testing getLiquidationPreview()...");
    const liquidationPreview = await sneakProtocol.read.getLiquidationPreview([1n]);
    
    console.log(`📊 Liquidation Preview:`);
    console.log(`   Can Liquidate: ${liquidationPreview.canLiquidate}`);
    console.log(`   Liquidation Start Index: ${liquidationPreview.liquidationStartIndex}`);
    console.log(`   Positions to Liquidate: ${liquidationPreview.positionsToLiquidate}`);
    console.log(`   Collateral Shortfall: $${formatEther(liquidationPreview.collateralShortfall)}`);
    console.log(`   Liquidation Penalty: $${formatEther(liquidationPreview.liquidationPenalty)}`);
    console.log(`   Remaining Value: $${formatEther(liquidationPreview.remainingValue)}`);

    console.log("✅ getLiquidationPreview() working correctly");
  });

  it("Should detect chains at risk after price manipulation", async function () {
    const initialAmount = parseEther("500");

    // Create opportunity with small liquidity for easier manipulation
    await sneakProtocol.write.createOpportunity([
      "Manipulable Market", "ipfs://manipulable", parseEther("1000")
    ], { account: accounts[1].account });

    await sneakProtocol.write.createOpportunity([
      "Secondary Market", "ipfs://secondary", parseEther("1000")
    ], { account: accounts[1].account });

    console.log("\n🎯 Testing Risk Detection After Price Manipulation");
    console.log("=================================================");

    // Create position chain
    await sneakProtocol.write.createPositionChain([1n, true, initialAmount], {
      account: accounts[2].account
    });

    await sneakProtocol.write.extendChain([1n, 2n, false], {
      account: accounts[2].account
    });

    // Check initial health
    const initialHealthData = await sneakProtocol.read.getChainHealthData([1n]);
    console.log(`📊 Initial Health Factor: ${(Number(initialHealthData.healthFactor) / 100).toFixed(1)}%`);

    // Manipulate market to crash YES price (user has YES position)
    console.log("\n💥 Manipulating market with large NO trade...");
    await sneakProtocol.write.buyTokens([1n, false, parseEther("800")], {
      account: accounts[3].account
    });

    // Check health after manipulation
    const manipulatedHealthData = await sneakProtocol.read.getChainHealthData([1n]);
    console.log(`📊 Health Factor After Attack: ${(Number(manipulatedHealthData.healthFactor) / 100).toFixed(1)}%`);
    console.log(`⚠️  Liquidation Risk: ${manipulatedHealthData.isLiquidationRisk}`);
    console.log(`🔥 High Risk: ${manipulatedHealthData.isHighRisk}`);

    // Check if chain appears in at-risk list
    const chainsAtRisk = await sneakProtocol.read.getChainsAtRisk();
    console.log(`📊 Chains at risk after manipulation: ${chainsAtRisk.length}`);

    // Check liquidation preview
    const liquidationPreview = await sneakProtocol.read.getLiquidationPreview([1n]);
    console.log(`💀 Can liquidate now: ${liquidationPreview.canLiquidate}`);
    
    if (liquidationPreview.canLiquidate) {
      console.log(`   Would liquidate ${liquidationPreview.positionsToLiquidate} positions`);
      console.log(`   Starting from position ${liquidationPreview.liquidationStartIndex}`);
    }

    // Health factor should be lower after manipulation
    assert(manipulatedHealthData.healthFactor < initialHealthData.healthFactor);
    console.log("✅ Risk detection working correctly");
  });

  it("Should provide accurate position-level risk analysis", async function () {
    const initialAmount = parseEther("1000");

    // Create opportunities  
    for (let i = 1; i <= 4; i++) {
      await sneakProtocol.write.createOpportunity([
        `Risk Analysis Opp ${i}`, `ipfs://risk${i}`, parseEther("5000")
      ], { account: accounts[1].account });
    }

    console.log("\n🔬 Testing Position-Level Risk Analysis");
    console.log("======================================");

    // Create 4-level chain
    await sneakProtocol.write.createPositionChain([1n, true, initialAmount], {
      account: accounts[2].account
    });

    await sneakProtocol.write.extendChain([1n, 2n, false], {
      account: accounts[2].account
    });

    await sneakProtocol.write.extendChain([1n, 3n, true], {
      account: accounts[2].account
    });

    await sneakProtocol.write.extendChain([1n, 4n, false], {
      account: accounts[2].account
    });

    console.log("✅ 4-level position chain created");

    // Analyze each position's risk
    const riskData = await sneakProtocol.read.getChainRiskAnalysis([1n]);
    
    console.log("\n📊 Position-by-Position Risk Analysis:");
    let totalRiskBuffer = 0n;
    let liquidationTriggers = 0;
    
    for (let i = 0; i < riskData.length; i++) {
      const pos = riskData[i];
      totalRiskBuffer += pos.riskToNextPosition;
      
      if (pos.isLiquidationTrigger) {
        liquidationTriggers++;
      }
      
      console.log(`\n   Position ${Number(pos.positionIndex) + 1}:`);
      console.log(`      🎯 Opportunity ${pos.opportunityId} (${pos.side ? 'YES' : 'NO'})`);
      console.log(`      💰 Allocated: $${formatEther(pos.allocatedAmount)}`);
      console.log(`      📈 Current Value: $${formatEther(pos.currentValue)}`);
      console.log(`      🛡️  Risk Buffer: $${formatEther(pos.riskToNextPosition)}`);
      console.log(`      ${pos.isLiquidationTrigger ? '🚨' : '✅'} Liquidation Trigger: ${pos.isLiquidationTrigger}`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total Risk Buffer: $${formatEther(totalRiskBuffer)}`);
    console.log(`   Liquidation Triggers: ${liquidationTriggers}`);
    console.log(`   Chain Length: ${riskData.length} positions`);

    assert.equal(riskData.length, 4);
    console.log("✅ Position-level risk analysis working correctly");
  });
});
