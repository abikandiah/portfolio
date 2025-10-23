import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const webPortfolioProject: ProjectProps = {
    type: projectType.Personal,
    name: 'Web Portfolio',
    duration: '2025',
    description: `A portfolio to show case myself. Built with TypeScript, React, TailwindCSS, Tanstack Router, and Vite.`,
    tech: [techType.TypeScript, techType.React, techType.TailwindCSS, techType.TanstackRouter],

    sections: [
        { title: 'Overview', body: Overview }
    ]
};

function Overview() {
    return (
        <>
            <p>

            </p>
        </>
    )
}

