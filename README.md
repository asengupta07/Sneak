# Sneak

**Private Opportunity Markets on Avalanche**

---

## 1. Introduction

Imagine spotting an unsigned band destined for massive success.
Instead of cold-calling record labels, what if you could **bet on them yourself** – and get paid when you’re right?

**Sneak** introduces **Opportunity Markets**: private prediction markets where those who discover opportunities are financially rewarded by those who have the resources to act on them.

Music labels, research labs, and VCs all want to find the “next big thing” before competitors. Meanwhile, people on the ground – fans, shop owners, researchers – often spot these opportunities early but lack institutional connections or ways to monetize their insight.

Prediction markets offer a way to turn information into signal using skin in the game. But traditional prediction markets require someone else to take the opposite side of every bet. This makes them poorly suited for discovery of early-stage opportunities where no one wants to bet against thousands of obscure ideas.

**Sneak solves this by making the natural counterparties the institutions that benefit from early discovery — but keeping market prices private so they alone can act on the information.**

---

## 2. Intuition & Motivation

### The Problem

* **Information is trapped**: Fans spot artists, researchers spot breakthroughs, locals spot businesses – but can’t monetize their insight.
* **Institutions miss early signals**: Labels, labs, and investors only find opportunities late, when competition is high.
* **Existing solutions don’t scale**: Scout programs require vetting and trust. Public prediction markets create free signals competitors can exploit.

### The Goal

Sneak aims to enable a mechanism where:

* **Scouts (discoverers)** are rewarded for early insight.
* **Sponsors (institutions)** receive private, actionable signals before competitors.
* **Markets remain fair** and difficult to exploit by insiders.

---

## 3. Mechanism Design

### 3.1 Core Idea

* Sponsors (e.g., a record label) create a family of **private prediction markets** for statements like:

  > “Will we sign Artist X in 2025?”
* Scouts can create new markets for artists not yet listed.
* The **sponsor provides liquidity** — e.g., \$25,000 per market — acting as the “dumb money” that scouts can profit from if they are right.
* As scouts buy more shares, **the price rises (privately)**, giving the sponsor a signal to investigate earlier.
* If the sponsor acts (signs the artist), winning shares pay out.

This creates a **decentralized scouting program** powered by Sneak, open to anyone worldwide.

---

### 3.2 Privacy & Incentives

#### Private Pricing

Unlike public prediction markets, **only the sponsor sees market prices and order flow in real time**.
This prevents competitors from free-riding on the signal.

To prevent traders from inferring prices from immediate feedback:

* Orders settle after an **opportunity window** (e.g., two weeks).
* After the window, positions are revealed to traders, and optionally market prices can be made public for transparency.

---

### 3.3 Confidential Bets with eERC

To ensure that **no one (including competitors, external observers, or other traders) can see how much any participant is betting**, Sneak uses the **Encrypted ERC-20 (eERC)** standard from AvaCloud.

#### Why eERC?

* **Confidential transactions:** Trader balances and bet sizes remain hidden.
* **Client-side privacy:** Encryption, decryption, and zk-proof generation happen locally, not via a trusted third party.
* **Fully on-chain:** Works on Avalanche without relayers or off-chain actors.
* **Auditable:** Supports external auditors for compliance if needed.

#### Implementation in Sneak

* Users convert AVAX → **Sneak-wrapped eERC** (converter mode).
* All trades and liquidity provision occur in eERC.
* This means **nobody can see which opportunity a user bet on, nor how much they bet**, preserving both financial privacy and information advantage.

---

### 3.4 Market Design Choices

* **Liquidity Provision:** Sponsors may use an AMM or order book with liquidity concentrated between certain probability ranges (e.g., 1%–30%).
* **Unlimited vs. First-N Markets:**

  * *Unlimited:* Sponsor promises to pay out on all signings (trust-based).
  * *First-N:* Fully collateralized markets that only pay out on the first N opportunities (permissionless, more trust-minimized).
* **Anti-Exploitation Measures:**

  * Sponsors commit to never selling into their own markets.
  * Profits are recycled into liquidity or redistributed to traders.
  * Final trades and resolutions may be revealed post-event for transparency.

---

## 4. Benefits

| Stakeholder  | Benefit                                                                          |
| ------------ | -------------------------------------------------------------------------------- |
| **Scouts**   | Monetize early insight, globally accessible mechanism, skin-in-the-game rewards. |
| **Sponsors** | Receive early, private, actionable signals and reduce scouting costs.            |
| **Market**   | More efficient discovery of high-leverage opportunities.                         |

---

## 5. Challenges

| Challenge                                 | Possible Mitigation                                                                    |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| **Blind Trading (No Immediate Feedback)** | Allow partial position reveals or algorithmic trading agents.                          |
| **Self-Dealing / Insider Abuse**          | Commit to no sell-side manipulation, use TEEs, make trade logs public post-resolution. |
| **Liquidity Management**                  | Use bounded liquidity, dynamic incentive sizing, or First-N market structure.          |
| **Regulatory Considerations**             | Use eERC’s auditor framework for compliance.                                           |

---

## 6. Conclusion

**Sneak** opens up a **new design space for private, incentive-aligned discovery of opportunities** across domains — music, sports, research, investing.

By combining **private prediction markets** with **privacy-preserving infrastructure like eERC**, Sneak enables:

* Confidential participation
* Actionable institutional signals
* Scalable, trust-minimized scouting

We believe Sneak could become a core primitive for the future of **information finance**.

<!-- If you’re interested in contributing liquidity, building tooling, or experimenting with new incentive designs, we’d love to collaborate. -->
