import { Icons } from "@/components/icons";
import {
    HomeIcon,
    NotebookIcon,
    DatabaseIcon,
    MessagesSquareIcon,
} from "lucide-react";

export const DATA = {
    site_title: "YUMLABS",
    initials: "YL",
    url: "https://github.com/Yumshot",
    location: "Puyallup, WA",
    locationLink: "https://www.google.com/maps/place/Puyallup,+WA",
    description: "A Compilation of Personal/Public Tools, API's & Libraries.",
    summary: "Some kind of information",
    avatarUrl: "/me.png",
    fetch_llm_records_address: "http://127.0.0.1:8080/all_llm_records",
    fetch_available_models_address:
        "http://127.0.0.1:8080/all_available_models",
    fetch_default_prompts_address: "http://127.0.0.1:8080/all_default_prompts",
    fetch_api_chat_address: "http://127.0.0.1:8080/api/chat",
    roleOptions: [
        { label: "system", value: "System" },
        { label: "user", value: "User" },
        { label: "assistant", value: "Assistant" },
    ],
    skills: [
        "React",
        "Typescript",
        "Node.js",
        "Python",
        "Rust",
        "Sql",
        "MongoDB",
        "C#",
    ],
    navbar: [
        { href: "/", icon: HomeIcon, label: "Home" },
        { href: "/blog", icon: NotebookIcon, label: "Blog" },
        { href: "/llm-outputs", icon: DatabaseIcon, label: "LLM Outputs" },
        {
            href: "/llm-interaction",
            icon: MessagesSquareIcon,
            label: "LLM Interact",
        },
    ],
    contact: {
        email: "hello@example.com",
        tel: "+123456789",
        social: {
            GitHub: {
                name: "GitHub",
                url: "https://github.com/Yumshot",
                icon: Icons.github,

                navbar: true,
            },
            LinkedIn: {
                name: "LinkedIn",
                url: "https://dub.sh/dillion-linkedin",
                icon: Icons.linkedin,

                navbar: false,
            },
            X: {
                name: "X",
                url: "https://dub.sh/dillion-twitter",
                icon: Icons.x,

                navbar: false,
            },
            Youtube: {
                name: "Youtube",
                url: "https://dub.sh/dillion-youtube",
                icon: Icons.youtube,
                navbar: false,
            },
            email: {
                name: "Send Email",
                url: "#",
                icon: Icons.email,

                navbar: false,
            },
        },
    },

    work: [],
    education: [],
    projects: [
        {
            title: "Yum-Commits",
            href: "https://github.com/Yumshot/yum-commits",
            dates: "Oct 2024 - Present",
            active: true,
            description:
                "The **Yum-Commits** project is a CLI tool designed to streamline the process of creating commit messages for Git repositories by leveraging AI technology. Aimed at developers, this tool automates the generation of concise and informative commit messages that adhere to standard Git commit message conventions. The tool integrates with Git repositories to analyze changes, detect uncommitted modifications, and generate commit messages that describe the updates in a consistent format, such as feat, fix, docs, and other common types, ensuring clarity and consistency in version control documentation.",
            technologies: ["Rust", "Ollama", "Git"],
            links: [
                {
                    type: "Website",
                    href: "https://github.com/Yumshot/yum-commits",
                    icon: <Icons.globe className="size-3" />,
                },
            ],
            image: "",
            video: "/commits.mp4",
        },
        {
            title: "Yum-OSU!",
            href: "https://github.com/Yumshot/yum-osu",
            dates: "Oct 2024 - Present",
            active: true,
            description:
                "The **Yum-OSU!** project is a rhythm game inspired by OSU!, designed to provide an engaging and customizable experience for rhythm game enthusiasts. With user-generated beatmaps, customizable skins, and multiple gameplay modes, **Yum-OSU!** offers players a dynamic and immersive way to test their timing and precision. The game features an intuitive beatmap editor, allowing players to create and share tracks, while ranked competitions and leaderboards ensure a competitive edge. **Yum-OSU!** brings rhythm gaming to life with a focus on community, creativity, and personalized gameplay.",
            technologies: ["Rust", "Macroquad"],
            links: [
                {
                    type: "Website",
                    href: "https://github.com/Yumshot/yum-commits",
                    icon: <Icons.globe className="size-3" />,
                },
            ],
            image: "",
            video: "/osu.mp4",
        },
    ],
    hackathons: [],
} as const;
