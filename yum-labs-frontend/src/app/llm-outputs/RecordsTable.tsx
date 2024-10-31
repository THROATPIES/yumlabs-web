import React from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableCell,
    TableBody,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LlmRecord {
    id: { id: { String: string } };
    instruction: string;
    prompt: string;
    response: string;
    model?: string;
}

interface RecordsTableProps {
    records: LlmRecord[];
}

export const RecordsTable: React.FC<RecordsTableProps> = ({ records }) => {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell>
                            <Badge variant="outline">ID</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">Instruction</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">Prompt</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">Response</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">Model</Badge>
                        </TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.map((record: LlmRecord) => {
                        const idString = record.id.id.String;

                        return (
                            <TableRow key={idString}>
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                {idString}
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{idString}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell>
                                    <HoverCard>
                                        <HoverCardTrigger>...</HoverCardTrigger>
                                        <HoverCardContent>
                                            <p>{record.instruction}</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                </TableCell>
                                <TableCell>
                                    <HoverCard>
                                        <HoverCardTrigger>...</HoverCardTrigger>
                                        <HoverCardContent>
                                            <p>{record.prompt}</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                </TableCell>
                                <TableCell>
                                    <ScrollArea className="h-[75px] w-[450px] rounded-md border p-4">
                                        {record.response}
                                    </ScrollArea>
                                </TableCell>
                                <TableCell>
                                    {record.model ? (
                                        <Badge variant="outline">
                                            {record.model}
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive">
                                            None
                                        </Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};
