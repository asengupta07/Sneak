import { contractAbi } from "@/app/abi";
import { useReadContract } from "wagmi";

const useGetPositionChain = async (chainId: number) => {
    return useReadContract({
        address: process.env
            .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
        abi: contractAbi,
        functionName: "getPositionChain",
        args: [chainId],
    });
};

const useGetUserChains = (user: string) => {
    return useReadContract({
        address: process.env
            .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
        abi: contractAbi,
        functionName: "getUserChains",
        args: [user],
    });
};

const useGetUserTokens = (
    opportunityId: number,
    side: boolean,
    user: string
) => {
    return useReadContract({
        address: process.env
            .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
        abi: contractAbi,
        functionName: "getUserTokens",
        args: [opportunityId, side, user],
    });
};
export { useGetPositionChain, useGetUserChains, useGetUserTokens };
