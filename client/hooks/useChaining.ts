import { useWriteContract } from "wagmi";
import { contractAbi } from "@/app/abi";

const useChaining = () => {
    const { writeContractAsync } = useWriteContract();

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

    return { extendChain, liquidateChain };
};

export default useChaining;
