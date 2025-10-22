import { cn } from "@/lib/utils";

/**
 * A basic code display component styled with Tailwind CSS.
 * It uses the native <pre> and <code> tags for formatting.
 * @param {string} code The actual code string to display.
 * @param {string} language The language of the code (e.g., 'javascript', 'css').
 * @param {string} title A descriptive title for the code block.
 */
interface Props {
    code?: string;
    language?: string;
    title?: string;
}

function CodeDisplay({ code, language, title, className, children, ...props }: Props & React.ComponentProps<"div">) {
    return (
        <div
            className={cn("bg-background rounded border-container text-sm overflow-hidden my-4", className)}
            {...props}
        >

            {/* Header Bar */}
            {(title || language) &&
                <div className="flex justify-between items-center border-b border-stone-300/80 px-4 py-2">
                    <span className="text-sm font-medium">{title}</span>
                    <span className="text-sm">
                        {language}
                    </span>
                </div>
            }

            {/* Code Content Area */}
            <div className="p-4 overflow-auto max-h-256">
                <pre className="m-0 p-0 whitespace-pre-wrap">
                    <code>
                        {code || children}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export { CodeDisplay };

