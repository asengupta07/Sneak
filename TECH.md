# Sneak: A Multiversal Finance Market Protocol

## Abstract

Sneak is a fully composable, ERC-20 based opportunity market protocol that allows users to speculate on outcomes ("opportunities") while leveraging conditional liquidity across multiple opportunities in a recursive, chainable fashion. Unlike traditional prediction markets, Sneak is designed to:

- Represent opportunities using symmetric YES/NO ERC-20 token pairs.
- Allow participants to leverage positions as collateral to create arbitrarily deep chains of opportunity trades.
- Redistribute losing-side liquidity to winning participants, with a protocol fee and LP reward mechanism.
- Provide a deterministic, algorithmic resolution system that preserves consistency across chains.

This paper formalizes the mechanism design, tokenomics, liquidity dynamics, and recursive resolution algorithm.

---

## 1. Introduction

Prediction markets and DeFi composability have historically been disconnected — prediction tokens are often non-standard, illiquid, or unusable as collateral due to their binary payout structure. Sneak introduces an **opportunity market** primitive where opportunities are tradable, collateralizable, and recursively composable across multiple markets.

Sneak enables:

- **Opportunity Creation:** Anyone can create a new opportunity by providing initial liquidity.
- **Dynamic Pricing:** YES/NO prices are continuously updated based on buy/sell pressure.
- **Composable Collateral:** Users can leverage positions (YES/NO tokens) as collateral to take positions on other opportunities.
- **Chain Resolution:** If an outcome resolves, all dependent positions in chains are updated atomically.

---

## 2. Core Concepts

### 2.1 Opportunities

An **opportunity** $O_i$ is a market on a binary event (e.g., "Will Project X succeed?"). Each opportunity consists of:

- **YES token** $Y_i$ — represents belief that the event resolves positively.
- **NO token** $N_i$ — represents belief that the event resolves negatively.

Each opportunity maintains an LP-backed pool:

$$
LP_i = \{L_{Y_i}, L_{N_i}\}
$$

where $L_{Y_i}$ and $L_{N_i}$ are the current liquidity reserves backing YES and NO tokens respectively.

### 2.2 Initial State

When an opportunity is created:

- Creator deposits $L_0$ USD-equivalent liquidity.
- Initial state: $L_{Y_i} = L_{N_i} = L_0/2$.
- Initial price per token:

$$
P_{Y_i}(0) = P_{N_i}(0) = 0.5
$$

### 2.3 Price Update Mechanism

Let a user buy $\Delta$ worth of $Y_i$ tokens.

New price:

$$
P_{Y_i}' = \frac{L_{Y_i}+\Delta}{L_{Y_i}} P_{Y_i}
$$

$$
P_{N_i}' = \frac{L_{N_i}}{L_{N_i}+\Delta} P_{N_i}
$$

where $P_{Y_i}$ and $P_{N_i}$ are pre-transaction prices.

This mechanism maintains price symmetry and ensures that $P_{Y_i}+P_{N_i}=1$ is approximately preserved.

---

## 3. Position Chains

### 3.1 Definition

A **position chain** is a directed sequence of positions across opportunities:

$$
C = [(O_1, side_1, amt_1), (O_2, side_2, amt_2), ... , (O_k, side_k, amt_k)]
$$

where:

- $side_i \in \{Y, N\}$
- $amt_i$ is the value allocated from the previous position.

Example:

> Buy YES(Katseye) → Use resulting value as collateral to buy NO(Seedhemaut)

### 3.2 Chain Leverage

Each link in the chain is collateralized by the previous link’s current market value. This allows nested speculation:

- If $Y_1$ appreciates, user gains additional collateral to open further positions.
- If $Y_1$ collapses, all dependent positions downstream are liquidated.

### 3.3 Recursive Liquidation

Given chain $C$, define resolution function:

```
resolve(C):
  for i in range(len(C)):
    if outcome(C[i]) = LOSE:
       zero_out(C[i:])
       break
    else if outcome(C[i]) = WIN:
       distribute_payout(C[i])
       break_chain(C, i)
```

where `zero_out` sets downstream positions to zero, and `break_chain` creates new independent chains from remaining collateral.

### 3.4 Collateralization & Liquidation

We require over-collateralization at each chain link to protect downstream positions.

Definitions:

- Let \(\alpha \in (0,1)\) be the allocation factor (e.g., \(\alpha = 0.8\)). When a link \(i\) is opened, at most an \(\alpha\) fraction of the current mark value of the previous link \(i-1\) may be allocated to it.
- Let \(V\_{i}(t)\) be the current USD mark value of link \(i\) at time \(t\) (based on AMM mid or oracle TWAP).
- Let \(A*{i}\) be the fixed amount that was actually allocated from link \(i-1\) to open link \(i\) at creation time: \(A_i = \alpha \cdot V*{i-1}(t\_{\text{open}})\).
- Maintenance requirement (per link): \(V*{i-1}(t) \ge A_i\). Initial over-collateralization headroom is \((1-\alpha)\cdot V*{i-1}(t\_{\text{open}})\).

Trigger:

- If for some smallest index \(j\ge 2\), \(V\_{j-1}(t) < A_j\), then link \(j\) and all downstream links \(j..k\) become under-collateralized and must be liquidated.
- To avoid flip-flop near the boundary, we use hysteresis \(\tau\) (e.g., 1%). Liquidation triggers when \(V*{j-1}(t) < (1-\tau)\cdot A_j\) and only clears when \(V*{j-1}(t) > (1+\tau)\cdot A_j\).

Process (single chain):

