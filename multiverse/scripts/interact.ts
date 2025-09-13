import { network } from "hardhat";
import { parseEther, formatEther, getContract } from "viem";

// Configuration - update these with your deployed contract addresses
const SNEAK_PROTOCOL_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update after deployment
const MOCK_USDC_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";     // Update after deployment

async function main() {
  const { viem } = await network.connect();
  const [user1, user2, user3] = await viem.getWalletClients();

  console.log("🔧 SneakProtocol Interaction Script");
  console.log("=====================================");

  // Get contract instances
  const sneakProtocol = await viem.getContractAt("SneakProtocol", SNEAK_PROTOCOL_ADDRESS);
  const mockUSDC = await viem.getContractAt("MockERC20", MOCK_USDC_ADDRESS);

  // Mint tokens for users
  console.log("\n💸 Setting up users with USDC...");
  const mintAmount = parseEther("10000");
  
  for (let i = 1; i < 4; i++) {
    const user = [user1, user2, user3][i - 1];
    await mockUSDC.write.mint([user.account.address, mintAmount]);
    await mockUSDC.write.approve([SNEAK_PROTOCOL_ADDRESS, mintAmount], {
      account: user.account
    });
    console.log(`✅ User ${i} (${user.account.address}): ${formatEther(mintAmount)} USDC`);
  }

  // Interactive menu
  console.log("\n🎯 Available Actions:");
  console.log("1. Create new opportunity");
  console.log("2. View opportunity details");
  console.log("3. Buy tokens (YES/NO)");
  console.log("4. Create position chain");
  console.log("5. Extend position chain");
  console.log("6. View chain details");
  console.log("7. Liquidate chain");
  console.log("8. Resolve opportunity");
  console.log("9. Claim winnings");
  console.log("10. Run full demo");

  // For this script, let's run a quick demo
  await runQuickDemo(sneakProtocol, mockUSDC, user1, user2, user3);
}

async function runQuickDemo(sneakProtocol: any, mockUSDC: any, user1: any, user2: any, user3: any) {
  console.log("\n🚀 Running Quick Demo...");
  console.log("========================");

  // 1. Create opportunity
  console.log("\n1️⃣ Creating opportunity...");
  await sneakProtocol.write.createOpportunity([
    "Will AI achieve AGI by 2025?",
    "ipfs://agi-prediction-2025",
    parseEther("5000")
  ], { account: user1.account });

  const opportunity = await sneakProtocol.read.getOpportunity([2n]); // Opportunity 2 (1 was created in deploy)
  console.log(`✅ Created: "${opportunity.name}"`);
  console.log(`   Initial prices: YES=$${(Number(opportunity.priceYes)/100).toFixed(2)}, NO=$${(Number(opportunity.priceNo)/100).toFixed(2)}`);

  // 2. User2 buys YES tokens  
  console.log("\n2️⃣ User2 buying YES tokens...");
  const buyAmount = parseEther("500");
  await sneakProtocol.write.buyTokens([2n, true, buyAmount], { 
    account: user2.account 
  });
  
  const updatedOpp = await sneakProtocol.read.getOpportunity([2n]);
  console.log(`✅ After $${formatEther(buyAmount)} YES buy:`);
  console.log(`   New prices: YES=$${(Number(updatedOpp.priceYes)/100).toFixed(3)}, NO=$${(Number(updatedOpp.priceNo)/100).toFixed(3)}`);

  // 3. User3 creates position chain
  console.log("\n3️⃣ User3 creating position chain...");
  await sneakProtocol.write.createPositionChain([2n, false, parseEther("200")], {
    account: user3.account
  });

  const chain = await sneakProtocol.read.getPositionChain([1n]);
  console.log(`✅ Chain created with $${formatEther(chain.positions[0].amount)} initial position`);

  // 4. Show user balances
  console.log("\n4️⃣ Current token holdings:");
  const user2YesTokens = await sneakProtocol.read.getUserTokens([2n, true, user2.account.address]);
  const user3NoTokens = await sneakProtocol.read.getUserTokens([2n, false, user3.account.address]);
  
  console.log(`   User2 YES tokens: ${formatEther(user2YesTokens)}`);
  console.log(`   User3 NO tokens: ${formatEther(user3NoTokens)}`);

  // 5. Show current opportunity state
  console.log("\n5️⃣ Final opportunity state:");
  const finalOpp = await sneakProtocol.read.getOpportunity([2n]);
  console.log(`   Total liquidity: $${formatEther(BigInt(finalOpp.liquidityYes) + BigInt(finalOpp.liquidityNo))}`);
  console.log(`   YES pool: $${formatEther(finalOpp.liquidityYes)} (${formatEther(finalOpp.totalYesTokens)} tokens)`);
  console.log(`   NO pool: $${formatEther(finalOpp.liquidityNo)} (${formatEther(finalOpp.totalNoTokens)} tokens)`);
  console.log(`   Current prices: YES=$${(Number(finalOpp.priceYes)/100).toFixed(3)}, NO=$${(Number(finalOpp.priceNo)/100).toFixed(3)}`);

  console.log("\n🎉 Demo completed! Protocol is working correctly.");
}

