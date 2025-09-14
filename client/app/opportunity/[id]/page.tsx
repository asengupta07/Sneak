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
  useResolveOpportunity as useResolveOpportunityWrite,
  useClaimWinnings,
} from "../../hooks/useSneakProtocolWrites";
import useBuyTokens from "@/hooks/buyTokens";
import { useAccount } from "wagmi";

interface Opportunity {
  id: string;
  name: string;
  metadataUrl: string;
  liquidityYes: number;
  liquidityNo: number;
  priceYes: number;
  priceNo: number;
  creator: string;
  resolved: boolean;
  outcome: boolean;
  totalYesTokens: number;
  totalNoTokens: number;
  creationTime: number;
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
  const { createPositionChain } = useBuyTokens();
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
  const [ipfsMetadata, setIpfsMetadata] = useState<any>(null);
  const [metadataLoading, setMetadataLoading] = useState(false);

  // Load opportunity from contract
  // Map onchain data into UI-friendly shape
  const parsedOpportunity: Opportunity | null = useMemo(() => {
    if (!onchainOpportunity) return null;
    try {
      const o: any = onchainOpportunity as any;
      
      // Console log all raw values for debugging
      console.log("Raw onchain opportunity data:", o);
      console.log("Raw liquidityYes (Wei):", o.liquidityYes);
      console.log("Raw liquidityNo (Wei):", o.liquidityNo);
      console.log("Raw priceYes (Wei):", o.priceYes);
      console.log("Raw priceNo (Wei):", o.priceNo);
      console.log("Raw totalYesTokens (Wei):", o.totalYesTokens);
      console.log("Raw totalNoTokens (Wei):", o.totalNoTokens);
      console.log("Raw creationTime (seconds):", o.creationTime);
      
      // Convert from Wei to proper units
      // Liquidity values are in 18 decimals (like ETH/Wei)
      const liquidityYes = Number(o.liquidityYes ?? BigInt(0)) / 1e18;
      const liquidityNo = Number(o.liquidityNo ?? BigInt(0)) / 1e18;
      
      // Token amounts are in 6 decimals (USDC)
      const totalYesTokens = Number(o.totalYesTokens ?? BigInt(0)) / 1e6;
      const totalNoTokens = Number(o.totalNoTokens ?? BigInt(0)) / 1e6;
      
      // Price values are in 18 decimals, convert to decimal (0-1 range)
      const yesPrice = Number(o.priceYes ?? BigInt(0)) / 1e18;
      const noPrice = Number(o.priceNo ?? BigInt(0)) / 1e18;
      
      const creator = String(o.creator);
      const resolved = Boolean(o.resolved);
      const outcomeBool = Boolean(o.outcome);
      const creationTime = Number(o.creationTime ?? BigInt(0)) * 1000; // Convert seconds to milliseconds
      
      // Console log converted values
      console.log("Converted liquidityYes (ETH):", liquidityYes);
      console.log("Converted liquidityNo (ETH):", liquidityNo);
      console.log("Converted totalYesTokens (USDC):", totalYesTokens);
      console.log("Converted totalNoTokens (USDC):", totalNoTokens);
      console.log("Converted yesPrice (decimal):", yesPrice);
      console.log("Converted noPrice (decimal):", noPrice);
      console.log("Converted creationTime (ms):", creationTime);
      
      return {
        id: String(o.id ?? opportunityId),
        name: String(o.name ?? "Opportunity"),
        metadataUrl: String(o.metadataUrl ?? ""),
        liquidityYes,
        liquidityNo,
        priceYes: yesPrice,
        priceNo: noPrice,
        creator,
        resolved,
        outcome: outcomeBool,
        totalYesTokens,
        totalNoTokens,
        creationTime,
      };
    } catch (e) {
      console.error("Error parsing opportunity data:", e);
      return null;
    }
  }, [onchainOpportunity, address, opportunityId]);

  useMemo(() => {
    setOpportunity(parsedOpportunity);
    setLoading(Boolean(isLoadingOpportunity));
  }, [parsedOpportunity, isLoadingOpportunity]);

