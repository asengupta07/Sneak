"use client";

import useBuyTokens from "@/hooks/buyTokens";
import { useCreateOpportunity } from "@/hooks/createOpportunity";
// import useGetOpportunity from "@/hooks/getOpportunity";
import useChaining from "@/hooks/useChaining";
import { parseEther } from "viem";

const Page = () => {
    const { createOpportunity, error, isPending } = useCreateOpportunity();
    const { buyTokens, createPositionChain } = useBuyTokens();

    const handleCreateOpportunity = () => {
        createOpportunity({
            name: "Test",
            metadataUrl: "Test",
            initialLiquidity: "10",
        });
    };

    // const { data: opportunity } = useGetOpportunity(3);

    return (
        <>
            <div>
                <button onClick={handleCreateOpportunity}>
                    Create Opportunity
                </button>
                {error && <div>{error.message}</div>}
                {isPending && <div>Creating opportunity...</div>}
            </div>

            <div>
                {/* <button onClick={() => console.log(opportunity)}>
                    Log Opportunity
                </button> */}
            </div>

            <div>
                <button
                    onClick={() =>
                        createPositionChain(2, true, parseEther("10"))
                    }
                >
                    Buy Tokens
                </button>
            </div>
        </>
    );
};

export default Page;
