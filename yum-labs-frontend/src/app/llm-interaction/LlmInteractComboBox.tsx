"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type LlmInteractComboBoxProps = {
    models: { value: string }[]; // Ensure models have the correct type
    selectedModel: string;
    onModelSelect: (model: string) => void;
};

// Utility function to truncate text
const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
};

export function LlmInteractComboBox({
    models,
    selectedModel,
    onModelSelect,
}: LlmInteractComboBoxProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {selectedModel
                        ? truncateText(
                              models.find(
                                  (model) => model.value === selectedModel,
                              )?.value || "Select...",
                              20, // Set max length for truncation
                          )
                        : "Select..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>Nothing found.</CommandEmpty>
                        <CommandGroup>
                            {models.map((model) => (
                                <CommandItem
                                    key={model.value}
                                    value={model.value}
                                    onSelect={(currentValue) => {
                                        onModelSelect(
                                            currentValue === selectedModel
                                                ? ""
                                                : currentValue,
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    {model.value}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            selectedModel === model.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