  // Fetch IPFS metadata
  const fetchIpfsMetadata = async (metadataUrl: string) => {
    if (!metadataUrl || metadataUrl === "") return;
    
    setMetadataLoading(true);
    try {
      console.log("Fetching IPFS metadata from:", metadataUrl);
      const response = await fetch(metadataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.status}`);
      }
      const data = await response.json();
      console.log("IPFS metadata fetched:", data);
      setIpfsMetadata(data);
    } catch (error) {
      console.error("Error fetching IPFS metadata:", error);
      setIpfsMetadata(null);
    } finally {
      setMetadataLoading(false);
    }
  };

  // Fetch metadata when opportunity changes
  useMemo(() => {
    if (parsedOpportunity?.metadataUrl) {
      fetchIpfsMetadata(parsedOpportunity.metadataUrl);
    }
  }, [parsedOpportunity?.metadataUrl]);

  const getStatusColor = (resolved: boolean) => {
    if (resolved) {
      return "text-blue-400 bg-blue-400/20";
    }
    return "text-green-400 bg-green-400/20";
  };

  const getOutcomeIcon = (resolved: boolean, outcome: boolean) => {
    if (!resolved) {
      return <Clock className="w-6 h-6 text-gray-400" />;
    }
    return outcome ? 
      <CheckCircle className="w-6 h-6 text-green-400" /> : 
      <XCircle className="w-6 h-6 text-red-400" />;
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

    console.log("=== Starting Trade ===");
    console.log("Current trading side state:", tradingSide);
    console.log("Current trading amount state:", tradingAmount);

    try {
      // Convert USDC amount to Wei (6 decimals for USDC)
        const amount = BigInt(Math.floor(parseFloat(tradingAmount) * 1e18));
      console.log("Trading amount in USDC:", tradingAmount);
      console.log("Trading amount in Wei:", amount.toString());
      console.log("Trading side (string):", tradingSide);
      console.log("Trading side (boolean):", tradingSide === "yes");
      console.log("Trading side (boolean) type:", typeof (tradingSide === "yes"));
      console.log("Opportunity ID:", opportunity.id);
      
      const sideBoolean = tradingSide === "yes";
      console.log("Side boolean value:", sideBoolean, "Type:", typeof sideBoolean);
      
      await createPositionChain(Number(opportunity.id), sideBoolean, amount);
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
                    opportunity.resolved
                  )}`}
                >
                  {opportunity.resolved ? "resolved" : "active"}
                </span>
                <span className="text-gray-400 text-sm">
                  Onchain
                </span>
                {address && opportunity.creator?.toLowerCase() === address.toLowerCase() && (
                  <span className="text-orange-400 text-sm font-medium">
                    CREATOR
                  </span>
                )}
                {getOutcomeIcon(opportunity.resolved, opportunity.outcome)}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {ipfsMetadata?.title || opportunity.name}
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                {ipfsMetadata?.description || opportunity.metadataUrl}
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-6 lg:mt-0">
              <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              {address && opportunity.creator?.toLowerCase() === address.toLowerCase() && (
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
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {opportunity.creator?.slice(0, 2).toUpperCase() || "??"}
              </span>
            </div>
            <div>
              <p className="text-white font-medium">
                {opportunity.creator?.slice(0, 6)}...{opportunity.creator?.slice(-4)}
              </p>
              <p className="text-gray-400 text-sm">
                {opportunity.creator}
              </p>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Yes Liquidity</p>
              <p className="text-2xl font-bold text-white">
                {opportunity.liquidityYes.toFixed(4)} ETH
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">No Liquidity</p>
              <p className="text-2xl font-bold text-white">
                {opportunity.liquidityNo.toFixed(4)} ETH
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Liquidity</p>
              <p className="text-2xl font-bold text-white">
                {(opportunity.liquidityYes + opportunity.liquidityNo).toFixed(4)} ETH
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Created</p>
              <p className="text-lg font-semibold text-white">
                {new Date(opportunity.creationTime).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Banner Section - Full Width */}
        {ipfsMetadata?.banners?.length > 0 && (
          <div className="mb-8">
            {metadataLoading ? (
              <div className="flex items-center justify-center py-16 bg-gray-900/50 border border-orange-500/20 rounded-2xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-3 text-gray-300">Loading banner...</span>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl">
                {ipfsMetadata.banners.map((banner: string, index: number) => (
                  <img
                    key={index}
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-64 md:h-80 lg:h-96 object-cover"
                    onError={(e) => {
                      console.error("Error loading banner:", banner);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ))}
                {/* Optional overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images Gallery */}
            {ipfsMetadata?.images?.length > 0 && (
              <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-orange-500" />
                  Images
                </h3>
                
                {metadataLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <span className="ml-3 text-gray-300">Loading images...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ipfsMetadata.images.map((image: string, index: number) => (
                      <div key={index} className="group relative overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`Image ${index + 1}`}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            console.error("Error loading image:", image);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Resolution Criteria from IPFS */}
            {ipfsMetadata?.resolutionCriteria && (
              <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-orange-500" />
                  Resolution Criteria
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {ipfsMetadata.resolutionCriteria}
                </p>
              </div>
            )}

            {/* Fallback: Show raw metadata URL if no IPFS data */}
            {!metadataLoading && !ipfsMetadata && opportunity.metadataUrl && (
              <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Info className="w-6 h-6 mr-2 text-orange-500" />
                  Metadata
                </h3>
                <p className="text-gray-300 mb-2">Raw metadata URL:</p>
                <a 
                  href={opportunity.metadataUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 break-all"
                >
                  {opportunity.metadataUrl}
                </a>
              </div>
            )}

            {/* Token Information */}
            <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2 text-orange-500" />
                Token Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Total Yes Tokens</p>
                  <p className="text-xl font-bold text-white">
                    {opportunity.totalYesTokens.toFixed(2)} USDC
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total No Tokens</p>
                  <p className="text-xl font-bold text-white">
                    {opportunity.totalNoTokens.toFixed(2)} USDC
                  </p>
                </div>
              </div>
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
                          {position.side.toUpperCase()} - {(position.amount / 1e18).toFixed(2)} ETH
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
            {!opportunity.resolved && (
              <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Trade</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount (USDC)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={tradingAmount}
                      onChange={(e) => setTradingAmount(e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                      placeholder="10.00"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        console.log("Setting trading side to YES");
                        setTradingSide("yes");
                      }}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        tradingSide === "yes"
                          ? "border-green-500 bg-green-500/20 text-green-400"
                          : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-green-500/50"
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-semibold">YES</p>
                        <p className="text-sm">
                          {(opportunity.priceYes * 100).toFixed(1)}%
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        console.log("Setting trading side to NO");
                        setTradingSide("no");
                      }}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        tradingSide === "no"
                          ? "border-red-500 bg-red-500/20 text-red-400"
                          : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-red-500/50"
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-semibold">NO</p>
                        <p className="text-sm">
                          {(opportunity.priceNo * 100).toFixed(1)}%
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
            {address && opportunity.creator?.toLowerCase() === address.toLowerCase() && !opportunity.resolved && (
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
            {opportunity.resolved && (
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
                <span className="font-semibold">{tradingAmount} USDC</span> on{" "}
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
                  ? (opportunity.priceYes * 100).toFixed(1)
                  : (opportunity.priceNo * 100).toFixed(1)}
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
