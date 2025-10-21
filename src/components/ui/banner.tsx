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

const styles = {
    tip: {
        container: 'bg-blue-100 border-blue-500 text-blue-800',
        title: 'text-blue-900',
        icon: 'text-blue-500',
    },
    note: {
        container: 'bg-green-100 border-green-500 text-green-800',
        title: 'text-green-900',
        icon: 'text-green-500',
    },
    warning: {
        container: 'bg-yellow-100 border-yellow-500 text-yellow-800',
        title: 'text-yellow-900',
        icon: 'text-yellow-500',
    },
    alert: {
        container: 'bg-red-100 border-red-500 text-red-800',
        title: 'text-red-900',
        icon: 'text-red-500',
    },
};

/**
 * Generic Banner Component for Tips, Warnings, Notes, and Alerts.
 *
 * @param {('tip'|'warning'|'note'|'alert')} type - The type of message.
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
    const color = styleColor[type] || styles.note;

    const containerClass = `bg-${color}-${colorWeights[0]} text-${color}-${colorWeights[1]} border-${color}-${colorWeights[2]}`;
    const iconClass = `text-${color}-${colorWeights[1]}`;
    const titleClass = `text-${color}-${colorWeights[1]}`;

    return (
        <div
            className={cn(`p-4 border-l-4 rounded-md shadow-md mb-4`, containerClass, className)}
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
                        <p className={`text-lg font-bold ${titleClass}`}>
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
