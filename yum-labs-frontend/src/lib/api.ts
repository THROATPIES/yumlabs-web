import { DATA } from "@/data/resume";

// api.ts
export async function fetchAvailableModels() {
    const res = await fetch(DATA.fetch_available_models_address);
    if (!res.ok) throw new Error("Failed to fetch models");
    return res.json();
}

export async function fetchDefaultPrompts() {
    const res = await fetch(DATA.fetch_default_prompts_address);
    if (!res.ok) throw new Error("Failed to fetch prompts");
    return res.json();
}
