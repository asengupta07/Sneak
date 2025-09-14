import { contractAbi, musdcAbi } from "@/app/abi";
import { useWriteContract } from "wagmi";
import { parseEther, parseUnits } from "viem";

interface CreateOpportunityProps {
    name: string;
    metadataUrl: string;
    initialLiquidity: string;
}

export const useCreateOpportunity = () => {
    const { writeContractAsync, error, isPending } = useWriteContract();

    const createOpportunity = async ({
        name,
        metadataUrl,
        initialLiquidity,
    }: CreateOpportunityProps) => {
        const liquidityAmount = parseEther(initialLiquidity);
        console.log(
            "Creating opportunity:",
            name,
            metadataUrl,
            liquidityAmount
        );

        try {
            console.log("Approving MUSDC spending...");
            await writeContractAsync({
                address: process.env.NEXT_PUBLIC_MUSDC_ADDRESS as `0x${string}`,
                abi: musdcAbi,
                functionName: "approve",
                args: [
                    process.env
                        .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
                    liquidityAmount,
                ],
            });

            console.log("Creating opportunity...");
            await writeContractAsync({
                address: process.env
                    .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
                abi: contractAbi,
                functionName: "createOpportunity",
                args: [name, metadataUrl, liquidityAmount],
            });
        } catch (error) {
            console.error("Error creating opportunity:", error);
            throw error;
        }
    };

    return { createOpportunity, error, isPending };
};
