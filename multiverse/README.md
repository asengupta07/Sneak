# SneakProtocol - Advanced Opportunity Market

A fully composable, ERC-20 based opportunity market protocol that enables users to chain positions with leverage while maintaining liquidation safety through sophisticated collateralization mechanics.

## 🎯 Key Features

- **Dynamic Pricing**: Automated market maker with price discovery based on liquidity flows
- **Position Chaining**: Chain positions across multiple opportunities with 60% LTV
- **Liquidation Protection**: Cascading liquidation system to prevent systemic risk
- **High Leverage**: Up to 5-7x effective leverage through position chaining
- **Composable**: ERC-20 tokens usable as collateral across the ecosystem

## 📊 Test Results Summary

All 16 comprehensive tests passing ✅

### Basic Functionality

- ✅ Opportunity creation ($10K → $5K YES/NO splits)
- ✅ Dynamic pricing (Example 1: $1K → $100 YES → $0.60/$0.41 prices)
- ✅ Dynamic pricing (Example 2: $3K → $100 NO → $0.46/$0.53 prices)
- ✅ Position chaining (60% LTV, $5 fees)
- ✅ Resolution and payouts ($190 winnings to winner)

### Advanced Scenarios

- ✅ 3-Level chaining ($100 → $55 → $28, $93 total debt)
- ✅ 5-Level chaining ($100 → ... → $2.08, $117 total debt)
- ✅ Liquidation attacks (Price crash from $0.50 → $0.32, positions liquidated)
- ✅ 7-Level cascade ($1000 → $35 final position)
- ✅ Price recovery (Attack then recovery scenarios)
- ✅ Multi-chain competition (Competing users on same opportunities)

## 🔧 Core Mechanics

### Initial Liquidity Split

```solidity
// Example: $10,000 initial liquidity
createOpportunity("Project X Success", "ipfs://...", 10000e18);
// Results in: $5,000 YES pool, $5,000 NO pool, both at $0.50
```

### Dynamic Pricing Formula

```
New_YES_Price = (L_YES + Buy_Amount) / L_YES * Old_YES_Price
New_NO_Price = L_NO / (L_NO + Buy_Amount) * Old_NO_Price
```

### Position Chaining with LTV

```
Position 1: $100 initial
Position 2: $55 (60% of $100 - $5 fee)
Position 3: $28 (60% of $55 - $5 fee)
Position 4: $12 (60% of $28 - $5 fee)
...
```

### Liquidation Mechanics

- **Trigger**: When collateral value < debt + hysteresis (1%)
- **Process**: Liquidate positions from trigger point onwards
- **Preservation**: Upstream positions remain active
- **Example**: Position 1 value drops → Positions 2+ liquidated

## 🚀 Usage Examples

### Basic Trading

```typescript
// Create opportunity
await sneakProtocol.write.createOpportunity([
  "Will Bitcoin reach $100K by 2024?",
  "ipfs://bitcoin-prediction-image",
  parseEther("50000"), // $50K initial liquidity
]);

// Buy YES tokens
await sneakProtocol.write.buyTokens([
  1n, // opportunity ID
  true, // YES side
  parseEther("1000"), // $1000 investment
]);
```

### Position Chaining

```typescript
// Create 3-level chain
await sneakProtocol.write.createPositionChain([
  1n,
  true,
  parseEther("100"), // $100 YES on opportunity 1
]);

await sneakProtocol.write.extendChain([
  1n,
  2n,
  false, // Chain to opportunity 2, NO side
]);

await sneakProtocol.write.extendChain([
  1n,
  3n,
  true, // Chain to opportunity 3, YES side
]);
```

### Resolution & Claims

```typescript
// Resolve opportunity (owner only)
await sneakProtocol.write.resolveOpportunity([1n, true]); // YES wins

// Claim winnings
await sneakProtocol.write.claimWinnings([1n]);
```

## 📋 Contract Architecture

### Core Contracts

- **SneakProtocol.sol**: Main protocol logic
- **MockERC20.sol**: Test token for demonstrations

### Key Structs

