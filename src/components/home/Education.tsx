import { Card } from '@abumble/design-system/components/Card'
import { cn } from '@abumble/design-system/utils'
import { ChevronDown, University } from 'lucide-react'
import { useState } from 'react'
import { CardH2Header } from '../ui/card'
import tmuLogo from '@/assets/tmu.svg'
import uoftLogo from '@/assets/uoft-logo.svg'

function Education() {
	return (
		<Card>
			<CardH2Header title={'Education'} Icon={University} />

			<ol className="space-y-2">
				<EducationRow
					school="University of Toronto"
					degree="MEng in Electrical & Computer Engineering"
					duration="2026 - Present"
					logoSrc={uoftLogo}
					current
					bullets={[
						'Placeholder — relevant coursework or focus area',
						'Placeholder — thesis or capstone project details',
					]}
				/>
				<EducationRow
					school="Toronto Metropolitan University"
					degree="BEng in Computer Engineering"
					duration="2014 - 2018"
					logoSrc={tmuLogo}
				/>
			</ol>
		</Card>
	)
}

interface EducationRowProps {
	school: string
	degree: string
	duration: string
	logoSrc: string
	current?: boolean
	bullets?: Array<string>
}

function EducationRow({
	school,
	degree,
	duration,
	logoSrc,
	current,
	bullets,
}: EducationRowProps) {
	const [expanded, setExpanded] = useState(false)
	const hasBullets = bullets != null && bullets.length > 0

	return (
		<li>
			<button
				type="button"
				disabled={!hasBullets}
				aria-expanded={hasBullets ? expanded : undefined}
				aria-label={`${school}, ${degree}, ${duration}`}
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
						alt={`${school} Logo`}
						loading="lazy"
						decoding="async"
						data-nimg="1"
					/>
				</div>

				<div className="flex flex-auto flex-wrap gap-x-2" aria-hidden="true">
					<span className="w-full flex-none text-sm font-medium leading-6 text-foreground">
						{school}
					</span>
					<span className="text-xs leading-5 text-muted-foreground">
						{degree}
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

export default Education
