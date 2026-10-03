// Used for project URLs, section anchors and sub-heading anchors (which get
// shared as copied links), so strip anything that isn't a letter or digit —
// "Properties & Units" becomes `properties-units`, not `properties-&-units`.
// Returns '' if there's nothing left; callers decide what that means.
//
// Shared by the app and the build-time content plugin, so it must stay free
// of imports — the plugin loads it outside Vite's alias resolution.
export function toUrl(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
}
