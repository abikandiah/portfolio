import CraneLift from "@/assets/construction/crane-lift.svg";
import { cn } from "@/lib/utils";


function UnderConstruction() {
    // const [darkMode, setDarkMode] = useState(true);

    // // Optional: sync with system preference on first load
    // useEffect(() => {
    //     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    //     setDarkMode(prefersDark);
    // }, []);

    return (
        <div className="flex flex-col items-center justify-center text-gray-900">

            <div className="mb-6">

                <div className="flex animate-slide-right-return">
                    <ConstructionImage
                        className="animate-rumble"
                        src={CraneLift}
                        alt="Construction Crane Lift"
                    />
                </div>
            </div>

            <h1 className="text-4xl font-bold mb-3">
                Under Construction
            </h1>

            <p className={`max-w-md mb-8 text-gray-700 sm:text-2xl text-xl`}>
                Will be back soon!
            </p>

        </div>
    );
}

function ConstructionImage({ className, ...props }: React.ComponentProps<"img">) {
    return (
        <img
            className={cn(`sm:h-64 sm:w-64 h-32 w-32`, className)}
            {...props}
        />
    )
}

export default UnderConstruction;
