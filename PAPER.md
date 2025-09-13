# Multiverse Finance — Technical Whitepaper (eERC-enabled, opportunity-market aware)

**Status:** design draft — reference implementation choices are called out.
**Scope:** a rigorous, algorithmic spec for Multiverse Finance: verses (parallel universes) + binary YES/NO assets + composable leverage chains + private balances via eERC.
**Goal:** deliver a clear, internally-consistent accounting model and complete algorithms (create market, trade, collateralize, resolve, cascade) that implement the behaviour you described (including the example arithmetic).

---

# 1. Executive summary (TL;DR)

* Multiverse Finance models conditional (event-conditioned) **verses**. For each verse (opportunity / event) the protocol issues two claim tokens: **YES** and **NO**.
* Markets are initialized by sponsors (LPs). Each market has two pools: `R_yes` and `R_no`. Initially each side is seeded by LP (often 50/50). YES and NO token *prices* are derived from a deterministic bonding-style pricing rule (we use the multiplicative update you described).
* Traders buy YES or NO with USD-equivalent value (we'll call this **stable units** for the paper; on Avalanche this would be wrapped eERC converted from AVAX). Buying updates the market price by a multiplicative rule (example below) and mints claim tokens to the buyer.
* Claim tokens can be used as collateral inside the multiverse: you can borrow, lend, and create multi-opportunity chains (use YES from market A as collateral to borrow funds to buy YES/NO in market B, etc.). Because tokens in the same verse resolve together, loans entirely within the same verse have special risk properties (simultaneous payoff/zeroing).
* At resolution: the losing-side reserves are transferred to the winners, minus protocol tax and LP payouts. The protocol enforces LP payout (principal + configurable premium) before distributing remainder to winning claim holders. If any token in a dependency chain becomes zero, dependent positions are liquidated *recursively* — we provide an explicit graph traversal algorithm.
* Confidentiality of who bet what and how much is provided by using **eERC (AvaCloud)** in converter mode; we note the privacy/enforceability tradeoffs and the proof obligations needed.

---

# 2. Definitions, notation, primitives

**Verse / Opportunity**

* `V` — an event / verse / market (e.g., “Will X be signed in 2025?”). Every `V` has two mutually-exclusive outcomes (binary): YES (Y) and NO (N). Resolution oracle picks one real-world outcome at resolution time `T_resolve`.

**State variables (per `V`)**

* `R_y` — USD-value reserve on YES side (includes LP & trader USD deposits).
* `R_n` — USD-value reserve on NO side.
* `p_y` — market price of one unit YES (in USD).
* `p_n` — market price of one unit NO (in USD).
* `S_y` — total YES token supply (units).
* `S_n` — total NO token supply (units).
* `LP_total` — total LP provided at market initialization (USD). LP is typically split into `LP_y` and `LP_n` according to initial weighting.
* `r_lp` — LP premium (example: 4% = 0.04).
* `tau` — protocol tax fraction applied to the losing-side pool on resolution (example: 1% = 0.01).
* `k` — an invariant used by the pricing rule (see §4).

**Positions & Loans**

* `Position` — a record created when a trader buys tokens: `(owner, verse, side, amount_USD, tokens_minted, timestamp)`
* `Loan` — a record `(borrower, lender, collateral: (verse, side, token_amount), borrowed_amount_USD, collateral_locked)`.

**Dependency Graph**

* Directed edges represent collateralization: an edge `A -> B` means **A tokens were used as collateral** to create position B (B depends on A). The protocol uses this graph to compute cascading failures.

---

# 3. High-level invariants & assumptions

1. **Loss / Winner pool invariant at resolution.** At resolution, the set of funds reserved in `R_yes` and `R_no` plus any protocol escrow must be sufficient to pay LP returns + protocol fee + winners’ payouts. The protocol enforces this by either (a) requiring sponsor/LP to collateralize LP premium into an escrow outside the loser pool, or (b) disallowing LP\_total beyond some safe factor relative to expected trader deposits. The design below assumes the sponsor/LP explicitly accepts that their LP funds are at market risk but *also* wants a preferential LP payout (principal + r\_lp) funded primarily from losing-side funds; we call this **LP-priority payout**. Implementation choices and solvency constraints are discussed in §11.

2. **eERC privacy model.** We will use eERC in converter mode to turn AVAX → wrapped private USD-equivalent tokens for trading. Because balances are encrypted, the protocol must either (a) require zk-proofs that certain amounts were transferred into contract escrows, (b) use auditor-accessible keys (eERC supports rotatable auditors), or (c) use a TEE for private matching. We discuss these tradeoffs in §10.

3. **Bonding-style pricing chosen.** The trading example you gave is used as the canonical price update rule (multiplicative scaling); we formalize it below. This is a **design choice** (not the only possible one), selected to exactly reproduce the numeric behaviour you showed.

---

# 4. Pricing rule (reference implementation — multiplicative update)

This section fixes the exact pricing and minting rule used in the numeric example you supplied.

**Initial conditions**

* When a market `V` is created, sponsor deposits `LP_total`. By default LP split is equal: `LP_y = LP_total/2`, `LP_n = LP_total/2`. Initialize:

  * `R_y := LP_y`, `R_n := LP_n`
  * `p_y := 0.50` (50 cents), `p_n := 0.50`
  * `S_y := LP_y / p_y` (so initial YES supply = LP\_y / 0.5), `S_n := LP_n / p_n`.

> Note: `S_y` and `S_n` are used to track token counts. We adopt the convention that when funds are added to a side (a trader buys that side), the buyer receives `tokens = amount_usd / p_current` units (rounded according to decimals). After the trade we update reserves and prices by the multiplicative rule below.

**Trade (buy) step** — buying `Δ` (USD) of YES on market `V` at current `p_y`:

1. `tokens_minted := Δ / p_y` (buyer receives these YES tokens).
2. `R_y := R_y + Δ`. (funds are added to the YES side reserve)
3. Update prices multiplicatively:

   * `p_y := p_y * (R_y / (R_y - Δ))` — equivalently `p_y_new = p_y_old * (R_y_new / R_y_old)`.
   * `p_n := p_n * ((R_y - Δ) / R_y)` — equivalently `p_n_new = p_n_old * (R_y_old / R_y_new)`.
     (This ensures `p_y * p_n` remains constant; product invariant explained below.)
4. `S_y := S_y + tokens_minted`.

**Sell (redeem)** — when a user wants to sell YES, implement symmetrical steps (reduce `S_y`, reduce `R_y` by `amount`, update prices inversely). (Detailed sell algorithm given later.)

**Conserved invariant (pricing)**:

* Let `K := p_y * p_n`. Under the multiplicative update above `K` stays constant (because `p_y` is multiplied by `R_y_new/R_y_old` while `p_n` multiplied by the inverse). If initially `p_y = p_n = 0.5`, then `K = 0.25`. After any YES buy with Δ > 0, `p_y` increases and `p_n` decreases such that `p_y * p_n = 0.25`.

**Why choose multiplicative update?**

* This replicates the exact numeric updates you wrote down. It creates *immediate paper gains* for pre-existing holders when `p_y` rises. It is a bonding-like curve: buyers both add funds and move the price multiplicatively. It's a clean primitive for the “leveraging across verses” user story. (Alternative MM/AMM rules are possible; if you want classical probability-based pricing where `p_y = R_y / (R_y + R_n)`, we can switch — but it will change the arithmetic and composability mechanics.)

---

# 5. Minting, supply, and accounting

**Token accounting**

* YES and NO tokens are ERC20-like tokens *scoped by verse*. The reference implementation uses two logical token contracts (`YES` and `NO`) that internally index balances per `verseId`. Externally, functions take `verseId` as an additional parameter (e.g., `balanceOf(address, verseId)`). This preserves the "two-contract" requirement while supporting multiple independent markets.

**Operations when a buyer spends USD `Δ` to buy YES**:

* `tokens_minted = Δ / p_y_old` (rounded down to token decimals).
* Add `tokens_minted` to `S_y` and to buyer's `balance[YES][verseId]`.
* Add `Δ` to `R_y`.
* Update prices as in §4.

**Payout at resolution (conceptual)**

* Let `winning_side = YES` (the oracle says YES). Let `R_win = R_y`, `R_lose = R_n`.

* Protocol tax: `tax = tau * R_lose`.

* LP priority payout: the protocol pays `LP_principal + LP_principal * r_lp` to LP(s). Implementation choices for distribution across LPs depend on whether LPs are per-market or aggregated across many markets. For per-market LPs: `lp_payments = sum_i(P_i * (1 + r_lp))` where `P_i` is LP deposit by provider `i` for this market. Protocol enforces exact repayment (discussed further below).

* Remaining pool `R_remain = R_lose - tax - LP_interest_payments`. If `R_remain < 0`, the market is underfunded — fallback policies apply (see §11).

* Each winner `w` receives: `payout_w = (their_token_balance) * 1USD_equivalent_per_token + pro-rata_share_of(R_remain)`. For the first term we define `1USD_equivalent_per_token` for winners as: winners *retrieve* their side reserve `R_win` pro-rata to their token holdings (so winners split `R_win` among themselves). Then they also receive a share of `R_remain`. Thus final `payout_w = (their_tokens / S_win) * R_win + (their_tokens / S_win) * R_remain`.

* LPs receive their scheduled LP payments before winners receive `R_remain`.

**Note on backing vs market price**

* Because the multiplicative update decouples token price from immediate on-chain reserve (`p * S` may differ from `R`), **settlement always uses reserves `R` and token supply `S` to compute entitlement**, not token `p * holdings`. This is necessary for solvency. That is, the actual USD available to distribute is `R_win + R_lose` (plus any protocol escrow). Winners’ entitlement is computed from those reserves after fees and LP payments.

---

# 6. Example — two markets + person A (step-by-step numeric)

We reproduce your example and extend it to a chain example. All arithmetic below is exact to the precision shown.

**Markets**:

1. `V1 = seedhemaut splitting?` — `LP_total = $100`

   * `LP_y = 50`, `LP_n = 50`
   * initial `p_y = p_n = 0.50`, `R_y = 50`, `R_n = 50`, `S_y = 100`, `S_n = 100`.

2. `V2 = katseye make it big?` — `LP_total = $200`

   * `LP_y = 100`, `LP_n = 100`
   * initial `p_y = p_n = 0.50`, `R_y = 100`, `R_n = 100`, `S_y = 200`, `S_n = 200`.

**Person A trades**:

* A buys `$10` of YES(katseye) on `V2`.

  Calculation (using §4):

  * `p_old = 0.50`, `R_y_old = 100 * 0.5 = 100?` — careful: in our setup `R_y` equals LP\_y = 100 (USD), consistent.
  * `tokens_minted = 10 / 0.50 = 20 tokens` (YES\_katseye).
  * `R_y_new = 100 + 10 = 110`.
  * `p_y_new = 0.50 * (110 / 100) = 0.50 * 1.10 = 0.55` — **NOTE**: this differs from your earlier arithmetic because your example assumed `LP_total` was \$100 split 50/50 resulting in `R_y = 50` initially. In the text you offered a smaller market with `LP=100` and `50/50` so `R_y=50`. To match *your exact numbers* below we will adopt the small-market convention (see the next concrete numeric block). — to avoid confusion we give the concrete numbers that match your example next.

**Concrete numbers that match your posted arithmetic** (you used `LP=100` per market, split 50/50 => `R_y = 50` initially). We'll follow that for the rest of this numeric example.

* For `V2` with `LP_total = $100` (split 50/50), initial `R_y=50`, `R_n=50`, `p_y=0.50`.

A buys `$10` YES(katseye):

1. `tokens_minted = 10 / 0.50 = 20 tokens`.
2. `R_y_new = 50 + 10 = 60`.
3. `p_y_new = 0.50 * (60 / 50) = 0.50 * 1.2 = 0.60` → YES(katseye) price becomes **\$0.60**.
4. `p_n_new = 0.50 * (50 / 60) = 0.50 * 0.8333333333333 = 0.4166666666667` → NO(katseye) becomes **\$0.416666666667**.
5. A's new paper value = `tokens_minted * p_y_new = 20 * 0.60 = $12.00`.

So this reproduces the arithmetic you supplied.

**A then leverages**: A uses the 20 YES(katseye) tokens as collateral (paper value \$12) to *borrow* \$12 (or less, depending on lending LTV) and uses borrowed funds to buy YES(seedhemaut) in `V1`:

* Assume seed market starts `R_y = 50`, `p_old = 0.50`. Buyer uses borrowed \$12 to buy YES(seedhemaut):

  * `tokens_minted_seed = 12 / 0.50 = 24 tokens`.
  * `R_y_seed_new = 50 + 12 = 62`.
  * `p_y_seed_new = 0.50 * (62 / 50) = 0.62`.
  * A's new paper value in seed = `24 * 0.62 = $14.88`.

**Chain result interpretation**:

* **If `V2` (katseye) resolves as NO (fails)**: YES(katseye) tokens go to zero. Collateralised loans that used YES(katseye) as collateral become under-collateralized. Lenders seize collateral, but collateral has zero value — the lender can't be repaid; dependent positions (e.g., the seed position bought using borrowed funds) are at risk and would be defaulted / liquidated. This *cascades*; the protocol will traverse the dependency graph and mark dependent loans/positions as defaulted — see §8 algorithm.

* **If `V2` resolves YES (katseye succeeds)**: YES(katseye) tokens become convertible into base USD (pull-up rules discussed in §7). Collateral may be returned to borrower who can repay their borrowings; the chain *splits* into branches where the upstream collateralized event is resolved and downstream positions proceed independently.

We give exact numeric liquidation/payout examples in §9.

---

# 7. Verse resolution — pull-up and splitting rules

**At resolution time `T_resolve`** the oracle reports an outcome. Let `winning_verse = P_i` (one partition element). Protocol does:

1. Any verse that does **not** contain the observed outcome is **evaporated**. All tokens tied exclusively to evaporated verses become worthless (balance -> 0 for payout purposes). Their reserves have been pre-allocated; losers’ reserves move to the `losing_pool` for distribution.

2. If a single child verse `P_i` remains after resolution (common binary case), `P_i` *partitions the parent* and tokens of `P_i` can be **pulled up** to parent: owners can convert their tokens into parent-universe tokens (which are withdrawable as base USD). In practice we allow `pullUp(verseId_child, targetVerse)` which burns child tokens and credits parent-universe balance.

3. After pull-ups are processed and LP / tax taken, the winners are paid per the settlement formula in §5.

**Atomicity**: resolution and settlement must be atomic: oracle triggers settlement function which performs all protocol steps in one transaction (or in a dispute-handling flow).

---

# 8. Dependency graph and cascading liquidation algorithm

When tokens are used as collateral for loans and then used to buy other market positions, you create a directed dependency graph `G`:

* Nodes = positions (purchases, loans, collaterals).
* Edge `u -> v` means *v depends on u* (e.g., v loaned against u; v’s collateral includes tokens minted at u).

**Goal**: when a node becomes worthless (its verse evaporates), find all nodes that transitively depend on it and mark them defaulted; seize collateral where possible and reallocate to lenders and creditors in correct priority order.

**Algorithm (BFS cascade)**

```
function cascade_defaults(evaporated_verse V0):
    queue := all positions that *directly* depend on tokens belonging to V0
    visited := empty set
    while queue not empty:
        pos := queue.pop()
        if pos in visited: continue
        visited.add(pos)

        # mark pos as defaulted
        pos.state := DEFAULTED

        # For loans where pos was the borrower:
        for each loan L where L.borrower == pos.owner and collateral_locked includes tokens from evaporated verse:
            # seize collateral
            seized := seize_collateral(L)
            # attempt to repay lender using seized
            repay_amount := min(seized.value_usd, L.borrowed_amount_usd)
            lender.balance += repay_amount
            remainder := seized.value_usd - repay_amount
            if remainder > 0:
                # remainder goes to borrower (if policy)
                borrower.balance += remainder

            # Mark loan closed
            L.state := CLOSED

            # Any positions that used the seized collateral (i.e., other loans that used borrower tokens as collateral) are now impacted:
            for each dependent_position D that used the same collateral:
                queue.push(D)

        # For any positions that used pos's tokens as collateral:
        for each dependent_position D depending on pos:
            queue.push(D)
```

**Notes & choices**:

* `seize_collateral(L)` returns actual USD value of collateral at the time of seizure (often zero for evaporated tokens). If collateral value insufficient to repay lender, lender suffers loss equal to `L.borrowed_amount_usd - seized_value`. The protocol may enforce insurance pools or require lenders to over-collateralize.
* When collateral seizing causes other loans to become undercollateralized, those loans are also queued — hence cascade.

We provide a formal, gas-efficient implementation plan in the smart-contract section (events, batched processing) to avoid reentrancy attacks.

---

# 9. Settlement & fee distribution — worked numeric examples

We give two settlement illustrations to show LP / tax / winner distribution.

**Parameters**: `r_lp = 4%` (0.04), `tau = 1%` (0.01).

### Example A — simple market, no leverage

Market with `LP_total = 100`, `R_yes = 50`, `R_no = 50` initially; after trading final state is `R_yes = 80`, `R_no = 70` (for example). Suppose oracle resolves YES.

* `R_win = R_yes = 80`
* `R_lose = R_no = 70`
* `tax = tau * R_lose = 0.01 * 70 = $0.70`
* `LP_principal_total = LP_total = $100` (LPs expect return of principal + 4% = \$104 total). Implementation requires that LP premium `LP_interest` of \$4 must be taken from the loser pool(s). Here `R_lose = $70` is less than `LP_interest (= $4)` in this example? Wait, LP\_interest = 4% of principals = 0.04 \* 100 = \$4. 70 >= 0.70 + 4 = 4.70 available, so sufficient.

Compute:

* After tax & LP interest: `R_remain = R_lose - tax - LP_interest = 70 - 0.70 - 4 = 65.30`.
* Winners split their side `R_win` among token holders; additionally winners split `R_remain` pro-rata. If a winner holds `w_tokens` and total winner supply `S_win`, payout:

  `payout = (w_tokens / S_win) * R_win + (w_tokens / S_win) * R_remain`.

**Example B — small market matching the exact numbers in §6**:

`V2` (katseye), initial `R_yes = 50`, user A buys \$10 YES:

* After trade: `R_yes = 60`, `R_no = 50`, `p_yes = 0.60`, `p_no ≈ 0.4166666667`.
* Suppose at resolution `YES` wins. Suppose there are no other traders: `S_yes` contains tokens minted to A and LP-supplied tokens. Detailed S computation:

  * Initial `S_yes_initial = LP_y / p_initial = 50 / 0.5 = 100 tokens`.
  * A minted `20` tokens, so `S_yes_total = 120`.
  * `R_win = R_yes_final = 60`, `R_lose = R_no_final = 50`.
  * `tax = 0.01 * 50 = 0.50`.
  * `LP_principal_total = 100`, `LP_interest = 0.04*100 = 4.00`. (Does market have enough losing pool? R\_lose = \$50 so 50 - 0.5 - 4 = 45.5 left.)
  * `R_remain = 50 - 0.50 - 4.00 = 45.50`.
  * A’s share = `20 / 120 = 1/6`.
  * A receives: `(1/6) * R_win + (1/6) * R_remain = (1/6)*(60 + 45.5) = (1/6)*105.5 = 17.5833333333`.

  So A invested \$10 and ends up receiving \~\$17.5833 on resolution — note this includes the portion of LP principal that was returned to winners and the distribution of losing funds after LP interest & tax are extracted.

> This is a *reference settlement policy* that matches your rule stating "losing side entire amount is added to winning side for distribution, LP gets back their initial investment + 4% and 1% is taken as protocol tax, the rest amount is distributed equally with the winners."

**Important solvency check**: LP interest + tax must be ≤ `R_lose` else the system cannot satisfy LP + tax. The protocol must either (A) prevent such imbalance at market creation (require LP\_initial ≤ fraction of expected total or sponsor escrow), or (B) have a fallback partial payment policy (pro-rate LP interest or use an insurance pool).

---

# 10. Privacy (eERC) integration & enforceability

You requested to implement this with **eERC (AvaCloud)**. Key implications and required proofs:

**What eERC gives you (from your prior summary)**:

* Confidential on-chain token balances and transfers.
* Client-side zk-SNARK proof generation; no relayers required.
* Converter mode: wrap AVAX → eERC and trade with private amounts.
* Auditor support: rotatable auditors for compliance.

**Practical consequences for Multiverse Finance**:

1. **Private Bets** — Since trades are committed in eERC, market-side amounts (who bet how much on which verse) can be private. This matches your goal: *no one else knows how much anyone bets on a particular opportunity*.

2. **On-chain Enforceability** — Even though balances are private, the protocol must be able to verify **that** required funds were deposited to the contract (escrow) before minting claim tokens or granting loans. This requires **proofs**:

   * Use eERC proofs that a transfer of `Δ` from a private balance to market escrow occurred, without revealing `Δ`. The market contract should accept a ZK-proof of deposit (proof attests `transfer(amount=Δ) to escrow`). eERC supports such proofs per your notes; implementation must wire the contract to verify proofs before minting tokens.

3. **Collateral & Liquidation in private setting** — If collateral balances are encrypted, the protocol needs zk-proof-based protocols to:

   * Lock collateral (proof-of-lock).
   * Prove collateral valuation at the time of seizure (either revealed to auditors or proven via zk).
   * Alternatively the protocol could require collateral to be wrapped into a *public escrow* when used as collateral (this reduces privacy but simplifies enforcement). The paper recommends a hybrid approach: use full privacy for trading, but require collateralized positions to be *temporarily escrowed* (encrypted escrow with auditor-access or ZK proofs of lock) so lenders can ensure enforceability.

4. **Recommendation**:

   * Use **eERC converter mode** for private balances.
   * For deposits used to mint claim tokens, require a **zk-deposit-proof** to the market contract. The market contract mints claim tokens only after verifying the proof.
   * For collateralized loans, require a **zk-lock-proof** that the collateral is under custody of the lending contract (and associate an auditor key for emergency dispute resolution), or wrap collateral into a short-term *public* escrow (reduces privacy but ensures liquidation).

---

# 11. Safety / solvency / parameter constraints

To avoid underfunded payouts and cascading insolvency:

1. **LP interest solvency constraint**
   At market creation, if LP expects guaranteed premium `r_lp`, protocol must ensure:
   `R_lose_max_possible >= tau * R_lose_max_possible + Sum(LP_principal_i * r_lp)` for any possible losing side. Because `R_lose_max_possible` is endogenous (depends on trader deposits) the safe approach is **require LP\_providers to collateralize their premium into a separate escrow**, or require sponsor to top up escrow equal to `Sum(LP_principal_i * r_lp)`. If you don't want sponsors to escrow, cap `LP_total` supportable by current pool size: `LP_total <= (1 - tau) * R_lose` — this is brittle.

2. **Loan LTV limits**
   Loans using tokens as collateral must set conservative LTVs. While tokens from within the same verse will go to zero together at resolution (reducing liquidation race), prices can move between trades; set `LTV <= 100%` only if loans are settled only at resolution or if loans are overcollateralized. Practical design: `LTV_max = 0.8` (80%) for intra-verse loans, lower for cross-verse.

3. **Oracle safety**
   Use reputable oracle + dispute window to avoid malicious or erroneous resolution. Disputes should pause settlements until resolved. Notarize final resolution on-chain.

4. **Protocol insurance**
   Maintain a global insurance pool to cover partial shortfalls in case `R_lose` insufficient to cover LP interest & tax.

---

# 12. Contract API (reference pseudocode / interface)

**High-level Solidity-style interface (pseudo)**

```solidity
contract MultiverseMarket {
    // create a market
    function createMarket(bytes32 verseId, uint initialLP_usd, uint initialPrice_percentBasisPoints /* e.g., 5000 = 0.50 */) external;

    // deposit: accept a zk-deposit proof from eERC and mint claim tokens
    function zkDepositAndBuyYes(bytes32 verseId, bytes zkProof, bytes proofPublicInputs) external returns (uint tokensMinted);

    function zkDepositAndBuyNo(bytes32 verseId, bytes zkProof, bytes proofPublicInputs) external returns (uint tokensMinted);

    // collateralization: lock collateral (requires zk-lock proof or escrow)
    function lockCollateral(address owner, bytes32 verseId, bool side, uint tokenAmount) external;

    // open loan: borrow USD-equivalent against locked collateral
    function openLoan(address borrower, uint borrowAmountUSD, CollateralRef collateral) external returns (LoanID);

    // settleMarket: called by oracle adaptor; atomically performs tax, LP payout, winner distribution
    function settleMarket(bytes32 verseId, Side winningSide, OracleProof proof) external;

    // helper: cascade default processing (callable by system)
    function processCascadeDefaults(bytes32 verseId) internal;

    // ... events, getters
}
```

**Notes**: every state-changing method that touches private eERC balances must be accompanied by a zk-proof accepted by the contract verifying the transfer or lock. The contract verifies the proof before minting tokens or changing collateral state.

---

# 13. Full pseudocode: core operations

Below are condensed pseudocode routines for the key operations.

**Create market**

```
function createMarket(verseId, LP_total):
    LP_y := LP_total / 2
    LP_n := LP_total / 2
    R_y[verseId] := LP_y
    R_n[verseId] := LP_n
    p_y[verseId] := 0.5
    p_n[verseId] := 0.5
    S_y[verseId] := LP_y / 0.5
    S_n[verseId] := LP_n / 0.5
    record LP providers and escrow requirements (if any)
```

**Buy YES**

```
function buyYES(verseId, Δ_usd, buyer, zkDepositProof):
    verify zkDepositProof that Δ_usd was sent from buyer to this contract escrow
    tokens := floor(Δ_usd / p_y[verseId], tokenDecimals)
    R_y_old := R_y[verseId]
    R_y_new := R_y_old + Δ_usd
    p_y_new := p_y[verseId] * (R_y_new / R_y_old)
    p_n_new := p_n[verseId] * (R_y_old / R_y_new)
    S_y[verseId] += tokens
    R_y[verseId] := R_y_new
    p_y[verseId] := p_y_new
    p_n[verseId] := p_n_new
    credit buyer with tokens
    emit TradeExecuted(...)
    return tokens
```

**Open loan**

```
function openLoan(borrower, collateralRef, borrowAmountUSD):
    require collateralRef tokens locked with proof
    LTV := computeLTV(collateralRef, borrowAmountUSD)
    require LTV <= LTV_limit
    create Loan record
    transfer borrowed USD-equivalent (eERC) to borrower
```

**Settlement**

```
function settleMarket(verseId, winningSide):
    assert oracle proof valid
    R_win := R_yes if winningSide==YES else R_no
    R_lose := R_no if winningSide==YES else R_yes
    tax := tau * R_lose
    LP_interest := sum_over_LPs(P_i * r_lp)
    if R_lose < tax + LP_interest:
        handleUnderfundedCase()  # see §11
    R_remain := R_lose - tax - LP_interest

    # pay LP principals + interest (from R_lose or from escrow)
    payLPs()

    # pay winners: each winner gets pro-rata share of R_win + pro-rata share of R_remain
    for each winner w:
        payout := (w.tokens / S_win) * (R_win + R_remain)
        transfer payout (via eERC) to w
    close market and burn tokens
```

**Cascade defaults**

* Implement BFS as in §8.

---

# 14. Edge cases & all possible cases (exhaustive categories)

We enumerate a broad list of cases and the protocol policy for each:

1. **Insufficient losing-side funds to pay LP interest and tax** — policy options:

   * **(A)** Require per-market LP-interest escrow up-front (recommended).
   * **(B)** Pro-rate LP-interest from losers and supplement from global insurance pool.
   * **(C)** Use sponsor reputation: sponsors that repeatedly underfund lose ability to provide LP.

2. **Simultaneous multi-verse resolution** — if two dependent verses resolve at the same block, the protocol processes in canonical order (e.g., topological order by dependency graph) or treats them as atomic and calculates payouts accordingly.

3. **Partial fills / fractional tokens** — all arithmetic uses integer token units with token decimals; rounding floors token minting and keeps residual USD in a dust buffer allocated per-side.

4. **Front-running / MEV** — since prices update multiplicatively and trades reveal only zk-proofs of transfer (but not amount), MEV risk is limited; nevertheless reveal timing and TEE-based matching help mitigate.

5. **Oracle conflicts / disputes** — dispute window, temporary pause on liquidation until resolved.

6. **Collateral reuse / double-use** — disallowed: when collateral is locked it is tagged and cannot be re-used unless multi-signature release. The contract tracks lock references.

7. **Cross-verse borrowing** — allowed only if both tokens belong to the **same parent verse** or if the protocol can enforce simultaneous zeroing. Cross-verse loans expose liquidation risk and should use conservative LTVs.

8. **Market creator malfeasance (self-dealing)** — require commitments: market creators cannot short (sell into) their own markets before LP lock-up window; use TEEs or on-chain commitments to reduce abuse.

9. **Privacy conflicts vs enforceability** — for fully private collateral the protocol must accept zk-lock proofs + auditor keys. If this is undesirable, require public escrow for collateral.

10. **Market with many partitions (more than binary)** — the multiverse map supports partitions `P1..PN`. The same settlement process extends: only the winning partition's reserves remain; losers are all other partitions.

---

# 15. Governance, parameters & recommended defaults

* `r_lp` (LP premium): default 4% (0.04). **Require LPs to escrow r\_lp at market creation** unless sponsor uses trusted reputation.
* `tau` (protocol tax): default 1% (0.01).
* `LTV_max` for intra-verse loans: default `0.80`. For cross-verse: `0.5`. These are configurable by governance.
* Dispute window: `48 hours` default for high-value markets.
* Oracle adapters: use decentralized oracle with aggregated reporting and on-chain evidence.

---

# 16. Security considerations

* Reentrancy — use checks-effects-interactions pattern.
* Oracle manipulation — minimize single-source oracle dependence; implement dispute game.
* zk-proof verification costs — on-chain proof verification gas cost must be accounted for; consider aggregating proofs or verifying via an on-chain verifier contract with batched proofs.
* LP over-exposure — detect markets where LP\_total far exceeds expected turnover; restrict or require extra escrow.

---

# 17. Implementation roadmap (suggested)

1. **Core non-private prototype** (public proof-of-concept): implement markets & multiplicative pricing, basic leveraged collateral, settling, cascading defaults. Use public tokens to validate logic & economics.

2. **Integrate eERC proofs**: replace public deposits with zk-deposit proofs and implement zk-lock proof interface.

3. **Collateral escrow & auditor flows**: build small auditor contracts for emergency dispute resolution and proofs for collateral locks.

4. **UI & tooling**: provide graphs of dependency chains and a "what-if" simulator for LTV and cascading failure.

---

# 18. Appendix — derivations & invariants

**Multiplicative price invariant**
Given `p_y_old`, `p_n_old` with `K := p_y_old * p_n_old`. On YES buy with `Δ`:

* `p_y_new = p_y_old * (R_y_old + Δ) / R_y_old`.
* `p_n_new = p_n_old * R_y_old / (R_y_old + Δ)`.
* Then `p_y_new * p_n_new = p_y_old * p_n_old * ( (R_y_old + Δ) / R_y_old ) * (R_y_old / (R_y_old + Δ)) = K`.

**Token minting vs reserve**

* Tokens minted = `Δ / p_y_old`.
* Note: after the trade, `p_y_new * S_y_new` is not equal to `R_y_new` in general. This is acceptable because *settlement* uses `R_y` and `S_y` to compute payouts (not `p * S`). The pricing mechanism is a market-making bonding curve that transiently changes the relation between token price and backing reserve. This must be understood by users: *capitalization backing is the reserve `R` and final payouts are computed from reserve amounts*.

---

# 19. What I did *not* assume or fake

* I did **not** assume any hidden eERC capability beyond the features you provided: converter mode, client-side zk proofs, auditor support, and fully on-chain operation. Where additional capabilities are required (e.g., a zk-proof that escrow holds exact collateral valuation at seizure time), I explicitly called them out as **requirements** for privacy+enforceability to work and suggested remediation (auditors or short-term public escrow).
* I did **not** pick an AMM other than the multiplicative rule you demonstrated — that exact rule is implemented as the canonical bonding rule in this spec to match your arithmetic and behaviour. If you prefer a different bonding curve (constant-sum, LMSR, or `R_y/(R_y+R_n)` probability model) I can convert all formulas and examples.

---

# 20. Next steps I can do for you (pick any; I will perform now)

* Convert this spec into a polished whitepaper PDF (with equations formatted, diagrams, and the cascade-flow chart).
* Produce a Solidity reference implementation of the **core market** (non-private prototype) implementing the multiplicative pricing, tokens, settlement & cascade logic.
* Produce a sequence diagram / flowchart SVG showing the chain of leveraged trades and cascade default.
* Convert the interface pseudocode to working smart-contract skeleton (solidity) with unit test plan.

Tell me which of these you want now and I’ll produce it immediately (I won’t ask clarifying questions — I’ll default to the most common next step if you don’t specify).
