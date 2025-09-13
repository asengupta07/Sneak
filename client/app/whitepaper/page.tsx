"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Shield, Eye, Users, TrendingUp, Lock, Zap, Target, DollarSign, Clock, CheckCircle, BookOpen, FileText, Database, Network, Cpu, Layers, GitBranch, BarChart3, AlertTriangle, Info, Music, Search, Lightbulb, Building2 } from "lucide-react"
import Navbar from "../components/Navbar"
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

export default function WhitepaperPage() {
  const [currentSection, setCurrentSection] = useState('abstract')

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id)
        }
      })
    }, observerOptions)

    const sections = document.querySelectorAll('section[id]')
    sections.forEach((section) => {
      observer.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section)
      })
    }
  }, [])

  const tableOfContents = [
    { id: 'abstract', title: 'Abstract', level: 1 },
    { id: 'introduction', title: '1. Introduction', level: 1 },
    { id: 'problem-statement', title: '1.1 Problem Statement', level: 2 },
    { id: 'solution-overview', title: '1.2 Solution Overview', level: 2 },
    { id: 'core-concepts', title: '2. Core Concepts', level: 1 },
    { id: 'opportunities', title: '2.1 Opportunities & ERC-20 Pairs', level: 2 },
    { id: 'pricing-mechanism', title: '2.2 Dynamic Pricing Mechanism', level: 2 },
    { id: 'position-chains', title: '3. Position Chains: Composable Leverage', level: 1 },
    { id: 'definition', title: '3.1 Chain Definition', level: 2 },
    { id: 'collateralization', title: '3.2 Collateralization & Liquidation', level: 2 },
    { id: 'resolution-payouts', title: '4. Resolution & Payout Engine', level: 1 },
    { id: 'resolution-event', title: '4.1 Resolution Event', level: 2 },
    { id: 'payout-formula', title: '4.2 Payout Formula', level: 2 },
    { id: 'privacy', title: '5. Privacy Architecture', level: 1 },
    { id: 'eerc-implementation', title: '5.1 eERC Implementation', level: 2 },
    { id: 'confidential-transactions', title: '5.2 Confidential Transactions', level: 2 },
    { id: 'implementation', title: '6. Technical Implementation', level: 1 },
    { id: 'smart-contracts', title: '6.1 Smart Contract Architecture', level: 2 },
    { id: 'avalanche-integration', title: '6.2 Avalanche Integration', level: 2 },
    { id: 'security', title: '7. Security Analysis', level: 1 },
    { id: 'threat-model', title: '7.1 Threat Model for Chained Positions', level: 2 },
    { id: 'attack-vectors', title: '7.2 Attack Vectors', level: 2 },
    { id: 'mitigation-strategies', title: '7.3 Mitigation Strategies', level: 2 },
    { id: 'economics', title: '8. Economic Model & Tokenomics', level: 1 },
    { id: 'stakeholder-analysis', title: '8.1 Stakeholder Analysis', level: 2 },
    { id: 'incentive-alignment', title: '8.2 Incentive Alignment', level: 2 },
    { id: 'algorithmic-spec', title: '9. Algorithmic Specification', level: 1 },
    { id: 'price-update-algo', title: '9.1 Price Update Algorithm', level: 2 },
    { id: 'chain-resolution-algo', title: '9.2 Chain Resolution Algorithm', level: 2 },
    { id: 'liquidation-algo', title: '9.3 Liquidation Monitoring', level: 2 },
    { id: 'edge-cases', title: '10. Edge Cases & Mitigations', level: 1 },
    { id: 'future-work', title: '11. Future Work', level: 1 },
    { id: 'conclusion', title: '12. Conclusion', level: 1 },
    { id: 'references', title: '13. References', level: 1 }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar variant="technical" currentPage="/whitepaper" />

      <div className="fixed left-0 top-20 w-80 h-screen bg-black/95 backdrop-blur-sm border-r border-orange-500/20 overflow-y-auto z-40 hidden lg:block">
        <div className="p-6 pb-40 mb-40">
          <h3 className="text-lg font-bold text-orange-500 mb-6">Table of Contents</h3>
          <div className="space-y-2">
            {tableOfContents.map((item) => {
              const isActive = currentSection === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById(item.id)
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      })
                    }
                  }}
                  className={`block py-2 px-3 rounded-lg transition-all duration-200 text-sm cursor-pointer ${
                    item.level === 1
                      ? `font-semibold ${
                          isActive
                            ? 'text-orange-500 bg-orange-500/20 border-l-2 border-orange-500'
                            : 'text-orange-500 hover:bg-orange-500/10'
                        }`
                      : `${
                          isActive
                            ? 'text-white bg-gray-800 border-l-2 border-orange-500 ml-4'
                            : 'text-gray-300 hover:bg-gray-800 ml-4'
                        }`
                  }`}
                >
                  {item.title}
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <main className="lg:ml-80">
        <section id="abstract" className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center bg-orange-500/10 border border-orange-500/20 rounded-full px-6 py-2 mb-8">
              <FileText className="w-5 h-5 text-orange-500 mr-2" />
              <span className="text-orange-500 font-medium">Technical Whitepaper v3.0</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-orange-500 to-white bg-clip-text text-transparent">
              Sneak: A Multiversal Finance Market Protocol
            </h1>

            <div className="bg-gray-900/50 border border-orange-500/20 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-orange-500 mb-6">Abstract</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Sneak is a fully composable, ERC-20 based opportunity market protocol that allows users to speculate on outcomes ("opportunities") while leveraging conditional liquidity across multiple opportunities in a recursive, chainable fashion. Unlike traditional prediction markets, Sneak is designed to:
              </p>
              <ul className="list-disc list-inside text-lg text-gray-300 leading-relaxed space-y-2">
                <li>Represent opportunities using symmetric YES/NO ERC-20 token pairs, making positions fully fungible and DeFi-compatible.</li>
                <li>Allow participants to leverage positions as collateral to create arbitrarily deep chains of conditional opportunity trades, amplifying capital efficiency.</li>
                <li>Redistribute losing-side liquidity to winning participants through a deterministic payout mechanism, featuring protocol fees and LP rewards.</li>
                <li>Provide a robust, algorithmic resolution system that preserves consistency and atomicity across complex, interdependent position chains.</li>
              </ul>
              <p className="text-lg text-gray-300 leading-relaxed mt-6">
                This paper formalizes the complete mechanism design, tokenomics, dynamic liquidity models, privacy architecture, and the recursive resolution algorithm that underpins the Sneak protocol. We present a system for creating highly expressive, conditional financial instruments on-chain.
              </p>
            </div>
          </div>
        </section>

        <section id="introduction" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-orange-500 mb-8">1. Introduction</h2>
            <div className="space-y-12">
              <div>
                <h3 id="problem-statement" className="text-2xl font-semibold text-white mb-6">1.1 Problem Statement</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The DeFi ecosystem has matured to support complex financial primitives, yet prediction markets remain a largely isolated and capital-inefficient vertical. Existing platforms suffer from several fundamental limitations that prevent mainstream adoption and deep integration with other DeFi protocols:
                </p>
                
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-red-400 mb-3">Key Problems:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span><strong>Illiquid & Non-Standard Tokens:</strong> Market positions are often represented by non-fungible or proprietary tokens, preventing their use as collateral in lending, borrowing, or other DeFi protocols.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span><strong>Capital Inefficiency:</strong> Capital is "locked" within a single prediction. A user cannot use the value of a likely-to-succeed position to speculate on another, unrelated event without first closing the initial position.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span><strong>Lack of Expressiveness:</strong> Traditional markets only allow simple, unconditional speculation. It is difficult to express complex, conditional views such as "I believe X will happen, and *if* it does, then Y will also happen."</span>
                    </li>
                     <li className="flex items-start space-x-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span><strong>Binary Payouts:</strong> The all-or-nothing payout structure of outcome tokens makes them volatile and difficult to price as collateral, leading to high collateralization requirements or outright incompatibility with money markets.</span>
                    </li>
                  </ul>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The current state of prediction markets represents a significant missed opportunity. While DeFi has enabled unprecedented composability and capital efficiency through protocols like Uniswap, Aave, and Compound, prediction markets have remained largely siloed. This isolation stems from several technical and economic barriers that prevent these markets from achieving their full potential as information aggregation and risk management tools.
                </p>

                <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-orange-500 mb-4">Market Size & Opportunity</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The global prediction market industry is estimated to be worth over $100 billion annually, yet on-chain prediction markets capture less than 0.1% of this volume. This massive gap represents both the current limitations of existing platforms and the enormous potential for innovation.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">Traditional Markets</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Centralized, opaque operations</li>
                        <li>• High barriers to entry</li>
                        <li>• Limited global accessibility</li>
                        <li>• Regulatory complexity</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">On-Chain Potential</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Global, permissionless access</li>
                        <li>• Transparent, auditable operations</li>
                        <li>• Composable with DeFi ecosystem</li>
                        <li>• Programmable, automated execution</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The fundamental issue is that existing prediction market platforms treat each market as an isolated entity. Users must choose between different markets, and their capital becomes locked within each individual prediction. This creates several problems:
                </p>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Technical Limitations</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">1. Token Standard Incompatibility</h5>
                      <p className="text-gray-300 text-sm">Most prediction platforms use proprietary token standards or non-fungible tokens (NFTs) to represent positions. This prevents integration with existing DeFi protocols that expect standard ERC-20 tokens.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">2. Capital Lock-up</h5>
                      <p className="text-gray-300 text-sm">Users cannot leverage their positions as collateral for other activities. A $10,000 position in a 90% likely outcome cannot be used to fund additional speculation without first selling the position.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">3. Limited Expressiveness</h5>
                      <p className="text-gray-300 text-sm">Traditional markets only allow simple binary bets. Complex conditional strategies like "If X happens, then bet on Y" require multiple separate transactions and manual management.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 id="solution-overview" className="text-2xl font-semibold text-white mb-6">1.2 Solution Overview</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  <strong>Sneak</strong> introduces the concept of a composable **opportunity market** to solve these issues. By representing every position as a pair of standard, fungible ERC-20 tokens (YES/NO), Sneak unlocks the ability for these positions to be used as collateral. The protocol's core innovation is the **Position Chain**, a mechanism that allows users to recursively leverage the value of one position to fund another, creating a chain of conditional speculations.
                </p>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-green-400 mb-3">Key Innovations:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Fungible ERC-20 Positions:</strong> All YES/NO positions are standard ERC-20 tokens, making them instantly compatible with the entire DeFi ecosystem.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Position Chaining:</strong> A novel primitive for creating chains of dependent speculations, radically improving capital efficiency.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Recursive, Atomic Resolution:</strong> A deterministic algorithm that can resolve entire chains of outcomes atomically, ensuring consistency even in complex scenarios.</span>
                    </li>
                     <li className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Privacy by Design:</strong> Optional integration with the eERC standard to enable fully confidential transactions and position management.</span>
                    </li>
                  </ul>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The Sneak protocol fundamentally reimagines how prediction markets work by treating every position as a first-class DeFi asset. Instead of creating isolated markets, Sneak creates a unified ecosystem where positions can be composed, leveraged, and integrated with existing DeFi protocols.
                </p>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">Architecture Overview</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                      <div>
                        <h5 className="font-semibold text-white">Market Creation</h5>
                        <p className="text-gray-300 text-sm">Anyone can create a new opportunity market by providing initial liquidity and defining clear resolution criteria.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                      <div>
                        <h5 className="font-semibold text-white">Token Minting</h5>
                        <p className="text-gray-300 text-sm">Each market mints two ERC-20 tokens: YES and NO, representing opposing outcomes with dynamic pricing.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                      <div>
                        <h5 className="font-semibold text-white">Position Chaining</h5>
                        <p className="text-gray-300 text-sm">Users can use their positions as collateral to create chains of conditional speculations, maximizing capital efficiency.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">4</div>
                      <div>
                        <h5 className="font-semibold text-white">Atomic Resolution</h5>
                        <p className="text-gray-300 text-sm">When outcomes resolve, entire chains are processed atomically, ensuring consistency and preventing partial failures.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  This architecture enables several powerful use cases that were previously impossible:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-orange-500 mb-3">Capital Efficiency</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Users can leverage a single position across multiple markets, dramatically increasing their effective capital utilization.
                    </p>
                    <p className="text-gray-300 text-sm font-mono bg-gray-800/50 rounded p-2">
                      Example: $1,000 → YES(Event A) → 80% → YES(Event B) → 80% → NO(Event C)
                    </p>
                  </div>
                  <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-orange-500 mb-3">Complex Strategies</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Express sophisticated conditional views: "If X happens, then Y will also happen, but if Z happens instead, then W will occur."
                    </p>
                    <p className="text-gray-300 text-sm font-mono bg-gray-800/50 rounded p-2">
                      Example: Hedged positions across correlated events
                    </p>
                  </div>
                </div>

                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">DeFi Integration</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Because all positions are standard ERC-20 tokens, they can be seamlessly integrated with existing DeFi protocols:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-cyan-400 mb-2">Lending Protocols</h5>
                      <p className="text-gray-300 text-sm">Use positions as collateral for borrowing other assets</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-cyan-400 mb-2">DEX Integration</h5>
                      <p className="text-gray-300 text-sm">Trade positions on automated market makers</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-cyan-400 mb-2">Yield Farming</h5>
                      <p className="text-gray-300 text-sm">Provide liquidity and earn rewards on position tokens</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="core-concepts" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-orange-500 mb-8">2. Core Concepts</h2>
            
            <div className="space-y-12">
              <div>
                <h3 id="opportunities" className="text-2xl font-semibold text-white mb-6">2.1 Opportunities & ERC-20 Pairs</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  An <strong>opportunity</strong> <InlineMath math="O_i" /> is a market on a binary event with a clearly defined resolution criterion. Each opportunity created on Sneak mints two distinct, fungible ERC-20 tokens:
                </p>
                <ul className="list-disc list-inside text-lg text-gray-300 leading-relaxed space-y-2 mb-6">
                  <li>A <strong>YES token</strong> (<InlineMath math="Y_i" />), representing a belief that the event resolves positively.</li>
                  <li>A <strong>NO token</strong> (<InlineMath math="N_i" />), representing a belief that the event resolves negatively.</li>
                </ul>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  These tokens are backed by a shared liquidity pool within an Automated Market Maker (AMM). The total value of a <InlineMath math="Y_i" /> and <InlineMath math="N_i" /> token pair is designed to approach 1 base currency unit (e.g., 1 USDC) upon resolution.
                </p>

                <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-orange-500 mb-4">Token Standard Compliance</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    All opportunity tokens are fully compliant with the ERC-20 standard, ensuring seamless integration with the broader DeFi ecosystem. This compliance includes:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">Standard Functions</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• <code>transfer()</code> - Move tokens between addresses</li>
                        <li>• <code>approve()</code> - Authorize spending by other contracts</li>
                        <li>• <code>transferFrom()</code> - Execute approved transfers</li>
                        <li>• <code>balanceOf()</code> - Query token balances</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">DeFi Compatibility</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Compatible with all DEXs</li>
                        <li>• Usable as collateral in lending protocols</li>
                        <li>• Integrates with yield farming strategies</li>
                        <li>• Supports meta-transactions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Market Creation Process</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Creating a new opportunity market involves several key steps to ensure proper setup and security:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                      <div>
                        <h5 className="font-semibold text-white">Market Definition</h5>
                        <p className="text-gray-300 text-sm">Creator defines a clear, binary outcome with specific resolution criteria and deadline.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                      <div>
                        <h5 className="font-semibold text-white">Liquidity Provision</h5>
                        <p className="text-gray-300 text-sm">Creator deposits initial liquidity (minimum $1,000) split equally between YES and NO sides.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                      <div>
                        <h5 className="font-semibold text-white">Token Minting</h5>
                        <p className="text-gray-300 text-sm">Protocol mints initial supply of YES and NO tokens based on deposited liquidity.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">4</div>
                      <div>
                        <h5 className="font-semibold text-white">Market Activation</h5>
                        <p className="text-gray-300 text-sm">Market becomes active and available for trading after passing security checks.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-400 mb-4">Resolution Mechanism</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Each opportunity must have a clearly defined resolution mechanism to ensure fair and transparent outcomes:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-400 mb-2">Oracle-Based</h5>
                      <p className="text-gray-300 text-sm">Uses external data feeds (e.g., Chainlink) for objective, verifiable outcomes</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-400 mb-2">Community Voting</h5>
                      <p className="text-gray-300 text-sm">Decentralized resolution through token holder voting with dispute mechanisms</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-400 mb-2">Manual Resolution</h5>
                      <p className="text-gray-300 text-sm">Creator or designated resolver determines outcome with appeal process</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 id="pricing-mechanism" className="text-2xl font-semibold text-white mb-6">2.2 Dynamic Pricing Mechanism</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  Sneak employs a sophisticated dynamic pricing mechanism based on the liquidity reserves in the AMM. This mechanism ensures fair price discovery while maintaining market efficiency and preventing manipulation.
                </p>

                <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-orange-500 mb-4">Initial Market Setup</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    When an opportunity is created with an initial liquidity deposit of <InlineMath math="L_0" />, the reserves are split equally between the two outcomes:
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <BlockMath math="L_{Y_i} = L_{N_i} = \frac{L_0}{2}" />
                    <BlockMath math="P_{Y_i}(0) = P_{N_i}(0) = 0.5" />
                    <BlockMath math="S_{Y_i} = S_{N_i} = \frac{L_0}{0.5} = 2L_0" />
                  </div>
                  <p className="text-gray-300 leading-relaxed mt-4">
                    Where <InlineMath math="S_{Y_i}" /> and <InlineMath math="S_{N_i}" /> represent the initial token supplies for YES and NO respectively.
                  </p>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Price Update Algorithm</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    When a user purchases <InlineMath math="\Delta" /> worth of <InlineMath math="Y_i" /> tokens, the price adjusts based on the new ratio of reserves. The algorithm uses a multiplicative pricing formula:
                  </p>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
                    <div>
                      <h5 className="font-semibold text-blue-400 mb-2">Step 1: Calculate Tokens to Mint</h5>
                      <BlockMath math="\text{tokens}_{minted} = \frac{\Delta}{P_{Y_i}}" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-400 mb-2">Step 2: Update Reserves</h5>
                      <BlockMath math="L_{Y_i}^{new} = L_{Y_i}^{old} + \Delta" />
                      <BlockMath math="L_{N_i}^{new} = L_{N_i}^{old}" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-400 mb-2">Step 3: Update Prices</h5>
                      <BlockMath math="P_{Y_i}^{new} = P_{Y_i}^{old} \times \frac{L_{Y_i}^{new}}{L_{Y_i}^{old}}" />
                      <BlockMath math="P_{N_i}^{new} = P_{N_i}^{old} \times \frac{L_{Y_i}^{old}}{L_{Y_i}^{new}}" />
                    </div>
                  </div>

                  <p className="text-gray-300 leading-relaxed mt-4">
                    This multiplicative approach ensures that as liquidity for one outcome increases, its price appreciates, while the price of the opposing outcome depreciates proportionally.
                  </p>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">Mathematical Properties</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Price Conservation</h5>
                      <p className="text-gray-300 text-sm mb-2">The product of YES and NO prices remains constant:</p>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <BlockMath math="K = P_{Y_i} \times P_{N_i} = \text{constant}" />
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Price Bounds</h5>
                      <p className="text-gray-300 text-sm mb-2">Prices are bounded between 0 and 1:</p>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <BlockMath math="0 < P_{Y_i}, P_{N_i} < 1" />
                        <BlockMath math="P_{Y_i} + P_{N_i} \approx 1" />
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Slippage Calculation</h5>
                      <p className="text-gray-300 text-sm mb-2">The effective price paid includes slippage:</p>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <BlockMath math="\text{slippage} = \frac{\text{effective\_price} - P_{Y_i}^{old}}{P_{Y_i}^{old}}" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">Example Calculation</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Let's walk through a concrete example to demonstrate the pricing mechanism:
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
                    <div>
                      <h5 className="font-semibold text-cyan-400 mb-2">Initial State</h5>
                      <BlockMath math="L_0 = \$10,000" />
                      <BlockMath math="L_{Y_i} = L_{N_i} = \$5,000" />
                      <BlockMath math="P_{Y_i} = P_{N_i} = 0.5" />
                      <BlockMath math="S_{Y_i} = S_{N_i} = 10,000 \text{ tokens}" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-cyan-400 mb-2">User Buys $1,000 of YES</h5>
                      <BlockMath math="\text{tokens}_{minted} = \frac{\$1,000}{0.5} = 2,000 \text{ tokens}" />
                      <BlockMath math="L_{Y_i}^{new} = \$5,000 + \$1,000 = \$6,000" />
                      <BlockMath math="P_{Y_i}^{new} = 0.5 \times \frac{\$6,000}{\$5,000} = 0.6" />
                      <BlockMath math="P_{N_i}^{new} = 0.5 \times \frac{\$5,000}{\$6,000} = 0.417" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-cyan-400 mb-2">Result</h5>
                      <BlockMath math="\text{User's position value} = 2,000 \times 0.6 = \$1,200" />
                      <BlockMath math="\text{Paper gain} = \$1,200 - \$1,000 = \$200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="position-chains" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-orange-500 mb-8">3. Position Chains: Composable Leverage</h2>
            <div className="space-y-12">
              <div>
                <h3 id="definition" className="text-2xl font-semibold text-white mb-6">3.1 Chain Definition</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  A <strong>position chain</strong> is the core innovation of Sneak. It is a directed, acyclic graph of positions where the collateral for each "downstream" link is provided by the marked-to-market value of the "upstream" link. This creates a powerful mechanism for capital efficiency and complex conditional strategies.
                </p>
                
                <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-orange-500 mb-4">Mathematical Definition</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Formally, a chain <InlineMath math="C" /> is a sequence of positions:
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <BlockMath math="C = [(O_1, s_1, a_1), (O_2, s_2, a_2), ... , (O_k, s_k, a_k)]" />
                  </div>
                  <p className="text-gray-300 leading-relaxed my-4">where:</p>
                   <ul className="list-disc list-inside text-lg text-gray-300 leading-relaxed space-y-2 mb-4">
                    <li><InlineMath math="O_i" /> is the <InlineMath math="i" />-th opportunity.</li>
                    <li><InlineMath math="s_i \in \{Y, N\}" /> is the chosen side (YES or NO).</li>
                    <li><InlineMath math="a_i" /> is the value allocated from the previous position's collateral.</li>
                  </ul>
                  <p className="text-gray-300 leading-relaxed">
                    The chain must satisfy the constraint: <InlineMath math="a_i \leq \alpha \cdot V_{i-1}(t_{\text{open}})" /> for all <InlineMath math="i > 1" />, where <InlineMath math="\alpha" /> is the allocation factor.
                  </p>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Chain Properties</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">1. Acyclicity</h5>
                      <p className="text-gray-300 text-sm">Chains cannot contain circular dependencies, preventing infinite loops and ensuring deterministic resolution.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">2. Collateralization</h5>
                      <p className="text-gray-300 text-sm">Each link must be over-collateralized by the previous link, maintaining solvency throughout the chain.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">3. Atomic Resolution</h5>
                      <p className="text-gray-300 text-sm">When any link resolves, the entire chain is processed atomically, ensuring consistency and preventing partial failures.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">4. Composability</h5>
                      <p className="text-gray-300 text-sm">Chains can be created, modified, and extended dynamically as market conditions change.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-green-400 mb-6">Use Cases & Examples</h4>
                  <div className="space-y-6">
                    {/* Example 1 */}
                    <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-5">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-7 h-7 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center text-sm font-bold text-orange-400">1</div>
                        <h5 className="font-semibold text-white text-lg">Sequential Speculation</h5>
                      </div>
                      
                      <div className="bg-gray-800/40 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-orange-400 font-semibold">$1,000</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-green-400 font-mono">YES("Bitcoin &gt; $100k by 2024")</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-blue-400 font-semibold">80%</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-green-400 font-mono">YES("Ethereum &gt; $10k by 2024")</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-blue-400 font-semibold">80%</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-red-400 font-mono">NO("Stock market crash in 2024")</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/20 rounded-lg p-3">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          <span className="text-orange-400 font-semibold">Strategy:</span> This creates a conditional strategy: "If Bitcoin hits $100k AND Ethereum hits $10k, then bet against a stock market crash."
                        </p>
                      </div>
                    </div>

                    {/* Example 2 */}
                    <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-5">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-7 h-7 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center text-sm font-bold text-orange-400">2</div>
                        <h5 className="font-semibold text-white text-lg">Hedged Position</h5>
                      </div>
                      
                      <div className="bg-gray-800/40 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-orange-400 font-semibold">$1,000</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-green-400 font-mono">YES("Tech stocks rise")</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-blue-400 font-semibold">50%</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-red-400 font-mono">NO("Interest rates increase")</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-blue-400 font-semibold">50%</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-green-400 font-mono">YES("Real estate falls")</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/20 rounded-lg p-3">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          <span className="text-orange-400 font-semibold">Strategy:</span> This hedges against the scenario where tech stocks rise but interest rates increase, leading to real estate decline.
                        </p>
                      </div>
                    </div>

                    {/* Example 3 */}
                    <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-5">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-7 h-7 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center text-sm font-bold text-orange-400">3</div>
                        <h5 className="font-semibold text-white text-lg">Leveraged Bet</h5>
                      </div>
                      
                      <div className="bg-gray-800/40 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-orange-400 font-semibold">$1,000</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-green-400 font-mono">YES("Company A acquires Company B")</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-blue-400 font-semibold">90%</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-green-400 font-mono">YES("Company A stock rises 20%")</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/20 rounded-lg p-3">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          <span className="text-orange-400 font-semibold">Strategy:</span> This leverages the acquisition bet to also bet on the acquirer's stock performance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">Chain Management</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Users can manage their chains through several operations:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-400 mb-2">Chain Operations</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• <strong>Extend:</strong> Add new links to existing chains</li>
                        <li>• <strong>Split:</strong> Create multiple chains from one position</li>
                        <li>• <strong>Merge:</strong> Combine multiple chains</li>
                        <li>• <strong>Close:</strong> Exit positions early</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-400 mb-2">Monitoring</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Real-time P&L tracking</li>
                        <li>• Collateralization ratio monitoring</li>
                        <li>• Liquidation risk alerts</li>
                        <li>• Performance analytics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 id="collateralization" className="text-2xl font-semibold text-white mb-6">3.2 Collateralization & Liquidation</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  To maintain solvency and prevent cascading failures, each link in a chain must be over-collateralized. The protocol implements a sophisticated collateralization system with multiple safety mechanisms.
                </p>

                <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-orange-500 mb-4">Key Parameters:</h4>
                   <ul className="list-disc list-inside text-lg text-gray-300 leading-relaxed space-y-3">
                    <li><strong>Allocation Factor (<InlineMath math="\alpha" />):</strong> The maximum percentage of a link's value that can be allocated to collateralize the next link (default: 80%). This creates a 20% safety buffer.</li>
                    <li><strong>Mark Value (<InlineMath math="V_i(t)" />):</strong> The current USD value of link <InlineMath math="i" />, determined by a manipulation-resistant oracle using TWAP (Time-Weighted Average Price) over a 1-hour window.</li>
                    <li><strong>Allocated Amount (<InlineMath math="A_i" />):</strong> The fixed USD amount allocated from link <InlineMath math="i-1" /> when link <InlineMath math="i" /> was created. <InlineMath math="A_i = \alpha \cdot V_{i-1}(t_{\text{open}})" />.</li>
                    <li><strong>Maintenance Requirement:</strong> For each link <InlineMath math="i" />, the condition <InlineMath math="V_{i-1}(t) \ge A_i" /> must hold at all times.</li>
                    <li><strong>Hysteresis (<InlineMath math="\tau" />):</strong> A buffer (default: 1%) to prevent cascading liquidations from minor price fluctuations. Liquidation is triggered when <InlineMath math="V_{j-1}(t) < (1-\tau) \cdot A_j" />.</li>
                    <li><strong>Liquidation Penalty (<InlineMath math="\gamma" />):</strong> A fee (default: 5%) applied during liquidation to reward liquidators and cover protocol costs.</li>
                  </ul>
                </div>

                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-red-400 mb-4">Liquidation Triggers</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    A chain becomes eligible for liquidation when any of the following conditions are met:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                      <div>
                        <h5 className="font-semibold text-white">Under-collateralization</h5>
                        <p className="text-gray-300 text-sm">Any link's collateral value falls below the maintenance requirement: <InlineMath math="V_{j-1}(t) < (1-\tau) \cdot A_j" /></p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                      <div>
                        <h5 className="font-semibold text-white">Oracle Deviation</h5>
                        <p className="text-gray-300 text-sm">Price oracle reports a deviation greater than 10% from the AMM price, indicating potential manipulation.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                      <div>
                        <h5 className="font-semibold text-white">Market Resolution</h5>
                        <p className="text-gray-300 text-sm">An opportunity in the chain resolves as a LOSE, automatically triggering liquidation of downstream positions.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Liquidation Process:</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    When a liquidation is triggered, the protocol executes the following steps atomically:
                  </p>
                  <ol className="list-decimal list-inside text-lg text-gray-300 leading-relaxed space-y-2">
                    <li><strong>Identification:</strong> The protocol identifies the first link <InlineMath math="j" /> in the chain that violates the maintenance requirement.</li>
                    <li><strong>Freezing:</strong> The chain is immediately frozen to prevent further downstream openings or modifications.</li>
                    <li><strong>Unwinding:</strong> Positions are unwound from the end of the chain backwards to <InlineMath math="j" />, using current AMM prices to determine the recovery value.</li>
                    <li><strong>Debt Repayment:</strong> The recovered assets are used to repay the collateral debt, with any shortfall absorbed by the protocol's insurance fund.</li>
                    <li><strong>Penalty Application:</strong> A liquidation penalty (<InlineMath math="\gamma" />) is applied, with 50% going to the liquidator and 50% to the protocol treasury.</li>
                    <li><strong>Asset Return:</strong> The user retains ownership of the still-solvent prefix of the chain (<InlineMath math="0..j-1" />) and any remaining value after liquidation costs.</li>
                  </ol>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-4">Liquidation Example</h4>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    Consider a chain with the following structure:
                  </p>
                  
                  {/* Chain Visualization */}
                  <div className="bg-gray-900/50 rounded-xl p-6 mb-6">
                    <div className="space-y-4">
                      {/* Link 1 */}
                      <div className="flex items-center space-x-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold text-white">1</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-green-400 font-semibold">Link 1</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-white font-mono">YES("Event A")</span>
                          </div>
                          <div className="text-sm text-gray-300">
                            <span className="text-green-400">Initial:</span> $1,000 | 
                            <span className="text-yellow-400 ml-2">Current:</span> $800 | 
                            <span className="text-red-400 ml-2">Required for Link 2:</span> $640
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-semibold">$800</div>
                          <div className="text-xs text-gray-400">Current Value</div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center">
                        <div className="w-0.5 h-6 bg-orange-500"></div>
                      </div>

                      {/* Link 2 */}
                      <div className="flex items-center space-x-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">2</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-blue-400 font-semibold">Link 2</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-white font-mono">YES("Event B")</span>
                          </div>
                          <div className="text-sm text-gray-300">
                            <span className="text-blue-400">Allocated:</span> $640 (80% of $800) | 
                            <span className="text-yellow-400 ml-2">Current:</span> $400 | 
                            <span className="text-red-400 ml-2">Required for Link 3:</span> $320
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-blue-400 font-semibold">$400</div>
                          <div className="text-xs text-gray-400">Current Value</div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center">
                        <div className="w-0.5 h-6 bg-orange-500"></div>
                      </div>

                      {/* Link 3 */}
                      <div className="flex items-center space-x-4 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">3</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-purple-400 font-semibold">Link 3</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-white font-mono">NO("Event C")</span>
                          </div>
                          <div className="text-sm text-gray-300">
                            <span className="text-purple-400">Allocated:</span> $320 (80% of $400) | 
                            <span className="text-yellow-400 ml-2">Current:</span> $200
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-purple-400 font-semibold">$200</div>
                          <div className="text-xs text-gray-400">Current Value</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Liquidation Trigger */}
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">⚠</div>
                      <h5 className="font-semibold text-red-400">Liquidation Trigger</h5>
                    </div>
                    <p className="text-gray-300 text-sm">
                      If Link 1's value drops to <span className="text-red-400 font-semibold">$600</span>, it violates the maintenance requirement for Link 2 (which needs <span className="text-red-400 font-semibold">$640</span>). This triggers liquidation of the entire chain.
                    </p>
                  </div>

                  {/* Liquidation Process */}
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h5 className="font-semibold text-white mb-3">Liquidation Process:</h5>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                        <div>
                          <div className="text-white font-semibold">Unwind Link 3</div>
                          <div className="text-gray-300 text-sm">Recover ~$200 from current market value</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                        <div>
                          <div className="text-white font-semibold">Unwind Link 2</div>
                          <div className="text-gray-300 text-sm">Recover ~$400 from current market value</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                        <div>
                          <div className="text-white font-semibold">Apply Penalty</div>
                          <div className="text-gray-300 text-sm">5% penalty on total debt: $30 total</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">✓</div>
                        <div>
                          <div className="text-white font-semibold">Return to User</div>
                          <div className="text-gray-300 text-sm">$570 (Link 1 value $600 - penalty $30)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">Risk Management Features</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-cyan-400 mb-2">Circuit Breakers</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Price movement limits (5% per hour)</li>
                        <li>• Volume-based halts</li>
                        <li>• Oracle deviation detection</li>
                        <li>• Emergency pause mechanism</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-cyan-400 mb-2">Insurance Mechanisms</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Protocol insurance fund</li>
                        <li>• Liquidation penalty buffer</li>
                        <li>• Emergency reserve</li>
                        <li>• Community governance fund</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="resolution-payouts" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-orange-500 mb-8">4. Resolution & Payout Engine</h2>
            <div className="space-y-12">
              <div>
                <h3 id="resolution-event" className="text-2xl font-semibold text-white mb-6">4.1 Resolution Event</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The resolution process is the critical moment when an opportunity's outcome is determined and value is distributed. Sneak implements a sophisticated, multi-step resolution engine that ensures fair and efficient distribution of rewards while maintaining protocol sustainability.
                </p>

                <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-orange-500 mb-4">Resolution Triggers</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    An opportunity can be resolved through several mechanisms:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">Time-Based</h5>
                      <p className="text-gray-300 text-sm">Automatic resolution at the predetermined deadline using the last available oracle price</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">Event-Based</h5>
                      <p className="text-gray-300 text-sm">Resolution triggered by specific on-chain or off-chain events (e.g., election results, sports outcomes)</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">Manual</h5>
                      <p className="text-gray-300 text-sm">Creator or designated resolver manually triggers resolution with community oversight</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Resolution Process</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    When an opportunity <InlineMath math="O_i" /> resolves, the protocol executes the following steps atomically:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                      <div>
                        <h5 className="font-semibold text-white">Outcome Determination</h5>
                        <p className="text-gray-300 text-sm">The protocol determines the winning outcome (YES or NO) based on the predefined resolution criteria.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                      <div>
                        <h5 className="font-semibold text-white">Liquidity Pool Analysis</h5>
                        <p className="text-gray-300 text-sm">Calculate total liquidity in both YES and NO pools, including all trading activity and fees collected.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                      <div>
                        <h5 className="font-semibold text-white">Fee Distribution</h5>
                        <p className="text-gray-300 text-sm">Allocate protocol fees (1%) and liquidity provider rewards (4%) from the losing side's pool.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">4</div>
                      <div>
                        <h5 className="font-semibold text-white">Winner Distribution</h5>
                        <p className="text-gray-300 text-sm">Distribute remaining value pro-rata to all holders of the winning token.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">5</div>
                      <div>
                        <h5 className="font-semibold text-white">Chain Processing</h5>
                        <p className="text-gray-300 text-sm">Process any dependent position chains, updating collateral values and triggering liquidations if necessary.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-green-400 mb-4">Resolution Security</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    To prevent manipulation and ensure fair resolution, the protocol implements several security measures:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-400 mb-2">Oracle Validation</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Multiple oracle sources required</li>
                        <li>• Deviation threshold checks</li>
                        <li>• Time-weighted price validation</li>
                        <li>• Emergency pause capability</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-400 mb-2">Dispute Resolution</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• 24-hour challenge period</li>
                        <li>• Community voting mechanism</li>
                        <li>• Escalation to governance</li>
                        <li>• Arbitration process</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 id="payout-formula" className="text-2xl font-semibold text-white mb-6">4.2 Payout Formula</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The payout calculation is designed to ensure fair distribution while maintaining protocol sustainability. The formula accounts for all stakeholders and ensures mathematical precision.
                </p>

                <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-orange-500 mb-4">Mathematical Framework</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Let <InlineMath math="S_{\text{win}}" /> be the total supply of the winning token and <InlineMath math="H_j" /> be the holdings of user <InlineMath math="j" />.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">The payout rate per winning token is:</p>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <BlockMath math="R_{\text{token}} = \frac{(L_{\text{win}} + L_{\text{lose}} - LP_{\text{reward}} - \text{ProtocolFee})}{S_{\text{win}}}" />
                  </div>
                  <p className="text-gray-300 leading-relaxed my-4">The total payout for user <InlineMath math="j" /> is:</p>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <BlockMath math="P_j = H_j \times R_{\text{token}}" />
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Detailed Breakdown</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Total Available Value</h5>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <BlockMath math="V_{\text{total}} = L_{\text{win}} + L_{\text{lose}}" />
                      </div>
                      <p className="text-gray-300 text-sm mt-2">This represents the total value available for distribution, including both winning and losing side liquidity.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Fee Structure</h5>
                      <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                        <BlockMath math="F_{\text{protocol}} = 0.01 \times L_{\text{lose}}" />
                        <BlockMath math="F_{\text{LP}} = 0.04 \times L_{\text{lose}}" />
                        <BlockMath math="V_{\text{distributable}} = V_{\text{total}} - F_{\text{protocol}} - F_{\text{LP}}" />
                      </div>
                      <p className="text-gray-300 text-sm mt-2">Protocol takes 1% fee, liquidity providers get 4% reward, remainder goes to winners.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Per-Token Value</h5>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <BlockMath math="R_{\text{token}} = \frac{V_{\text{distributable}}}{S_{\text{win}}}" />
                      </div>
                      <p className="text-gray-300 text-sm mt-2">Each winning token receives this amount, regardless of when it was purchased.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">Chain Resolution Impact</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    For chained positions, resolution has cascading effects:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Winning Link</h5>
                      <p className="text-gray-300 text-sm mb-2">If link <InlineMath math="i" /> resolves as a WIN, its payout <InlineMath math="P_i" /> becomes the new, fully unlocked collateral value <InlineMath math="V_i" /> available for the next link or for withdrawal.</p>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <BlockMath math="V_i^{\text{new}} = P_i = H_i \times R_{\text{token}}" />
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Losing Link</h5>
                      <p className="text-gray-300 text-sm mb-2">If link <InlineMath math="i" /> resolves as a LOSE, its value goes to zero, triggering a check on the downstream link's solvency.</p>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <BlockMath math="V_i^{\text{new}} = 0" />
                        <BlockMath math="\text{Check: } V_{i+1} \geq A_{i+1}" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">Example Calculation</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Consider a market with the following final state:
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
                    <div>
                      <h5 className="font-semibold text-cyan-400 mb-2">Market State</h5>
                      <BlockMath math="L_{\text{win}} = \$8,000 \text{ (YES pool)}" />
                      <BlockMath math="L_{\text{lose}} = \$12,000 \text{ (NO pool)}" />
                      <BlockMath math="S_{\text{win}} = 10,000 \text{ tokens}" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-cyan-400 mb-2">Fee Calculation</h5>
                      <BlockMath math="F_{\text{protocol}} = 0.01 \times \$12,000 = \$120" />
                      <BlockMath math="F_{\text{LP}} = 0.04 \times \$12,000 = \$480" />
                      <BlockMath math="V_{\text{distributable}} = \$20,000 - \$120 - \$480 = \$19,400" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-cyan-400 mb-2">Per-Token Payout</h5>
                      <BlockMath math="R_{\text{token}} = \frac{\$19,400}{10,000} = \$1.94" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-cyan-400 mb-2">User Payout</h5>
                      <BlockMath math="\text{If user holds 1,000 YES tokens: } P_j = 1,000 \times \$1.94 = \$1,940" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="privacy" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-orange-500 mb-8">5. Privacy Architecture</h2>
            <div className="space-y-12">
              <div>
                <h3 id="eerc-implementation" className="text-2xl font-semibold text-white mb-6">5.1 eERC Implementation</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  Sneak leverages the <strong>Encrypted ERC-20 (eERC)</strong> standard from AvaCloud to ensure 
                  complete transaction confidentiality. The eERC implementation provides <strong>client-side encryption</strong>, 
                  <strong>zero-knowledge proofs</strong>, and <strong>on-chain privacy</strong> without requiring 
                  trusted third parties or off-chain relayers.
                </p>

                <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-orange-500 mb-4">eERC Technical Specifications</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The eERC standard provides several key privacy features that make it ideal for Sneak's use case:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">Encryption Layer</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• AES-256-GCM encryption</li>
                        <li>• Client-side key generation</li>
                        <li>• Perfect forward secrecy</li>
                        <li>• Quantum-resistant algorithms</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">Zero-Knowledge Proofs</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• zk-SNARKs for balance validity</li>
                        <li>• Range proofs for amounts</li>
                        <li>• Transfer authorization proofs</li>
                        <li>• Efficient proof generation</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">Key Management</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Hierarchical deterministic keys</li>
                        <li>• Multi-signature support</li>
                        <li>• Hardware wallet integration</li>
                        <li>• Recovery mechanisms</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Privacy Features</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Transaction Privacy</h5>
                      <p className="text-gray-300 text-sm">All transaction amounts, sender/receiver addresses, and token types are encrypted on-chain. Only the parties involved can decrypt the transaction details.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Balance Privacy</h5>
                      <p className="text-gray-300 text-sm">Account balances are encrypted and only verifiable through zero-knowledge proofs. No external observer can determine how many tokens a user holds.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Market Privacy</h5>
                      <p className="text-gray-300 text-sm">Which opportunities a user is betting on remains completely hidden. Only the user and the market creator (if configured) can see the trading activity.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-400 mb-4">Integration with Sneak</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The eERC standard integrates seamlessly with Sneak's position chains and resolution mechanisms:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-400 mb-2">Chain Privacy</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Private chain creation</li>
                        <li>• Encrypted collateral tracking</li>
                        <li>• Anonymous liquidation</li>
                        <li>• Private resolution</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-400 mb-2">Market Privacy</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Private market participation</li>
                        <li>• Encrypted price discovery</li>
                        <li>• Anonymous trading</li>
                        <li>• Private settlement</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 id="confidential-transactions" className="text-2xl font-semibold text-white mb-6">5.2 Confidential Transactions</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The confidential transaction system ensures that <strong>no external observer</strong> can determine 
                  which opportunities a user is betting on, nor the size of their bets. This is achieved through 
                  <strong>commitment schemes</strong>, <strong>range proofs</strong>, and <strong>mixing protocols</strong> 
                  that obfuscate transaction patterns.
                </p>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">Transaction Privacy Features</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Lock className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <h5 className="font-semibold text-white">Amount Hiding</h5>
                        <p className="text-gray-300 text-sm">Transaction amounts are encrypted and only verifiable through zero-knowledge proofs. The actual value being transferred is completely hidden from external observers.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Eye className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <h5 className="font-semibold text-white">Sender/Receiver Privacy</h5>
                        <p className="text-gray-300 text-sm">One-time addresses prevent transaction graph analysis. Each transaction uses a unique address that cannot be linked to the user's identity.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <h5 className="font-semibold text-white">Market Obfuscation</h5>
                        <p className="text-gray-300 text-sm">Which opportunity is being bet on remains completely hidden. Market identifiers are encrypted and only decipherable by authorized parties.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">Mixing and Anonymization</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    To further enhance privacy, Sneak implements several mixing and anonymization techniques:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-cyan-400 mb-2">Transaction Mixing</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• CoinJoin-style mixing</li>
                        <li>• Decoy transactions</li>
                        <li>• Timing obfuscation</li>
                        <li>• Volume normalization</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-cyan-400 mb-2">Network Privacy</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Tor integration</li>
                        <li>• VPN support</li>
                        <li>• IP address masking</li>
                        <li>• Traffic analysis resistance</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-4">Privacy vs. Compliance</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    While Sneak prioritizes user privacy, it also maintains compliance capabilities for regulated markets:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                      <div>
                        <h5 className="font-semibold text-white">Optional KYC</h5>
                        <p className="text-gray-300 text-sm">Users can optionally complete KYC verification to access higher limits and additional features while maintaining transaction privacy.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                      <div>
                        <h5 className="font-semibold text-white">Audit Trails</h5>
                        <p className="text-gray-300 text-sm">For compliance purposes, users can generate encrypted audit trails that can be decrypted by authorized parties (e.g., tax authorities).</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                      <div>
                        <h5 className="font-semibold text-white">Regulatory Reporting</h5>
                        <p className="text-gray-300 text-sm">The protocol can generate aggregate statistics and reports for regulatory compliance without revealing individual transaction details.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="implementation" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-orange-500 mb-8">6. Technical Implementation</h2>
            <div className="space-y-12">
              <div>
                <h3 id="smart-contracts" className="text-2xl font-semibold text-white mb-6">6.1 Smart Contract Architecture</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The Sneak protocol is implemented through a <strong>modular smart contract system</strong> deployed on 
                  the Avalanche C-Chain. The architecture consists of <strong>core protocol contracts</strong>, 
                  <strong>market-specific contracts</strong>, and <strong>privacy layer contracts</strong> that work 
                  together to provide secure, private, and efficient opportunity markets.
                </p>

                <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-orange-500 mb-4">Core Contract System</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The protocol consists of several interconnected smart contracts that work together to provide the full functionality:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">SneakCore</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Main protocol controller</li>
                        <li>• Market creation and management</li>
                        <li>• Position chain orchestration</li>
                        <li>• Resolution coordination</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">OpportunityFactory</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Deploys new opportunity contracts</li>
                        <li>• Manages market templates</li>
                        <li>• Handles market validation</li>
                        <li>• Tracks market registry</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">PositionChainManager</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Chain creation and modification</li>
                        <li>• Collateralization tracking</li>
                        <li>• Liquidation management</li>
                        <li>• Chain resolution processing</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">eERCAdapter</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• eERC standard integration</li>
                        <li>• Privacy transaction handling</li>
                        <li>• Zero-knowledge proof validation</li>
                        <li>• Encryption key management</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Contract Interaction Flow</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The contracts interact in a specific sequence to handle different operations:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                      <div>
                        <h5 className="font-semibold text-white">Market Creation</h5>
                        <p className="text-gray-300 text-sm">SneakCore → OpportunityFactory → Deploy new Opportunity contract → Initialize eERC tokens</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                      <div>
                        <h5 className="font-semibold text-white">Position Trading</h5>
                        <p className="text-gray-300 text-sm">User → eERCAdapter → Opportunity contract → AMM interaction → PositionChainManager (if chaining)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                      <div>
                        <h5 className="font-semibold text-white">Resolution</h5>
                        <p className="text-gray-300 text-sm">Oracle → SneakCore → Opportunity contract → PositionChainManager → eERCAdapter → User payouts</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-400 mb-4">Security Features</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-400 mb-2">Access Control</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Role-based permissions</li>
                        <li>• Multi-signature requirements</li>
                        <li>• Time-locked operations</li>
                        <li>• Emergency pause functionality</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-400 mb-2">Upgradeability</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Proxy pattern implementation</li>
                        <li>• Gradual migration support</li>
                        <li>• Backward compatibility</li>
                        <li>• Community governance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 id="oracle-system" className="text-2xl font-semibold text-white mb-6">6.2 Oracle System</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The oracle system is critical for price discovery, market resolution, and liquidation triggers. 
                  Sneak implements a robust, multi-layered oracle architecture that ensures accuracy and prevents manipulation.
                </p>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">Oracle Architecture</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Primary Oracles</h5>
                      <p className="text-gray-300 text-sm mb-2">Chainlink price feeds provide the primary source of truth for external data:</p>
                      <ul className="text-gray-300 text-sm space-y-1 ml-4">
                        <li>• ETH/USD, BTC/USD, AVAX/USD price feeds</li>
                        <li>• Sports scores and election results</li>
                        <li>• Weather data and economic indicators</li>
                        <li>• Custom data feeds for specific markets</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Secondary Validation</h5>
                      <p className="text-gray-300 text-sm mb-2">Multiple independent sources validate primary oracle data:</p>
                      <ul className="text-gray-300 text-sm space-y-1 ml-4">
                        <li>• Band Protocol for cross-validation</li>
                        <li>• Pyth Network for real-time data</li>
                        <li>• Community-run oracles</li>
                        <li>• Manual verification for critical events</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">Price Aggregation</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The protocol uses a sophisticated price aggregation mechanism to ensure accurate and manipulation-resistant pricing:
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                    <BlockMath math="P_{\text{final}} = \text{median}(P_1, P_2, ..., P_n)" />
                    <BlockMath math="\text{where } |P_i - P_{\text{median}}| \leq \text{threshold}" />
                  </div>
                  <p className="text-gray-300 text-sm mt-4">
                    Outlier prices are automatically filtered out, and the median of remaining prices is used as the final price.
                  </p>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-4">Oracle Security Measures</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-yellow-400 mb-2">Manipulation Prevention</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Time-weighted average pricing</li>
                        <li>• Deviation threshold checks</li>
                        <li>• Circuit breakers</li>
                        <li>• Emergency pause mechanisms</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-yellow-400 mb-2">Reliability Features</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Heartbeat monitoring</li>
                        <li>• Automatic failover</li>
                        <li>• Historical data validation</li>
                        <li>• Community dispute resolution</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 id="scalability" className="text-2xl font-semibold text-white mb-6">6.3 Scalability & Performance</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  Sneak is designed to handle high transaction volumes and complex position chains while maintaining 
                  low latency and reasonable gas costs. The protocol implements several optimization strategies.
                </p>

                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-red-400 mb-4">Performance Optimizations</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Batch Processing</h5>
                      <p className="text-gray-300 text-sm">Multiple operations are batched together to reduce gas costs and improve throughput:</p>
                      <ul className="text-gray-300 text-sm space-y-1 ml-4 mt-2">
                        <li>• Batch position updates in chains</li>
                        <li>• Aggregate liquidation operations</li>
                        <li>• Batch resolution processing</li>
                        <li>• Bulk oracle updates</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">State Compression</h5>
                      <p className="text-gray-300 text-sm">Efficient storage patterns minimize on-chain data requirements:</p>
                      <ul className="text-gray-300 text-sm space-y-1 ml-4 mt-2">
                        <li>• Merkle tree-based position tracking</li>
                        <li>• Compressed chain state storage</li>
                        <li>• Lazy loading of historical data</li>
                        <li>• Event-based state updates</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-indigo-400 mb-4">Layer 2 Integration</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Sneak is designed to be compatible with various Layer 2 solutions for enhanced scalability:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-indigo-400 mb-2">Avalanche Subnets</h5>
                      <p className="text-gray-300 text-sm">Dedicated subnets for high-frequency trading with custom consensus rules</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-indigo-400 mb-2">Polygon Integration</h5>
                      <p className="text-gray-300 text-sm">Cross-chain compatibility for broader market access</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-indigo-400 mb-2">Arbitrum Support</h5>
                      <p className="text-gray-300 text-sm">Optimistic rollup integration for reduced gas costs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="security" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-orange-500 mb-8">7. Security Analysis</h2>
            <div className="space-y-12">
              <div>
                <h3 id="threat-model" className="text-2xl font-semibold text-white mb-6">7.1 Threat Model for Chained Positions</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The introduction of position chains creates novel attack vectors that traditional prediction markets don't face. Our comprehensive threat model considers adversaries attempting to manipulate oracle prices, trigger cascading liquidations, or exploit resolution timing to extract value from the protocol.
                </p>

                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-red-400 mb-4">Primary Attack Vectors</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">1. Oracle Manipulation Attacks</h5>
                      <p className="text-gray-300 text-sm mb-2">Adversaries may attempt to manipulate price feeds to trigger unfair liquidations or create profitable arbitrage opportunities:</p>
                      <ul className="text-gray-300 text-sm space-y-1 ml-4">
                        <li>• Flash loan attacks to temporarily move prices</li>
                        <li>• Coordinated trading to create artificial price movements</li>
                        <li>• Oracle delay exploitation during high volatility</li>
                        <li>• Cross-chain price manipulation through DEX arbitrage</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">2. Cascading Liquidation Attacks</h5>
                      <p className="text-gray-300 text-sm mb-2">Malicious actors may attempt to trigger multiple liquidations in a chain to extract value:</p>
                      <ul className="text-gray-300 text-sm space-y-1 ml-4">
                        <li>• Coordinated price manipulation across multiple markets</li>
                        <li>• Exploitation of liquidation timing windows</li>
                        <li>• MEV extraction during liquidation events</li>
                        <li>• Front-running liquidation transactions</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">3. Resolution Timing Exploits</h5>
                      <p className="text-gray-300 text-sm mb-2">Attackers may exploit the timing of market resolution to gain unfair advantages:</p>
                      <ul className="text-gray-300 text-sm space-y-1 ml-4">
                        <li>• Last-minute position adjustments before resolution</li>
                        <li>• Exploitation of resolution delay mechanisms</li>
                        <li>• Cross-market arbitrage during resolution</li>
                        <li>• Information asymmetry exploitation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Economic Attack Scenarios</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Scenario 1: Coordinated Price Manipulation</h5>
                      <p className="text-gray-300 text-sm">An attacker with significant capital could coordinate price movements across multiple markets to trigger liquidations and extract value from the protocol's insurance fund.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Scenario 2: MEV Extraction</h5>
                      <p className="text-gray-300 text-sm">MEV bots could front-run liquidation transactions or resolution events to extract value at the expense of legitimate users.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Scenario 3: Oracle Delay Exploitation</h5>
                      <p className="text-gray-300 text-sm">During high volatility periods, attackers could exploit delays in oracle price updates to execute profitable trades before price corrections.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-4">Risk Assessment Matrix</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="text-left py-2 px-4">Attack Vector</th>
                          <th className="text-left py-2 px-4">Likelihood</th>
                          <th className="text-left py-2 px-4">Impact</th>
                          <th className="text-left py-2 px-4">Mitigation</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        <tr className="border-b border-gray-700">
                          <td className="py-2 px-4">Oracle Manipulation</td>
                          <td className="py-2 px-4 text-yellow-400">Medium</td>
                          <td className="py-2 px-4 text-red-400">High</td>
                          <td className="py-2 px-4">Multi-oracle validation, TWAP pricing</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="py-2 px-4">Cascading Liquidations</td>
                          <td className="py-2 px-4 text-green-400">Low</td>
                          <td className="py-2 px-4 text-yellow-400">Medium</td>
                          <td className="py-2 px-4">Hysteresis buffers, circuit breakers</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="py-2 px-4">MEV Extraction</td>
                          <td className="py-2 px-4 text-red-400">High</td>
                          <td className="py-2 px-4 text-yellow-400">Medium</td>
                          <td className="py-2 px-4">Private mempool, commit-reveal schemes</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">Resolution Timing</td>
                          <td className="py-2 px-4 text-yellow-400">Medium</td>
                          <td className="py-2 px-4 text-yellow-400">Medium</td>
                          <td className="py-2 px-4">Time-locked resolution, dispute mechanisms</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <h3 id="security-measures" className="text-2xl font-semibold text-white mb-6">7.2 Security Measures & Mitigations</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  To address the identified threats, Sneak implements multiple layers of security measures designed to protect users and maintain protocol integrity.
                </p>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-green-400 mb-4">Oracle Security</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Multi-Oracle Validation</h5>
                      <p className="text-gray-300 text-sm">The protocol uses multiple independent oracle sources and requires consensus before accepting price updates:</p>
                      <ul className="text-gray-300 text-sm space-y-1 ml-4 mt-2">
                        <li>• Minimum 3 oracle sources required</li>
                        <li>• Median price selection algorithm</li>
                        <li>• Deviation threshold enforcement (5%)</li>
                        <li>• Automatic failover to backup oracles</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Time-Weighted Average Pricing (TWAP)</h5>
                      <p className="text-gray-300 text-sm">All price updates use TWAP over a 1-hour window to prevent manipulation through short-term price spikes.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Circuit Breakers</h5>
                      <p className="text-gray-300 text-sm">Automatic trading halts when price movements exceed predefined thresholds to prevent cascading effects.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">Liquidation Protection</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Hysteresis Buffers</h5>
                      <p className="text-gray-300 text-sm">A 1% buffer prevents liquidations from minor price fluctuations and reduces the likelihood of cascading liquidations.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Gradual Liquidation</h5>
                      <p className="text-gray-300 text-sm">Large positions are liquidated gradually over time to prevent market disruption and reduce MEV opportunities.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Liquidation Penalties</h5>
                      <p className="text-gray-300 text-sm">5% liquidation penalty discourages malicious liquidation attempts and provides protocol revenue.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">MEV Protection</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-cyan-400 mb-2">Private Mempool</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Encrypted transaction submission</li>
                        <li>• Delayed transaction revelation</li>
                        <li>• Commit-reveal schemes</li>
                        <li>• MEV-resistant ordering</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-cyan-400 mb-2">Fair Ordering</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Time-based transaction ordering</li>
                        <li>• Random selection mechanisms</li>
                        <li>• Anti-front-running measures</li>
                        <li>• Priority fee caps</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 id="audit-process" className="text-2xl font-semibold text-white mb-6">7.3 Security Audit Process</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  Sneak undergoes rigorous security auditing to identify and mitigate potential vulnerabilities before mainnet deployment.
                </p>

                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-indigo-400 mb-4">Audit Phases</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                      <div>
                        <h5 className="font-semibold text-white">Code Review</h5>
                        <p className="text-gray-300 text-sm">Comprehensive line-by-line code review by multiple security experts to identify potential vulnerabilities.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                      <div>
                        <h5 className="font-semibold text-white">Formal Verification</h5>
                        <p className="text-gray-300 text-sm">Mathematical proof of critical protocol properties using formal verification tools.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                      <div>
                        <h5 className="font-semibold text-white">Penetration Testing</h5>
                        <p className="text-gray-300 text-sm">Simulated attacks to test the protocol's resilience against various attack vectors.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white">4</div>
                      <div>
                        <h5 className="font-semibold text-white">Economic Modeling</h5>
                        <p className="text-gray-300 text-sm">Economic analysis to ensure the protocol remains stable under various market conditions.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-orange-400 mb-4">Bug Bounty Program</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    A comprehensive bug bounty program incentivizes security researchers to identify vulnerabilities:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">Critical Issues</h5>
                      <p className="text-gray-300 text-sm">Up to $100,000 for critical vulnerabilities that could lead to fund loss</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">High Severity</h5>
                      <p className="text-gray-300 text-sm">Up to $25,000 for high-severity issues affecting protocol functionality</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">Medium Severity</h5>
                      <p className="text-gray-300 text-sm">Up to $5,000 for medium-severity issues with limited impact</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="economics" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-orange-500 mb-8">8. Economic Model & Tokenomics</h2>
            <div className="space-y-12">
              <div>
                <h3 id="stakeholder-analysis" className="text-2xl font-semibold text-white mb-6">8.1 Stakeholder Analysis</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The Sneak ecosystem consists of multiple stakeholder groups, each with distinct roles and incentives. The tokenomics are carefully designed to balance these incentives, ensuring market liquidity, security, and sustainable growth.
                </p>

                <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-orange-500 mb-4">Core Stakeholders</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-3">Traders</h5>
                      <ul className="text-gray-300 text-sm space-y-2">
                        <li>• <strong>Role:</strong> Create and manage position chains, speculate on outcomes</li>
                        <li>• <strong>Incentives:</strong> Profit from correct predictions, capital efficiency through chaining</li>
                        <li>• <strong>Risks:</strong> Liquidation risk, market volatility, opportunity cost</li>
                        <li>• <strong>Value Add:</strong> Price discovery, market liquidity, information aggregation</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-3">Liquidity Providers</h5>
                      <ul className="text-gray-300 text-sm space-y-2">
                        <li>• <strong>Role:</strong> Provide initial liquidity for new markets, earn rewards</li>
                        <li>• <strong>Incentives:</strong> 4% reward from losing side, protocol fees, market creation</li>
                        <li>• <strong>Risks:</strong> Impermanent loss, market resolution risk</li>
                        <li>• <strong>Value Add:</strong> Market creation, price stability, reduced slippage</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-3">Liquidators</h5>
                      <ul className="text-gray-300 text-sm space-y-2">
                        <li>• <strong>Role:</strong> Monitor chains, execute liquidations, maintain protocol health</li>
                        <li>• <strong>Incentives:</strong> 50% of liquidation penalty (2.5% of liquidated value)</li>
                        <li>• <strong>Risks:</strong> Gas costs, competition, timing risk</li>
                        <li>• <strong>Value Add:</strong> Risk management, protocol stability, automated monitoring</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-3">Protocol Treasury</h5>
                      <ul className="text-gray-300 text-sm space-y-2">
                        <li>• <strong>Role:</strong> Collect fees, fund development, maintain insurance fund</li>
                        <li>• <strong>Incentives:</strong> 1% protocol fee, 50% of liquidation penalties</li>
                        <li>• <strong>Risks:</strong> Regulatory changes, competition, technical risks</li>
                        <li>• <strong>Value Add:</strong> Protocol development, security, governance, insurance</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Economic Incentive Alignment</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The protocol's economic model ensures that all stakeholders benefit from the protocol's success:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                      <div>
                        <h5 className="font-semibold text-white">Traders → Liquidity Providers</h5>
                        <p className="text-gray-300 text-sm">More trading activity increases fees for liquidity providers, incentivizing them to create more markets.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                      <div>
                        <h5 className="font-semibold text-white">Liquidity Providers → Traders</h5>
                        <p className="text-gray-300 text-sm">More markets and liquidity reduce slippage and improve trading conditions for traders.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                      <div>
                        <h5 className="font-semibold text-white">Liquidators → All Stakeholders</h5>
                        <p className="text-gray-300 text-sm">Efficient liquidation maintains protocol health and protects all participants from bad debt.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 id="fee-structure" className="text-2xl font-semibold text-white mb-6">8.2 Fee Structure & Revenue Model</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  Sneak implements a carefully balanced fee structure that ensures protocol sustainability while maintaining competitive trading costs.
                </p>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-green-400 mb-4">Fee Breakdown</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Trading Fees</h5>
                      <p className="text-gray-300 text-sm mb-2">Applied to all position trades (buy/sell):</p>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <BlockMath math="\text{Trading Fee} = 0.3\% \text{ of trade value}" />
                        <BlockMath math="\text{Distribution: } 0.1\% \text{ Protocol} + 0.2\% \text{ Liquidity Provider}" />
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Liquidation Fees</h5>
                      <p className="text-gray-300 text-sm mb-2">Applied when positions are liquidated:</p>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <BlockMath math="\text{Liquidation Penalty} = 5\% \text{ of liquidated value}" />
                        <BlockMath math="\text{Distribution: } 2.5\% \text{ Liquidator} + 2.5\% \text{ Protocol}" />
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Resolution Fees</h5>
                      <p className="text-gray-300 text-sm mb-2">Applied during market resolution:</p>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <BlockMath math="\text{Resolution Fee} = 1\% \text{ of losing side pool}" />
                        <BlockMath math="\text{LP Reward} = 4\% \text{ of losing side pool}" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">Revenue Projections</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Based on conservative estimates and comparable DeFi protocols:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-400 mb-2">Year 1</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• TVL: $10M</li>
                        <li>• Daily Volume: $1M</li>
                        <li>• Annual Revenue: $1.1M</li>
                        <li>• Protocol Fee: $0.3M</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-400 mb-2">Year 2</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• TVL: $50M</li>
                        <li>• Daily Volume: $5M</li>
                        <li>• Annual Revenue: $5.5M</li>
                        <li>• Protocol Fee: $1.5M</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-400 mb-2">Year 3</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• TVL: $200M</li>
                        <li>• Daily Volume: $20M</li>
                        <li>• Annual Revenue: $22M</li>
                        <li>• Protocol Fee: $6M</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">Treasury Management</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Protocol fees are allocated to various treasury functions:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-cyan-400 mb-2">Allocation Breakdown</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• 40% - Development & R&D</li>
                        <li>• 25% - Security & Audits</li>
                        <li>• 20% - Insurance Fund</li>
                        <li>• 10% - Marketing & Growth</li>
                        <li>• 5% - Governance & Operations</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-cyan-400 mb-2">Insurance Fund</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Covers liquidation shortfalls</li>
                        <li>• Protects against oracle failures</li>
                        <li>• Emergency protocol upgrades</li>
                        <li>• Target: 5% of TVL</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 id="tokenomics" className="text-2xl font-semibold text-white mb-6">8.3 Tokenomics & Governance</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  While Sneak doesn't have a native token, the protocol's economic model is designed to be sustainable and self-reinforcing through its fee structure and stakeholder incentives.
                </p>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-4">No-Token Model Benefits</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Reduced Speculation</h5>
                      <p className="text-gray-300 text-sm">Without a native token, users focus on the protocol's utility rather than token price speculation, leading to more sustainable growth.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Lower Barriers to Entry</h5>
                      <p className="text-gray-300 text-sm">Users don't need to acquire and hold tokens to use the protocol, reducing friction and improving accessibility.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Regulatory Clarity</h5>
                      <p className="text-gray-300 text-sm">Operating without a token reduces regulatory complexity and potential compliance issues in various jurisdictions.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Focus on Utility</h5>
                      <p className="text-gray-300 text-sm">The protocol's value is derived from its utility and adoption rather than token mechanics, creating more sustainable long-term value.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-indigo-400 mb-4">Governance Model</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Sneak implements a novel governance model based on stake-weighted voting using position tokens:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Voting Power Calculation</h5>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <BlockMath math="\text{Voting Power}_i = \sum_{j} \text{Position Value}_{i,j} \times \text{Time Weight}_j" />
                      </div>
                      <p className="text-gray-300 text-sm mt-2">Where time weight increases with position duration to reward long-term participants.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Governance Proposals</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Protocol parameter changes (fees, liquidation thresholds)</li>
                        <li>• New feature additions and upgrades</li>
                        <li>• Treasury allocation decisions</li>
                        <li>• Emergency protocol actions</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Voting Process</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• 7-day proposal period for discussion</li>
                        <li>• 3-day voting period</li>
                        <li>• 50%+1 majority required for approval</li>
                        <li>• 25% quorum requirement</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="algorithmic-spec" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-orange-500 mb-8">9. Algorithmic Specification</h2>
            <div className="space-y-12">
              <div>
                <h3 id="chain-resolution-algorithm" className="text-2xl font-semibold text-white mb-6">9.1 Chain Resolution Algorithm</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The chain resolution algorithm is the core mechanism that ensures atomic and consistent processing of position chains when outcomes are determined.
                </p>

                <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-orange-500 mb-4">Algorithm Overview</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    When an opportunity resolves, the following algorithm processes all dependent chains:
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                    <BlockMath math="\text{Algorithm: ChainResolution}(O_i, \text{outcome})" />
                    <BlockMath math="1. \text{Identify all chains containing } O_i" />
                    <BlockMath math="2. \text{For each chain } C \text{ containing } O_i:" />
                    <BlockMath math="3. \quad \text{If outcome = WIN: } V_i = P_i" />
                    <BlockMath math="4. \quad \text{If outcome = LOSE: } V_i = 0" />
                    <BlockMath math="5. \quad \text{Check downstream solvency: } V_{i+1} \geq A_{i+1}" />
                    <BlockMath math="6. \quad \text{If insolvent: trigger liquidation}" />
                    <BlockMath math="7. \text{Update all chain states atomically}" />
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Complexity Analysis</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Time Complexity</h5>
                      <p className="text-gray-300 text-sm">O(n × m) where n is the number of chains and m is the average chain length. This is efficient for typical use cases.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Space Complexity</h5>
                      <p className="text-gray-300 text-sm">O(n) where n is the number of active chains. Memory usage scales linearly with the number of chains.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Gas Complexity</h5>
                      <p className="text-gray-300 text-sm">O(k) where k is the number of chains affected by the resolution. Gas costs are proportional to the number of affected chains.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 id="liquidation-algorithm" className="text-2xl font-semibold text-white mb-6">9.2 Liquidation Algorithm</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The liquidation algorithm ensures fair and efficient processing of under-collateralized positions while protecting the protocol from bad debt.
                </p>

                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-red-400 mb-4">Liquidation Process</h4>
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                    <BlockMath math="\text{Algorithm: Liquidation}(C, j)" />
                    <BlockMath math="1. \text{Freeze chain } C \text{ to prevent modifications}" />
                    <BlockMath math="2. \text{Calculate recovery value: } R = \sum_{i=j}^{k} V_i" />
                    <BlockMath math="3. \text{Calculate debt: } D = \sum_{i=j}^{k} A_i" />
                    <BlockMath math="4. \text{Apply penalty: } P = \gamma \times D" />
                    <BlockMath math="5. \text{If } R \geq D + P: \text{ successful liquidation}" />
                    <BlockMath math="6. \text{Else: use insurance fund to cover shortfall}" />
                    <BlockMath math="7. \text{Return } R - D - P \text{ to user}" />
                    <BlockMath math="8. \text{Distribute penalty: } 50\% \text{ to liquidator, } 50\% \text{ to protocol}" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="roadmap" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-orange-500 mb-8">10. Development Roadmap</h2>
            <div className="space-y-12">
              <div>
                <h3 id="phase-1" className="text-2xl font-semibold text-white mb-6">10.1 Phase 1: Core Protocol (Q1 2024)</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The initial phase focuses on building and deploying the core protocol functionality with basic position chaining capabilities.
                </p>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-green-400 mb-4">Milestones</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                      <div>
                        <h5 className="font-semibold text-white">Smart Contract Development</h5>
                        <p className="text-gray-300 text-sm">Complete development of core smart contracts including SneakCore, OpportunityFactory, and PositionChainManager.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                      <div>
                        <h5 className="font-semibold text-white">Security Audits</h5>
                        <p className="text-gray-300 text-sm">Comprehensive security audits by leading firms including formal verification of critical components.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                      <div>
                        <h5 className="font-semibold text-white">Testnet Launch</h5>
                        <p className="text-gray-300 text-sm">Public testnet deployment with basic UI for market creation and position management.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">4</div>
                      <div>
                        <h5 className="font-semibold text-white">Mainnet Beta</h5>
                        <p className="text-gray-300 text-sm">Limited mainnet deployment with whitelisted users and basic position chaining functionality.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 id="phase-2" className="text-2xl font-semibold text-white mb-6">10.2 Phase 2: Privacy & Advanced Features (Q2 2024)</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The second phase introduces privacy features and advanced position management capabilities.
                </p>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Key Features</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-400 mb-2">Privacy Integration</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• eERC standard implementation</li>
                        <li>• Zero-knowledge proof integration</li>
                        <li>• Private transaction support</li>
                        <li>• Anonymous position management</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-400 mb-2">Advanced Features</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Complex chain strategies</li>
                        <li>• Automated position management</li>
                        <li>• Risk management tools</li>
                        <li>• Advanced analytics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 id="phase-3" className="text-2xl font-semibold text-white mb-6">10.3 Phase 3: Ecosystem & Scaling (Q3-Q4 2024)</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The final phase focuses on ecosystem development, cross-chain integration, and scaling solutions.
                </p>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">Ecosystem Development</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Cross-Chain Integration</h5>
                      <p className="text-gray-300 text-sm">Support for multiple blockchains including Ethereum, Polygon, and other EVM-compatible chains.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">API & SDK</h5>
                      <p className="text-gray-300 text-sm">Comprehensive API and SDK for third-party developers to build on top of Sneak.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Mobile Applications</h5>
                      <p className="text-gray-300 text-sm">Native mobile apps for iOS and Android with full privacy and position management capabilities.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Institutional Tools</h5>
                      <p className="text-gray-300 text-sm">Advanced tools for institutional users including portfolio management, risk analytics, and compliance reporting.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="conclusion" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-orange-500 mb-8">11. Conclusion</h2>
            <div className="space-y-12">
              <div>
                <h3 id="summary" className="text-2xl font-semibold text-white mb-6">11.1 Summary</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  Sneak represents a fundamental advancement in prediction market technology, introducing the concept of composable opportunity markets with position chaining. By leveraging standard ERC-20 tokens and implementing sophisticated privacy features, Sneak creates a new paradigm for capital-efficient speculation and information aggregation.
                </p>

                <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-orange-500 mb-4">Key Innovations</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-3">Technical Innovations</h5>
                      <ul className="text-gray-300 text-sm space-y-2">
                        <li>• Position chaining for capital efficiency</li>
                        <li>• eERC integration for privacy</li>
                        <li>• Atomic chain resolution</li>
                        <li>• Sophisticated liquidation mechanisms</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-3">Economic Innovations</h5>
                      <ul className="text-gray-300 text-sm space-y-2">
                        <li>• No-token sustainable model</li>
                        <li>• Stake-weighted governance</li>
                        <li>• Balanced fee structure</li>
                        <li>• Insurance fund mechanisms</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-4">Impact on DeFi</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Sneak's innovations have significant implications for the broader DeFi ecosystem:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                      <div>
                        <h5 className="font-semibold text-white">Capital Efficiency</h5>
                        <p className="text-gray-300 text-sm">Position chaining enables unprecedented capital efficiency, allowing users to leverage positions across multiple markets.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                      <div>
                        <h5 className="font-semibold text-white">Privacy Enhancement</h5>
                        <p className="text-gray-300 text-sm">eERC integration brings true privacy to prediction markets, protecting user strategies and positions.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                      <div>
                        <h5 className="font-semibold text-white">Composability</h5>
                        <p className="text-gray-300 text-sm">Standard ERC-20 tokens enable seamless integration with existing DeFi protocols and tools.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-400 mb-4">Future Outlook</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The future of Sneak and composable opportunity markets is bright:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-400 mb-2">Short-term (6-12 months)</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Mainnet launch and initial adoption</li>
                        <li>• First position chains and complex strategies</li>
                        <li>• Privacy feature rollout</li>
                        <li>• Community growth and governance</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-400 mb-2">Long-term (1-3 years)</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Cross-chain ecosystem expansion</li>
                        <li>• Institutional adoption and tools</li>
                        <li>• Advanced AI-powered strategies</li>
                        <li>• Global regulatory compliance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 id="call-to-action" className="text-2xl font-semibold text-white mb-6">11.2 Call to Action</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The development of Sneak represents a collaborative effort between developers, researchers, and the broader DeFi community. We invite all stakeholders to participate in this groundbreaking project.
                </p>

                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-orange-400 mb-4">Get Involved</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-3">For Developers</h5>
                      <ul className="text-gray-300 text-sm space-y-2">
                        <li>• Contribute to open-source development</li>
                        <li>• Build applications on Sneak</li>
                        <li>• Participate in security audits</li>
                        <li>• Join our developer community</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-3">For Users</h5>
                      <ul className="text-gray-300 text-sm space-y-2">
                        <li>• Test the protocol on testnet</li>
                        <li>• Provide feedback and suggestions</li>
                        <li>• Create and participate in markets</li>
                        <li>• Join our community discussions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
