import { Button } from '@abumble/design-system/components/Button'
import { cn } from '@abumble/design-system/utils'
import { createFileRoute } from '@tanstack/react-router'
import { Download } from 'lucide-react'
import { useEffect, useRef } from 'react'
import AbiResume from '@/assets/Abilaesh Kandiah - Resume.pdf'
import profilePhoto from '@/assets/face.svg'
import Education from '@/components/home/Education'
import ProjectsOverview from '@/components/home/ProjectsOverview'
import WorkExperience from '@/components/home/WorkExperience'
import { SocialLinks } from '@/components/SocialLinks'
import { PageDescription, PageHeader } from '@/components/ui'

export const Route = createFileRoute('/')({
	component: App,
})

// One column, read top to bottom: who I am, then experience, education
// and projects, in the order a recruiter skims them.
function App() {
	return (
		<>
			{/* `!`: the design system's unlayered `.image-background` sets its
			    own height, which would otherwise beat these utilities. */}
			<LandscapeContainer className="-mx-3 -mt-14 h-44! sm:h-56!" />
			<div className="list-column flex flex-col">
				<ProfileIntro />
				<WorkExperience />
				<Education />
				<ProjectsOverview />
			</div>
		</>
	)
}

function ProfileIntro() {
	return (
		<div className="flex flex-col gap-4 px-6 pb-8 pt-2 sm:pt-4">
			<div className="flex flex-col items-center gap-2 text-center">
				<FaceContextMenu src={profilePhoto} />

				<div className="flex flex-col items-center">
					<PageHeader>Abilaesh Kandiah</PageHeader>

					<PageDescription className="mt-1">
						Full-Stack Developer
					</PageDescription>
				</div>
			</div>

			<section className="flex flex-col gap-4">
				<p className="p-text">
					Hey, I'm Abi, a seasoned full-stack developer with over 7 years of
					experience dedicated to bringing ideas to life. I architect and
					deliver complete, robust solutions—from database design to launching
					polished UIs. Leveraging React, JavaScript, Java, Node, and Python
					alongside modern CI/CD and cloud platforms (AWS/Azure/GCP), I manage
					the full operational loop to build it right.
				</p>

				<div className="flex flex-wrap items-center justify-between gap-4">
					<SocialLinks className="flex items-center gap-4" />
					<DownloadResume />
				</div>
			</section>
		</div>
	)
}

function DownloadResume() {
	return (
		<Button
			asChild
			variant="outline"
			className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
		>
			<a href={AbiResume} download className="flex items-center gap-2">
				<span className="font-medium">Download CV</span>
				<Download />
			</a>
		</Button>
	)
}

// A wind-up toy: hovering gives a slow passive spin, and moving the mouse
// quickly across it "spends energy" to wind it up further. The energy decays
// gradually (coasts to a stop) once you stop moving or leave.
const SPIN_CYCLE_MS = 12000
const SPIN_IDLE_RATE = 0.3
const SPIN_MAX_RATE = 14
const SPIN_EASE = 0.08
const ENERGY_MAX = 14
const ENERGY_DECAY = 0.985
const ENERGY_PER_PIXEL_MOVED = 0.03
const ENERGY_STOP_THRESHOLD = 0.05

function FaceContextMenu({ src }: { src: string }) {
	const imgRef = useRef<HTMLImageElement>(null)
	const spinAnimation = useRef<Animation | null>(null)
	const rafId = useRef<number>(0)
	const looping = useRef(false)

	const isHovering = useRef(false)
	const lastPointer = useRef<{ x: number; y: number } | null>(null)
	const energy = useRef(0)

	function getSpinAnimation(): Animation | null {
		if (spinAnimation.current != null) {
			return spinAnimation.current
		}

		const img = imgRef.current
		if (img == null) {
			return null
		}

		spinAnimation.current = img.animate(
			[{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
			{ duration: SPIN_CYCLE_MS, iterations: Infinity },
		)
		spinAnimation.current.playbackRate = SPIN_IDLE_RATE
		spinAnimation.current.pause()
		return spinAnimation.current
	}

	function tick() {
		const animation = spinAnimation.current
		if (animation == null) {
			return
		}

		energy.current *= ENERGY_DECAY

		const target = Math.min(
			(isHovering.current ? SPIN_IDLE_RATE : 0) + energy.current,
			SPIN_MAX_RATE,
		)
		animation.playbackRate += (target - animation.playbackRate) * SPIN_EASE

		const settled =
			!isHovering.current &&
			energy.current < ENERGY_STOP_THRESHOLD &&
			Math.abs(animation.playbackRate) < ENERGY_STOP_THRESHOLD

		if (settled) {
			animation.pause()
			looping.current = false
			return
		}

		rafId.current = requestAnimationFrame(tick)
	}

	function ensureSpinning() {
		const animation = getSpinAnimation()
		if (animation == null) {
			return
		}

		animation.play()

		// Tracked separately from `playState`, since `.play()` can leave it
		// `pending` rather than `running` (e.g. a backgrounded tab) — relying
		// on `playState` here let a second pointerenter start a duplicate
		// rAF chain against the same animation.
		if (looping.current) {
			return
		}

		looping.current = true
		rafId.current = requestAnimationFrame(tick)
	}

	function onPointerEnter() {
		isHovering.current = true
		lastPointer.current = null
		ensureSpinning()
	}

	function onPointerMove(event: React.PointerEvent<HTMLImageElement>) {
		const last = lastPointer.current

		if (last != null) {
			const distance = Math.hypot(
				event.clientX - last.x,
				event.clientY - last.y,
			)
			energy.current = Math.min(
				energy.current + distance * ENERGY_PER_PIXEL_MOVED,
				ENERGY_MAX,
			)
		}

		lastPointer.current = { x: event.clientX, y: event.clientY }
	}

	function onPointerLeave() {
		isHovering.current = false
		lastPointer.current = null
	}

	useEffect(() => {
		return () => {
			cancelAnimationFrame(rafId.current)
			spinAnimation.current?.cancel()
		}
	}, [])

	// The SVG is a line drawing, so the banner shows through it where they
	// overlap. A disc in the page background fills just the face (r=10 of the
	// 24-unit viewBox, so inset 2/24), leaving the margin around it clear. It
	// sits outside the img so `dark:invert` doesn't flip its colour.
	return (
		<div className="relative -mt-8 shrink-0 sm:-mt-10">
			<span className="absolute inset-[9%] rounded-full bg-background" />
			<img
				ref={imgRef}
				onPointerEnter={onPointerEnter}
				onPointerMove={onPointerMove}
				onPointerLeave={onPointerLeave}
				className="relative h-28 w-28 rounded-full object-cover ring-4 ring-background shadow-lg sm:h-40 sm:w-40 dark:invert"
				src={src}
				alt="Abilaesh Kandiah's Profile Photo"
			/>
		</div>
	)
}

function LandscapeContainer({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return <div className={cn('image-background', className)} {...props}></div>
}
