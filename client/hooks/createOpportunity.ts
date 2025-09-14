import { contractAbi } from "@/app/abi";
import { useWriteContract } from "wagmi";

export const useCreateOpportunity = () => {
    const { writeContractAsync } = useWriteContract();

    const createOpportunity = (
        name: string,
        metadataUrl: string,
        initialLiquidity: string
    ) => {
        console.log(
            "Creating opportunity:",
            name,
            metadataUrl,
            initialLiquidity
        );
        return writeContractAsync({
            address: process.env
                .NEXT_PUBLIC_SNEAK_PROTOCOL_ADDRESS as `0x${string}`,
            abi: contractAbi,
            functionName: "createOpportunity",
            args: [name, metadataUrl, initialLiquidity],
        });
    };

    return createOpportunity;
};
