import { Card } from '@abumble/design-system/components/Card'
import { University } from 'lucide-react'
import { CardH2Header } from '../ui/card'
import { ExpandableRow } from './ExpandableRow'
import tmuLogo from '@/assets/tmu.svg'
import uoftLogo from '@/assets/uoft-logo.svg'

function Education() {
	return (
		<Card>
			<CardH2Header title={'Education'} Icon={University} />

			<ol className="space-y-2">
				<ExpandableRow
					title="University of Toronto"
					subtitle="MEng in Electrical & Computer Engineering"
					duration="2026 - Present"
					logoSrc={uoftLogo}
					current
					bullets={[
						'Placeholder — relevant coursework or focus area',
						'Placeholder — thesis or capstone project details',
					]}
				/>
				<ExpandableRow
					title="Toronto Metropolitan University"
					subtitle="BEng in Computer Engineering"
					duration="2014 - 2018"
					logoSrc={tmuLogo}
				/>
			</ol>
		</Card>
	)
}

export default Education
