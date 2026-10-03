import { Card } from '@abumble/design-system/components/Card'
import { University } from 'lucide-react'
import { CardH2Header } from '../ui/card'
import { ExpandableRow } from './ExpandableRow'
import tmuLogo from '@/assets/tmu-badge-logo.png'
import uoftLogo from '@/assets/uoft-badge-logo.svg'

function Education() {
	return (
		<Card className="home-card">
			<CardH2Header title={'Education'} Icon={University} />

			<ol>
				<ExpandableRow
					title="University of Toronto"
					subtitle="MEng in Electrical & Computer Engineering"
					duration="2026 – Present"
					logoSrc={uoftLogo}
					current
					defaultExpanded
					bullets={[
						'Returning to my computer engineering roots to pivot from full-stack development into embedded systems and hardware',
						'Coursework in FPGAs, computer architecture and distributed systems, systems programming in Rust, and a refresher in electrical fundamentals',
					]}
				/>
				<ExpandableRow
					title="Toronto Metropolitan University"
					subtitle="BEng in Computer Engineering"
					duration="2014 – 2018"
					logoSrc={tmuLogo}
				/>
			</ol>
		</Card>
	)
}

export default Education
