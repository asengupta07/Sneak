"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Shield, Eye, Users, TrendingUp, Lock, Zap, Target, DollarSign, Clock, CheckCircle, BookOpen, FileText, Database, Network, Cpu, Layers, GitBranch, BarChart3, AlertTriangle, Info, Music, Search, Lightbulb, Building2 } from "lucide-react"
import Navbar from "../components/Navbar"
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

export default function HowItWorksPage() {
  const [activeSection, setActiveSection] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentSection, setCurrentSection] = useState('abstract')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

    // Observe all sections
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
    { id: 'introduction', title: 'Introduction', level: 1 },
    { id: 'problem-statement', title: 'Problem Statement', level: 2 },
    { id: 'solution-overview', title: 'Solution Overview', level: 2 },
    { id: 'mechanism', title: 'Mechanism Design', level: 1 },
    { id: 'core-mechanism', title: 'Core Mechanism', level: 2 },
    { id: 'market-creation', title: 'Market Creation Process', level: 2 },
    { id: 'trading-mechanics', title: 'Trading Mechanics', level: 2 },
    { id: 'pricing-model', title: 'Pricing Model', level: 2 },
    { id: 'privacy', title: 'Privacy Architecture', level: 1 },
    { id: 'eerc-implementation', title: 'eERC Implementation', level: 2 },
    { id: 'confidential-transactions', title: 'Confidential Transactions', level: 2 },
    { id: 'implementation', title: 'Technical Implementation', level: 1 },
    { id: 'smart-contracts', title: 'Smart Contract Architecture', level: 2 },
    { id: 'avalanche-integration', title: 'Avalanche Integration', level: 2 },
    { id: 'security', title: 'Security Analysis', level: 1 },
    { id: 'threat-model', title: 'Threat Model', level: 2 },
    { id: 'attack-vectors', title: 'Attack Vectors', level: 2 },
    { id: 'mitigation-strategies', title: 'Mitigation Strategies', level: 2 },
    { id: 'economics', title: 'Economic Model', level: 1 },
    { id: 'stakeholder-analysis', title: 'Stakeholder Analysis', level: 2 },
    { id: 'incentive-alignment', title: 'Incentive Alignment', level: 2 },
    { id: 'market-efficiency', title: 'Market Efficiency', level: 2 },
    { id: 'mathematics', title: 'Mathematical Framework', level: 1 },
    { id: 'pricing-mechanism', title: 'Multiplicative Pricing Mechanism', level: 2 },
    { id: 'settlement-formula', title: 'Settlement and Payout Formula', level: 2 },
    { id: 'example-calculation', title: 'Worked Example', level: 2 },
    { id: 'challenges', title: 'Challenges & Mitigations', level: 1 },
    { id: 'regulatory-considerations', title: 'Regulatory Considerations', level: 2 },
    { id: 'technical-challenges', title: 'Technical Challenges', level: 2 },
    { id: 'conclusion', title: 'Conclusion', level: 1 },
    { id: 'references', title: 'References', level: 1 }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navbar variant="technical" currentPage="/how-it-works" />

      {/* Table of Contents Sidebar */}
      <div className="fixed left-0 top-20 w-80 h-screen bg-black/95 backdrop-blur-sm border-r border-orange-500/20 overflow-y-auto z-40 hidden lg:block">
        <div className="p-6 pb-40 mb-40">
          <h3 className="text-lg font-bold text-orange-500 mb-6">Table of Contents</h3>
          <div className="space-y-2">
            {tableOfContents.map((item, index) => {
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
                  className={`block py-2 px-3 rounded-lg transition-all duration-200 text-sm cursor-pointer ${item.level === 1
                    ? `font-semibold ${isActive
                      ? 'text-orange-500 bg-orange-500/20 border-l-2 border-orange-500'
                      : 'text-orange-500 hover:bg-orange-500/10'
                    }`
                    : `${isActive
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

      {/* Hero Section */}
      <section id="abstract" className="pt-32 pb-20 px-6 lg:ml-80">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center bg-orange-500/10 border border-orange-500/20 rounded-full px-6 py-2 mb-8">
            <FileText className="w-5 h-5 text-orange-500 mr-2" />
            <span className="text-orange-500 font-medium">Technical Whitepaper v2.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-orange-500 to-white bg-clip-text text-transparent">
            Sneak Protocol
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-orange-500 mb-8">
            Multiversal Finance Markets on Avalanche
          </h2>

          <div className="bg-gray-900/50 border border-orange-500/20 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-orange-500 mb-6">Abstract</h3>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              <strong>Sneak</strong> introduces a novel mechanism for <strong>multiversal finance opportunity markets</strong> that enables 
              decentralized discovery and monetization of early-stage opportunities across multiple domains including music, 
              research, and venture capital. Unlike traditional prediction markets that require counterparties for every bet, 
              Sneak creates <strong>incentive-aligned markets</strong> where institutions that benefit from early discovery 
              provide liquidity, while maintaining <strong>complete transaction privacy</strong> through the eERC standard.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              This paper presents the complete technical architecture, economic model, and security analysis of the Sneak protocol, 
              demonstrating how <strong>confidential transactions</strong> and <strong>private pricing mechanisms</strong> 
              can create efficient markets for information discovery without compromising competitive advantages.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section id="introduction" className="py-20 px-6 lg:ml-80">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-orange-500 mb-8">1. Introduction</h2>

          <div className="space-y-8">
            <div>
              <h3 id="problem-statement" className="text-2xl font-semibold text-white mb-6">1.1 Problem Statement</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The discovery of high-value opportunities in domains such as music, research, and venture capital 
                suffers from fundamental <strong>information asymmetry</strong> and <strong>incentive misalignment</strong>. 
                While individuals on the ground—fans, researchers, local business owners—often possess early insights 
                about emerging opportunities, they lack mechanisms to monetize this information effectively.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Traditional institutions (record labels, research labs, VCs) that could benefit from these insights 
                face significant challenges in <strong>scaling their discovery processes</strong>. Existing solutions 
                such as scout programs require extensive vetting and trust-building, while public prediction markets 
                create <strong>free-rider problems</strong> where competitors can exploit signals without contributing 
                to their generation.
              </p>
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-red-400 mb-3">Key Problems:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong>Information Trapping:</strong> Early insights remain trapped with individuals who cannot monetize them</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong>Late Discovery:</strong> Institutions only discover opportunities when competition is already high</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong>Scalability Issues:</strong> Traditional scouting mechanisms don't scale globally</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong>Free-Rider Problem:</strong> Public markets create signals that competitors can exploit</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 id="solution-overview" className="text-2xl font-semibold text-white mb-6">1.2 Solution Overview</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                <strong>Sneak</strong> addresses these challenges through a novel architecture that combines 
                <strong> private prediction markets</strong> with <strong>confidential transaction technology</strong>. 
                The protocol creates incentive-aligned markets where institutions that benefit from early discovery 
                provide liquidity, while maintaining complete privacy of trading activity and market prices.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The core innovation lies in the <strong>natural counterparty design</strong>: instead of requiring 
                traders to find counterparties for every bet, institutions that stand to benefit from discovering 
                opportunities act as the "house" by providing liquidity. This creates a <strong>decentralized scouting 
                program</strong> that scales globally while preserving competitive advantages through private pricing.
              </p>
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-green-400 mb-3">Key Innovations:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span><strong>Private Pricing:</strong> Only sponsors see market prices and order flow in real-time</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span><strong>Confidential Transactions:</strong> eERC technology ensures complete transaction privacy</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span><strong>Incentive Alignment:</strong> Natural counterparties benefit from early discovery</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span><strong>Global Scalability:</strong> Permissionless participation for scouts worldwide</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanism Design Section */}
      <section id="mechanism" className="py-20 px-6 lg:ml-80">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-orange-500 mb-8">2. Mechanism Design</h2>

          <div className="space-y-12">
            <div>
              <h3 id="core-mechanism" className="text-2xl font-semibold text-white mb-6">2.1 Core Mechanism</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The Sneak protocol implements a <strong>three-phase mechanism</strong> that creates incentive-aligned 
                markets for opportunity discovery. The core innovation lies in the <strong>natural counterparty design</strong> 
                where institutions that benefit from early discovery provide liquidity, eliminating the need for 
                traditional counterparty matching.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-orange-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-orange-500 mb-3">Phase 1: Market Creation</h4>
                  <p className="text-gray-300 text-sm">
                    Sponsors (institutions) create private prediction markets for specific opportunity statements 
                    with committed liquidity pools.
                  </p>
                </div>

                <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-orange-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-orange-500 mb-3">Phase 2: Scout Participation</h4>
                  <p className="text-gray-300 text-sm">
                    Scouts discover and bet on opportunities using confidential transactions, 
                    driving private price signals.
                  </p>
                </div>

                <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-orange-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-orange-500 mb-3">Phase 3: Resolution & Payout</h4>
                  <p className="text-gray-300 text-sm">
                    When opportunities materialize, winning scouts receive payouts from the 
                    sponsor's liquidity pool.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 id="market-creation" className="text-2xl font-semibold text-white mb-6">2.2 Market Creation Process</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Market creation in Sneak follows a <strong>structured process</strong> that ensures proper 
                incentive alignment and market integrity. Sponsors must commit specific liquidity amounts 
                and define clear resolution criteria before markets become active.
              </p>

              <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-orange-500 mb-4">Market Creation Parameters</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-white mb-2">Required Parameters:</h5>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>• <strong>Opportunity Statement:</strong> Clear, verifiable outcome</li>
                      <li>• <strong>Liquidity Commitment:</strong> Minimum $10,000 AVAX</li>
                      <li>• <strong>Resolution Criteria:</strong> Objective verification method</li>
                      <li>• <strong>Market Duration:</strong> 30-365 days</li>
                      <li>• <strong>Fee Structure:</strong> 2-5% platform fee</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white mb-2">Optional Parameters:</h5>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>• <strong>Maximum Participants:</strong> Unlimited or capped</li>
                      <li>• <strong>Minimum Bet Size:</strong> $1-100 AVAX</li>
                      <li>• <strong>Geographic Restrictions:</strong> None by default</li>
                      <li>• <strong>Verification Method:</strong> On-chain or oracle-based</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 id="trading-mechanics" className="text-2xl font-semibold text-white mb-6">2.3 Trading Mechanics</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The trading mechanism implements <strong>confidential order matching</strong> with 
                <strong> delayed settlement</strong> to prevent front-running and maintain privacy. 
                All transactions use the eERC standard for complete confidentiality.
              </p>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Trading Flow</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                    <div>
                      <p className="text-gray-300"><strong>Order Submission:</strong> Scout submits encrypted order with eERC tokens</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                    <div>
                      <p className="text-gray-300"><strong>Private Matching:</strong> Orders matched against sponsor liquidity privately</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                    <div>
                      <p className="text-gray-300"><strong>Price Update:</strong> Private price updated based on order flow (sponsor only)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">4</div>
                    <div>
                      <p className="text-gray-300"><strong>Delayed Settlement:</strong> Positions revealed after opportunity window (2 weeks)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 id="pricing-model" className="text-2xl font-semibold text-white mb-6">2.4 Pricing Model</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Sneak employs a <strong>multiplicative pricing mechanism</strong> that creates immediate paper gains 
                for existing holders when new trades occur. This bonding curve approach ensures market efficiency 
                while maintaining the incentive structure for early discovery.
              </p>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-purple-400 mb-4">Mathematical Foundation</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-white mb-2">Initial Conditions:</h5>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <BlockMath math="R_y = LP_y, \quad R_n = LP_n" />
                      <BlockMath math="p_y = 0.50, \quad p_n = 0.50" />
                      <BlockMath math="S_y = \frac{LP_y}{0.5}, \quad S_n = \frac{LP_n}{0.5}" />
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-white mb-2">Price Update Rule (Buying YES with amount Δ):</h5>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <BlockMath math="tokens_{minted} = \frac{\Delta}{p_y}" />
                      <BlockMath math="R_y^{new} = R_y + \Delta" />
                      <BlockMath math="p_y^{new} = p_y \cdot \frac{R_y^{new}}{R_y^{old}}" />
                      <BlockMath math="p_n^{new} = p_n \cdot \frac{R_y^{old}}{R_y^{new}}" />
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-white mb-2">Conserved Invariant:</h5>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <BlockMath math="K = p_y \cdot p_n = \text{constant}" />
                      <p className="text-gray-300 text-sm mt-2">
                        This ensures that the product of YES and NO prices remains constant, maintaining market balance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-cyan-400 mb-4">Example Calculation</h4>
                <p className="text-gray-300 mb-4">
                  Consider a market with initial liquidity of $100 split 50/50 between YES and NO:
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <BlockMath math="\text{Initial: } R_y = 50, \quad R_n = 50, \quad p_y = 0.50, \quad p_n = 0.50" />
                  <BlockMath math="\text{Scout buys } \$10 \text{ of YES:}" />
                  <BlockMath math="tokens_{minted} = \frac{10}{0.50} = 20 \text{ tokens}" />
                  <BlockMath math="R_y^{new} = 50 + 10 = 60" />
                  <BlockMath math="p_y^{new} = 0.50 \cdot \frac{60}{50} = 0.60" />
                  <BlockMath math="p_n^{new} = 0.50 \cdot \frac{50}{60} = 0.4167" />
                  <BlockMath math="\text{Scout's paper value} = 20 \times 0.60 = \$12.00" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Architecture Section */}
      <section id="privacy" className="py-20 px-6 lg:ml-80">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-orange-500 mb-8">3. Privacy Architecture</h2>

          <div className="space-y-12">
            <div>
              <h3 id="eerc-implementation" className="text-2xl font-semibold text-white mb-6">3.1 eERC Implementation</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Sneak leverages the <strong>Encrypted ERC-20 (eERC)</strong> standard from AvaCloud to ensure 
                complete transaction confidentiality. The eERC implementation provides <strong>client-side encryption</strong>, 
                <strong>zero-knowledge proofs</strong>, and <strong>on-chain privacy</strong> without requiring 
                trusted third parties or off-chain relayers.
              </p>

              <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-orange-500 mb-4">eERC Technical Specifications</h4>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">Encryption Layer</h5>
                      <p className="text-gray-300 text-sm">AES-256-GCM encryption for transaction data</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">Zero-Knowledge Proofs</h5>
                      <p className="text-gray-300 text-sm">zk-SNARKs for balance and transfer validity</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">Key Management</h5>
                      <p className="text-gray-300 text-sm">Hierarchical deterministic (HD) key derivation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 id="confidential-transactions" className="text-2xl font-semibold text-white mb-6">3.2 Confidential Transactions</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The confidential transaction system ensures that <strong>no external observer</strong> can determine 
                which opportunities a user is betting on, nor the size of their bets. This is achieved through 
                <strong>commitment schemes</strong>, <strong>range proofs</strong>, and <strong>mixing protocols</strong> 
                that obfuscate transaction patterns.
              </p>

              <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-cyan-400 mb-4">Transaction Privacy Features</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-cyan-400 mt-1" />
                    <div>
                      <h5 className="font-semibold text-white">Amount Hiding</h5>
                      <p className="text-gray-300 text-sm">Transaction amounts are encrypted and only verifiable through zero-knowledge proofs</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Eye className="w-5 h-5 text-cyan-400 mt-1" />
                    <div>
                      <h5 className="font-semibold text-white">Sender/Receiver Privacy</h5>
                      <p className="text-gray-300 text-sm">One-time addresses prevent transaction graph analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-cyan-400 mt-1" />
                    <div>
                      <h5 className="font-semibold text-white">Market Obfuscation</h5>
                      <p className="text-gray-300 text-sm">Which opportunity is being bet on remains completely hidden</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Implementation Section */}
      <section id="implementation" className="py-20 px-6 lg:ml-80">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-orange-500 mb-8">4. Technical Implementation</h2>

          <div className="space-y-12">
            <div>
              <h3 id="smart-contracts" className="text-2xl font-semibold text-white mb-6">4.1 Smart Contract Architecture</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The Sneak protocol is implemented through a <strong>modular smart contract system</strong> deployed on 
                the Avalanche C-Chain. The architecture consists of <strong>core protocol contracts</strong>, 
                <strong>market-specific contracts</strong>, and <strong>privacy layer contracts</strong> that work 
                together to provide secure, private, and efficient opportunity markets.
              </p>

              <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-orange-500 mb-4">Core Contract Architecture</h4>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-white mb-3">Protocol Contracts</h5>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• <strong>SneakCore:</strong> Main protocol registry and governance</li>
                        <li>• <strong>MarketFactory:</strong> Creates and manages market instances</li>
                        <li>• <strong>LiquidityManager:</strong> Handles sponsor liquidity provision</li>
                        <li>• <strong>ResolutionEngine:</strong> Manages market resolution and payouts</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-3">Privacy Contracts</h5>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• <strong>eERCWrapper:</strong> eERC token integration layer</li>
                        <li>• <strong>CommitmentManager:</strong> Handles encrypted commitments</li>
                        <li>• <strong>ProofVerifier:</strong> Validates zero-knowledge proofs</li>
                        <li>• <strong>MixingPool:</strong> Transaction mixing and obfuscation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 id="avalanche-integration" className="text-2xl font-semibold text-white mb-6">4.2 Avalanche Integration</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Sneak leverages Avalanche's <strong>high-performance consensus</strong> and <strong>subnet architecture</strong> 
                to provide fast, low-cost transactions while maintaining security. The protocol utilizes the 
                <strong>C-Chain</strong> for main contract deployment and can be extended to custom subnets 
                for specialized market types or enhanced privacy requirements.
              </p>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Avalanche-Specific Features</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-400 mb-2">Fast Finality</h5>
                    <p className="text-gray-300 text-sm">Sub-second transaction finality for real-time trading</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-400 mb-2">Low Fees</h5>
                    <p className="text-gray-300 text-sm">Micro-fee structure enables small bet sizes</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-400 mb-2">EVM Compatibility</h5>
                    <p className="text-gray-300 text-sm">Full Ethereum tooling and library support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Analysis Section */}
      <section id="security" className="py-20 px-6 lg:ml-80">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-orange-500 mb-8">5. Security Analysis</h2>

          <div className="space-y-12">
            <div>
              <h3 id="threat-model" className="text-2xl font-semibold text-white mb-6">5.1 Threat Model</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The Sneak protocol faces several categories of threats that could compromise its security, 
                privacy, or economic integrity. Our threat model considers <strong>adversarial actors</strong> 
                including malicious scouts, compromised sponsors, external attackers, and regulatory entities.
              </p>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-red-400 mb-4">Threat Categories</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-white mb-3">Economic Attacks</h5>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• <strong>Market Manipulation:</strong> Coordinated buying to inflate prices</li>
                      <li>• <strong>Insider Trading:</strong> Using privileged information for profit</li>
                      <li>• <strong>Sybil Attacks:</strong> Creating multiple identities to influence markets</li>
                      <li>• <strong>Liquidity Attacks:</strong> Draining sponsor liquidity pools</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white mb-3">Privacy Attacks</h5>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• <strong>Transaction Analysis:</strong> Inferring trading patterns from metadata</li>
                      <li>• <strong>Timing Attacks:</strong> Correlating transactions with external events</li>
                      <li>• <strong>Network Analysis:</strong> Tracking IP addresses and connection patterns</li>
                      <li>• <strong>Cryptographic Attacks:</strong> Breaking encryption or zero-knowledge proofs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 id="attack-vectors" className="text-2xl font-semibold text-white mb-6">5.2 Attack Vectors</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Specific attack vectors include <strong>front-running</strong> through MEV extraction, 
                <strong>price manipulation</strong> via coordinated trading, and <strong>privacy leakage</strong> 
                through transaction graph analysis. Each vector requires specific mitigation strategies.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border border-orange-500/20 rounded-lg">
                  <thead className="bg-orange-500/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-orange-500 font-semibold">Attack Vector</th>
                      <th className="px-4 py-3 text-left text-orange-500 font-semibold">Risk Level</th>
                      <th className="px-4 py-3 text-left text-orange-500 font-semibold">Impact</th>
                      <th className="px-4 py-3 text-left text-orange-500 font-semibold">Mitigation</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-t border-orange-500/20">
                      <td className="px-4 py-3"><strong>MEV Extraction</strong></td>
                      <td className="px-4 py-3 text-yellow-400">Medium</td>
                      <td className="px-4 py-3">Price manipulation, unfair advantage</td>
                      <td className="px-4 py-3">Delayed settlement, commit-reveal scheme</td>
                    </tr>
                    <tr className="border-t border-orange-500/20">
                      <td className="px-4 py-3"><strong>Sybil Attacks</strong></td>
                      <td className="px-4 py-3 text-red-400">High</td>
                      <td className="px-4 py-3">Market manipulation, false signals</td>
                      <td className="px-4 py-3">Staking requirements, reputation system</td>
                    </tr>
                    <tr className="border-t border-orange-500/20">
                      <td className="px-4 py-3"><strong>Privacy Leakage</strong></td>
                      <td className="px-4 py-3 text-red-400">High</td>
                      <td className="px-4 py-3">Loss of competitive advantage</td>
                      <td className="px-4 py-3">eERC encryption, mixing protocols</td>
                    </tr>
                    <tr className="border-t border-orange-500/20">
                      <td className="px-4 py-3"><strong>Smart Contract Bugs</strong></td>
                      <td className="px-4 py-3 text-red-400">Critical</td>
                      <td className="px-4 py-3">Fund loss, protocol failure</td>
                      <td className="px-4 py-3">Formal verification, audits, bug bounties</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 id="mitigation-strategies" className="text-2xl font-semibold text-white mb-6">5.3 Mitigation Strategies</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Our mitigation strategies employ <strong>multi-layered security</strong> including cryptographic 
                primitives, economic incentives, and protocol-level protections. The combination of these strategies 
                creates a robust defense against the identified attack vectors.
              </p>

              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-green-400 mb-4">Security Measures</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <h5 className="font-semibold text-white">Cryptographic Security</h5>
                      <p className="text-gray-300 text-sm">AES-256 encryption, zk-SNARKs, and secure multi-party computation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <h5 className="font-semibold text-white">Economic Incentives</h5>
                      <p className="text-gray-300 text-sm">Staking requirements, slashing conditions, and reward mechanisms</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <h5 className="font-semibold text-white">Temporal Controls</h5>
                      <p className="text-gray-300 text-sm">Delayed settlement, time locks, and opportunity windows</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Economic Model Section */}
      <section id="economics" className="py-20 px-6 lg:ml-80">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-orange-500 mb-8">6. Economic Model</h2>

          <div className="space-y-12">
            <div>
              <h3 id="stakeholder-analysis" className="text-2xl font-semibold text-white mb-6">6.1 Stakeholder Analysis</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The Sneak protocol creates value for three primary stakeholder groups through carefully designed 
                <strong>incentive mechanisms</strong> and <strong>value distribution</strong>. Each stakeholder 
                group contributes unique value to the ecosystem and receives appropriate rewards.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-orange-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-orange-500 mb-3">Scouts</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    <strong>Value Contribution:</strong> Early discovery, market research, signal generation
                  </p>
                  <p className="text-gray-300 text-sm">
                    <strong>Rewards:</strong> Direct payouts from successful predictions, reputation building
                  </p>
                </div>
                
                <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-orange-500 mb-3">Sponsors</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    <strong>Value Contribution:</strong> Liquidity provision, market creation, opportunity execution
                  </p>
                  <p className="text-gray-300 text-sm">
                    <strong>Rewards:</strong> Early access to opportunities, competitive advantage, cost reduction
                  </p>
                </div>
                
                <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-orange-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-orange-500 mb-3">Protocol</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    <strong>Value Contribution:</strong> Infrastructure, security, privacy, market efficiency
                  </p>
                  <p className="text-gray-300 text-sm">
                    <strong>Rewards:</strong> Platform fees, governance tokens, network effects
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 id="incentive-alignment" className="text-2xl font-semibold text-white mb-6">6.2 Incentive Alignment</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The protocol's <strong>incentive structure</strong> ensures that all participants are motivated 
                to act in ways that benefit the overall ecosystem. This alignment is achieved through 
                <strong>economic mechanisms</strong> that reward desirable behaviors and penalize harmful ones.
              </p>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-purple-400 mb-4">Incentive Mechanisms</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <h5 className="font-semibold text-white">Skin in the Game</h5>
                      <p className="text-gray-300 text-sm">Scouts must stake tokens to participate, aligning their interests with market success</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <h5 className="font-semibold text-white">Time-Locked Rewards</h5>
                      <p className="text-gray-300 text-sm">Delayed payouts prevent short-term manipulation and encourage long-term thinking</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <h5 className="font-semibold text-white">Reputation System</h5>
                      <p className="text-gray-300 text-sm">Successful scouts gain reputation, enabling larger positions and better terms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 id="market-efficiency" className="text-2xl font-semibold text-white mb-6">6.3 Market Efficiency</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Sneak's design promotes <strong>market efficiency</strong> through several mechanisms that 
                ensure accurate price discovery and optimal resource allocation. The combination of 
                <strong>private pricing</strong> and <strong>confidential transactions</strong> creates 
                efficient markets without the typical free-rider problems.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border border-orange-500/20 rounded-lg">
                  <thead className="bg-orange-500/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-orange-500 font-semibold">Efficiency Factor</th>
                      <th className="px-4 py-3 text-left text-orange-500 font-semibold">Mechanism</th>
                      <th className="px-4 py-3 text-left text-orange-500 font-semibold">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-t border-orange-500/20">
                      <td className="px-4 py-3"><strong>Price Discovery</strong></td>
                      <td className="px-4 py-3">Private pricing with sponsor-only visibility</td>
                      <td className="px-4 py-3">Accurate signals without competitor exploitation</td>
                    </tr>
                    <tr className="border-t border-orange-500/20">
                      <td className="px-4 py-3"><strong>Information Aggregation</strong></td>
                      <td className="px-4 py-3">Decentralized scout network</td>
                      <td className="px-4 py-3">Diverse perspectives and global coverage</td>
                    </tr>
                    <tr className="border-t border-orange-500/20">
                      <td className="px-4 py-3"><strong>Risk Distribution</strong></td>
                      <td className="px-4 py-3">Sponsor liquidity provision</td>
                      <td className="px-4 py-3">Reduced risk for individual scouts</td>
                    </tr>
                    <tr className="border-t border-orange-500/20">
                      <td className="px-4 py-3"><strong>Transaction Costs</strong></td>
                      <td className="px-4 py-3">Avalanche low fees + eERC efficiency</td>
                      <td className="px-4 py-3">Enables micro-betting and global participation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mathematical Framework Section */}
      <section id="mathematics" className="py-20 px-6 lg:ml-80">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-orange-500 mb-8">7. Mathematical Framework</h2>
          
          <div className="space-y-12">
            <div>
              <h3 id="pricing-mechanism" className="text-2xl font-semibold text-white mb-6">7.1 Multiplicative Pricing Mechanism</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The Sneak protocol employs a <strong>multiplicative pricing rule</strong> that ensures 
                price discovery while maintaining market efficiency. This mechanism creates immediate 
                paper gains for existing holders when new participants enter the market.
              </p>
              
              <div className="bg-gray-900/30 border border-orange-500/20 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-orange-500 mb-4">Core Pricing Equations</h4>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h5 className="font-semibold text-orange-400 mb-2">Initial Market Setup</h5>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p>For a market with total liquidity <InlineMath math="LP_{total}" />:</p>
                      <p>• <InlineMath math="R_y = R_n = \frac{LP_{total}}{2}" /> (equal initial reserves)</p>
                      <p>• <InlineMath math="p_y = p_n = 0.50" /> (initial prices)</p>
                      <p>• <InlineMath math="S_y = S_n = \frac{LP_{total}}{0.5}" /> (initial token supply)</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h5 className="font-semibold text-orange-400 mb-2">Price Update Rule</h5>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p>When buying <InlineMath math="\Delta" /> USD worth of YES tokens:</p>
                      <p>• <InlineMath math="tokens_{minted} = \frac{\Delta}{p_{y,old}}" /></p>
                      <p>• <InlineMath math="R_{y,new} = R_{y,old} + \Delta" /></p>
                      <p>• <InlineMath math="p_{y,new} = p_{y,old} \times \frac{R_{y,new}}{R_{y,old}}" /></p>
                      <p>• <InlineMath math="p_{n,new} = p_{n,old} \times \frac{R_{y,old}}{R_{y,new}}" /></p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h5 className="font-semibold text-orange-400 mb-2">Conserved Invariant</h5>
                    <div className="text-gray-300 text-sm">
                      <p>The product <InlineMath math="K = p_y \times p_n" /> remains constant, ensuring:</p>
                      <p>• <InlineMath math="K = 0.25" /> (when starting at 50/50 split)</p>
                      <p>• Price movements are bounded and predictable</p>
                      <p>• Market maintains solvency guarantees</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 id="settlement-formula" className="text-2xl font-semibold text-white mb-6">7.2 Settlement and Payout Formula</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The settlement mechanism ensures fair distribution of rewards while maintaining protocol 
                sustainability. The formula accounts for liquidity provider returns, protocol fees, 
                and winner distributions.
              </p>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Settlement Process</h4>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-400 mb-2">Step 1: Calculate Fees and LP Returns</h5>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p>• <InlineMath math="tax = \tau \times R_{lose}" /> (protocol fee)</p>
                      <p>• <InlineMath math="LP_{interest} = LP_{total} \times r_{lp}" /> (LP premium)</p>
                      <p>• <InlineMath math="R_{remain} = R_{lose} - tax - LP_{interest}" /></p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-400 mb-2">Step 2: Winner Payout Calculation</h5>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p>For each winner with <InlineMath math="w_{tokens}" />:</p>
                      <p>• <InlineMath math="share = \frac{w_{tokens}}{S_{win}}" /></p>
                      <p>• <InlineMath math="payout = share \times (R_{win} + R_{remain})" /></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 id="example-calculation" className="text-2xl font-semibold text-white mb-6">7.3 Worked Example</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Let's walk through a concrete example to demonstrate the pricing mechanism and settlement process.
              </p>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-green-400 mb-4">Example: Katseye Market</h4>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h5 className="font-semibold text-green-400 mb-2">Initial Setup</h5>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p>• <InlineMath math="LP_{total} = \$100" /></p>
                      <p>• <InlineMath math="R_y = R_n = \$50" /></p>
                      <p>• <InlineMath math="p_y = p_n = \$0.50" /></p>
                      <p>• <InlineMath math="S_y = S_n = 100 \text{ tokens}" /></p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h5 className="font-semibold text-green-400 mb-2">After $10 YES Purchase</h5>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p>• <InlineMath math="tokens_{minted} = \frac{\$10}{\$0.50} = 20 \text{ tokens}" /></p>
                      <p>• <InlineMath math="R_{y,new} = \$50 + \$10 = \$60" /></p>
                      <p>• <InlineMath math="p_{y,new} = \$0.50 \times \frac{\$60}{\$50} = \$0.60" /></p>
                      <p>• <InlineMath math="p_{n,new} = \$0.50 \times \frac{\$50}{\$60} = \$0.417" /></p>
                      <p>• <InlineMath math="\text{Paper value} = 20 \times \$0.60 = \$12.00" /></p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h5 className="font-semibold text-green-400 mb-2">Settlement (if YES wins)</h5>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p>• <InlineMath math="tax = 0.01 \times \$50 = \$0.50" /></p>
                      <p>• <InlineMath math="LP_{interest} = \$100 \times 0.04 = \$4.00" /></p>
                      <p>• <InlineMath math="R_{remain} = \$50 - \$0.50 - \$4.00 = \$45.50" /></p>
                      <p>• <InlineMath math="share = \frac{20}{120} = \frac{1}{6}" /></p>
                      <p>• <InlineMath math="payout = \frac{1}{6} \times (\$60 + \$45.50) = \$17.58" /></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges & Mitigations Section */}
      <section id="challenges" className="py-20 px-6 lg:ml-80">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-orange-500 mb-8">8. Challenges & Mitigations</h2>
          
          <div className="space-y-12">
            <div>
              <h3 id="regulatory-considerations" className="text-2xl font-semibold text-white mb-6">8.1 Regulatory Considerations</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The Sneak protocol operates in a complex regulatory environment where <strong>prediction markets</strong> 
                and <strong>confidential transactions</strong> may face scrutiny from various jurisdictions. 
                Our approach focuses on <strong>compliance by design</strong> and <strong>transparent operations</strong> 
                while maintaining the core privacy features that make the protocol valuable.
              </p>
              
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-yellow-400 mb-4">Regulatory Challenges</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-white mb-3">Gambling Regulations</h5>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• <strong>Skill vs. Chance:</strong> Demonstrating skill-based nature of opportunity discovery</li>
                      <li>• <strong>Licensing Requirements:</strong> Potential need for gambling licenses in some jurisdictions</li>
                      <li>• <strong>Age Restrictions:</strong> Implementing appropriate age verification systems</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white mb-3">Financial Regulations</h5>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• <strong>Securities Laws:</strong> Ensuring markets don't constitute securities offerings</li>
                      <li>• <strong>AML/KYC:</strong> Anti-money laundering and know-your-customer requirements</li>
                      <li>• <strong>Tax Reporting:</strong> Providing necessary tax documentation for users</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 id="technical-challenges" className="text-2xl font-semibold text-white mb-6">8.2 Technical Challenges</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Implementing a <strong>privacy-preserving prediction market</strong> presents several technical 
                challenges related to <strong>scalability</strong>, <strong>user experience</strong>, and 
                <strong>cryptographic complexity</strong>. Our technical roadmap addresses these challenges 
                through phased development and continuous optimization.
              </p>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-red-400 mb-4">Technical Challenges</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Cpu className="w-5 h-5 text-red-400 mt-1" />
                    <div>
                      <h5 className="font-semibold text-white">Zero-Knowledge Proof Generation</h5>
                      <p className="text-gray-300 text-sm">Client-side proof generation can be computationally intensive and slow</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Network className="w-5 h-5 text-red-400 mt-1" />
                    <div>
                      <h5 className="font-semibold text-white">Network Scalability</h5>
                      <p className="text-gray-300 text-sm">High transaction volumes may impact network performance and fees</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Database className="w-5 h-5 text-red-400 mt-1" />
                    <div>
                      <h5 className="font-semibold text-white">Data Availability</h5>
                      <p className="text-gray-300 text-sm">Ensuring encrypted data remains accessible while maintaining privacy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section id="conclusion" className="py-20 px-6 lg:ml-80">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-orange-500 mb-8">9. Conclusion</h2>
          
          <div className="space-y-8">
            <p className="text-lg text-gray-300 leading-relaxed">
              <strong>Sneak</strong> represents a fundamental advancement in the design of <strong>information markets</strong> 
              by combining <strong>private prediction markets</strong> with <strong>confidential transaction technology</strong>. 
              The protocol addresses critical limitations in existing discovery mechanisms while preserving the competitive 
              advantages that make early discovery valuable.
            </p>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              Through careful <strong>mechanism design</strong> and <strong>privacy-preserving infrastructure</strong>, 
              Sneak enables a new paradigm where <strong>information discovery</strong> becomes a globally accessible, 
              financially rewarding activity. The protocol's <strong>incentive alignment</strong> ensures that all 
              participants benefit from the ecosystem's success.
            </p>
            
            <div className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-orange-500 mb-6">The Future of Information Finance</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Sneak opens up a new design space for <strong>private, incentive-aligned discovery</strong> across 
                domains including music, research, venture capital, and beyond. As the protocol matures, we expect 
                to see novel applications and use cases that leverage its unique combination of privacy and efficiency.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                The success of Sneak depends on the participation of <strong>scouts</strong>, <strong>sponsors</strong>, 
                and the broader community. We invite you to join us in building the future of information finance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section id="references" className="py-20 px-6 lg:ml-80">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-orange-500 mb-8">10. References</h2>
          
          <div className="space-y-4 text-gray-300">
            <div className="bg-gray-900/30 border border-orange-500/20 rounded-lg p-4">
              <p className="text-sm">
                <strong>[1]</strong> Hanson, R. (2003). "Combinatorial Information Market Design." <em>Information Systems Frontiers</em>, 5(1), 107-119.
              </p>
            </div>
            <div className="bg-gray-900/30 border border-orange-500/20 rounded-lg p-4">
              <p className="text-sm">
                <strong>[2]</strong> Wolfers, J., & Zitzewitz, E. (2004). "Prediction Markets." <em>Journal of Economic Perspectives</em>, 18(2), 107-126.
              </p>
            </div>
            <div className="bg-gray-900/30 border border-orange-500/20 rounded-lg p-4">
              <p className="text-sm">
                <strong>[3]</strong> AvaCloud. (2024). "eERC-20: Encrypted ERC-20 Standard for Privacy-Preserving Transactions." <em>Technical Specification</em>.
              </p>
            </div>
            <div className="bg-gray-900/30 border border-orange-500/20 rounded-lg p-4">
              <p className="text-sm">
                <strong>[4]</strong> Avalanche Foundation. (2024). "Avalanche Consensus Protocol: A New Approach to Distributed Systems." <em>White Paper</em>.
              </p>
            </div>
            <div className="bg-gray-900/30 border border-orange-500/20 rounded-lg p-4">
              <p className="text-sm">
                <strong>[5]</strong> Ben-Sasson, E., et al. (2014). "Succinct Non-Interactive Zero Knowledge for a von Neumann Architecture." <em>USENIX Security</em>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-500/10 to-orange-500/5 lg:ml-80">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-orange-500">Ready to Start Discovering?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the waitlist and be among the first to discover and profit from opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="bg-orange-500 text-black px-8 py-4 rounded-full font-semibold hover:bg-orange-400 transition-colors"
            >
              Join Waitlist
            </a>
            <a
              href="#privacy"
              className="border border-orange-500 text-orange-500 px-8 py-4 rounded-full font-semibold hover:bg-orange-500/10 transition-colors"
            >
              Learn About Privacy
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-orange-500/20 lg:ml-80">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-orange-500 mb-4">Sneak Protocol</h3>
              <p className="text-gray-400 text-sm">
                Private opportunity markets for decentralized discovery and monetization.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Protocol</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#mechanism" className="hover:text-orange-500 transition-colors">How It Works</a></li>
                <li><a href="#privacy" className="hover:text-orange-500 transition-colors">Privacy</a></li>
                <li><a href="#security" className="hover:text-orange-500 transition-colors">Security</a></li>
                <li><a href="#economics" className="hover:text-orange-500 transition-colors">Economics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/" className="hover:text-orange-500 transition-colors">Home</a></li>
                <li><a href="#references" className="hover:text-orange-500 transition-colors">References</a></li>
                <li><a href="https://github.com/sneak-protocol" className="hover:text-orange-500 transition-colors">GitHub</a></li>
                <li><a href="https://docs.sneak.io" className="hover:text-orange-500 transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="https://discord.gg/sneak" className="hover:text-orange-500 transition-colors">Discord</a></li>
                <li><a href="https://twitter.com/sneakprotocol" className="hover:text-orange-500 transition-colors">Twitter</a></li>
                <li><a href="https://t.me/sneakprotocol" className="hover:text-orange-500 transition-colors">Telegram</a></li>
                <li><a href="mailto:hello@sneak.io" className="hover:text-orange-500 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Sneak Protocol. All rights reserved. Built on Avalanche.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}