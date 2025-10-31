import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/disclaimer')({
  component: RouteComponent,
})

function RouteComponent() {
  return Disclaimer;
}

function Disclaimer() {
  return (
    <>
			<h1 className="font-bold tracking-tight text-gray-900 sm:text-4xl text-3xl mt-6">
				Disclaimer
			</h1>

			<h2 className="mt-1 text-gray-700 sm:text-2xl text-xl">
				Full-Stack Developer
			</h2>
    </>
  )
}
