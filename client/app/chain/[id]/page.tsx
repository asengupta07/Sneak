"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import {
  useGetPositionChain,
  useGetChainRiskAnalysis,
  useGetChainHealthData,
} from "../../hooks/useSneakProtocolReads";
import {
  ArrowLeft,
  Activity,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export default function ChainDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chainIdParam = params.id as string;
  const chainId = useMemo(() => {
    try {
      return BigInt(chainIdParam);
    } catch {
      return undefined;
    }
  }, [chainIdParam]);

  const { data: chainData } = useGetPositionChain(chainId);
  const { data: riskData } = useGetChainRiskAnalysis(chainId);
  const { data: healthData } = useGetChainHealthData(chainId);

  const chain = (chainData as any)?.result;
  const risk = (riskData as any)?.result as any[] | undefined;
  const health = (healthData as any)?.result;

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-cover bg-center bg-no-repeat">
      <Navbar variant="home" />
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>

        <div className="bg-gray-900/50 border border-orange-500/20 rounded-2xl p-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Chain #{String(chainId)}
          </h1>
          <p className="text-gray-400">Owner: {String(chain?.owner || "-")}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Positions</p>
              <p className="text-2xl font-bold text-white">
                {Array.isArray(chain?.positions) ? chain.positions.length : 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Debt</p>
              <p className="text-2xl font-bold text-white">
                {String(chain?.totalDebt ?? 0n)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Health Factor</p>
              <p className="text-2xl font-bold text-white">
                {String(health?.healthFactor ?? 0n)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Liquidation Risk</p>
              <p
                className={`text-2xl font-bold ${
                  health?.isLiquidationRisk ? "text-red-400" : "text-green-400"
                }`}
              >
                {health?.isLiquidationRisk ? "At Risk" : "Healthy"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Positions */}
          <div className="lg:col-span-2 bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 text-orange-500 mr-2" />
              Positions
            </h3>
            <div className="space-y-3">
              {Array.isArray(chain?.positions) && chain.positions.length > 0 ? (
                chain.positions.map((p: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-800/50 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="text-white font-semibold">
                        Opp #{String(p.opportunityId)} • {p.side ? "YES" : "NO"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Amount: {Number(p.amount ?? 0n) / 1_000_000} • Tokens:{" "}
                        {Number(p.tokens ?? 0n) / 1_000_000}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-sm">Current Value</p>
                      <p className="text-white font-semibold">
                        {Number(p.currentValue ?? 0n) / 1_000_000}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No positions.</p>
              )}
            </div>
          </div>

          {/* Risk Analysis */}
          <div className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <ShieldAlert className="w-5 h-5 text-orange-500 mr-2" />
              Risk Analysis
            </h3>
            <div className="space-y-3">
              {Array.isArray(risk) && risk.length > 0 ? (
                risk.map((r: any, idx: number) => (
                  <div key={idx} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white font-semibold">
                        Position {String(r.positionIndex)}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          r.isLiquidationTrigger
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {r.isLiquidationTrigger ? "Trigger" : "OK"}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Opp #{String(r.opportunityId)} • {r.side ? "YES" : "NO"}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-300">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-400 mr-1" />{" "}
                        Curr: {Number(r.currentValue ?? 0n) / 1_000_000}
                      </div>
                      <div className="flex items-center">
                        <TrendingDown className="w-4 h-4 text-red-400 mr-1" />{" "}
                        PnL: {Number(r.pnl ?? 0n) / 1_000_000}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No risk data.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
