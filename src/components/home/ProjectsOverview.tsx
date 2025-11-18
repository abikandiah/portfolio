import { projects } from "@/constants/project";
import type { Project } from "@/types/ProjectTypes";
import { Card, CardContent } from "@abumble/design-system/components/Card";
import { FolderCode } from "lucide-react";
import { TextLink } from "../ui";
import { CardH2Header } from "../ui/card";

function ProjectsOverview() {
	return (
		<Card>
			<CardH2Header title={'Key Projects'}
				Icon={FolderCode}
			/>


			<CardContent className="space-y-4">
				{projects.slice(0, 5).map(proj =>
					<ProjectOverview key={proj.name} proj={proj} />
				)}
			</CardContent>
		</Card>
	)
}

function ProjectOverview({ proj }: { proj: Project }) {
	const { name, duration, description } = proj;

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

			<p className="text-sm leading-5 text-gray-600">
				{description}
			</p>

			<TextLink
				to="/projects/$projectKey"
				params={{ projectKey: proj.pathname }}
				className="text-xs"
			>
				View Project
			</TextLink>

		</div>
	)
}

export default ProjectsOverview;
