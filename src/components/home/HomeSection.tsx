import { SectionLabel } from '../ui/section-label'

interface HomeSectionProps {
	title: string
	Icon: React.ElementType
	children: React.ReactNode
}

// One home-page section: a rule above, then its label and rows. Plain
// rather than carded, to match the write-ups' reading column.
function HomeSection({ title, Icon, children }: HomeSectionProps) {
	return (
		<section className="flex flex-col gap-3 border-t px-3 py-8 sm:px-6">
			<SectionLabel title={title} Icon={Icon} />
			{children}
		</section>
	)
}

export { HomeSection }