1. Identify the minimal violating index \(j\).
2. Freeze new downstream openings for this chain.
3. Unwind positions for indices \(i = k, k-1, ..., j\) into base using current AMM prices (or a protected close mechanism) to repay exposure.
4. Apply a liquidation incentive/penalty (e.g., \(\gamma\)% of recovered value) to liquidators; any shortfall is first absorbed by the per-link buffer, then by insurance if configured.
5. Preserve the prefix \(0..j-1\); the user keeps remaining value at link \(j-1\).

Example:

- User opens link 1 with \$10 of YES(\(O_1\)). With \(\alpha=0.8\), they may allocate at most \$8 to link 2.
- If \(V_1\) falls below \$8 (or \$(1-\tau)\cdot 8\) with hysteresis), link 2 (and any links after it) are liquidated. Link 1 remains open with its current value after unwind costs.

Notes:

- Collateral marks should use manipulation-resistant prices (e.g., TWAPs) and may include per-opportunity haircuts.
- Partial liquidation is optional: the protocol may either fully unwind \(j..k\) or reduce \(A*j\) until \(V*{j-1}\ge A_j\) again.
- If a resolution event and a liquidation trigger occur in the same block, resolution is processed first; then collateralization is re-evaluated.

---

## 4. Resolution & Payouts

### 4.1 Resolution Event

When opportunity $O_i$ resolves:

- Winning side receives entire losing-side liquidity.
- Liquidity provider receives initial deposit + 4% reward.
- Protocol takes 1% fee.
- Remaining winnings are distributed **pro-rata** to token holders.

### 4.2 Formula

Let:

- $W_i$ = total winning side liquidity
- $L_i$ = total losing side liquidity
- $H_j$ = holding of user j

Then payout per token:

$$
R_{token} = \frac{(W_i + L_i - LP_{reward} - ProtocolFee)}{\text{TotalWinningTokens}}
$$

User j’s payout:

$$
P_j = H_j * R_{token}
$$

---

## 5. Algorithmic Specification

### 5.1 Price Update Algorithm

```
function buy(opportunity, side, amount):
    if side == YES:
        opportunity.L_Y += amount
        opportunity.P_Y = (opportunity.L_Y / (opportunity.L_Y - amount)) * opportunity.P_Y
        opportunity.P_N = (opportunity.L_N / (opportunity.L_N + amount)) * opportunity.P_N
    else:
        ... (symmetric)
```

### 5.2 Chain Resolution Algorithm

```
function resolve_chain(chain):
    for i from 0 to len(chain)-1:
        outcome = get_outcome(chain[i].opportunity)
        if outcome == chain[i].side:
            payout = chain[i].amount * get_payout_rate(chain[i].opportunity)
            chain[i].status = 'WIN'
            chain[i].payout = payout
            break_chain(chain, i)
            break
        else:
            chain[i].status = 'LOSE'
            zero_out(chain[i:])
            break
```

### 5.3 Liquidation Monitoring & Execution

```
// alpha_open is the per-link allocation factor (e.g., 0.8)
// mcr = 1.0 enforces V_{i-1} >= A_i; tau is hysteresis (e.g., 0.01)
function monitor_and_liquidate(chain, alpha_open=0.8, mcr=1.0, tau=0.01):
    // Precondition: chain[0] is funded; each chain[i>0] stores allocated_from_prev = A_i
    for i from 1 to len(chain)-1:
        collateral_value = mark_value(chain[i-1].opportunity, chain[i-1].side)
        allocated = chain[i].allocated_from_prev  // A_i fixed at open
        threshold = allocated * mcr * (1 - tau)
        if collateral_value < threshold:
            liquidate_downstream(chain, start_index=i)
            break

function liquidate_downstream(chain, start_index):
    // Prevent new downstream links during unwind
    freeze_new_downstream(chain)
    for j from len(chain)-1 down to start_index:
        unwind_position(chain[j])  // close into base via AMM/TWAP
        apply_liquidation_penalty(chain[j])
        chain[j].status = 'LIQUIDATED'
    unfreeze_prefix(chain, prefix_end=start_index-1)
```

---

## 6. Edge Cases

- **Simultaneous Resolution:** If multiple opportunities in a chain resolve simultaneously, evaluation order follows chain index.
- **Zero Liquidity:** If either $L_{Y_i}=0$ or $L_{N_i}=0$, trading is halted until external liquidity is added.
- **Deep Chains:** Chains can be arbitrarily deep; gas optimization is needed for on-chain execution.
- **Oracle Lag & Manipulation:** Use TWAPs and per-market haircuts for collateral marks; add circuit breakers around volatile moves.
- **Hysteresis:** Apply \(\tau\) bands around thresholds to prevent rapid flip-flop liquidations.
- **Partial vs Full Liquidation:** Implement either full unwind of \(j..k\) or partial reduction until \(V\_{j-1}\ge A_j\).
- **Resolution vs Liquidation Ordering:** If both occur in the same block, process resolution first, then re-evaluate liquidation conditions.

---

## 7. Future Work

- **Automated Hedging:** Allow users to automatically delta-hedge across YES/NO pairs.
- **Cross-Opportunity AMM:** Allow trading YES(Op1) directly for YES(Op2) without returning to USD.
- **Governance:** DAO-controlled listing of opportunities and fee parameters.

---

## 8. Conclusion

Sneak introduces a new financial primitive: the composable opportunity market. By enabling ERC-20 YES/NO tokens, collateralized position chaining, and deterministic recursive resolution, Sneak allows users to express complex market views, build hedged portfolios, and extract signal from collective betting behavior.

This whitepaper serves as the technical foundation for the implementation of Sneak’s smart contracts and front-end interfaces.
