import { colorWeights } from "@/constants";
import { cn } from "@/lib/utils";
import type { onClickCallback } from "@/types";
import { CircleX, Info, Lightbulb, TriangleAlert, X } from "lucide-react";
import { Button } from "./button";
import { Skeleton } from "./skeleton";

export const bannerType = {
    Info: 'info',
    Note: 'note',
    Warning: 'warning',
    Alert: 'alert'
} as const;

export type TBannerType = (typeof bannerType)[keyof typeof bannerType];

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

export interface BannerProps extends React.ComponentProps<"div"> {
    type: TBannerType;
    message: string;
    title?: string;
    loading?: boolean;
    hideIcon?: boolean;
    onClose?: onClickCallback<HTMLButtonElement>;
}

function Banner({ type = bannerType.Note, title, message, loading, className, hideIcon, onClose, ...props }: BannerProps) {

    const color = styleColor[type] || styleColor.note;
    const containerClass = `bg-${color}-${colorWeights[0]} text-${color}-${colorWeights[1]} border-${color}-${colorWeights[2]}`;

    return (
        <div
            className={cn(`p-3 border-l-4 rounded`, containerClass, className)}
            role="alert"
            {...props}
        >
            <div className="flex items-start">
                {loading ?
                    <BannerLoadingContent />
                    :
                    <BannerContent title={title} message={message}
                        color={color} type={type} hideIcon={hideIcon} />
                }

                {onClose &&
                    <CloseButton onClick={onClose} />
                }
            </div>
        </div>
    );
}

type BannerContentProps = Omit<BannerProps, 'loading' | 'onClose'> & {
    color: string;
}

function BannerContent({ title, message, color, type, hideIcon }: BannerContentProps) {
    const Icon = icons[type] || icons.note;

    return (
        <>
            {!hideIcon && Icon &&
                <div className={`flex-shrink-0 mr-3 text-${color}-${colorWeights[1]}`}>
                    <Icon />
                </div>
            }
            <div>
                {title && (
                    <p className={`font-bold text-${color}-${colorWeights[1]}`}>
                        {title}
                    </p>
                )}
                <p className="text-sm">
                    {message}
                </p>
            </div>
        </>
    )
}

function BannerLoadingContent() {
    return (
        <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

function CloseButton(props: React.ComponentProps<"button">) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full ml-auto mb-auto relative -top-1 -right-1"
            {...props}
        >
            <X />
            <span className="sr-only">Close banner</span>
        </Button>
    );
}

export { Banner };
