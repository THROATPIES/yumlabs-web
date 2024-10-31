"use client";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LlmInteractComboBox } from "./LlmInteractComboBox";
import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { fetchAvailableModels, fetchDefaultPrompts } from "@/lib/api";

// Message object structure to store the sender and message
type Message = {
    sender: "User" | "Assistant"; // Define message sender type
    text: string; // Message text
};

export function Dashboard() {
    const [models, setModels] = useState([]); // Models state
    const [selectedModel, setSelectedModel] = useState("orca-mini:latest"); // For the selected model
    const [selectedRole, setSelectedRole] = useState("System"); // For the selected role
    const [temperature, setTemperature] = useState("0.7"); // For the temperature
    const [top_p, setTopP] = useState("0.8"); // For top-p
    const [top_k, setTopK] = useState("40.0"); // For top-k
    const [content, setContent] = useState(""); // For the content field
    const [messages, setMessages] = useState<Message[]>([]); // Store messages as objects (sender and text)
    const [inputMessage, setInputMessage] = useState(""); // Store the current input
    const [prompts, setPrompts] = useState([]); // Store the prompts
    const [selectedPrompt, setSelectedPrompt] = useState(""); // Store the selected prompt
    const [isTyping, setIsTyping] = useState(false); // New state for "assistant is typing"

    const scrollRef = useRef<HTMLDivElement>(null); // Reference for the scrollable area

    useEffect(() => {
        fetchAvailableModels()
            .then((data) => {
                const modelOptions = data.map((model: string) => ({
                    value: model,
                }));
                setModels(modelOptions);
            })
            .catch((err) => {
                console.error("Error fetching models:", err);
            });

        fetchDefaultPrompts()
            .then((data) => {
                const promptOptions = data.map((prompt: string) => ({
                    value: prompt,
                }));
                setPrompts(promptOptions);
            })
            .catch((err) => {
                console.error("Error fetching prompts:", err);
            });
    }, []);

    const handleClearMessages = () => {
        setMessages([]);
        setInputMessage("");
    };

    // Handle sending a message
    const handleSendMessage = async () => {
        if (inputMessage.trim().length > 1) {
            // Append the user's message to the chat
            setMessages((prev) => [
                { sender: "User", text: inputMessage },
                ...prev,
            ]);

            // Set the assistant as "typing..."
            setIsTyping(true);

            try {
                // Send the user's input and settings to the backend API
                const response = await fetch(DATA.fetch_api_chat_address, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: "488736e9-58b7-473a-b8ca-136ee7b3040c",
                        model: selectedModel,
                        role: selectedRole,
                        temperature,
                        top_p,
                        top_k,
                        content, // The "You are a..." content field
                        prompt: inputMessage,
                    }),
                });

                const data = await response.json();

                // Append the assistant's response and remove the "typing" indicator
                setMessages((prev) => [
                    { sender: "Assistant", text: data.response },
                    ...prev,
                ]);
            } catch (error) {
                console.error("Error fetching AI response:", error);
                setMessages((prev) => [
                    {
                        sender: "Assistant",
                        text: "There was an error getting a response.",
                    },
                    ...prev,
                ]);
            }

            // Clear the "typing" indicator and the input field
            setIsTyping(false);
            setInputMessage(""); // Clear the input field after sending
        }
    };

    // Handle keydown event to send message on Enter key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && e.shiftKey && inputMessage.trim().length > 1) {
            e.preventDefault(); // Prevents default newline behavior when Shift + Enter is pressed
            handleSendMessage();
        }
    };

    // Handle setting selected prompt and updating content field
    const handlePromptSelect = (selectedPrompt: string) => {
        setSelectedPrompt(selectedPrompt); // Set the selected prompt
        setContent(selectedPrompt); // Update the content field with the selected prompt
    };

    return (
        <div className="max-w-[1200px] mx-auto py-12 sm:py-24 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Settings */}
                <div className="bg-white dark:bg-black text-black dark:text-white p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Settings</h2>
                    <Separator className="mb-4" />

                    {/* Model Selection */}
                    <div className="mb-4">
                        <label
                            htmlFor="model"
                            className="text-sm font-medium pr-5"
                        >
                            <Badge variant="outline">Model</Badge>
                        </label>
                        <LlmInteractComboBox
                            models={models}
                            selectedModel={selectedModel}
                            onModelSelect={setSelectedModel}
                        />
                    </div>

                    {/* Prompt Section */}
                    <div className="mb-4">
                        <label
                            htmlFor="prompt"
                            className="text-sm font-medium pr-5"
                        >
                            <Badge variant="outline">Prompts</Badge>
                        </label>
                        <LlmInteractComboBox
                            models={prompts}
                            selectedModel={selectedPrompt}
                            onModelSelect={handlePromptSelect}
                        />
                    </div>

                    {/* Temperature, Top P, and Top K */}
                    <div className="mb-4">
                        <label className="text-sm font-medium">
                            Temperature
                        </label>
                        <Input
                            type="number"
                            value={temperature}
                            onChange={(e) => setTemperature(e.target.value)}
                            placeholder="0.7"
                            className="mb-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 text-black dark:text-white"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">
                                    Top P
                                </label>
                                <Input
                                    type="number"
                                    value={top_p}
                                    onChange={(e) => setTopP(e.target.value)}
                                    placeholder="0.8"
                                    className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600 text-black dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    Top K
                                </label>
                                <Input
                                    type="number"
                                    value={top_k}
                                    onChange={(e) => setTopK(e.target.value)}
                                    placeholder="40.0"
                                    className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600 text-black dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="mb-4">
                        <label className="text-sm font-medium">Content</label>
                        <Textarea
                            value={content}
                            rows={3}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="You are a..."
                            className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600 text-black dark:text-white"
                        />
                    </div>
                </div>

                {/* Right Column - Chat Box */}
                <div className="bg-white dark:bg-black text-black dark:text-white p-6 rounded-lg flex flex-col max-h-[400px]">
                    <h2 className="text-lg font-semibold mb-4">Output</h2>
                    <Separator className="mb-4" />

                    {/* Chat Output */}
                    <ScrollArea
                        className="flex-1 mb-4 border rounded-lg p-3 bg-white dark:bg-black border-gray-300 dark:border-gray-800 overflow-y-auto max-h-[400px]"
                        ref={scrollRef}
                    >
                        {/* Display "Assistant is typing..." at the top */}
                        {isTyping && (
                            <div className="my-2 p-2 rounded-lg text-sm max-w-full bg-gray-200 dark:bg-zinc-600 self-start">
                                <Badge
                                    variant="secondary"
                                    className="text-red-400 ml-2"
                                >
                                    Assistant
                                </Badge>
                                <div className="flex items-center justify-center">
                                    <BlurFade
                                        delay={0.25}
                                        inView
                                        inViewMargin="150px"
                                    >
                                        <span className="text-black dark:text-white ml-3 text-center">
                                            Assistant is typing...
                                        </span>
                                    </BlurFade>
                                </div>
                            </div>
                        )}

                        {/* Render the rest of the messages */}
                        {messages.length > 0 ? (
                            <>
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`my-2 p-2 rounded-lg text-sm max-w-full ${
                                            msg.sender === "User"
                                                ? "bg-gray-300 dark:bg-zinc-800 self-end"
                                                : "bg-gray-200 dark:bg-zinc-600 self-start"
                                        }`}
                                    >
                                        {msg.sender === "User" ? (
                                            <Badge
                                                variant="secondary"
                                                className="text-blue-400 ml-2"
                                            >
                                                User
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="secondary"
                                                className="text-red-400 ml-2"
                                            >
                                                Assistant
                                            </Badge>
                                        )}
                                        <span className="text-black dark:text-white ml-3">
                                            {msg.text}
                                        </span>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p className="text-gray-400 text-sm">
                                No messages yet. Start a conversation!
                            </p>
                        )}
                    </ScrollArea>

                    {/* Input and Send Button */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            className="bg-transparent border-none text-gray-400"
                        >
                            <Upload />
                        </Button>

                        <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown} // Add keydown event listener
                            placeholder="Type your message here..."
                            className="flex-1 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 text-black dark:text-white"
                        />
                        <Button
                            onClick={handleClearMessages}
                            className="w-auto bg-zinc-900 text-white px-4 py-2"
                        >
                            Clear
                        </Button>

                        <Button
                            onClick={handleSendMessage}
                            className="w-auto bg-blue-600 text-white px-4 py-2"
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
