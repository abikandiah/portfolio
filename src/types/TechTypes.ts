import { colorWeights } from "@/constants";

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


// Type for the dynamic key: [BgColor, BgIndex, TextColor, TextIndex, BorderColor, BorderIndex]
type DynamicColorKey = [string, number, string, number, string, number];

// The structure is now: { [DynamicColorKey as string]: TTech[] }
// NOTE: JavaScript objects/maps only allow string/Symbol keys. In TypeScript, we
// represent the array as a unique string key (e.g., using JSON.stringify for lookup,
// but for definition clarity, we'll keep the array literal for now, knowing the actual
// object key must be converted to a string).

const techColorConfigMap: { [key: string]: TTech[] } = {
    // [BgColor, BgIndex, TextColor, TextIndex, BorderColor, BorderIndex]

    // --- BLUE Scheme (bg-blue-100, text-blue-800, border-blue-400) ---
    'blue,0,blue,1,blue,2': [
        techType.TypeScript,
        techType.TSX,
        techType.GoogleCloud,
        techType.RDBMS,
    ],

    // --- YELLOW/GRAY Scheme (WCAG Contrast on Yellow: bg-yellow-100, text-gray-900, border-yellow-400) ---
    // Here, index '3' is a placeholder for the special 900 weight, and 'gray' is the text color.
    'yellow,0,gray,3,yellow,2': [
        techType.JavaScript,
        techType.Python,
    ],

    // --- RED Scheme (bg-red-100, text-red-800, border-red-400) ---
    'red,0,red,1,red,2': [
        techType.Java,
        techType.Axios,
    ],

    // --- PURPLE Scheme ---
    'purple,0,purple,1,purple,2': [
        techType.CSharp,
        techType.ReactRedux,
        techType.JavaAnnotations,
        techType.JavaReflections,
    ],

    // --- CYAN Scheme ---
    'cyan,0,cyan,1,cyan,2': [
        techType.Go,
        techType.React,
    ],

    // --- PINK/ROSE/FUCHSIA Schemes ---
    'pink,0,pink,1,pink,2': [
        techType.Ruby,
    ],
    'rose,0,rose,1,rose,2': [
        techType.XPath,
    ],
    'fuchsia,0,fuchsia,1,fuchsia,2': [
        techType.SASS,
        techType.TusProtocol,
        techType.Concurrency,
    ],
    'violet,0,violet,1,violet,2': [
        techType.ReduxSagas,
        techType.OIDC,
        techType.SSOLinks,
    ],

    // --- SKY/LIGHT-BLUE Scheme ---
    'sky,0,sky,1,sky,2': [
        techType.CSS,
        techType.Docker,
        techType.AzureAD,
        techType.MicrosoftEDiscovery,
    ],

    // --- ORANGE Scheme ---
    'orange,0,orange,1,orange,2': [
        techType.HTML,
        techType.JSX,
        techType.Jenkins,
    ],

    // --- TEAL/GREEN/EMERALD Schemes ---
    'teal,0,teal,1,teal,2': [
        techType.TailwindCSS,
    ],
    'green,0,green,1,green,2': [
        techType.Node,
        techType.MongoDB,
    ],
    'emerald,0,emerald,1,emerald,2': [
        techType.RestAPI,
        techType.OpenSource,
    ],

    // --- INDIGO Scheme ---
    'indigo,0,indigo,1,indigo,2': [
        techType.ReactRouter,
        techType.TanstackRouter,
        techType.PostgreSQL,
    ],

    // --- AMBER Scheme ---
    'amber,0,amber,1,amber,2': [
        techType.AWS,
        techType.GoogleVault,
        techType.ThreadPools,
    ],

    // --- LIME Scheme ---
    'lime,0,lime,1,lime,2': [
        techType.WebWorkers,
        techType.Selenium,
    ],

    // --- GRAY Scheme (Includes Default) ---
    'gray,0,gray,1,gray,2': [
        techType.Dropwizard,
        techType.Express,
        techType.LDAP,
        techType.SMTP,
        techType.i18next,
    ],
};

function generateTechColorMap(sourceConfigMap: { [key: string]: TTech[] }): { [key: string]: string } {
    const finalMap: { [key: string]: string } = {};

    // Helper function to get the correct weight (handles the special 900 case)
    const getWeight = (index: number): number => {
        if (index === 3) {
            return 900; // Special case for text-gray-900
        }
        return colorWeights[index];
    };

    for (const configString in sourceConfigMap) {
        // Parse the string key back into the configuration array
        const parts = configString.split(',');
        const config: DynamicColorKey = [
            parts[0], parseInt(parts[1]),
            parts[2], parseInt(parts[3]),
            parts[4], parseInt(parts[5])
        ];

        const [
            bgColor, bgIndex,
            textColor, textIndex,
            borderColor, borderIndex
        ] = config;

        // Construct the dynamic class string
        const bgClass = `bg-${bgColor}-${getWeight(bgIndex)}`;
        const textClass = `text-${textColor}-${getWeight(textIndex)}`;
        const borderClass = `border-${borderColor}-${getWeight(borderIndex)}`;

        const colorString = `${bgClass} ${textClass} ${borderClass}`;

        // Map the generated string to all the associated tech keys
        const techKeys = sourceConfigMap[configString];
        for (const key of techKeys) {
            finalMap[key] = colorString;
        }
    }

    // Set the 'default' key using the dynamically generated string
    const defaultColorConfig = finalMap[techType.Dropwizard]; // Use any key mapped to the default gray scheme
    finalMap['default'] = defaultColorConfig;

    return finalMap;
}

// This is the map your application uses for lookups (O(1) efficiency)
const techColorMap = generateTechColorMap(techColorConfigMap);

export { techColorMap, techType };
export type { TTech };

