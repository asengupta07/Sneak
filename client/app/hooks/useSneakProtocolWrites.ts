"use client"

import { useCallback } from 'react'
import { useWriteContract } from 'wagmi'
import { abi } from '../abi'
import { SNEAK_PROTOCOL_ADDRESS } from './useSneakProtocolReads'

type BigNumberish = bigint | number | string

export function useCreateOpportunity() {
    const { writeContractAsync } = useWriteContract()
    return useCallback(async (name: string, imageUrl: string, initialLiquidity: BigNumberish) => {
        if (!SNEAK_PROTOCOL_ADDRESS) throw new Error('Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS')
        return writeContractAsync({ address: SNEAK_PROTOCOL_ADDRESS, abi, functionName: 'createOpportunity', args: [name, imageUrl, BigInt(initialLiquidity as any)] })
    }, [writeContractAsync])
}

export function useBuyTokens() {
    const { writeContractAsync } = useWriteContract()
    return useCallback(async (opportunityId: BigNumberish, side: boolean, amount: BigNumberish) => {
        if (!SNEAK_PROTOCOL_ADDRESS) throw new Error('Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS')
        return writeContractAsync({ address: SNEAK_PROTOCOL_ADDRESS, abi, functionName: 'buyTokens', args: [BigInt(opportunityId as any), side, BigInt(amount as any)] })
    }, [writeContractAsync])
}

export function useCreatePositionChain() {
    const { writeContractAsync } = useWriteContract()
    return useCallback(async (opportunityId: BigNumberish, side: boolean, amount: BigNumberish) => {
        if (!SNEAK_PROTOCOL_ADDRESS) throw new Error('Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS')
        return writeContractAsync({ address: SNEAK_PROTOCOL_ADDRESS, abi, functionName: 'createPositionChain', args: [BigInt(opportunityId as any), side, BigInt(amount as any)] })
    }, [writeContractAsync])
}

export function useExtendChain() {
    const { writeContractAsync } = useWriteContract()
    return useCallback(async (chainId: BigNumberish, opportunityId: BigNumberish, side: boolean) => {
        if (!SNEAK_PROTOCOL_ADDRESS) throw new Error('Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS')
        return writeContractAsync({ address: SNEAK_PROTOCOL_ADDRESS, abi, functionName: 'extendChain', args: [BigInt(chainId as any), BigInt(opportunityId as any), side] })
    }, [writeContractAsync])
}

export function useLiquidateChain() {
    const { writeContractAsync } = useWriteContract()
    return useCallback(async (chainId: BigNumberish) => {
        if (!SNEAK_PROTOCOL_ADDRESS) throw new Error('Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS')
        return writeContractAsync({ address: SNEAK_PROTOCOL_ADDRESS, abi, functionName: 'liquidateChain', args: [BigInt(chainId as any)] })
    }, [writeContractAsync])
}

export function useClaimWinnings() {
    const { writeContractAsync } = useWriteContract()
    return useCallback(async (opportunityId: BigNumberish) => {
        if (!SNEAK_PROTOCOL_ADDRESS) throw new Error('Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS')
        return writeContractAsync({ address: SNEAK_PROTOCOL_ADDRESS, abi, functionName: 'claimWinnings', args: [BigInt(opportunityId as any)] })
    }, [writeContractAsync])
}

export function useResolveOpportunity() {
    const { writeContractAsync } = useWriteContract()
    return useCallback(async (opportunityId: BigNumberish, outcome: boolean) => {
        if (!SNEAK_PROTOCOL_ADDRESS) throw new Error('Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS')
        return writeContractAsync({ address: SNEAK_PROTOCOL_ADDRESS, abi, functionName: 'resolveOpportunity', args: [BigInt(opportunityId as any), outcome] })
    }, [writeContractAsync])
}

export function useTransferOwnership() {
    const { writeContractAsync } = useWriteContract()
    return useCallback(async (newOwner: `0x${string}`) => {
        if (!SNEAK_PROTOCOL_ADDRESS) throw new Error('Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS')
        return writeContractAsync({ address: SNEAK_PROTOCOL_ADDRESS, abi, functionName: 'transferOwnership', args: [newOwner] })
    }, [writeContractAsync])
}

export function useRenounceOwnership() {
    const { writeContractAsync } = useWriteContract()
    return useCallback(async () => {
        if (!SNEAK_PROTOCOL_ADDRESS) throw new Error('Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS')
        return writeContractAsync({ address: SNEAK_PROTOCOL_ADDRESS, abi, functionName: 'renounceOwnership', args: [] })
    }, [writeContractAsync])
}

export function useWithdrawProtocolFees() {
    const { writeContractAsync } = useWriteContract()
    return useCallback(async (token: `0x${string}`) => {
        if (!SNEAK_PROTOCOL_ADDRESS) throw new Error('Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS')
        return writeContractAsync({ address: SNEAK_PROTOCOL_ADDRESS, abi, functionName: 'withdrawProtocolFees', args: [token] })
    }, [writeContractAsync])
}


