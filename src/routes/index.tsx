import { cn } from '@abumble/design-system/utils'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
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
			<LandscapeContainer
				className="-mx-3 -mt-14"
				style={{ height: '224px' }}
			/>
			<div className="center-page flex flex-col">
				<ProfileIntro />
				<MainContent />
			</div>
		</>
	)
}

function ProfileIntro() {
	return (
		<div className="flex flex-col gap-4 px-6 pb-8 pt-18 sm:pt-24">
			<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
				<FaceContextMenu src={profilePhoto} />

				<div className="flex flex-col">
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

				<SocialLinks className="flex items-center gap-4" />
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
			return
		}

		rafId.current = requestAnimationFrame(tick)
	}

	function ensureSpinning() {
		const animation = getSpinAnimation()
		if (animation == null) {
			return
		}

		if (animation.playState !== 'running') {
			animation.play()
			rafId.current = requestAnimationFrame(tick)
		}
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

	return (
		<img
			ref={imgRef}
			onPointerEnter={onPointerEnter}
			onPointerMove={onPointerMove}
			onPointerLeave={onPointerLeave}
			className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-background shadow-lg sm:h-24 sm:w-24 dark:invert"
			src={src}
			alt="Abilaesh Kandiah's Profile Photo"
		/>
	)
}

function LandscapeContainer({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return <div className={cn('image-background', className)} {...props}></div>
}
