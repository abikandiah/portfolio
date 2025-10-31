import profilePhoto from "@/assets/face.svg";
import github from "@/assets/github.svg";
import linkedinBlack from "@/assets/linkedin-black.png";
import Education from '@/components/home/Education';
import ProjectsOverview from '@/components/home/ProjectsOverview';
import WorkExperience from '@/components/home/WorkExperience';
import { ExternalSite, PageDescription, PageHeader } from "@/components/ui";
import { LINKS, PERSONAL } from "@/constants";
import { createFileRoute } from '@tanstack/react-router';
import { Mail } from 'lucide-react';
import { useRef, useState } from 'react';

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	return (
		<>
			<LandscapeContainer />
			<div className="flex flex-col px-3 xl:px-0">
				<ProfileHeader />
				<ProfileSummary />
				<MainContent />
			</div>
		</>
	)
}

function ProfileHeader() {
	return (
		<div className="flex flex-col items-center justify-center">
			<FaceContextMenu src={profilePhoto} />

			<PageHeader className="sm:text-4xl text-3xl mt-6">
				Abilaesh Kandiah
			</PageHeader>

			<PageDescription className="sm:text-2xl text-xl mt-1">
				Full-Stack Developer
			</PageDescription>
		</div>
	)
}

function ProfileSummary() {
	return (
		<section className='flex flex-col gap-4 p-6 mt-2'>

			<p className="p-text">
				I'm Abi, a full-stack developer and general enthusiast. I design and build software in all fields of need. Working with tools such as React, TypeScrpt, Java, Node and Python. Learning whatever is needed to get the job done the best way it can be done.
			</p>
			<p className="p-text">
				I do front and backend with most of my experience in ReactJS and Java Dropwizard. I've designed SQL database schemas, frontend styles and components, backend APIs, automated end-to-end tests, authentication and authorization, and entire applications.

				I've over 7 years of technical experience and I'm always looking to extend.
			</p>

			<div className="flex items-center gap-4">
				<SendEmail email={PERSONAL.email} />

				<ExternalSite
					url={LINKS.github}
					src={github}
					alt="GitHub Logo"
					aria-label="Github Profile"
					title="Visit my Github"
				/>

				<ExternalSite
					url={LINKS.linkedinUrl}
					src={linkedinBlack}
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
			href={`mailto:${email}?subject=Hello!&body=I wanted to reach out to you regarding...`}
		>
			<Mail />
			{showText && <span className="ml-2 font-medium">{email}</span>}
		</a>
	)
}

function FaceContextMenu({ src }: { src: string }) {

	const [state, setState] = useState({ degree: 0, duration: 500 });
	const downTime = useRef(0);

	function onPointerDown(event: React.PointerEvent<HTMLImageElement>) {
		downTime.current = event.timeStamp;
	}

	function onPointerUp(event: React.PointerEvent<HTMLImageElement>) {
		const additionalDegrees = (event.timeStamp - downTime.current);

		setState({
			degree: state.degree + additionalDegrees,
			duration: Math.max(additionalDegrees * 2, 500)
		});
	}

	const rotationClass = `transition-transform duration-500 rotate-[var(--random-rotation)]`;
	const customStyles = {
		// Use the CSS variable syntax for custom properties
		'--random-rotation': `${state.degree}deg`,
		'transitionDuration': `${state.duration}ms`,
	};

	return (
		<img onPointerDown={onPointerDown} onPointerUp={onPointerUp}
			className={`sm:h-48 sm:w-48 h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-lg ${rotationClass}`}
			src={src}
			alt="Abilaesh Kandiah's Profile Photo"
			style={customStyles}
		/>
	)
}

function LandscapeContainer() {
	return (
		<div className="image-background">
			{/* <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent"></div> */}
		</div>
	);
}

