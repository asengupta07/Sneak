"use client";

import { useCreateOpportunity } from "@/hooks/createOpportunity";

const Page = () => {
    const createOpportunity = useCreateOpportunity();

    const handleCreateOpportunity = async () => {
        await createOpportunity("Test", "Test", "100");
    };

    return (
        <div>
            <button onClick={handleCreateOpportunity}>
                Create Opportunity
            </button>
        </div>
    );
};

export default Page;
