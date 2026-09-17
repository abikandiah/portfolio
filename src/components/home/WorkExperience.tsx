import { BriefcaseBusiness, ChevronDown, Download } from 'lucide-react'
import { Card } from '@abumble/design-system/components/Card'
import { Button } from '@abumble/design-system/components/Button'
import { cn } from '@abumble/design-system/utils'
import { useState } from 'react'
import { CardH2Header } from '../ui/card'
import AbiResume from '@/assets/Abilaesh Kandiah - Resume.pdf'
import bee from '@/assets/bee.svg'
import nuixLogo from '@/assets/nuix.png'
import rampivaLogo from '@/assets/rampiva.png'

function WorkExperience() {
	return (
		<Card>
			<CardH2Header title={'Experience'} Icon={BriefcaseBusiness} />

			<ol className="space-y-2">
				<WorkExperienceRow
					companyName="Sabbatical"
					role="Individual Contributor"
					duration="2025 - Present"
					logoSrc={bee}
					current
					bullets={[
						'Placeholder — key project or focus area during this time',
						'Placeholder — a skill or technology explored in depth',
					]}
				/>

				<WorkExperienceRow
					companyName="Nuix"
					role="Senior Software Engineer"
					duration="2023 - 2025"
					logoSrc={nuixLogo}
					bullets={[
						'Placeholder — a key project or initiative led',
						'Placeholder — measurable impact or outcome',
						'Placeholder — technology or process introduced',
					]}
				/>

				<WorkExperienceRow
					companyName="Rampiva"
					role="Software Developer"
					duration="2018 - 2023"
					logoSrc={rampivaLogo}
					bullets={[
						'Placeholder — a key project or initiative led',
						'Placeholder — measurable impact or outcome',
					]}
				/>
			</ol>

			<DownloadResume />
		</Card>
	)
}

interface WorkExperienceRowProps {
	companyName: string
	role: string
	duration: string
	logoSrc: string
	current?: boolean
	bullets?: Array<string>
}

function WorkExperienceRow({
	companyName,
	role,
	duration,
	logoSrc,
	current,
	bullets,
}: WorkExperienceRowProps) {
	const [expanded, setExpanded] = useState(false)
	const hasBullets = bullets != null && bullets.length > 0

	return (
		<li>
			<button
				type="button"
				disabled={!hasBullets}
				aria-expanded={hasBullets ? expanded : undefined}
				aria-label={`${companyName}, ${role}, ${duration}`}
				onClick={() => setExpanded((value) => !value)}
				className="flex w-full items-start gap-4 rounded-lg p-3 -mx-3 text-left transition-all hover:-translate-y-0.5 hover:bg-foreground/4 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring"
			>
				<div
					className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full
                shadow-md ring-1 shadow-stone-800/5 ring-stone-900/5"
				>
					<img
						className="h-7 w-7"
						src={logoSrc}
						alt={`${companyName} Logo`}
						loading="lazy"
						decoding="async"
						data-nimg="1"
					/>
				</div>

				<div className="flex flex-auto flex-wrap gap-x-2" aria-hidden="true">
					<span className="w-full flex-none text-sm font-medium leading-6 text-foreground">
						{companyName}
					</span>
					<span className="text-xs leading-5 text-muted-foreground">
						{role}
					</span>
					<span
						className={cn(
							'ml-auto text-xs leading-5',
							current
								? 'font-medium text-foreground'
								: 'text-muted-foreground',
						)}
					>
						{duration}
					</span>
				</div>

				{hasBullets && (
					<ChevronDown
						className={cn(
							'mt-1.5 h-4 w-4 flex-none text-muted-foreground transition-transform',
							expanded && 'rotate-180',
						)}
					/>
				)}
			</button>

			{hasBullets && expanded && (
				<ul className="ml-14 mt-1 mb-2 list-disc space-y-1 pl-4">
					{bullets.map((bullet, index) => (
						<li key={index} className="text-xs leading-5 text-muted-foreground">
							{bullet}
						</li>
					))}
				</ul>
			)}
		</li>
	)
}

function DownloadResume() {
	return (
		<Button asChild className="">
			<a href={AbiResume} download className="flex items-center gap-2">
				<span className="font-medium">Download CV</span>
				<Download />
			</a>
		</Button>
	)
}

export default WorkExperience
