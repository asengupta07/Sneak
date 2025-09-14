"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useCreatePositionChain } from "../hooks/useSneakProtocolWrites";
import { useNextOpportunityId } from "../hooks/useSneakProtocolReads";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  BarChart3,
  Activity,
  AlertTriangle,
  Zap,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "active" | "resolved" | "pending" | "cancelled";
  outcome?: "yes" | "no" | null;
  resolutionDate: string;
  initialLiquidity: number;
  currentLiquidity: number;
  yesLiquidity: number;
  noLiquidity: number;
  yesPrice: number;
  noPrice: number;
  totalVolume: number;
  participants: number;
  images: string[];
  banners: string[];
  creator: {
    address: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  resolvedAt?: string;
}

interface UserPosition {
  opportunityId: string;
  side: "yes" | "no";
  amount: number;
  price: number;
  value: number;
  liquidationPrice?: number;
  chainLevel: number;
  parentPosition?: string;
}

export default function MarketPage() {
  const router = useRouter();
  const createChain = useCreatePositionChain();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<
    Opportunity[]
  >([]);
  const [userPositions, setUserPositions] = useState<UserPosition[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("volume");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [showTradingModal, setShowTradingModal] = useState(false);
  const [tradingAmount, setTradingAmount] = useState("");
  const [tradingSide, setTradingSide] = useState<"yes" | "no">("yes");
  const [showChainingModal, setShowChainingModal] = useState(false);
  const [chainingAmount, setChainingAmount] = useState("");
  const [chainingSide, setChainingSide] = useState<"yes" | "no">("yes");
  const [selectedPosition, setSelectedPosition] = useState<UserPosition | null>(
    null
  );

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockOpportunities: Opportunity[] = [
      {
        id: "1",
        title: "Will Bitcoin reach $100k by end of 2024?",
        description:
          "This opportunity speculates on Bitcoin's price reaching $100,000 USD by December 31, 2024.",
        category: "Crypto",
        status: "active",
        resolutionDate: "2024-12-31T23:59:59Z",
        initialLiquidity: 10000,
        currentLiquidity: 15000,
        yesLiquidity: 8000,
        noLiquidity: 7000,
        yesPrice: 0.533,
        noPrice: 0.467,
        totalVolume: 25000,
        participants: 156,
        images: ["/api/placeholder/400/300"],
        banners: ["/api/placeholder/800/200"],
        creator: {
          address: "0x1234...5678",
          name: "CryptoTrader",
          avatar: "/api/placeholder/40/40",
        },
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        title: "Will OpenAI release GPT-5 in 2024?",
        description:
          "Speculation on whether OpenAI will publicly release GPT-5 before the end of 2024.",
        category: "Technology",
        status: "active",
        resolutionDate: "2024-06-30T23:59:59Z",
        initialLiquidity: 5000,
        currentLiquidity: 7500,
        yesLiquidity: 4000,
        noLiquidity: 3500,
        yesPrice: 0.533,
        noPrice: 0.467,
        totalVolume: 12000,
        participants: 89,
        images: ["/api/placeholder/400/300"],
        banners: ["/api/placeholder/800/200"],
        creator: {
          address: "0xabcd...1234",
          name: "TechAnalyst",
          avatar: "/api/placeholder/40/40",
        },
        createdAt: "2024-01-10T14:20:00Z",
      },
      {
        id: "3",
        title: "Will the US have a recession in 2024?",
        description:
          "Economic speculation on whether the US will enter a technical recession in 2024.",
        category: "Finance",
        status: "active",
        resolutionDate: "2024-12-31T23:59:59Z",
        initialLiquidity: 15000,
        currentLiquidity: 22000,
        yesLiquidity: 12000,
        noLiquidity: 10000,
        yesPrice: 0.545,
        noPrice: 0.455,
        totalVolume: 35000,
        participants: 234,
        images: ["/api/placeholder/400/300"],
        banners: ["/api/placeholder/800/200"],
        creator: {
          address: "0xefgh...5678",
          name: "EconExpert",
          avatar: "/api/placeholder/40/40",
        },
        createdAt: "2024-02-01T09:15:00Z",
      },
    ];

    const mockPositions: UserPosition[] = [
      {
        opportunityId: "1",
        side: "yes",
        amount: 100,
        price: 0.5,
        value: 106.6, // Current value based on price change
        liquidationPrice: 65,
        chainLevel: 0,
      },
      {
        opportunityId: "2",
        side: "no",
        amount: 60,
        price: 0.467,
        value: 60,
        liquidationPrice: 30,
        chainLevel: 1,
        parentPosition: "1",
      },
    ];

    setOpportunities(mockOpportunities);
    setFilteredOpportunities(mockOpportunities);
    setUserPositions(mockPositions);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = opportunities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((opp) => opp.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((opp) => opp.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "title":
          aValue = a.title;
          bValue = b.title;
          break;
        case "volume":
          aValue = a.totalVolume;
          bValue = b.totalVolume;
          break;
        case "liquidity":
          aValue = a.currentLiquidity;
          bValue = b.currentLiquidity;
          break;
        case "participants":
          aValue = a.participants;
          bValue = b.participants;
          break;
        case "resolutionDate":
          aValue = new Date(a.resolutionDate).getTime();
          bValue = new Date(b.resolutionDate).getTime();
          break;
        default:
          aValue = a.totalVolume;
          bValue = b.totalVolume;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOpportunities(filtered);
  }, [
    opportunities,
    searchTerm,
    statusFilter,
    categoryFilter,
    sortBy,
    sortOrder,
  ]);

  const calculateNewPrice = (
    currentLiquidity: number,
    currentPrice: number,
    tradeAmount: number,
    side: "yes" | "no"
  ) => {
    if (side === "yes") {
      const newLiquidity = currentLiquidity + tradeAmount;
      return (newLiquidity / currentLiquidity) * currentPrice;
    } else {
      const newLiquidity = currentLiquidity + tradeAmount;
      return (currentLiquidity / newLiquidity) * currentPrice;
    }
  };

  const handleTrade = async (opportunity: Opportunity) => {
    if (!tradingAmount) return;

    try {
      const tradeAmount = parseFloat(tradingAmount);
      await createChain(
        BigInt(opportunity.id),
        tradingSide === "yes",
        BigInt(Math.floor(tradeAmount * 1_000_000))
      );

      setShowTradingModal(false);
      setTradingAmount("");
    } catch (error) {
      console.error("Error placing trade:", error);
    }
  };

  const handleChainPosition = async (opportunity: Opportunity) => {
    if (!chainingAmount || !selectedPosition) return;

    try {
      const chainAmount = parseFloat(chainingAmount);
      const maxAllocation = selectedPosition.value * 0.6;
      if (chainAmount > maxAllocation) {
        alert(
          `Maximum allocation is $${maxAllocation.toFixed(
            2
          )} (60% of position value)`
        );
        return;
      }

      await createChain(
        BigInt(opportunity.id),
        chainingSide === "yes",
        BigInt(Math.floor(chainAmount * 1_000_000))
      );

      setShowChainingModal(false);
      setChainingAmount("");
      setSelectedPosition(null);
    } catch (error) {
      console.error("Error chaining position:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/20";
      case "resolved":
        return "text-blue-400 bg-blue-400/20";
      case "pending":
        return "text-yellow-400 bg-yellow-400/20";
      case "cancelled":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getPriceChangeColor = (price: number) => {
    return price > 0.5 ? "text-green-400" : "text-red-400";
  };

  const categories = [
    "all",
    "Technology",
    "Finance",
    "Sports",
    "Politics",
    "Entertainment",
    "Science",
    "Business",
    "Crypto",
    "Other",
  ];
  const statuses = ["all", "active", "resolved", "pending", "cancelled"];

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-cover bg-center bg-no-repeat">
      {/* Navbar */}
      <Navbar variant="home" currentPage="/market" />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-orange-500 mb-2">Market</h1>
            <p className="text-lg text-gray-300">
              Trade on opportunities and build position chains
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => router.push("/create-opportunity")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center"
            >
              <Zap className="w-5 h-5 mr-2" />
              Create Opportunity
            </button>
          </div>
        </div>

        {/* User Positions Summary */}
        {userPositions.length > 0 && (
          <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <LinkIcon className="w-6 h-6 mr-2 text-orange-500" />
              Your Position Chains
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userPositions.map((position, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      Level {position.chainLevel}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        position.side === "yes"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {position.side.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-white font-semibold">
                    ${position.value.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Liquidation: ${position.liquidationPrice?.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
              >
                {statuses.map((status) => (
                  <option key={status} value={status} className="capitalize">
                    {status === "all" ? "All Status" : status}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
              >
                <option value="volume-desc">Highest Volume</option>
                <option value="volume-asc">Lowest Volume</option>
                <option value="liquidity-desc">Highest Liquidity</option>
                <option value="participants-desc">Most Participants</option>
                <option value="resolutionDate-asc">Resolution Date</option>
                <option value="title-asc">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/40 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        opportunity.status
                      )}`}
                    >
                      {opportunity.status}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {opportunity.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {opportunity.title}
                  </h3>
                </div>
                <button
                  onClick={() => router.push(`/opportunity/${opportunity.id}`)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Price Display */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-gray-400">YES</span>
                  </div>
                  <p
                    className={`text-lg font-bold ${getPriceChangeColor(
                      opportunity.yesPrice
                    )}`}
                  >
                    {(opportunity.yesPrice * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400">
                    ${opportunity.yesLiquidity.toFixed(0)}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                    <span className="text-sm text-gray-400">NO</span>
                  </div>
                  <p
                    className={`text-lg font-bold ${getPriceChangeColor(
                      opportunity.noPrice
                    )}`}
                  >
                    {(opportunity.noPrice * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400">
                    ${opportunity.noLiquidity.toFixed(0)}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <p className="text-gray-400 text-xs">Volume</p>
                  <p className="text-white font-semibold">
                    ${(opportunity.totalVolume / 1000).toFixed(1)}k
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Participants</p>
                  <p className="text-white font-semibold">
                    {opportunity.participants}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Liquidity</p>
                  <p className="text-white font-semibold">
                    ${(opportunity.currentLiquidity / 1000).toFixed(1)}k
                  </p>
                </div>
              </div>

              {/* Resolution Date */}
              <div className="flex items-center text-gray-400 text-sm mb-4">
                <Clock className="w-4 h-4 mr-2" />
                {new Date(opportunity.resolutionDate).toLocaleDateString()}
              </div>

              {/* Trading Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedOpportunity(opportunity);
                    setTradingSide("yes");
                    setShowTradingModal(true);
                  }}
                  className="flex items-center justify-center p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-colors"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Buy YES
                </button>
                <button
                  onClick={() => {
                    setSelectedOpportunity(opportunity);
                    setTradingSide("no");
                    setShowTradingModal(true);
                  }}
                  className="flex items-center justify-center p-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Buy NO
                </button>
              </div>

              {/* Chain Position Button */}
              {userPositions.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedOpportunity(opportunity);
                    setShowChainingModal(true);
                  }}
                  className="w-full mt-3 flex items-center justify-center p-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-semibold transition-colors"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Chain Position
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No opportunities found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your filters or search terms"
                : "No opportunities are available at the moment"}
            </p>
          </div>
        )}
      </div>

      {/* Trading Modal */}
      {showTradingModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-orange-500/20 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">
              Buy {tradingSide.toUpperCase()} - {selectedOpportunity.title}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tradingAmount}
                  onChange={(e) => setTradingAmount(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  placeholder="100.00"
                />
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Current Price</span>
                  <span className="text-white font-semibold">
                    {tradingSide === "yes"
                      ? (selectedOpportunity.yesPrice * 100).toFixed(1) + "%"
                      : (selectedOpportunity.noPrice * 100).toFixed(1) + "%"}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Estimated Tokens</span>
                  <span className="text-white font-semibold">
                    {tradingAmount
                      ? (
                          parseFloat(tradingAmount) /
                          (tradingSide === "yes"
                            ? selectedOpportunity.yesPrice
                            : selectedOpportunity.noPrice)
                        ).toFixed(2)
                      : "0"}{" "}
                    tokens
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">New Price</span>
                  <span className="text-orange-400 font-semibold">
                    {tradingAmount
                      ? (
                          calculateNewPrice(
                            tradingSide === "yes"
                              ? selectedOpportunity.yesLiquidity
                              : selectedOpportunity.noLiquidity,
                            tradingSide === "yes"
                              ? selectedOpportunity.yesPrice
                              : selectedOpportunity.noPrice,
                            parseFloat(tradingAmount),
                            tradingSide
                          ) * 100
                        ).toFixed(1) + "%"
                      : "0%"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowTradingModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleTrade(selectedOpportunity)}
                disabled={!tradingAmount}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Confirm Trade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chaining Modal */}
      {showChainingModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-orange-500/20 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">
              Chain Position - {selectedOpportunity.title}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Position to Chain
                </label>
                <select
                  value={selectedPosition?.opportunityId || ""}
                  onChange={(e) => {
                    const position = userPositions.find(
                      (p) => p.opportunityId === e.target.value
                    );
                    setSelectedPosition(position || null);
                  }}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="">Select a position</option>
                  {userPositions.map((position, index) => (
                    <option key={index} value={position.opportunityId}>
                      Level {position.chainLevel} - ${position.value.toFixed(2)}{" "}
                      {position.side.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPosition && (
                <>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Available to Chain</span>
                      <span className="text-white font-semibold">
                        ${(selectedPosition.value * 0.6).toFixed(2)} (60% LTV)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Interest Fee</span>
                      <span className="text-orange-400 font-semibold">
                        $5.00
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount to Chain (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max={selectedPosition.value * 0.6}
                      value={chainingAmount}
                      onChange={(e) => setChainingAmount(e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                      placeholder="60.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Side
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setChainingSide("yes")}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          chainingSide === "yes"
                            ? "border-green-500 bg-green-500/20 text-green-400"
                            : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-green-500/50"
                        }`}
                      >
                        YES
                      </button>
                      <button
                        onClick={() => setChainingSide("no")}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          chainingSide === "no"
                            ? "border-red-500 bg-red-500/20 text-red-400"
                            : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-red-500/50"
                        }`}
                      >
                        NO
                      </button>
                    </div>
                  </div>

                  {chainingAmount && (
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                        <span className="text-yellow-400 font-semibold">
                          Liquidation Warning
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">
                        If the parent position value drops below $
                        {(parseFloat(chainingAmount) + 5).toFixed(2)}, this
                        chained position will be liquidated.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowChainingModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleChainPosition(selectedOpportunity)}
                disabled={!chainingAmount || !selectedPosition}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Chain Position
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
