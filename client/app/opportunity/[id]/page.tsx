"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  AlertCircle,
  Share2,
  ExternalLink,
  BarChart3,
  Activity,
  Target,
  Info,
} from "lucide-react";
import { useGetOpportunity } from "../../hooks/useSneakProtocolReads";
import {
  useBuyTokens,
  useResolveOpportunity as useResolveOpportunityWrite,
  useClaimWinnings,
} from "../../hooks/useSneakProtocolWrites";
import { useAccount } from "wagmi";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "active" | "resolved" | "pending" | "cancelled";
  outcome?: "yes" | "no" | null;
  resolutionCriteria: string;
  resolutionDate: string;
  initialLiquidity: number;
  currentLiquidity: number;
  yesPrice: number;
  noPrice: number;
  totalVolume: number;
  participants: number;
  images: string[];
  banners: string[];
  isCreator: boolean;
  createdAt: string;
  resolvedAt?: string;
  creator: {
    address: string;
    name: string;
    avatar: string;
  };
}

interface Position {
  id: string;
  user: string;
  side: "yes" | "no";
  amount: number;
  price: number;
  timestamp: string;
}

export default function OpportunityDetail() {
  const router = useRouter();
  const params = useParams();
  const opportunityId = params.id as string;
  const idAsBigInt = useMemo(() => {
    try {
      return BigInt(opportunityId);
    } catch {
      return undefined;
    }
  }, [opportunityId]);
  const { address } = useAccount();
  const { data: onchainOpportunity, isLoading: isLoadingOpportunity } =
    useGetOpportunity(idAsBigInt);
  const buyTokens = useBuyTokens();
  const resolveOpportunityWrite = useResolveOpportunityWrite();
  const claimWinningsWrite = useClaimWinnings();

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no" | null>(
    null
  );
  const [tradingAmount, setTradingAmount] = useState("");
  const [tradingSide, setTradingSide] = useState<"yes" | "no">("yes");
  const [showTradingModal, setShowTradingModal] = useState(false);

  // Load opportunity from contract
  // Map onchain data into UI-friendly shape
  const parsedOpportunity: Opportunity | null = useMemo(() => {
    if (!onchainOpportunity) return null;
    try {
      const o: any = onchainOpportunity as any;
      const liquidityYes = Number(o.liquidityYes ?? 0n) / 1_000_000;
      const liquidityNo = Number(o.liquidityNo ?? 0n) / 1_000_000;
      const yesPrice = Number(o.priceYes ?? 0n) / 1_000_000;
      const noPrice = Number(o.priceNo ?? 0n) / 1_000_000;
      const creator = String(o.creator);
      const resolved = Boolean(o.resolved);
      const outcomeBool = Boolean(o.outcome);
      const creationTime = Number(o.creationTime ?? 0n) * 1000;
      return {
        id: String(o.id ?? opportunityId),
        title: String(o.name ?? "Opportunity"),
        description: String(o.metadataUrl ?? ""),
        category: "Onchain",
        status: resolved ? "resolved" : "active",
        outcome: resolved ? (outcomeBool ? "yes" : "no") : null,
        resolutionCriteria: "",
        resolutionDate: new Date(
          creationTime + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        initialLiquidity: liquidityYes + liquidityNo,
        currentLiquidity: liquidityYes + liquidityNo,
        yesPrice,
        noPrice,
        totalVolume: liquidityYes + liquidityNo,
        participants: 0,
        images: [],
        banners: [],
        isCreator: address
          ? creator?.toLowerCase() === address.toLowerCase()
          : false,
        createdAt: new Date(creationTime).toISOString(),
        creator: {
          address: creator,
          name: creator.slice(0, 6) + "..." + creator.slice(-4),
          avatar: "/api/placeholder/40/40",
        },
      };
    } catch (e) {
      return null;
    }
  }, [onchainOpportunity, address, opportunityId]);

  useMemo(() => {
    setOpportunity(parsedOpportunity);
    setLoading(Boolean(isLoadingOpportunity));
  }, [parsedOpportunity, isLoadingOpportunity]);

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

  const getOutcomeIcon = (outcome: string | null | undefined) => {
    switch (outcome) {
      case "yes":
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case "no":
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const handleOutcomeSelection = (outcome: "yes" | "no") => {
    setSelectedOutcome(outcome);
    setShowOutcomeModal(true);
  };

  const confirmOutcomeSelection = async () => {
    if (!opportunity || !selectedOutcome) return;

    try {
      await resolveOpportunityWrite(
        BigInt(opportunity.id),
        selectedOutcome === "yes"
      );
      setShowOutcomeModal(false);
      setSelectedOutcome(null);
    } catch (error) {
      console.error("Error setting outcome:", error);
    }
  };

  const handleDeleteOpportunity = async () => {
    if (
      !opportunity ||
      !confirm("Are you sure you want to delete this opportunity?")
    )
      return;

    try {
      // TODO: Implement actual API call to delete opportunity
      console.log(`Deleting opportunity ${opportunity.id}`);

      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting opportunity:", error);
    }
  };

  const handleTrade = async () => {
    if (!opportunity || !tradingAmount) return;

    try {
      const amount = BigInt(Math.floor(parseFloat(tradingAmount) * 1_000_000));
      await buyTokens(BigInt(opportunity.id), tradingSide === "yes", amount);
      setShowTradingModal(false);
      setTradingAmount("");
    } catch (error) {
      console.error("Error placing trade:", error);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen text-white relative overflow-hidden bg-cover bg-center bg-no-repeat"
        // style={{ backgroundImage: "url('/bg.png')" }}
      >
        <Navbar variant="home" />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  const handleClaimWinnings = async () => {
    if (!opportunity) return;
    try {
      await claimWinningsWrite(BigInt(opportunity.id));
    } catch (e) {
      console.error(e);
    }
  };

  if (!opportunity) {
    return (
      <div
        className="min-h-screen text-white relative overflow-hidden bg-cover bg-center bg-no-repeat"
        // style={{ backgroundImage: "url('/bg.png')" }}
      >
        <Navbar variant="home" />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Opportunity not found
            </h3>
            <p className="text-gray-400 mb-6">
              The opportunity you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden bg-cover bg-center bg-no-repeat"
      //   style={{ backgroundImage: "url('/bg.png')" }}
    >
      {/* Navbar */}
      <Navbar variant="home" />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Header */}
        <div className="bg-gray-900/50 border border-orange-500/20 rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    opportunity.status
                  )}`}
                >
                  {opportunity.status}
                </span>
                <span className="text-gray-400 text-sm">
                  {opportunity.category}
                </span>
                {opportunity.isCreator && (
                  <span className="text-orange-400 text-sm font-medium">
                    CREATOR
                  </span>
                )}
                {getOutcomeIcon(opportunity.outcome)}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {opportunity.title}
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                {opportunity.description}
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-6 lg:mt-0">
              <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              {opportunity.isCreator && (
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      router.push(`/edit-opportunity/${opportunity.id}`)
                    }
                    className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDeleteOpportunity}
                    className="p-3 bg-red-900/50 hover:bg-red-800/50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Creator Info */}
          <div className="flex items-center space-x-3 mb-6">
            <img
              src={opportunity.creator.avatar}
              alt={opportunity.creator.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-white font-medium">
                {opportunity.creator.name}
              </p>
              <p className="text-gray-400 text-sm">
                {opportunity.creator.address}
              </p>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Current Liquidity</p>
              <p className="text-2xl font-bold text-white">
                {opportunity.currentLiquidity.toFixed(2)} ETH
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Volume</p>
              <p className="text-2xl font-bold text-white">
                {opportunity.totalVolume.toFixed(1)} ETH
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Participants</p>
              <p className="text-2xl font-bold text-white">
                {opportunity.participants}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Resolution Date</p>
              <p className="text-lg font-semibold text-white">
                {new Date(opportunity.resolutionDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            {opportunity.images.length > 0 && (
              <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {opportunity.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Opportunity image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Resolution Criteria */}
            <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2 text-orange-500" />
                Resolution Criteria
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {opportunity.resolutionCriteria}
              </p>
            </div>

            {/* Recent Positions */}
            <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-orange-500" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {positions.map((position) => (
                  <div
                    key={position.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          position.side === "yes"
                            ? "bg-green-400"
                            : "bg-red-400"
                        }`}
                      ></div>
                      <div>
                        <p className="text-white font-medium">
                          {position.side.toUpperCase()} - {position.amount} ETH
                        </p>
                        <p className="text-gray-400 text-sm">
                          {position.user} •{" "}
                          {new Date(position.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">
                        {(position.price * 100).toFixed(1)}%
                      </p>
                      <p className="text-gray-400 text-sm">Price</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trading Panel */}
            {opportunity.status === "active" && (
              <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Trade</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount (ETH)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={tradingAmount}
                      onChange={(e) => setTradingAmount(e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                      placeholder="0.1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTradingSide("yes")}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        tradingSide === "yes"
                          ? "border-green-500 bg-green-500/20 text-green-400"
                          : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-green-500/50"
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-semibold">YES</p>
                        <p className="text-sm">
                          {(opportunity.yesPrice * 100).toFixed(1)}%
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => setTradingSide("no")}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        tradingSide === "no"
                          ? "border-red-500 bg-red-500/20 text-red-400"
                          : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-red-500/50"
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-semibold">NO</p>
                        <p className="text-sm">
                          {(opportunity.noPrice * 100).toFixed(1)}%
                        </p>
                      </div>
                    </button>
                  </div>

                  <button
                    onClick={() => setShowTradingModal(true)}
                    disabled={!tradingAmount}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Place Trade
                  </button>
                </div>
              </div>
            )}

            {/* Creator Actions */}
            {opportunity.isCreator && opportunity.status === "active" && (
              <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Creator Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleOutcomeSelection("yes")}
                    className="w-full flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Set YES Outcome
                  </button>
                  <button
                    onClick={() => handleOutcomeSelection("no")}
                    className="w-full flex items-center justify-center p-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Set NO Outcome
                  </button>
                </div>
              </div>
            )}

            {/* Claim Winnings when resolved */}
            {opportunity.status === "resolved" && (
              <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Claim Winnings
                </h3>
                <p className="text-gray-300 mb-3">
                  If you hold winning side tokens for this opportunity, you can
                  claim now.
                </p>
                <button
                  onClick={handleClaimWinnings}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Claim
                </button>
              </div>
            )}

            {/* Price Chart Placeholder */}
            <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-orange-500" />
                Price Chart
              </h3>
              <div className="h-48 bg-gray-800/50 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Chart coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outcome Selection Modal */}
      {showOutcomeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-orange-500/20 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">
              Confirm Outcome
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to set the outcome to{" "}
              <span
                className={`font-semibold ${
                  selectedOutcome === "yes" ? "text-green-400" : "text-red-400"
                }`}
              >
                {selectedOutcome?.toUpperCase()}
              </span>
              ?
            </p>
            <p className="text-sm text-gray-400 mb-6">
              This action cannot be undone. All participants will be notified
              and rewards will be distributed.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowOutcomeModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmOutcomeSelection}
                className={`flex-1 font-semibold px-6 py-3 rounded-lg transition-colors ${
                  selectedOutcome === "yes"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                Confirm {selectedOutcome?.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trading Modal */}
      {showTradingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-orange-500/20 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">
              Confirm Trade
            </h3>
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">{tradingAmount} ETH</span> on{" "}
                <span
                  className={`font-semibold ${
                    tradingSide === "yes" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {tradingSide.toUpperCase()}
                </span>
              </p>
              <p className="text-sm text-gray-400">
                Price:{" "}
                {tradingSide === "yes"
                  ? (opportunity.yesPrice * 100).toFixed(1)
                  : (opportunity.noPrice * 100).toFixed(1)}
                %
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowTradingModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTrade}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Confirm Trade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
