import { BriefcaseBusiness, Download } from 'lucide-react'
import { Card } from '@abumble/design-system/components/Card'
import { Button } from '@abumble/design-system/components/Button'
import { CardH2Header } from '../ui/card'
import { ExpandableRow } from './ExpandableRow'
import AbiResume from '@/assets/Abilaesh Kandiah - Resume.pdf'
import bee from '@/assets/bee.svg'
import nuixLogo from '@/assets/nuix.png'
import rampivaLogo from '@/assets/rampiva.png'

function WorkExperience() {
	return (
		<Card>
			<CardH2Header title={'Experience'} Icon={BriefcaseBusiness} />

			<ol className="space-y-2">
				<ExpandableRow
					title="Sabbatical"
					subtitle="Individual Contributor"
					duration="2025 - Present"
					logoSrc={bee}
					current
					bullets={[
						'Placeholder — key project or focus area during this time',
						'Placeholder — a skill or technology explored in depth',
					]}
				/>

				<ExpandableRow
					title="Nuix"
					subtitle="Senior Software Engineer"
					duration="2023 - 2025"
					logoSrc={nuixLogo}
					bullets={[
						'Placeholder — a key project or initiative led',
						'Placeholder — measurable impact or outcome',
						'Placeholder — technology or process introduced',
					]}
				/>

				<ExpandableRow
					title="Rampiva"
					subtitle="Software Developer"
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
