import { InnerUnorderedList, UnorderedList } from '@/components/ui/list'
import { ConstructionLanding } from '@/components/UnderConstruction'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<ConstructionLanding />
	)

	return (
		<div className="flex flex-col center-page mt-12">
			<div className="card">
				<section className="p-text space-y-4">
					<Goals />
				</section>
			</div>
		</div>
	)
}

function Goals() {
	return (
		<>
			<p>
				I have a lot of goals when it comes to upskilling and advancing my technical skills:
			</p>
			<UnorderedList>
				<li>
					Modernize my frontend development tech stack and skills by focusing on:
					<InnerUnorderedList>
						<li>TypeScript and the latest version of React;</li>
						<li>Modern CSS and component libraries (including frameworks and methodologies), such as Tailwind CSS And shadcn-ui;</li>
						<li>Themed, responsive, and accessibile design.</li>
					</InnerUnorderedList>
				</li>

				<li>
					Modernize my backend development tech and skills by focusing on:
					<InnerUnorderedList>
						<li>backend server stack such as Dropwizard, Express and Django;</li>
						<li>Databases such as SQLite, PostgreSQL and general NoSQL and Graph;</li>
						<li>General VM usage and containerization with Docker and Kubernetes;</li>
						<li>General networking and hosting on local and cloud providers;</li>
						<li>General application development.</li>
					</InnerUnorderedList>
				</li>
				<li>Learn more about distributed and data-intensive applications.</li>
				<li>Learn all things AI and machine learning.</li>
				<li>Learn Linux to the max.</li>
				<li>Get comfortable with building full-stack applications from the ground-up.</li>
			</UnorderedList>

			<h3 className="sub-heading">From the Ground Up</h3>
			<p>
				One of my major goals is to become comfortable with building entire full-stack applications from the ground up within minutes. Right now, I'd have to heavily rely on Google and AI prompts. I'd still be able to do it, but I'm not experienced enough to be able to instantly know how to connect everything. I'm nearly there, I'm simply missing the last piece of the experience in building applications from 0 to 1, where all the component setup takes place.
			</p>
			<p>z
				Such as setting up the backend, authentication and authorization, API resources and endpoint patterns, the database and data models, the unit tests and end-to-end tests, the frontend and having it all bundled as an asset served by the backend, and etc. I've experience starting a frontend from the bottom-up, but not so much with the rest. Everything was already in place when I began working on backend tech; I'd just extend and add features to an existing backend solution. Now's the time to experiment with personal projects and get comfortable.
			</p>

			<h3 className="sub-heading">Personal Projects</h3>
			<p>
				My goal with these personal projects is to learn and learn as much as I can. This website was the first in my journey and it satisfied a lot to do with modernizing my frontend tech stack. It is themed, responsive and accessible, and all built with a modern tech stack including TypeScript, React, Tanstack Router, Tailwind CSS, Shadcn-UI and Vite. It is also hosted on Cloudflare as a Page.
			</p>
			<p>
				The rest of my projects will be more heavily focused on building full-stack solutions from the ground-up. Solutions involving Java and Node backends, SQL and NoSQL databases, password and OIDC authentication, containerization with Docker and Kubernetes, and working with cloud providers such as AWS and Cloudflare.
			</p>
			<p>
				I want to reach a continous point where I'm knowledgeable and comfortable with building and deploying software solutions; with general expertise in most stacks and focused expertise in a few.
			</p>
		</>
	)
}

