import { BriefcaseBusiness } from 'lucide-react'
import { HomeSection } from './HomeSection'
import { ExpandableRow } from './ExpandableRow'
import bee from '@/assets/bee.svg'
import nuixLogo from '@/assets/nuix.png'
import rampivaLogo from '@/assets/rampiva-badge-logo.svg'

function WorkExperience() {
	return (
		<HomeSection title="Experience" Icon={BriefcaseBusiness}>
			{/* A career reads as a sequence: the logos sit on a rail. */}
			<ol className="home-timeline">
				<ExpandableRow
					title="Sabbatical"
					subtitle="Independent Study"
					duration="2025 – 2026"
					logoSrc={bee}
					bullets={[
						'A deliberate break to reset my career goals and get back to learning, building and exploring',
						'Sharpened my full-stack skills through side projects and studied AI development and system design',
					]}
				/>

				<ExpandableRow
					title="Nuix"
					subtitle="Senior Software Engineer"
					duration="2023 – 2025"
					logoSrc={nuixLogo}
					bullets={[
						"Joined through Nuix's 2023 acquisition of Rampiva; continued as full-stack lead",
						'Led the third-party services framework and the Google Vault and Microsoft eDiscovery collectors built on it',
						'Took on cross-team work, coordinating integrations and releases with 6+ teams',
					]}
				/>

				<ExpandableRow
					title="Rampiva"
					subtitle="Software Developer → Full-Stack Lead"
					duration="2018 – 2023"
					logoSrc={rampivaLogo}
					bullets={[
						'First hire at an eDiscovery workflow-automation startup; grew into the full-stack lead',
						"Led development of major features, such as the platform's web app, its E2E test suite and Legal Hold",
					]}
				/>
			</ol>
		</HomeSection>
	)
}

export default WorkExperience
