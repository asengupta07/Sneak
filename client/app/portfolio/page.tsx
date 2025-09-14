"use client";

import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useAccount } from "wagmi";
import Link from "next/link";
import {
  useGetUserChains,
  useGetUserTokens,
} from "../hooks/useSneakProtocolReads";
import { Link as LinkIcon, Coins, User, Search } from "lucide-react";

export default function PortfolioPage() {
  const { address } = useAccount();
  const enabled = Boolean(address);
  const { data: userChainsData } = useGetUserChains(address as any);

  const chains: bigint[] = useMemo(() => {
    const res: any = (userChainsData as any)?.result;
    if (!res) return [];
    return res as bigint[];
  }, [userChainsData]);

  const [tokenQueryOppId, setTokenQueryOppId] = useState<string>("");
  const [tokenQuerySide, setTokenQuerySide] = useState<"yes" | "no">("yes");
  const { data: userTokensData } = useGetUserTokens(
    tokenQueryOppId ? BigInt(tokenQueryOppId) : undefined,
    tokenQuerySide === "yes",
    (address as any) || undefined
  );
  const tokenBalance = useMemo(() => {
    const res: any = (userTokensData as any)?.result;
    if (res === undefined || res === null) return undefined;
    try {
      return Number(res) / 1_000_000;
    } catch {
      return undefined;
    }
  }, [userTokensData]);

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-cover bg-center bg-no-repeat">
      <Navbar variant="home" currentPage="/portfolio" />
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-orange-500 mb-2">
              Portfolio
            </h1>
            <p className="text-lg text-gray-300">
              Your chains and token balances
            </p>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <User className="w-5 h-5" />
            <span>
              {address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "Not connected"}
            </span>
          </div>
        </div>

        {/* User Chains */}
        <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <LinkIcon className="w-5 h-5 text-orange-500 mr-2" />
            Your Chains
          </h3>
          {!enabled && (
            <p className="text-gray-400">Connect your wallet to view chains.</p>
          )}
          {enabled && chains.length === 0 && (
            <p className="text-gray-400">No chains found.</p>
          )}
          {enabled && chains.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chains.map((cid, idx) => (
                <Link
                  key={idx}
                  href={`/chain/${String(cid)}`}
                  className="block bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-orange-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">
                        Chain #{String(cid)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        View positions and risk
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Token Balance Quick Check */}
        <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Coins className="w-5 h-5 text-orange-500 mr-2" />
            Check Your Tokens for an Opportunity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input
              type="number"
              placeholder="Opportunity ID"
              value={tokenQueryOppId}
              onChange={(e) => setTokenQueryOppId(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
            />
            <select
              value={tokenQuerySide}
              onChange={(e) => setTokenQuerySide(e.target.value as any)}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
            >
              <option value="yes">YES side</option>
              <option value="no">NO side</option>
            </select>
            <div className="flex items-center">
              <div className="flex items-center text-gray-300">
                <Search className="w-4 h-4 mr-2" />
                <span>Auto-fetching balance...</span>
              </div>
            </div>
          </div>
          {tokenBalance !== undefined && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-300">
                Balance:{" "}
                <span className="text-white font-semibold">
                  {tokenBalance.toFixed(6)}
                </span>{" "}
                tokens
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
