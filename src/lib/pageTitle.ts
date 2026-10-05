const SITE_NAME = 'Abi Kandiah'

// The browser tab title for a page: its own name first, so tabs, history
// and bookmarks tell pages apart, then the site's. Pages without a name
// (home) get just the site's.
function pageTitle(page?: string): string {
	return page == null ? SITE_NAME : `${page} · ${SITE_NAME}`
}

export { pageTitle }
