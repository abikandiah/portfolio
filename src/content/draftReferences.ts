interface ReferencingProject {
	slug: string
	draft: boolean
	/** Every project this one points at: `related` plus body links. */
	references: Array<string>
}

/**
 * Published pages must never point at a draft: drafts are left out of
 * production builds, so the link would 404 there while working fine in dev
 * and tests. Checked in every mode — unlike the drafts themselves, this
 * can't wait for a production build to show up.
 *
 * Returns one message per offending reference.
 */
function findDraftReferences(
	projects: Array<ReferencingProject>,
): Array<string> {
	const drafts = new Set(
		projects.filter((proj) => proj.draft).map((proj) => proj.slug),
	)

	return projects
		.filter((proj) => !proj.draft)
		.flatMap((proj) =>
			proj.references
				.filter((reference) => drafts.has(reference))
				.map(
					(reference) =>
						`${proj.slug}: points at "${reference}", which is still a draft (it won't exist in production)`,
				),
		)
}

export { findDraftReferences }
export type { ReferencingProject }
