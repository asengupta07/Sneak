import { contractAbi, musdcAbi } from "@/app/abi";
import { useWriteContract } from "wagmi";
import { parseEther, parseUnits } from "viem";

interface BuyTokensProps {
    opportunityId: number;
    side: boolean;
    amount: string;
}

const useBuyTokens = () => {
    const { writeContractAsync, error, isPending } = useWriteContract();

    // const buyTokens = async ({
    //     opportunityId,
    //     side,
    //     amount,
    // }: BuyTokensProps) => {
    //     const tokenAmount = parseUnits(amount, 6); // MUSDC has 6 decimals
    //     console.log("Buying tokens:", opportunityId, side, tokenAmount);

    //     try {
    //         // Step 1: Approve MUSDC spending
    //         console.log("Approving MUSDC spending...");
    //         await writeContractAsync({
    //             address: process.env.NEXT_PUBLIC_MUSDC_ADDRESS as `0x${string}`,
    //             abi: musdcAbi,
    //             functionName: "approve",
    //             args: [
    //                 process.env
    //                     .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
    //                 tokenAmount,
    //             ],
    //         });

    //         // Step 2: Buy tokens
    //         console.log("Buying tokens...");
    //         await writeContractAsync({
    //             address: process.env
    //                 .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
    //             abi: contractAbi,
    //             functionName: "buyTokens",
    //             args: [opportunityId, side, parseEther(amount)],
    //         });
    //     } catch (error) {
    //         console.error("Error buying tokens:", error);
    //         throw error;
    //     }
    // };

    const createPositionChain = async (
        opportunityId: number,
        side: boolean,
        amount: bigint
    ) => {
        // Step 1: Approve MUSDC spending
        console.log("Approving MUSDC spending...");
        await writeContractAsync({
            address: process.env.NEXT_PUBLIC_MUSDC_ADDRESS as `0x${string}`,
            abi: musdcAbi,
            functionName: "approve",
            args: [
                process.env.NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
                amount,
            ],
        });

        await writeContractAsync({
            address: process.env
                .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
            abi: contractAbi,
            functionName: "createPositionChain",
            args: [opportunityId, side, amount],
        });
    };

    return { createPositionChain, error, isPending };
};

export default useBuyTokens;
