import { SendEmail } from '@/components/misc'
import { email } from '@/constants'
import { createFileRoute } from '@tanstack/react-router'
import { Download, MapPin } from 'lucide-react'

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	return (
		<>
			<div className="flex flex-col space-y-4">
				<ResumeHeader />
				<ResumeSummary />

				<CardDemo />
			</div>
		</>
	)
}

function ResumeHeader() {
	return (
		<div className="flex flex-col items-center justify-center mx-auto mb-8">

			<img
				className="h-64 w-64 rounded-full object-cover ring-4 ring-white shadow-lg"
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

			{/* 3. Contact & Location Details */}
			<div className="mt-4 flex flex-wrap justify-center space-x-4 sm:space-x-4 text-base text-gray-600">

				{/* Location */}
				<div className="flex items-center">
					<MapPin />
					<span className="font-medium ml-2">Toronto, Canada (Open to Remote)</span>
				</div>

				{/* Divider for separation on larger screens */}
				<span className="hidden sm:block text-gray-400">|</span>

				{/* Email */}
				<div className="flex items-center">
					<SendEmail email={email} showText />
				</div>

				{/* Divider for separation on larger screens */}
				<span className="hidden sm:block text-gray-400">|</span>

				{/* Dwonload Resume */}
				<div className="flex items-center">
					<DownloadResume />
				</div>
			</div>
		</div>
	)
}

function ResumeSummary() {
	return (
		<section id="summary" className="card">

			<h2 className="text-2xl font-bold mb-4">Professional Summary</h2>

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

function DownloadResume() {
	return (
		<a href={"/src/assets/Abilaesh Kandiah - Resume.pdf"} download
			className="flex items-center action-hover"
			title="Download my resume"
		>
			<Download />
			<span className="ml-2 font-medium">Download Resume</span>
		</a>
	)
}




import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

export function CardDemo() {
	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
				<CardAction>
					<Button variant="link">Sign Up</Button>
				</CardAction>
			</CardHeader>
			<CardContent>

			</CardContent>
			<CardFooter className="flex-col gap-2">
				<Button type="submit" className="w-full">
					Login
				</Button>
				<Button variant="outline" className="w-full">
					Login with Google
				</Button>
			</CardFooter>
		</Card>
	)
}


