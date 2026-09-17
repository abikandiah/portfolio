import type { CaseStudy, CaseStudyMedia } from '@/types/ProjectTypes'

function CaseStudyBody({ caseStudy }: { caseStudy: CaseStudy }) {
	const { summary, problem, approach, outcome, metrics, media } = caseStudy

	return (
		<div className="flex flex-col gap-6 p-3 p-text">
			<p>{summary}</p>

			{metrics != null && metrics.length > 0 && (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
					{metrics.map((metric, index) => (
						<div
							key={`${index}-${metric.label}`}
							className="rounded-lg border p-3 text-center"
						>
							<div className="text-lg font-semibold text-foreground">
								{metric.value}
							</div>
							<div className="text-xs text-muted-foreground">
								{metric.label}
							</div>
						</div>
					))}
				</div>
			)}

			<CaseStudySection title="Problem" body={problem} />
			<CaseStudySection title="Approach" body={approach} />
			<CaseStudySection title="Outcome" body={outcome} />

			{media != null && media.length > 0 && (
				<div className="grid gap-4 sm:grid-cols-2">
					{media.map((item, index) => (
						<CaseStudyMediaItem key={index} item={item} />
					))}
				</div>
			)}
		</div>
	)
}

function CaseStudySection({ title, body }: { title: string; body: string }) {
	return (
		<section className="space-y-2">
			<h2 className="font-semibold text-lg text-foreground">{title}</h2>
			<p>{body}</p>
		</section>
	)
}

function CaseStudyMediaItem({ item }: { item: CaseStudyMedia }) {
	return (
		<figure className="overflow-hidden rounded-lg border">
			{item.type === 'video' ? (
				<video src={item.src} controls className="w-full" />
			) : (
				<img
					src={item.src}
					alt={item.caption ?? ''}
					className="w-full object-cover"
				/>
			)}

			{item.caption != null && (
				<figcaption className="p-2 text-xs text-muted-foreground">
					{item.caption}
				</figcaption>
			)}
		</figure>
	)
}

export { CaseStudyBody }
