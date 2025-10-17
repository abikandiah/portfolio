import Contact from '@/components/home/Contact'
import Education from '@/components/home/Education'
import ProjectsOverview from '@/components/home/ProjectsOverview'
import WorkExperience from '@/components/home/WorkExperience'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	return (
		<>
			<div className="flex flex-col space-y-4">
				<ProfileHeader />
				<ProfileSummary />

				<MainContent />
			</div>
		</>
	)
}

function ProfileHeader() {
	return (
		<div className="flex flex-col items-center justify-center mx-auto mb-8">

			<img
				className="h-48 w-48 rounded-full object-cover ring-4 ring-white shadow-lg"
				src="/src/assets/profile-photo.jpg"
				alt="Abilaesh Kandiah's Profile Photo"
			/>

			{/* 1. Name */}
			<h1 className="mt-8 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
				Abilaesh Kandiah
			</h1>

			{/* 2. Professional Title */}
			<h2 className="mt-2 text-3xl font-light text-gray-700 sm:text-3xl">
				Full-Stack Developer
			</h2>
		</div>
	)
}

function ProfileSummary() {
	return (
		<section>

			{/* Summary Content */}
			<p className="leading-relaxed text-base">
				<span className="font-semibold">Full-Stack Developer</span> with
				<span className="font-semibold"> 7+ years of experience</span> specializing in building innovative, quality full-stack solutions from the ground up, culminating
				in a <span className="font-semibold">successful company acquisition</span>.

				Expert in <span className="font-semibold">Java, JavaScript, and React</span>, with a deep understanding of software development and system design principles.
				Seeking a challenging role to leverage my skills in producing high-quality software solutions, while continuously expanding my technical expertise.
			</p>
		</section>
	);
}


function MainContent() {
	return (
		<div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2">
			<div className="flex flex-col">
				<ProjectsOverview />
			</div>

			<div className="space-y-4 lg:pl-24 xl:pl-36">
				<Contact />
				<Education />
				<WorkExperience />
			</div>
		</div>
	)
}

