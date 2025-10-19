import type Project from "@/constants/project";
import { projects } from "@/constants/project";
import { Link } from "@tanstack/react-router";
import { FolderCode } from "lucide-react";
import { Card, CardContent, CardH2Header } from "../ui/card";

function ProjectsOverview() {
    return (
        <Card>
            <CardH2Header title={'Notable Projects'}
                Icon={FolderCode}
            />


            <CardContent className="space-y-4">
                {projects.map(proj =>
                    <ProjectOverview proj={proj} />
                )}
            </CardContent>
        </Card>
    )
}

function ProjectOverview({ proj }: { proj: Project }) {
    const { name, duration, description } = proj;

    const url = `/projects/${proj.getUrl()}`;

    return (
        <div className="">
            <div className="flex flex-auto">
                <span className="text-sm font-medium text-gray-900 leading-6">
                    {name}
                </span>

                <span className="ml-auto text-xs leading-5 text-gray-500">
                    {duration}
                </span>
            </div>

            <p className="font-medium text-sm leading-5 text-gray-600">
                {description}
            </p>

            <Link to={url}
                className="text-xs text-blue-600 hover:text-blue-800 visited:text-blue-900">
                View Project
            </Link>

        </div>
    )
}

export default ProjectsOverview;
