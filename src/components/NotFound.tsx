
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty";
import { Link } from "@tanstack/react-router";
import { FileQuestionMark } from "lucide-react";

function NotFound() {
    return (
        <Empty>
            <EmptyHeader>
                <FileQuestionMark size="128" className="mb-2"/>
                <EmptyTitle className="text-3xl">404 - Not Found</EmptyTitle>
                <EmptyDescription className="text-lg">
                    The page you were looking for was not found.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <EmptyDescription>
                    <Link to="/">
                        Return home
                    </Link>
                </EmptyDescription>
            </EmptyContent>
        </Empty>
    )
}

export { NotFound };
