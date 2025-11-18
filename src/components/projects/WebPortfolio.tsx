import { projectType, type ProjectProps } from "@/types/ProjectTypes";
import { techType } from "@/types/TechTypes";

export const webPortfolioProject: ProjectProps = {
	type: projectType.Personal,
	name: 'Web Portfolio',
	duration: '2025',
	description: `A personal portfolio website to showcase my technical expertise, designed as a modern single-page application (SPA) and hosted on Cloudflare as a Page.`,
	tech: [techType.TypeScript, techType.React, techType.TailwindCSS, techType.TanstackRouter, techType.Vite],

	sections: [
		{ title: 'Overview', body: Overview }
	]
};

function Overview() {
	return (
		<>
			<p>
				This was not only a goal to showcase myself but also to learn and upskill myself. I've done a lot of React development in my time but time goes on and things change. I needed to catch up to the latest frontend technologies and trends, as well as familiarize myself with JavaScript's good brother, TypeScript. I've written a lot of JavaScript but not so much TypeScript, so this project was a major step towards that direction.
			</p>
			<p>
				I did some research into the latest advancements and decided to stick with a React client-side rendered website. Although, I've stepped into a lot of talk against SPAs and how they're not meant for every single website, that they overcomplicate everything and not all websites need that complexity.
			</p>
			<p>
				I understand that point and agree. A lot of templating engines and even plain HTML, CSS And JS would suffice for a lot of cases. Arguably even for this website, it did not need to be created as a React SPA.
			</p>
			<p>
				But I did it anyway. I wanted to focus on learning and building web applications, not only on simply building a portfolio website.
			</p>
			<p>
				To that end, this website was created as a <span className="font-semibold">React SPA</span> written with <span className="font-semibold">TypeScript</span>, styled using <span className="font-semibold">Tailwind CSS</span>, constructed with <span className="font-semibold">Shadcn-UI</span> components, routed with <span className="font-semibold">Tanstack Router</span>, bundled by <span className="font-semibold">Vite</span>, and hosted by <span className="font-semibold">Cloudflare</span> to bring it all together.
			</p>
		</>
	)
}

