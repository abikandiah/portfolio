import { BriefcaseBusiness } from 'lucide-react'
import { Card } from '@abumble/design-system/components/Card'
import { CardH2Header } from '../ui/card'
import { ExpandableRow } from './ExpandableRow'
import bee from '@/assets/bee.svg'
import nuixLogo from '@/assets/nuix.png'
import rampivaLogo from '@/assets/rampiva-badge-logo.svg'

function WorkExperience() {
	return (
		<Card className="home-card">
			<CardH2Header title={'Experience'} Icon={BriefcaseBusiness} />

			{/* A career reads as a sequence: the logos sit on a rail. */}
			<ol className="home-timeline">
				<ExpandableRow
					title="Sabbatical"
					subtitle="Individual Contributor"
					duration="2025 – 2026"
					logoSrc={bee}
				/>

				<ExpandableRow
					title="Nuix"
					subtitle="Senior Software Engineer"
					duration="2023 – 2025"
					logoSrc={nuixLogo}
				/>

				<ExpandableRow
					title="Rampiva"
					subtitle="Software Developer"
					duration="2018 – 2023"
					logoSrc={rampivaLogo}
				/>
			</ol>
		</Card>
	)
}

export default WorkExperience
