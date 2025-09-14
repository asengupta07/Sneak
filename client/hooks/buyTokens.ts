import { contractAbi, musdcAbi } from "@/app/abi";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";

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
        console.log("=== Creating Position Chain ===");
        console.log("Opportunity ID:", opportunityId, typeof opportunityId);
        console.log("Side (true=yes, false=no):", side, typeof side);
        console.log("Amount (Wei):", amount.toString(), typeof amount);
        console.log("Amount (USDC):", (Number(amount) / 1e6).toFixed(6));
        console.log("MUSDC Address:", process.env.NEXT_PUBLIC_MUSDC_ADDRESS);
        console.log("Sneak Protocol Address:", process.env.NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS);
        
        // Validate inputs
        if (typeof side !== 'boolean') {
            console.error("ERROR: Side must be a boolean, got:", typeof side, side);
            throw new Error("Side parameter must be a boolean");
        }
        if (typeof opportunityId !== 'number') {
            console.error("ERROR: Opportunity ID must be a number, got:", typeof opportunityId, opportunityId);
            throw new Error("Opportunity ID must be a number");
        }
        
        // Ensure side is explicitly true or false
        const sideValue = side === true;
        console.log("Final side value being sent to contract:", sideValue, typeof sideValue);
        
        console.log("Step 1: Approving MUSDC spending...");
        const approveTx = await writeContractAsync({
            address: process.env.NEXT_PUBLIC_MUSDC_ADDRESS as `0x${string}`,
            abi: musdcAbi,
            functionName: "approve",
            args: [
                process.env.NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
                amount,
            ],
        });
        console.log("Approve transaction hash:", approveTx);

        console.log("Step 2: Creating position chain...");
        const positionTx = await writeContractAsync({
            address: process.env
                .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
            abi: contractAbi,
            functionName: "createPositionChain",
            args: [opportunityId, sideValue, amount],
        });
        console.log("Position chain transaction hash:", positionTx);
        console.log("=== Position Chain Created Successfully ===");
    };

    return { createPositionChain, error, isPending };
};

export default useBuyTokens;
