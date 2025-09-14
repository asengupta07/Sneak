"use client";

import { useWriteContract } from "wagmi";
import { contractAbi } from "../abi";
import { SNEAK_PROTOCOL_ADDRESS } from "./useSneakProtocolReads";

type BigNumberish = bigint | number | string;

export function useCreateOpportunity() {
    const { writeContractAsync } = useWriteContract();
    return (
        name: string,
        imageUrl: string,
        initialLiquidity: BigNumberish,
        options?: any
    ) => {
        if (!SNEAK_PROTOCOL_ADDRESS)
            throw new Error("Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS");
        return writeContractAsync(
            {
                address: SNEAK_PROTOCOL_ADDRESS,
                abi: contractAbi,
                functionName: "createOpportunity",
                args: [name, imageUrl, BigInt(initialLiquidity as any)],
            },
            options
        );
    };
}

export function useBuyTokens() {
    const { writeContractAsync } = useWriteContract();
    return (
        opportunityId: BigNumberish,
        side: boolean,
        amount: BigNumberish,
        options?: any
    ) => {
        if (!SNEAK_PROTOCOL_ADDRESS)
            throw new Error("Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS");
        return writeContractAsync(
            {
                address: SNEAK_PROTOCOL_ADDRESS,
                abi: contractAbi,
                functionName: "buyTokens",
                args: [
                    BigInt(opportunityId as any),
                    side,
                    BigInt(amount as any),
                ],
            },
            options
        );
    };
}

export function useCreatePositionChain() {
    const { writeContractAsync } = useWriteContract();
    return (
        opportunityId: BigNumberish,
        side: boolean,
        amount: BigNumberish,
        options?: any
    ) => {
        if (!SNEAK_PROTOCOL_ADDRESS)
            throw new Error("Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS");
        return writeContractAsync(
            {
                address: SNEAK_PROTOCOL_ADDRESS,
                abi: contractAbi,
                functionName: "createPositionChain",
                args: [
                    BigInt(opportunityId as any),
                    side,
                    BigInt(amount as any),
                ],
            },
            options
        );
    };
}

export function useExtendChain() {
    const { writeContractAsync } = useWriteContract();
    return (
        chainId: BigNumberish,
        opportunityId: BigNumberish,
        side: boolean,
        options?: any
    ) => {
        if (!SNEAK_PROTOCOL_ADDRESS)
            throw new Error("Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS");
        return writeContractAsync(
            {
                address: SNEAK_PROTOCOL_ADDRESS,
                abi: contractAbi,
                functionName: "extendChain",
                args: [
                    BigInt(chainId as any),
                    BigInt(opportunityId as any),
                    side,
                ],
            },
            options
        );
    };
}

export function useLiquidateChain() {
    const { writeContractAsync } = useWriteContract();
    return (chainId: BigNumberish, options?: any) => {
        if (!SNEAK_PROTOCOL_ADDRESS)
            throw new Error("Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS");
        return writeContractAsync(
            {
                address: SNEAK_PROTOCOL_ADDRESS,
                abi: contractAbi,
                functionName: "liquidateChain",
                args: [BigInt(chainId as any)],
            },
            options
        );
    };
}

export function useClaimWinnings() {
    const { writeContractAsync } = useWriteContract();
    return (opportunityId: BigNumberish, options?: any) => {
        if (!SNEAK_PROTOCOL_ADDRESS)
            throw new Error("Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS");
        return writeContractAsync(
            {
                address: SNEAK_PROTOCOL_ADDRESS,
                abi: contractAbi,
                functionName: "claimWinnings",
                args: [BigInt(opportunityId as any)],
            },
            options
        );
    };
}

export function useResolveOpportunity() {
    const { writeContractAsync } = useWriteContract();
    return (opportunityId: BigNumberish, outcome: boolean, options?: any) => {
        if (!SNEAK_PROTOCOL_ADDRESS)
            throw new Error("Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS");
        return writeContractAsync(
            {
                address: SNEAK_PROTOCOL_ADDRESS,
                abi: contractAbi,
                functionName: "resolveOpportunity",
                args: [BigInt(opportunityId as any), outcome],
            },
            options
        );
    };
}

export function useTransferOwnership() {
    const { writeContractAsync } = useWriteContract();
    return (newOwner: `0x${string}`, options?: any) => {
        if (!SNEAK_PROTOCOL_ADDRESS)
            throw new Error("Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS");
        return writeContractAsync(
            {
                address: SNEAK_PROTOCOL_ADDRESS,
                abi: contractAbi,
                functionName: "transferOwnership",
                args: [newOwner],
            },
            options
        );
    };
}

export function useRenounceOwnership() {
    const { writeContractAsync } = useWriteContract();
    return (options?: any) => {
        if (!SNEAK_PROTOCOL_ADDRESS)
            throw new Error("Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS");
        return writeContractAsync(
            {
                address: SNEAK_PROTOCOL_ADDRESS,
                abi: contractAbi,
                functionName: "renounceOwnership",
                args: [],
            },
            options
        );
    };
}

export function useWithdrawProtocolFees() {
    const { writeContractAsync } = useWriteContract();
    return (token: `0x${string}`, options?: any) => {
        if (!SNEAK_PROTOCOL_ADDRESS)
            throw new Error("Missing NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS");
        return writeContractAsync(
            {
                address: SNEAK_PROTOCOL_ADDRESS,
                abi: contractAbi,
                functionName: "withdrawProtocolFees",
                args: [token],
            },
            options
        );
    };
}
