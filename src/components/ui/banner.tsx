import { colorWeights } from "@/constants";
import { cn } from "@/lib/utils";
import { CircleX, Info, Lightbulb, TriangleAlert } from "lucide-react";

const bannerType = {
    Info: 'info',
    Note: 'note',
    Warning: 'warning',
    Alert: 'alert'
} as const;

type TBannerType = (typeof bannerType)[keyof typeof bannerType];

const icons: Record<TBannerType, React.ComponentType> = {
    [bannerType.Info]: Info,
    [bannerType.Note]: Lightbulb,
    [bannerType.Warning]: TriangleAlert,
    [bannerType.Alert]: CircleX
};

const styleColor: Record<TBannerType, string> = {
    [bannerType.Info]: 'blue',
    [bannerType.Note]: 'green',
    [bannerType.Warning]: 'yellow',
    [bannerType.Alert]: 'red',
};

/**
 * Generic Banner Component for Info, Warnings, Notes, and Alerts.
 *
 * @param {('info'|'warning'|'note'|'alert')} type - The type of message.
 * @param {string} title - The message title.
 * @param {string} message - The message content.
 * 
 */
interface BannerProps {
    type: TBannerType;
    title: string;
    message: string;
}

function Banner({ type = bannerType.Note, title, message, className, ...props }: BannerProps & React.ComponentProps<"div">) {
    const Icon = icons[type] || icons.note;
    const color = styleColor[type] || styleColor.note;

    const containerClass = `bg-${color}-${colorWeights[0]} text-${color}-${colorWeights[1]} border-${color}-${colorWeights[2]}`;
    const iconClass = `text-${color}-${colorWeights[1]}`;
    const titleClass = `text-${color}-${colorWeights[1]}`;

    return (
        <div
            className={cn(`p-3 border-l-4 rounded`, containerClass, className)}
            role="alert"
            {...props}
        >
            <div className="flex items-start">
                <div className={`flex-shrink-0 mr-3 ${iconClass}`}>
                    <Icon />
                </div>
                <div>
                    {/* Title is optional but recommended */}
                    {title && (
                        <p className={`font-bold ${titleClass}`}>
                            {title}
                        </p>
                    )}
                    <p className="text-sm">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export { Banner };