// Helper functions for interactive use
export async function createOpportunity(
  sneakProtocol: any, 
  name: string, 
  imageUrl: string, 
  liquidity: string,
  user: any
) {
  await sneakProtocol.write.createOpportunity([
    name, 
    imageUrl, 
    parseEther(liquidity)
  ], { account: user.account });
  
  console.log(`✅ Created opportunity: ${name} with $${liquidity} liquidity`);
}

export async function buyTokens(
  sneakProtocol: any,
  opportunityId: number,
  side: boolean, // true for YES, false for NO
  amount: string,
  user: any
) {
  await sneakProtocol.write.buyTokens([
    BigInt(opportunityId),
    side,
    parseEther(amount)
  ], { account: user.account });
  
  console.log(`✅ User bought $${amount} ${side ? 'YES' : 'NO'} tokens for opportunity ${opportunityId}`);
}

export async function viewOpportunity(sneakProtocol: any, opportunityId: number) {
  const opp = await sneakProtocol.read.getOpportunity([BigInt(opportunityId)]);
  
  console.log(`\n📊 Opportunity ${opportunityId}: ${opp.name}`);
  console.log(`   Image: ${opp.imageUrl}`);
  console.log(`   Creator: ${opp.creator}`);
  console.log(`   YES liquidity: $${formatEther(opp.liquidityYes)}`);
  console.log(`   NO liquidity: $${formatEther(opp.liquidityNo)}`);
  console.log(`   YES price: $${(Number(opp.priceYes)/100).toFixed(3)}`);
  console.log(`   NO price: $${(Number(opp.priceNo)/100).toFixed(3)}`);
  console.log(`   Resolved: ${opp.resolved ? (opp.outcome ? 'YES' : 'NO') : 'No'}`);
  
  return opp;
}

export async function viewChain(sneakProtocol: any, chainId: number) {
  const chain = await sneakProtocol.read.getPositionChain([BigInt(chainId)]);
  
  console.log(`\n⛓️  Position Chain ${chainId}:`);
  console.log(`   Owner: ${chain.owner}`);
  console.log(`   Total Debt: $${formatEther(chain.totalDebt)}`);
  console.log(`   Liquidated: ${chain.liquidated}`);
  console.log(`   Positions: ${chain.positions.length}`);
  
  for (let i = 0; i < chain.positions.length; i++) {
    const pos = chain.positions[i];
    console.log(`   ${i + 1}. Opp ${pos.opportunityId}: $${formatEther(pos.amount)} ${pos.side ? 'YES' : 'NO'} ${pos.active ? '(Active)' : '(Liquidated)'}`);
  }
  
  return chain;
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}
