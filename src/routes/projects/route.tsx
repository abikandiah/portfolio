import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar"
import { projects } from '@/constants/project'
import { Project } from '@/types/ProjectTypes'
import { ChevronDown } from 'lucide-react'

export const Route = createFileRoute('/projects')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<SidebarProvider>
			<ProjectSideBar />
			<div className="flex flex-col w-full">
				<Outlet />
			</div>
		</SidebarProvider>
	)
}

interface ProjectMap {
	[key: string]: Project[];
}

const projectsByType: ProjectMap = projects.reduce((prev, curr) => {
	if (prev[curr.type] == null) {
		prev[curr.type] = [];
	}
	prev[curr.type].push(curr);
	return prev;
}, {} as ProjectMap);


function ProjectSideBar() {
	return (
		<Sidebar>
			<SidebarContent>
				{Object.keys(projectsByType).map(type => {
					const projects = projectsByType[type];
					return (
						<ProjectsGroup key={type} type={type} projects={projects} />
					)
				})}
			</SidebarContent>
		</Sidebar >
	)
}

function ProjectsGroup({ type, projects }: { type: string, projects: Project[] }) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>
				{type}
			</SidebarGroupLabel>

			<SidebarGroupContent>
				<SidebarMenu>
					{projects.map((proj) => (
						<SidebarMenuLink key={proj.name}
							proj={proj} />
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

function SidebarMenuLink({ proj }: { proj: Project }) {
	return (
		<SidebarMenuItem>
			<Link to={'/projects/' + proj.pathname}>
				{({ isActive }) => (
					<SidebarMenuButton asChild isActive={isActive}>
						<span>{proj.name}</span>
					</SidebarMenuButton>
				)}
			</Link>
		</SidebarMenuItem>
	)
}

function CollapsibleProjectsGroup({ type, projects }: { type: string, projects: Project[] }) {
	return (
		<Collapsible defaultOpen className="group/collapsible">
			<SidebarGroup>
				<SidebarGroupLabel asChild>
					<CollapsibleTrigger>
						{type}
						<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
					</CollapsibleTrigger>
				</SidebarGroupLabel>

				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{projects.map((proj) => (
								<SidebarMenuLink key={proj.name}
									proj={proj} />
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>
	)
}
