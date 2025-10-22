
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
    AWS: 'AWS',
    Jenkins: 'Jenkins',
    Selenium: 'Selenium',
    XPath: 'XPath',
    i18next: 'i18next',
} as const;

type TTech = (typeof techType)[keyof typeof techType];


// This structure maps a single Tailwind color utility string to an array of technology keys.
const compressedTechColorMap: { [colorClasses: string]: TTech[] } = {
    // --- BLUE Scheme (bg-blue-100, text-blue-800, border-blue-400) ---
    'bg-blue-100 text-blue-800 border-blue-400': [
        techType.TypeScript,
        techType.TSX,
        techType.GoogleCloud,
        techType.RDBMS,
    ],

    // --- YELLOW/GRAY Scheme (WCAG Contrast on Yellow) ---
    'bg-yellow-100 text-gray-900 border-yellow-400': [
        techType.JavaScript,
        techType.Python,
    ],

    // --- RED Scheme (bg-red-100, text-red-800, border-red-400) ---
    'bg-red-100 text-red-800 border-red-400': [
        techType.Java,
        techType.Axios,
    ],

    // --- PURPLE Scheme (bg-purple-100, text-purple-800, border-purple-400) ---
    'bg-purple-100 text-purple-800 border-purple-400': [
        techType.CSharp,
        techType.ReactRedux,
        techType.JavaAnnotations,
        techType.JavaReflections,
    ],

    // --- CYAN Scheme (bg-cyan-100, text-cyan-800, border-cyan-400) ---
    'bg-cyan-100 text-cyan-800 border-cyan-400': [
        techType.Go,
        techType.React,
    ],

    // --- PINK/ROSE/FUCHSIA Schemes ---
    'bg-pink-100 text-pink-800 border-pink-400': [
        techType.Ruby,
    ],
    'bg-rose-100 text-rose-800 border-rose-400': [
        techType.XPath,
    ],
    'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-400': [
        techType.SASS,
        techType.TusProtocol,
        techType.Concurrency,
    ],
    'bg-violet-100 text-violet-800 border-violet-400': [
        techType.ReduxSagas,
        techType.OIDC,
        techType.SSOLinks,
    ],

    // --- SKY/LIGHT-BLUE Scheme (bg-sky-100, text-sky-800, border-sky-400) ---
    'bg-sky-100 text-sky-800 border-sky-400': [
        techType.CSS,
        techType.Docker,
        techType.AzureAD,
        techType.MicrosoftEDiscovery,
    ],

    // --- ORANGE Scheme (bg-orange-100, text-orange-800, border-orange-400) ---
    'bg-orange-100 text-orange-800 border-orange-400': [
        techType.HTML,
        techType.JSX,
        techType.Jenkins,
    ],

    // --- TEAL/GREEN/EMERALD Schemes ---
    'bg-teal-100 text-teal-800 border-teal-400': [
        techType.TailwindCSS,
    ],
    'bg-green-100 text-green-800 border-green-400': [
        techType.Node,
        techType.MongoDB,
    ],
    'bg-emerald-100 text-emerald-800 border-emerald-400': [
        techType.RestAPI,
        techType.OpenSource,
    ],

    // --- INDIGO Scheme (bg-indigo-100, text-indigo-800, border-indigo-400) ---
    'bg-indigo-100 text-indigo-800 border-indigo-400': [
        techType.ReactRouter,
        techType.TanstackRouter,
        techType.PostgreSQL,
    ],

    // --- AMBER Scheme (bg-amber-100, text-amber-800, border-amber-400) ---
    'bg-amber-100 text-amber-800 border-amber-400': [
        techType.AWS,
        techType.GoogleVault,
        techType.ThreadPools,
    ],

    // --- LIME Scheme (bg-lime-100, text-lime-800, border-lime-400) ---
    'bg-lime-100 text-lime-800 border-lime-400': [
        techType.WebWorkers,
        techType.Selenium,
    ],

    // --- GRAY Scheme (bg-gray-100, text-gray-800, border-gray-400) (Includes Default) ---
    'bg-gray-100 text-gray-800 border-gray-400': [
        techType.Dropwizard,
        techType.Express,
        techType.LDAP,
        techType.SMTP,
        techType.i18next,
        // NOTE: 'default' key is typically handled by a lookup function
        // but included here if TTechKey was expanded to include it.
    ],
};

function generateTechColorMap(sourceMap: { [colorClasses: string]: TTech[] }): { [key: string]: string } {
    const finalMap: { [key: string]: string } = {};
    for (const colorString in sourceMap) {
        const techKeys = sourceMap[colorString];
        for (const key of techKeys) {
            finalMap[key] = colorString;
        }
    }
    finalMap['default'] = 'bg-gray-100 text-gray-800 border-gray-400';
    return finalMap;
}

// This is the map your application uses for lookups (O(1) efficiency)
const techColorMap = generateTechColorMap(compressedTechColorMap);

export { techColorMap, techType };
export type { TTech };

