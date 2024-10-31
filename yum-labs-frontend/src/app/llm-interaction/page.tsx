import BlurFade from "@/components/magicui/blur-fade";
import { Dashboard } from "./Dashboard";

export const metadata = {
    title: "Outputs",
    description: "Catalogue of LLM outputs, for our reference.",
};

const BLUR_FADE_DELAY = 0.04;

export default async function LlmInteract() {
    return (
        <div>
            <BlurFade delay={BLUR_FADE_DELAY}>
                <h1 className="font-medium text-2xl mb-8 tracking-tighter">
                    LLM Interaction
                </h1>
                <Dashboard />
            </BlurFade>
        </div>
    );
}
