import { contractAbi } from "@/app/abi";
import { useReadContract } from "wagmi";

const useGetOpportunity = (opportunityId: number) => {
    return useReadContract({
        address: process.env
            .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
        abi: contractAbi,
        functionName: "getOpportunity",
        args: [opportunityId as number],
    });
};

const useGetAllOpportunities = () => {
    return useReadContract({
        address: process.env
            .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
        abi: contractAbi,
        functionName: "getOpportunities",
        args: [],
    });
};

export { useGetOpportunity, useGetAllOpportunities };
