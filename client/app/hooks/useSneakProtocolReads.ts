"use client"

import { useMemo } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import  abi  from '../abi'

// TODO: Replace with your deployed address or inject via env
export const SNEAK_PROTOCOL_ADDRESS = process.env.NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}` | undefined

function useAddressGuard() {
    if (!SNEAK_PROTOCOL_ADDRESS) {
        // Intentionally throw to surface misconfiguration in dev
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS')
        }
    }
    return SNEAK_PROTOCOL_ADDRESS as `0x${string}`
}

type BigNumberish = bigint | number | string

export function useBASIS_POINTS() {
    const address = useAddressGuard()
    return useReadContract({ address, abi, functionName: 'BASIS_POINTS' })
}

export function useFIXED_FEE() {
    const address = useAddressGuard()
    return useReadContract({ address, abi, functionName: 'FIXED_FEE' })
}

export function useHYSTERESIS() {
    const address = useAddressGuard()
    return useReadContract({ address, abi, functionName: 'HYSTERESIS' })
}

export function useINITIAL_PRICE() {
    const address = useAddressGuard()
    return useReadContract({ address, abi, functionName: 'INITIAL_PRICE' })
}

export function useINTEREST_RATE() {
    const address = useAddressGuard()
    return useReadContract({ address, abi, functionName: 'INTEREST_RATE' })
}

export function useLIQUIDATION_PENALTY() {
    const address = useAddressGuard()
    return useReadContract({ address, abi, functionName: 'LIQUIDATION_PENALTY' })
}

export function useLP_REWARD_RATE() {
    const address = useAddressGuard()
    return useReadContract({ address, abi, functionName: 'LP_REWARD_RATE' })
}

export function useLTV() {
    const address = useAddressGuard()
    return useReadContract({ address, abi, functionName: 'LTV' })
}

export function usePROTOCOL_FEE_RATE() {
    const address = useAddressGuard()
    return useReadContract({ address, abi, functionName: 'PROTOCOL_FEE_RATE' })
}

export function useBaseToken() {
    const address = useAddressGuard()
    return useReadContract({ address, abi, functionName: 'baseToken' })
}

export function useNextChainId() {
    const address = useAddressGuard()
    return useReadContract({ address, abi, functionName: 'nextChainId' })
}

export function useNextOpportunityId() {
    const address = useAddressGuard()
    return useReadContract({ address, abi, functionName: 'nextOpportunityId' })
}

export function useOwner() {
    const address = useAddressGuard()
    return useReadContract({ address, abi, functionName: 'owner' })
}

export function useGetUserChains(user?: `0x${string}`) {
    const address = useAddressGuard()
    const enabled = Boolean(user)
    return useReadContract({ address, abi, functionName: 'getUserChains', args: [user!], query: { enabled } })
}

export function useGetUserTokens(opportunityId?: BigNumberish, side?: boolean, user?: `0x${string}`) {
    const address = useAddressGuard()
    const enabled = useMemo(() => opportunityId !== undefined && side !== undefined && !!user, [opportunityId, side, user])
    return useReadContract({ address, abi, functionName: 'getUserTokens', args: [opportunityId as any, side as any, user as any], query: { enabled } })
}

export function useGetOpportunity(opportunityId?: BigNumberish) {
    const address = useAddressGuard()
    const enabled = opportunityId !== undefined
    return useReadContract({ address, abi, functionName: 'getOpportunity', args: [opportunityId as any], query: { enabled } })
}

export function useGetOpportunityRiskData(opportunityId?: BigNumberish) {
    const address = useAddressGuard()
    const enabled = opportunityId !== undefined
    return useReadContract({ address, abi, functionName: 'getOpportunityRiskData', args: [opportunityId as any], query: { enabled } })
}

export function useGetChainsAtRisk() {
    const address = useAddressGuard()
    return useReadContract({ address, abi, functionName: 'getChainsAtRisk' })
}

export function useGetChainHealthData(chainId?: BigNumberish) {
    const address = useAddressGuard()
    const enabled = chainId !== undefined
    return useReadContract({ address, abi, functionName: 'getChainHealthData', args: [chainId as any], query: { enabled } })
}

export function useGetChainRiskAnalysis(chainId?: BigNumberish) {
    const address = useAddressGuard()
    const enabled = chainId !== undefined
    return useReadContract({ address, abi, functionName: 'getChainRiskAnalysis', args: [chainId as any], query: { enabled } })
}

export function useGetLiquidationPreview(chainId?: BigNumberish) {
    const address = useAddressGuard()
    const enabled = chainId !== undefined
    return useReadContract({ address, abi, functionName: 'getLiquidationPreview', args: [chainId as any], query: { enabled } })
}

export function useGetPositionChain(chainId?: BigNumberish) {
    const address = useAddressGuard()
    const enabled = chainId !== undefined
    return useReadContract({ address, abi, functionName: 'getPositionChain', args: [chainId as any], query: { enabled } })
}

export function useOpportunities(opportunityId?: BigNumberish) {
    const address = useAddressGuard()
    const enabled = opportunityId !== undefined
    return useReadContract({ address, abi, functionName: 'opportunities', args: [opportunityId as any], query: { enabled } })
}

export function usePositionChains(chainId?: BigNumberish) {
    const address = useAddressGuard()
    const enabled = chainId !== undefined
    return useReadContract({ address, abi, functionName: 'positionChains', args: [chainId as any], query: { enabled } })
}

export function useProtocolFees(token?: `0x${string}`) {
    const address = useAddressGuard()
    const enabled = Boolean(token)
    return useReadContract({ address, abi, functionName: 'protocolFees', args: [token as any], query: { enabled } })
}

export function useUserChains(user?: `0x${string}`, index?: BigNumberish) {
    const address = useAddressGuard()
    const enabled = Boolean(user !== undefined && index !== undefined)
    return useReadContract({ address, abi, functionName: 'userChains', args: [user as any, index as any], query: { enabled } })
}

export function useUserTokens(opportunityId?: BigNumberish, side?: boolean, user?: `0x${string}`) {
    const address = useAddressGuard()
    const enabled = useMemo(() => opportunityId !== undefined && side !== undefined && !!user, [opportunityId, side, user])
    return useReadContract({ address, abi, functionName: 'userTokens', args: [opportunityId as any, side as any, user as any], query: { enabled } })
}


