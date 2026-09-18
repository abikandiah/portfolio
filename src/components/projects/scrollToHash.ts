// A plain `href="#id"` click updates the URL hash, which TanStack Router's
// scrollRestoration tracks as its own per-history-entry scroll slot — and
// once that entry exists, hovering *any* router `<Link>` elsewhere on the
// page (defaultPreload: 'intent') can trigger the router to re-render and
// replay that saved position, snapping the page back to wherever the hash
// last pointed. `history.replaceState` doesn't dodge this either — the
// router picks up on it and starts tracking that entry too. The only
// reliable fix is to never touch the URL/history for this at all: just
// scroll the element into view and leave the hash (and the router) alone.
function scrollToHash(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
	if (
		event.button !== 0 ||
		event.metaKey ||
		event.ctrlKey ||
		event.shiftKey ||
		event.altKey
	) {
		return
	}

	event.preventDefault()
	document.getElementById(id)?.scrollIntoView()
}

export { scrollToHash }
