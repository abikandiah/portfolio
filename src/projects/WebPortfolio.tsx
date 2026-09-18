import type { ProjectProps } from '@/types/ProjectTypes'
import { projectType } from '@/types/ProjectTypes'
import { techType } from '@/types/TechTypes'
import { Section } from '@/components/projects/Section'

export const webPortfolioProject: ProjectProps = {
	type: projectType.Personal,
	name: 'Web Portfolio',
	startYear: 2025,
	description: `A personal portfolio website to showcase my technical expertise, designed as a modern single-page application (SPA) and hosted on Cloudflare.`,
	tech: [
		techType.TypeScript,
		techType.React,
		techType.TailwindCSS,
		techType.TanstackRouter,
		techType.Vite,
	],

	sections: [{ title: 'Overview', body: Overview }],

	caseStudy: CaseStudy,
}

function CaseStudy() {
	return (
		<>
			<p>
				My portfolio site: where I showcase my experience and projects, explain
				the thinking behind them, and track what I pick up as I keep on
				building.
			</p>

			<Section title="Problem">
				<p>
					Needed to work as a quick read for everyone, hold up under closer
					technical scrutiny, and stay worth maintaining as I keep learning and
					adding to it.
				</p>
			</Section>

			<Section title="Approach">
				<p>
					Built as a React 19 SPA with TypeScript, TanStack Router, and
					Tailwind CSS v4. Design-wise: one small border-radius used everywhere
					instead of mixing pill and sharp shapes, hover/cursor behavior that
					only shows up on things that are actually clickable, a readable
					column width for write-ups instead of full-width prose, and a
					case-study/design toggle so each project can be read short or in
					depth.
				</p>
			</Section>

			<Section title="Outcome">
				<p>
					Still a work in progress — I add to it as I build new things and pick
					up new tools.
				</p>
			</Section>
		</>
	)
}

function Overview() {
	return (
		<>
			<p>
				This was not only a goal to showcase myself but also to learn and
				upskill myself. I've done a lot of React development in my time but time
				goes on and things change. I needed to catch up to the latest frontend
				technologies and trends, as well as familiarize myself with JavaScript's
				good brother, TypeScript. I've written a lot of JavaScript but not so
				much TypeScript, so this project was a major step towards that
				direction.
			</p>
			<p>
				I did some research into the latest advancements and decided to stick
				with a React client-side rendered website. Although, I've stepped into a
				lot of talk against SPAs and how they're not meant for every single
				website, that they overcomplicate everything and not all websites need
				that complexity.
			</p>
			<p>
				I understand that point and agree. A lot of templating engines and even
				plain HTML, CSS And JS would suffice for a lot of cases. Arguably even
				for this website, it did not need to be created as a React SPA.
			</p>
			<p>
				But I did it anyway. I wanted to focus on learning and building web
				applications, not only on simply building a portfolio website.
			</p>
			<p>
				To that end, this website was created as a{' '}
				<span className="font-semibold">React SPA</span> written with{' '}
				<span className="font-semibold">TypeScript</span>, styled using{' '}
				<span className="font-semibold">Tailwind CSS</span>, constructed with{' '}
				<span className="font-semibold">Shadcn-UI</span> components, routed with{' '}
				<span className="font-semibold">Tanstack Router</span>, bundled by{' '}
				<span className="font-semibold">Vite</span>, and hosted by{' '}
				<span className="font-semibold">Cloudflare</span> to bring it all
				together.
			</p>
		</>
	)
}
