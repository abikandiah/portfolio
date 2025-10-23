import Education from '@/components/home/Education'
import ProjectsOverview from '@/components/home/ProjectsOverview'
import WorkExperience from '@/components/home/WorkExperience'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { githubUrl, linkedinUrl, personalEmail } from '@/constants'
import { createFileRoute } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	return (
		<div className="flex flex-col pt-12">
			<ProfileHeader />
			<ProfileSummary />
			<MainContent />
		</div>
	)
}

function ProfileHeader() {
	// const photoSrc = "profile-photo.jpg";
	const photoSrc = "face.svg";

	return (
		<div className="flex flex-col items-center justify-center mx-auto">
			<FaceContextMenu src={photoSrc} />

			<h1 className="font-bold tracking-tight text-gray-900 sm:text-4xl text-3xl mt-6">
				Abilaesh Kandiah
			</h1>

			<h2 className="mt-1 text-gray-700 sm:text-2xl text-xl">
				Full-Stack Developer
			</h2>
		</div>
	)
}

function ProfileSummary() {
	return (
		<section className='flex flex-col gap-4 p-6 mt-2'>

			<p className="p-text">
				I'm Abi, a full-stack developer and general enthusiast. I enjoy learning and figuring things out and I've turned that joy towards designing and crafting quality software solutions. Learning whatever is needed to get the job done the best way it can be done. I've always thought of it like solving a puzzle and building legos.
			</p>
			<p className="p-text">
				I've built web applications with React and Redux, both in JavaScript and TypeScript, back-end servers with Java Dropwizard and Express. I've over 7 years of experience building full-stack projects from the ground up, and I'm looking for opportunities to extend, whether it be contract or permanent.
			</p>

			<div className="flex items-center gap-4">
				<SendEmail email={personalEmail} />

				<ExternalSite
					url={githubUrl}
					src="/src/assets/github.svg"
					alt="GitHub Logo"
					aria-label="Github Profile"
					title="Visit my Github"
				/>

				<ExternalSite
					url={linkedinUrl}
					src="/src/assets/linkedin-black.png"
					alt="LinkedIn Logo"
					aria-label="LinkedIn Profile"
					title="Check out my LinkedIn"
				/>
			</div>
		</section>
	)
}

function MainContent() {
	return (
		<div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2">
			<div className="flex flex-col">
				<ProjectsOverview />
			</div>

			<div className="space-y-4 lg:pl-4">
				<Education />
				<WorkExperience />
			</div>
		</div>
	)
}

function SendEmail({ email, showText }: { email: string; showText?: boolean }) {
	return (
		<a
			className="flex items-center action-hover"
			title="Send me an email"
			href={`mailto:${email}?subject=Hello From Your Website!&body=I wanted to reach out to you regarding...`}
		>
			<Mail />
			{showText && <span className="ml-2 font-medium">{email}</span>}
		</a>
	)
}

interface ExternalSiteProps {
	url: string;
	src: string;
	alt: string;
}

function ExternalSite({ url, src, alt, ...rest }: ExternalSiteProps & React.ComponentProps<"a">) {
	return (
		<a href={url} target="_blank" rel="noopener noreferrer" {...rest}>
			<img
				src={src}
				alt={alt}
				className="h-6 w-6"
			/>
		</a>
	)
}

function FaceContextMenu({ src }: { src: string }) {

	const [state, setState] = useState({ degree: 0, duration: 500 });

	function spin() {
		const rand = getRandomIntUpTo(3600);
		const diff = Math.abs(state.degree - rand);
		setState({
			degree: rand,
			duration: Math.max(diff * 2, 500)
		});
	}

	const rotationClass = `transition-transform duration-500 rotate-[var(--random-rotation)]`;
	const customStyles = {
		// Use the CSS variable syntax for custom properties
		'--random-rotation': `${state.degree}deg`,
		'transitionDuration': `${state.duration}ms`,
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<img onClick={spin}
					className={`sm:h-48 sm:w-48 h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-lg ${rotationClass}`}
					src={`/src/assets/${src}`}
					alt="Abilaesh Kandiah's Profile Photo"
					style={customStyles}
				/>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onSelect={spin}>Spin</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	)
}

/**
 * Returns a random integer between 0 and max, inclusive.
 * @param {number} max - The maximum possible number (inclusive).
 */
function getRandomIntUpTo(max: number) {
	// We use (max + 1) to make 'max' inclusive after Math.floor()
	return Math.floor(Math.random() * (max + 1));
}

