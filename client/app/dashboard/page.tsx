"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import {
    useGetChainsAtRisk,
    useGetChainHealthData,
    useGetLiquidationPreview,
} from "../hooks/useSneakProtocolReads";
import {
    useExtendChain,
    useLiquidateChain,
} from "../hooks/useSneakProtocolWrites";
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    Users,
    TrendingUp,
    Calendar,
    MoreVertical,
    AlertCircle,
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
    yesPrice: number;
    noPrice: number;
    totalVolume: number;
    participants: number;
    images: string[];
    banners: string[];
    isCreator: boolean;
    createdAt: string;
    resolvedAt?: string;
}

export default function OpportunitiesDashboard() {
    const router = useRouter();
    const { data: chainsAtRisk } = useGetChainsAtRisk();
    const extendChain = useExtendChain();
    const liquidateChain = useLiquidateChain();
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [filteredOpportunities, setFilteredOpportunities] = useState<
        Opportunity[]
    >([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [selectedOpportunity, setSelectedOpportunity] =
        useState<Opportunity | null>(null);
    const [showOutcomeModal, setShowOutcomeModal] = useState(false);
    const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no" | null>(
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
                initialLiquidity: 10,
                currentLiquidity: 25.5,
                yesPrice: 0.65,
                noPrice: 0.35,
                totalVolume: 150.2,
                participants: 45,
                images: ["/api/placeholder/300/200"],
                banners: ["/api/placeholder/600/200"],
                isCreator: true,
                createdAt: "2024-01-15T10:30:00Z",
            },
            {
                id: "2",
                title: "Will OpenAI release GPT-5 in 2024?",
                description:
                    "Speculation on whether OpenAI will publicly release GPT-5 before the end of 2024.",
                category: "Technology",
                status: "resolved",
                outcome: "yes",
                resolutionDate: "2024-06-30T23:59:59Z",
                initialLiquidity: 5,
                currentLiquidity: 0,
                yesPrice: 1.0,
                noPrice: 0.0,
                totalVolume: 89.7,
                participants: 32,
                images: ["/api/placeholder/300/200"],
                banners: ["/api/placeholder/600/200"],
                isCreator: false,
                createdAt: "2024-01-10T14:20:00Z",
                resolvedAt: "2024-06-15T16:45:00Z",
            },
            {
                id: "3",
                title: "Will the US have a recession in 2024?",
                description:
                    "Economic speculation on whether the US will enter a technical recession in 2024.",
                category: "Finance",
                status: "active",
                resolutionDate: "2024-12-31T23:59:59Z",
                initialLiquidity: 15,
                currentLiquidity: 42.3,
                yesPrice: 0.42,
                noPrice: 0.58,
                totalVolume: 203.8,
                participants: 78,
                images: ["/api/placeholder/300/200"],
                banners: ["/api/placeholder/600/200"],
                isCreator: true,
                createdAt: "2024-02-01T09:15:00Z",
            },
        ];
        setOpportunities(mockOpportunities);
        setFilteredOpportunities(mockOpportunities);
    }, []);

    // Filter and search logic
    useEffect(() => {
        let filtered = opportunities;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (opp) =>
                    opp.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    opp.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    opp.category
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((opp) => opp.status === statusFilter);
        }

        // Category filter
        if (categoryFilter !== "all") {
            filtered = filtered.filter(
                (opp) => opp.category === categoryFilter
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case "title":
                    aValue = a.title;
                    bValue = b.title;
                    break;
                case "createdAt":
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
                    break;
                case "resolutionDate":
                    aValue = new Date(a.resolutionDate).getTime();
                    bValue = new Date(b.resolutionDate).getTime();
                    break;
                case "liquidity":
                    aValue = a.currentLiquidity;
                    bValue = b.currentLiquidity;
                    break;
                case "volume":
                    aValue = a.totalVolume;
                    bValue = b.totalVolume;
                    break;
                default:
                    aValue = a.createdAt;
                    bValue = b.createdAt;
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

    const getOutcomeIcon = (outcome: string | null) => {
        switch (outcome) {
            case "yes":
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case "no":
                return <XCircle className="w-5 h-5 text-red-400" />;
            default:
                return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    const handleOutcomeSelection = (
        opportunity: Opportunity,
        outcome: "yes" | "no"
    ) => {
        setSelectedOpportunity(opportunity);
        setSelectedOutcome(outcome);
        setShowOutcomeModal(true);
    };

    const confirmOutcomeSelection = async () => {
        if (!selectedOpportunity || !selectedOutcome) return;

        try {
            // TODO: Implement actual API call to set outcome
            console.log(
                `Setting outcome for ${selectedOpportunity.id} to ${selectedOutcome}`
            );

            // Update local state
            setOpportunities((prev) =>
                prev.map((opp) =>
                    opp.id === selectedOpportunity.id
                        ? {
                              ...opp,
                              outcome: selectedOutcome,
                              status: "resolved" as const,
                              resolvedAt: new Date().toISOString(),
                          }
                        : opp
                )
            );

            setShowOutcomeModal(false);
            setSelectedOpportunity(null);
            setSelectedOutcome(null);
        } catch (error) {
            console.error("Error setting outcome:", error);
        }
    };

    const handleDeleteOpportunity = async (id: string) => {
        if (!confirm("Are you sure you want to delete this opportunity?"))
            return;

        try {
            // TODO: Implement actual API call to delete opportunity
            console.log(`Deleting opportunity ${id}`);

            setOpportunities((prev) => prev.filter((opp) => opp.id !== id));
        } catch (error) {
            console.error("Error deleting opportunity:", error);
        }
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
        <div
            className="min-h-screen text-white relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/bg.png')" }}
        >
            {/* Navbar */}
            <Navbar variant="home" currentPage="/dashboard" />

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-orange-500 mb-2">
                            Opportunities Dashboard
                        </h1>
                        <p className="text-lg text-gray-300">
                            Manage and monitor all opportunities
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/create-opportunity")}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center mt-4 md:mt-0"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Opportunity
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">
                                    Total Opportunities
                                </p>
                                <p className="text-2xl font-bold text-white">
                                    {opportunities.length}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>

                    <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Active</p>
                                <p className="text-2xl font-bold text-green-400">
                                    {
                                        opportunities.filter(
                                            (opp) => opp.status === "active"
                                        ).length
                                    }
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-green-400" />
                        </div>
                    </div>

                    <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">
                                    Total Volume
                                </p>
                                <p className="text-2xl font-bold text-white">
                                    {opportunities
                                        .reduce(
                                            (sum, opp) => sum + opp.totalVolume,
                                            0
                                        )
                                        .toFixed(1)}{" "}
                                    ETH
                                </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>

                    <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">
                                    Total Participants
                                </p>
                                <p className="text-2xl font-bold text-white">
                                    {opportunities.reduce(
                                        (sum, opp) => sum + opp.participants,
                                        0
                                    )}
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Chains At Risk */}
                <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">
                            Chains At Risk
                        </h3>
                    </div>
                    {Array.isArray(chainsAtRisk?.result) &&
                        chainsAtRisk.result.length === 0 && (
                            <p className="text-gray-400">No chains at risk.</p>
                        )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.isArray(chainsAtRisk?.result) &&
                            chainsAtRisk.result.map((cid: any, idx: number) => (
                                <ChainCard
                                    key={idx}
                                    chainId={cid as any}
                                    onExtend={extendChain}
                                    onLiquidate={liquidateChain}
                                />
                            ))}
                    </div>
                </div>

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
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                            >
                                {statuses.map((status) => (
                                    <option
                                        key={status}
                                        value={status}
                                        className="capitalize"
                                    >
                                        {status === "all"
                                            ? "All Status"
                                            : status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={categoryFilter}
                                onChange={(e) =>
                                    setCategoryFilter(e.target.value)
                                }
                                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category === "all"
                                            ? "All Categories"
                                            : category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [field, order] =
                                        e.target.value.split("-");
                                    setSortBy(field);
                                    setSortOrder(order as "asc" | "desc");
                                }}
                                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                            >
                                <option value="createdAt-desc">
                                    Newest First
                                </option>
                                <option value="createdAt-asc">
                                    Oldest First
                                </option>
                                <option value="title-asc">Title A-Z</option>
                                <option value="title-desc">Title Z-A</option>
                                <option value="liquidity-desc">
                                    Highest Liquidity
                                </option>
                                <option value="volume-desc">
                                    Highest Volume
                                </option>
                                <option value="resolutionDate-asc">
                                    Resolution Date
                                </option>
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
                                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                                        {opportunity.title}
                                    </h3>
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
                                        {opportunity.isCreator && (
                                            <span className="text-orange-400 text-xs font-medium">
                                                CREATOR
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                    {/* {getOutcomeIcon(opportunity.outcome)} */}
                                    <button className="p-1 hover:bg-gray-700 rounded">
                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                {opportunity.description}
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-gray-400 text-xs">
                                        Liquidity
                                    </p>
                                    <p className="text-white font-semibold">
                                        {opportunity.currentLiquidity.toFixed(
                                            2
                                        )}{" "}
                                        ETH
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs">
                                        Volume
                                    </p>
                                    <p className="text-white font-semibold">
                                        {opportunity.totalVolume.toFixed(1)} ETH
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs">
                                        Participants
                                    </p>
                                    <p className="text-white font-semibold">
                                        {opportunity.participants}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs">
                                        YES Price
                                    </p>
                                    <p className="text-white font-semibold">
                                        {(opportunity.yesPrice * 100).toFixed(
                                            1
                                        )}
                                        %
                                    </p>
                                </div>
                            </div>

                            {/* Resolution Date */}
                            <div className="flex items-center text-gray-400 text-sm mb-4">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(
                                    opportunity.resolutionDate
                                ).toLocaleDateString()}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() =>
                                            router.push(
                                                `/opportunity/${opportunity.id}`
                                            )
                                        }
                                        className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View
                                    </button>

                                    {opportunity.isCreator &&
                                        opportunity.status === "active" && (
                                            <button
                                                onClick={() =>
                                                    handleOutcomeSelection(
                                                        opportunity,
                                                        "yes"
                                                    )
                                                }
                                                className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                YES
                                            </button>
                                        )}

                                    {opportunity.isCreator &&
                                        opportunity.status === "active" && (
                                            <button
                                                onClick={() =>
                                                    handleOutcomeSelection(
                                                        opportunity,
                                                        "no"
                                                    )
                                                }
                                                className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                                            >
                                                <XCircle className="w-4 h-4 mr-1" />
                                                NO
                                            </button>
                                        )}
                                </div>

                                {opportunity.isCreator && (
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/edit-opportunity/${opportunity.id}`
                                                )
                                            }
                                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4 text-gray-400" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteOpportunity(
                                                    opportunity.id
                                                )
                                            }
                                            className="p-2 hover:bg-red-900/50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredOpportunities.length === 0 && (
                    <div className="text-center py-12">
                        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                            No opportunities found
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {searchTerm ||
                            statusFilter !== "all" ||
                            categoryFilter !== "all"
                                ? "Try adjusting your filters or search terms"
                                : "Create your first opportunity to get started"}
                        </p>
                        {!searchTerm &&
                            statusFilter === "all" &&
                            categoryFilter === "all" && (
                                <button
                                    onClick={() =>
                                        router.push("/create-opportunity")
                                    }
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                                >
                                    Create Opportunity
                                </button>
                            )}
                    </div>
                )}
            </div>

            {/* Outcome Selection Modal */}
            {showOutcomeModal && selectedOpportunity && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-orange-500/20 rounded-xl p-8 max-w-md w-full mx-4">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Confirm Outcome
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to set the outcome of "
                            {selectedOpportunity.title}" to{" "}
                            <span
                                className={`font-semibold ${
                                    selectedOutcome === "yes"
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`}
                            >
                                {selectedOutcome?.toUpperCase()}
                            </span>
                            ?
                        </p>
                        <p className="text-sm text-gray-400 mb-6">
                            This action cannot be undone. All participants will
                            be notified and rewards will be distributed.
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
        </div>
    );
}

function ChainCard({
    chainId,
    onExtend,
    onLiquidate,
}: {
    chainId: bigint | number | string;
    onExtend: (
        chainId: bigint,
        opportunityId: bigint,
        side: boolean
    ) => Promise<any>;
    onLiquidate: (chainId: bigint) => Promise<any>;
}) {
    const { data: health } = useGetChainHealthData(chainId as any);
    const { data: preview } = useGetLiquidationPreview(chainId as any);
    const [opportunityId, setOpportunityId] = useState<string>("");
    const [side, setSide] = useState<"yes" | "no">("yes");
    const [isBusy, setIsBusy] = useState(false);

    const handleExtend = async () => {
        if (!opportunityId) return;
        setIsBusy(true);
        try {
            await onExtend(
                BigInt(chainId as any),
                BigInt(opportunityId),
                side === "yes"
            );
            setOpportunityId("");
        } finally {
            setIsBusy(false);
        }
    };

    const handleLiquidate = async () => {
        setIsBusy(true);
        try {
            await onLiquidate(BigInt(chainId as any));
        } finally {
            setIsBusy(false);
        }
    };

    const canLiquidate = Boolean(
        (preview as any)?.result?.canLiquidate ?? false
    );

    return (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-orange-500/10">
            <div className="flex items-center justify-between mb-2">
                <p className="text-white font-semibold">
                    Chain #{String(chainId)}
                </p>
                <span
                    className={`text-xs px-2 py-1 rounded ${
                        (health as any)?.result?.isLiquidationRisk
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                    }`}
                >
                    {(health as any)?.result?.isLiquidationRisk
                        ? "At Risk"
                        : "Healthy"}
                </span>
            </div>
            <div className="text-sm text-gray-400 mb-4">
                <p>
                    Total Positions:{" "}
                    {String((health as any)?.result?.totalPositions ?? 0)}
                </p>
                <p>
                    Health Factor:{" "}
                    {String((health as any)?.result?.healthFactor ?? 0)}
                </p>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
                <input
                    type="number"
                    placeholder="Opportunity ID"
                    value={opportunityId}
                    onChange={(e) => setOpportunityId(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                />
                <select
                    value={side}
                    onChange={(e) => setSide(e.target.value as any)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                >
                    <option value="yes">YES</option>
                    <option value="no">NO</option>
                </select>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    disabled={isBusy || !opportunityId}
                    onClick={handleExtend}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded px-3 py-2 text-sm"
                >
                    Extend Chain
                </button>
                <button
                    disabled={isBusy || !canLiquidate}
                    onClick={handleLiquidate}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded px-3 py-2 text-sm"
                >
                    Liquidate
                </button>
            </div>
        </div>
    );
}
