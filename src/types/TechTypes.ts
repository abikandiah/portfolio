const techType = {
	TypeScript: 'TypeScript',
	JavaScript: 'JavaScript',
	Java: 'Java',
	Ruby: 'Ruby',
	Python: 'Python',
	CSharp: 'C#',
	Go: 'Go',
	CSS: 'CSS',
	HTML: 'HTML',
	SASS: 'SASS / CSS',
	JSX: 'JSX / HTML',
	TSX: 'TSX / HTML',
	React: 'React',
	ReactRedux: 'React-Redux',
	ReduxSagas: 'Redux-Sagas',
	Axios: 'Axios',
	ReactRouter: 'React Router',
	TanstackRouter: 'Tanstack Router',
	TailwindCSS: 'Tailwind CSS',
	Dropwizard: 'Dropwizard',
	OIDC: 'OIDC Authentication',
	RestAPI: 'REST API',
	GoogleCloud: 'Google Cloud',
	GoogleVault: 'Google Vault',
	AzureAD: 'Azure AD',
	MicrosoftEDiscovery: 'Microsoft eDiscovery',
	JavaAnnotations: 'Java Annotations',
	JavaReflection: 'Java Reflection',
	OpenSource: 'Open Source',
	TusProtocol: 'TUS Upload Protocol',
	RDBMS: 'RDBMS SQL',
	ThreadPools: 'Thread Pools',
	Concurrency: 'Concurrency and Synchronization',
	WebWorkers: 'Web Workers',
	SSOLinks: 'SSO Links',
	SMTP: 'SMTP',
	LDAP: 'LDAP',
	Node: 'Node',
	Express: 'Express',
	MongoDB: 'MongoDb',
	PostgreSQL: 'PostgreSQL',
	SQLite: 'SQLite',
	Docker: 'Docker',
	AWS: 'AWS',
	Jenkins: 'Jenkins',
	Selenium: 'Selenium',
	XPath: 'XPath',
	i18next: 'i18next',
	Fiddler: 'Fiddler',
	Vite: 'Vite',
	SpringBoot: 'Spring Boot',
	TanstackQuery: 'Tanstack Query',
	Liquibase: 'Liquibase',
	JWT: 'JWT',
	Caddy: 'Caddy',
	Logto: 'Logto',
	C: 'C',
	WebAssembly: 'WebAssembly',
	Emscripten: 'Emscripten',
} as const

type TTech = (typeof techType)[keyof typeof techType]

/**
 * Tech badges are grouped into a small set of theme-aware color families
 * (see `.tech-badge-*` in styles.css, which carry the actual light/dark
 * values) rather than raw hex/Tailwind palette classes. Kept to 9 hues so
 * badges stay visually distinguishable at a glance. Every tech gets a
 * color — no neutral/uncolored bucket, since a mix of colored and
 * "blank" badges reads as inconsistent rather than intentional. Grouping
 * leans on real brand colors where one exists (HTML orange, Sass pink,
 * WebAssembly indigo, etc.) and otherwise groups by ecosystem (e.g. LDAP
 * and SMTP alongside the other auth/protocol tech in purple).
 *
 * Typed as `Record<TTech, string>` so adding a new techType entry without
 * giving it a color is a compile error, not a silent fallback to neutral.
 */
const techFamilyMap: Record<TTech, string> = {
	// blue
	[techType.TypeScript]: 'tech-badge-blue',
	[techType.TSX]: 'tech-badge-blue',
	[techType.GoogleCloud]: 'tech-badge-blue',
	[techType.RDBMS]: 'tech-badge-blue',
	[techType.Liquibase]: 'tech-badge-blue',

	// yellow
	[techType.JavaScript]: 'tech-badge-yellow',
	[techType.JSX]: 'tech-badge-yellow',
	[techType.Python]: 'tech-badge-yellow',
	[techType.i18next]: 'tech-badge-yellow',

	// red
	[techType.Java]: 'tech-badge-red',
	[techType.Axios]: 'tech-badge-red',
	[techType.SpringBoot]: 'tech-badge-red',
	[techType.Dropwizard]: 'tech-badge-red',

	// purple
	[techType.CSharp]: 'tech-badge-purple',
	[techType.ReactRedux]: 'tech-badge-purple',
	[techType.JavaAnnotations]: 'tech-badge-purple',
	[techType.JavaReflection]: 'tech-badge-purple',
	[techType.ReduxSagas]: 'tech-badge-purple',
	[techType.OIDC]: 'tech-badge-purple',
	[techType.SSOLinks]: 'tech-badge-purple',
	[techType.JWT]: 'tech-badge-purple',
	[techType.Logto]: 'tech-badge-purple',
	[techType.LDAP]: 'tech-badge-purple',
	[techType.SMTP]: 'tech-badge-purple',

	// cyan
	[techType.Go]: 'tech-badge-cyan',
	[techType.React]: 'tech-badge-cyan',
	[techType.TailwindCSS]: 'tech-badge-cyan',
	[techType.CSS]: 'tech-badge-cyan',
	[techType.Docker]: 'tech-badge-cyan',
	[techType.AzureAD]: 'tech-badge-cyan',
	[techType.MicrosoftEDiscovery]: 'tech-badge-cyan',
	[techType.Caddy]: 'tech-badge-cyan',

	// pink
	[techType.Ruby]: 'tech-badge-pink',
	[techType.SASS]: 'tech-badge-pink',
	[techType.XPath]: 'tech-badge-pink',
	[techType.TusProtocol]: 'tech-badge-pink',
	[techType.Concurrency]: 'tech-badge-pink',

	// orange
	[techType.HTML]: 'tech-badge-orange',
	[techType.Jenkins]: 'tech-badge-orange',
	[techType.AWS]: 'tech-badge-orange',
	[techType.GoogleVault]: 'tech-badge-orange',
	[techType.ThreadPools]: 'tech-badge-orange',

	// green
	[techType.Node]: 'tech-badge-green',
	[techType.Express]: 'tech-badge-green',
	[techType.MongoDB]: 'tech-badge-green',
	[techType.Fiddler]: 'tech-badge-green',
	[techType.RestAPI]: 'tech-badge-green',
	[techType.OpenSource]: 'tech-badge-green',
	[techType.WebWorkers]: 'tech-badge-green',
	[techType.Selenium]: 'tech-badge-green',
	[techType.SQLite]: 'tech-badge-green',

	// indigo
	[techType.ReactRouter]: 'tech-badge-indigo',
	[techType.TanstackRouter]: 'tech-badge-indigo',
	[techType.TanstackQuery]: 'tech-badge-indigo',
	[techType.PostgreSQL]: 'tech-badge-indigo',
	[techType.Vite]: 'tech-badge-indigo',
	[techType.C]: 'tech-badge-indigo',
	[techType.Emscripten]: 'tech-badge-indigo',
	[techType.WebAssembly]: 'tech-badge-indigo',
}

// techFamilyMap above is exhaustive over TTech (compiler-enforced). This
// widened copy adds a 'default' fallback for callers that accept a plain
// string rather than a TTech (e.g. TechBadge's `value` prop) — it should
// never actually be hit in normal use.
const techColorMap: { [key: string]: string } = {
	...techFamilyMap,
	default: 'tech-badge-neutral',
}

export { techColorMap, techType }
export type { TTech }
