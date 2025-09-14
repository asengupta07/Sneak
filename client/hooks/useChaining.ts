import { useWriteContract } from "wagmi";
import { contractAbi } from "@/app/abi";

const useChaining = () => {
    const { writeContractAsync } = useWriteContract();

    const createPositionChain = async (
        opportunityId: number,
        side: boolean,
        amount: number
    ) => {
        await writeContractAsync({
            address: process.env
                .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
            abi: contractAbi,
            functionName: "createPositionChain",
            args: [opportunityId, side, amount],
        });
    };

    const extendChain = async (
        chainId: number,
        opportunityId: number,
        side: boolean
    ) => {
        await writeContractAsync({
            address: process.env
                .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
            abi: contractAbi,
            functionName: "extendChain",
            args: [chainId, opportunityId, side],
        });
    };

    const liquidateChain = async (chainId: number) => {
        await writeContractAsync({
            address: process.env
                .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
            abi: contractAbi,
            functionName: "liquidateChain",
            args: [chainId],
        });
    };

    return { createPositionChain, extendChain, liquidateChain };
};

export default useChaining;
