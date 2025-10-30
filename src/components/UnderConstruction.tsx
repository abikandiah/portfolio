
function UnderConstruction() {
    // const [darkMode, setDarkMode] = useState(true);

    // // Optional: sync with system preference on first load
    // useEffect(() => {
    //     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    //     setDarkMode(prefersDark);
    // }, []);

    return (
        <div
            // className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-500 ${darkMode
            //     ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
            //     : "bg-gradient-to-b from-yellow-50 to-white text-gray-900"
            //     } text-center p-6`}
            className="flex flex-col items-center justify-center text-gray-900"
        >
            {/* Gear Icon Animation */}
            <div className="mb-6">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className={`w-20 h-20 text-gray-700 animate-spin-slow`}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894a1.125 1.125 0 001.065.906l.933.066c.55.04.986.46 1.042 1.01l.07.916c.04.55.482.988 1.032 1.037l.923.08a1.125 1.125 0 01.987 1.092v1.093c0 .55-.398 1.02-.94 1.11l-.894.149a1.125 1.125 0 00-.906 1.065l-.066.933a1.125 1.125 0 01-1.01 1.042l-.916.07a1.125 1.125 0 00-1.037 1.032l-.08.923a1.125 1.125 0 01-1.092.987h-1.093a1.125 1.125 0 01-1.11-.94l-.149-.894a1.125 1.125 0 00-1.065-.906l-.933-.066a1.125 1.125 0 01-1.042-1.01l-.07-.916a1.125 1.125 0 00-1.032-1.037l-.923-.08a1.125 1.125 0 01-.987-1.092v-1.093c0-.55.398-1.02.94-1.11l.894-.149a1.125 1.125 0 00.906-1.065l.066-.933a1.125 1.125 0 011.01-1.042l.916-.07a1.125 1.125 0 001.037-1.032l.08-.923z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-3">Under Construction</h1>

            {/* Description */}
            <p
                className={`max-w-md mb-8 text-gray-600`}
            >
                Will be back soon!
            </p>

        </div>
    );
}

export default UnderConstruction;
