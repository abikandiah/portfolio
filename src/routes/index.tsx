import { cn } from '@abumble/design-system/utils'
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import profilePhoto from '@/assets/face.svg'
import Education from '@/components/home/Education'
import ProjectsOverview from '@/components/home/ProjectsOverview'
import WorkExperience from '@/components/home/WorkExperience'
import { SocialLinks } from '@/components/SocialLinks'
import { PageDescription, PageHeader } from '@/components/ui'

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	return (
		<>
			<LandscapeContainer className="-mx-3" />
			<div className="center-page flex flex-col">
				<ProfileIntro />
				<MainContent />
			</div>
		</>
	)
}

function ProfileIntro() {
	return (
		<div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 px-6 pb-6 pt-6">
			<div className="flex flex-col items-center justify-center shrink-0">
				<FaceContextMenu src={profilePhoto} />

				<PageHeader className="mt-6 text-center">Abilaesh Kandiah</PageHeader>

				<PageDescription className="mt-1 text-center">
					Full-Stack Developer
				</PageDescription>
			</div>

			<section className="flex flex-col gap-4 mt-4">
				<p className="p-text">
					Hey, I'm Abi, a seasoned full-stack developer with over 7 years of
					experience dedicated to bringing ideas to life. I architect and
					deliver complete, robust solutions—from database design to launching
					polished UIs. Leveraging React, JavaScript, Java, Node, and Python
					alongside modern CI/CD and cloud platforms (AWS/Azure/GCP), I manage
					the full operational loop to build it right.
				</p>

				<SocialLinks className="flex items-center gap-4 justify-center md:justify-start" />
			</section>
		</div>
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

function FaceContextMenu({ src }: { src: string }) {
	const [state, setState] = useState({ degree: 0, duration: 500 })
	const downTime = useRef(0)

	function onPointerDown(event: React.PointerEvent<HTMLImageElement>) {
		downTime.current = event.timeStamp
	}

	function onPointerUp(event: React.PointerEvent<HTMLImageElement>) {
		const additionalDegrees = event.timeStamp - downTime.current

		setState({
			degree: state.degree + additionalDegrees,
			duration: Math.max(additionalDegrees * 2, 500),
		})
	}

	const rotationClass = `transition-transform duration-500 rotate-[var(--random-rotation)]`
	const customStyles = {
		// Use the CSS variable syntax for custom properties
		'--random-rotation': `${state.degree}deg`,
		transitionDuration: `${state.duration}ms`,
	}

	return (
		<img
			onPointerDown={onPointerDown}
			onPointerUp={onPointerUp}
			className={`sm:h-48 sm:w-48 h-32 w-32 rounded-full object-cover ring-4 ring-background shadow-lg dark:invert ${rotationClass}`}
			src={src}
			alt="Abilaesh Kandiah's Profile Photo"
			style={customStyles}
		/>
	)
}

function LandscapeContainer({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return <div className={cn('image-background', className)} {...props}></div>
}
