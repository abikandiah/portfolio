
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
    JavaReflections: 'Java Reflections',
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
    Docker: 'Docker',
    AWS: 'AWS'
} as const;

type TTech = (typeof techType)[keyof typeof techType];

const techColorMap: { [key: string]: string } = {
    // --- Languages (Standardized bg-100, text-800, border-400) ---
    [techType.TypeScript]: 'bg-blue-100 text-blue-800 border-blue-400',
    [techType.JavaScript]: 'bg-yellow-100 text-gray-900 border-yellow-400', // Uses gray-900 for WCAG contrast on yellow
    [techType.Java]: 'bg-red-100 text-red-800 border-red-400',
    [techType.Python]: 'bg-yellow-100 text-gray-900 border-yellow-400', // Aligned with JS for color safety on light yellow
    [techType.CSharp]: 'bg-purple-100 text-purple-800 border-purple-400',
    [techType.Go]: 'bg-cyan-100 text-cyan-800 border-cyan-400',
    [techType.Ruby]: 'bg-pink-100 text-pink-800 border-pink-400',

    // --- Markup & Styling ---
    [techType.CSS]: 'bg-sky-100 text-sky-800 border-sky-400',
    [techType.HTML]: 'bg-orange-100 text-orange-800 border-orange-400',
    [techType.SASS]: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-400',
    [techType.TailwindCSS]: 'bg-teal-100 text-teal-800 border-teal-400',

    // --- Frameworks & Libraries ---
    [techType.React]: 'bg-cyan-100 text-cyan-800 border-cyan-400',
    [techType.JSX]: 'bg-orange-100 text-orange-800 border-orange-400',
    [techType.TSX]: 'bg-blue-100 text-blue-800 border-blue-400',
    [techType.ReactRedux]: 'bg-purple-100 text-purple-800 border-purple-400',
    [techType.ReduxSagas]: 'bg-violet-100 text-violet-800 border-violet-400',
    [techType.Axios]: 'bg-red-100 text-red-800 border-red-400',
    [techType.Dropwizard]: 'bg-gray-100 text-gray-800 border-gray-400',
    [techType.Node]: 'bg-green-100 text-green-800 border-green-400',
    [techType.Express]: 'bg-gray-100 text-gray-800 border-gray-400',

    // --- Routing & Navigation ---
    [techType.ReactRouter]: 'bg-indigo-100 text-indigo-800 border-indigo-400',
    [techType.TanstackRouter]: 'bg-indigo-100 text-indigo-800 border-indigo-400',

    // --- Infrastructure & Cloud ---
    [techType.MongoDB]: 'bg-green-100 text-green-800 border-green-400',
    [techType.PostgreSQL]: 'bg-indigo-100 text-indigo-800 border-indigo-400',
    [techType.Docker]: 'bg-sky-100 text-sky-800 border-sky-400',
    [techType.AWS]: 'bg-amber-100 text-amber-800 border-amber-400',
    [techType.GoogleCloud]: 'bg-blue-100 text-blue-800 border-blue-400',

    // --- Auth, Protocols, & Concepts ---
    [techType.AzureAD]: 'bg-sky-100 text-sky-800 border-sky-400',
    [techType.MicrosoftEDiscovery]: 'bg-sky-100 text-sky-800 border-sky-400',
    [techType.GoogleVault]: 'bg-amber-100 text-amber-800 border-amber-400',

    [techType.OIDC]: 'bg-violet-100 text-violet-800 border-violet-400',
    [techType.SSOLinks]: 'bg-violet-100 text-violet-800 border-violet-400',
    [techType.LDAP]: 'bg-gray-100 text-gray-800 border-gray-400',
    [techType.SMTP]: 'bg-gray-100 text-gray-800 border-gray-400',
    [techType.TusProtocol]: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-400',
    [techType.RestAPI]: 'bg-emerald-100 text-emerald-800 border-emerald-400',
    [techType.RDBMS]: 'bg-blue-100 text-blue-800 border-blue-400',

    // --- Internal/Performance Concepts ---
    [techType.JavaAnnotations]: 'bg-purple-100 text-purple-800 border-purple-400',
    [techType.JavaReflections]: 'bg-purple-100 text-purple-800 border-purple-400',
    [techType.ThreadPools]: 'bg-amber-100 text-amber-800 border-amber-400',
    [techType.Concurrency]: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-400',
    [techType.WebWorkers]: 'bg-lime-100 text-lime-800 border-lime-400',
    [techType.OpenSource]: 'bg-emerald-100 text-emerald-800 border-emerald-400',

    // --- Default ---
    default: 'bg-gray-100 text-gray-800 border-gray-400',
};

export { techColorMap, techType };
export type { TTech };

