import Education from '@/components/home/Education'
import ProjectsOverview from '@/components/home/ProjectsOverview'
import WorkExperience from '@/components/home/WorkExperience'
import { githubUrl, linkedinUrl, personalEmail } from '@/constants'
import { createFileRoute } from '@tanstack/react-router'
import { Mail } from 'lucide-react'

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	return (
		<>
			<div className="flex flex-col">
				<ProfileHeader />
				<ProfileSummary />
				<MainContent />
			</div>
		</>
	)
}

function ProfileHeader() {
	return (
		<div className="flex flex-col items-center justify-center mx-auto">
			<img
				className="sm:h-48 sm:w-48 h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-lg"
				src="/src/assets/profile-photo.jpg"
				alt="Abilaesh Kandiah's Profile Photo"
			/>

			<h1 className="font-bold tracking-tight text-gray-900 sm:text-4xl text-3xl mt-6">
				Abilaesh Kandiah
			</h1>

			<h2 className="mt-1 font-light text-gray-700 sm:text-2xl text-xl">
				Full-Stack Developer
			</h2>
		</div>
	)
}

function ProfileSummary() {
	return (
		<section className='card mt-6'>

			<p className="leading-relaxed text-base">
				<span className="font-semibold">Full-Stack Developer</span> with
				<span className="font-semibold"> 7+ years of experience</span> specializing in building innovative, quality full-stack solutions from the ground up, culminating
				in a <span className="font-semibold">successful company acquisition</span>.

				Expert in <span className="font-semibold">Java, JavaScript, and React</span>, with a deep understanding of software development and system design principles.
				Seeking a challenging role to leverage my skills in producing high-quality software solutions, while continuously expanding my technical expertise.
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
	);
}

function MainContent() {
	return (
		<div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2 mt-4">
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
export function ExternalSite({ url, src, alt, ...rest }: ExternalSiteProps & React.ComponentProps<"a">) {
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

