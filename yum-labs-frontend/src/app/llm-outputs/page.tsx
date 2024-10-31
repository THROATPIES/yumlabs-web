"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import React, { useEffect, useState } from "react";
import { RecordsTable } from "./RecordsTable";

const BLUR_FADE_DELAY = 0.04;

// Fetch LLM records from the API
async function fetchLlmRecords() {
    const res = await fetch(DATA.fetch_llm_records_address); // Use the correct URL for your backend API
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}

type LlmRecord = {
    id: {
        tb: string | null;
        id: {
            String: string;
        };
    };
    instruction: string;
    prompt: string;
    response: string;
    model: string;
};

export default function LlmOutputs() {
    const [records, setRecords] = useState<LlmRecord[]>([]); // State to hold the fetched records
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const getRecords = async () => {
            try {
                const data = await fetchLlmRecords(); // Fetch the records
                setRecords(data); // Update state
            } catch (error) {
                console.error("Failed to fetch records:", error);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        getRecords(); // Call the fetch function
    }, []);

    if (loading) {
        return <p>Loading...</p>; // Render a loading state while data is being fetched
    }

    return (
        <div className="max-w-[1200px] w-full mx-auto">
            {" "}
            {/* Make it responsive */}
            <BlurFade delay={BLUR_FADE_DELAY}>
                <h1 className="font-medium text-2xl mb-8 tracking-tighter">
                    LLM Outputs
                </h1>
                <RecordsTable records={records} />
            </BlurFade>
        </div>
    );
}
