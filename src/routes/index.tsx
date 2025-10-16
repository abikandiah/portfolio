import { SendEmail } from '@/components/misc'
import { email } from '@/constants'
import { createFileRoute } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	return (
		<>
			<ResumeHeader/>
		</>
	)
}

function ResumeHeader() {
	return (
		<div className="flex flex-col items-center justify-center max-w-4xl mx-auto p-4 border-b border-gray-200">

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
				<div className="flex items-center mt-2 sm:mt-0">
					<SendEmail email={email} showText />
				</div>
			</div>
		</div>
	)
}

