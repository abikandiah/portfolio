import { DownloadLink, SendEmail } from '@/components/misc'
import { email } from '@/constants'
import { createFileRoute } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	return (
		<>
			<div className="flex flex-col space-y-2">
				<ResumeHeader />
				<ResumeSummary />

				<CardDemo />
			</div>
		</>
	)
}

function ResumeHeader() {
	return (
		<div className="flex flex-col items-center justify-center mx-auto p-4 mb-4">

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
					<DownloadLink url={"/src/assets/Abilaesh Kandiah - Resume.pdf"} text={"Download Resume"} />
				</div>
			</div>
		</div>
	)
}

function ResumeSummary() {
	return (
		<section
			id="summary"
			className="p-6 rounded-md bg-card border-stone-200 border"
		>
			{/* Section Title
			<h2 className="text-2xl font-bold text-white border-b border-gray-600 pb-2 mb-4">
				Professional Profile
			</h2> */}

			{/* Summary Content */}
			<p className="leading-relaxed text-base">
				Highly accomplished and results-driven <span className="font-semibold">Senior Full-Stack Developer</span> with
				<span className="font-semibold"> 8+ years of experience</span> specializing in building resilient, high-traffic platforms using
				<span className="font-semibold"> React, Node.js, and AWS</span>. Proven success in
				<span className="font-semibold"> accelerating feature delivery by 40%</span> through strategic adoption of CI/CD pipelines and optimized cloud architecture. Consistently deliver
				<span className="font-semibold"> measurable business impact</span>, including a 15% reduction in infrastructure latency. Seeking a Lead Architect position to scale engineering excellence.
			</p>

			{/* Optional: Key Skills / Callouts */}
			<div className="mt-4 flex flex-wrap gap-2 text-sm">
				<span className="px-3 py-1 bg rounded-md font-medium border border-stone-200">AWS Certified</span>
				<span className="px-3 py-1 bg rounded-md font-medium border border-stone-200">AWS Certified</span>
				<span className="px-3 py-1 bg rounded-md font-medium border border-stone-200">AWS Certified</span>
			</div>
		</section>
	);
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