```solidity
struct Opportunity {
    uint256 id;
    string name;
    string imageUrl;
    uint256 liquidityYes;
    uint256 liquidityNo;
    uint256 priceYes;
    uint256 priceNo;
    address creator;
    bool resolved;
    bool outcome;
    uint256 totalYesTokens;
    uint256 totalNoTokens;
    uint256 creationTime;
}

struct PositionChain {
    uint256 chainId;
    address owner;
    Position[] positions;
    uint256 totalDebt;
    bool liquidated;
}
```

## 🔐 Security Features

### Liquidation Protection

- **1% Hysteresis**: Prevents liquidation flip-flopping
- **Cascading Design**: Only liquidates necessary positions
- **Debt Tracking**: Precise accounting of all obligations

### Price Manipulation Resistance

- **Large Liquidity Pools**: Harder to manipulate prices
- **TWAP Integration Ready**: Can integrate time-weighted average prices
- **Slippage Protection**: Large trades face increasing slippage

### Access Controls

- **Owner-Only Resolution**: Only protocol owner can resolve opportunities
- **User-Only Claims**: Only token holders can claim winnings
- **Chain Ownership**: Only chain owner can extend their chain

## 📈 Economic Model

### Fee Structure

- **Fixed Fee**: $5 per chain extension
- **Protocol Fee**: 1% of total liquidity on resolution
- **LP Rewards**: 4% of total liquidity to opportunity creator

### Token Economics

- **Pro-Rata Distribution**: Winnings split proportional to token holdings
- **Binary Outcomes**: Winner takes all (minus fees/rewards)
- **Collateralization**: 60% LTV enables high leverage with safety

## 🧪 Testing

Run comprehensive test suite:

```bash
# All tests
npx hardhat test

# Specific test suites
npx hardhat test --grep "3-Level Chaining"
npx hardhat test --grep "Liquidation"
npx hardhat test --grep "Advanced Scenarios"
```

### Test Categories

1. **Basic Functionality**: Core protocol operations
2. **Pricing Mechanics**: Dynamic pricing formula validation
3. **Position Chaining**: Multi-level position management
4. **Liquidation Logic**: Safety mechanism verification
5. **Advanced Scenarios**: Edge cases and stress tests

## 🌐 Deployment

Deploy to local network:

```bash
npx hardhat ignition deploy ignition/modules/SneakProtocol.ts --network localhost
```

Deploy to testnet:

```bash
npx hardhat ignition deploy ignition/modules/SneakProtocol.ts --network sepolia
```

## 📊 Performance Metrics

From test results:

- **Gas Efficiency**: Optimized with viaIR compiler
- **Chain Depth**: Tested up to 7 levels successfully
- **Liquidation Speed**: Sub-second liquidation execution
- **Price Discovery**: Immediate price updates on trades

## 🔬 Advanced Features

### Cascade Liquidations

The protocol handles complex scenarios where multiple positions in a chain become under-collateralized:

```
7-Level Chain Example:
$1000 → $595 → $352 → $206 → $119 → $66 → $35
Total Debt: ~$2,373 (multiple fees and interest)
```

### Price Recovery

Markets can recover from attacks:

```
Attack: $0.50 → $0.32 (36% drop)
Recovery: $0.32 → $0.66 (106% recovery)
```

### Multi-Chain Competition

Multiple users can build competing chains on the same opportunities, creating complex market dynamics.

## 🎯 Real-World Applications

- **Prediction Markets**: Sports, politics, technology outcomes
- **DeFi Protocols**: Token price predictions, protocol success
- **Event Betting**: Conference outcomes, product launches
- **Insurance Markets**: Risk assessment and coverage

## 🛣 Roadmap

- [ ] Frontend interface integration
- [ ] Oracle integration for automated resolution
- [ ] Cross-chain compatibility
- [ ] Advanced liquidation incentives
- [ ] Governance token integration
- [ ] Mobile app development

## 📄 License

UNLICENSED - See LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npx hardhat test`)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

**⚠️ Disclaimer**: This is experimental DeFi software. Use at your own risk. Not audited for production use.
