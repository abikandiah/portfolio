import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar"
import { projects } from '@/constants/project'
import { Project, projectType } from '@/types/ProjectTypes'

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

function ProjectSideBar() {
	return (
		<Sidebar>
			<SidebarContent>
				<WorkProjectsGroup />
				<PersonalProjectsGroup />
			</SidebarContent>
		</Sidebar >
	)
}

function PersonalProjectsGroup() {
	const personalProjects = projects.filter(proj => proj.type == projectType.Personal);
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Personal Projects</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{personalProjects.map((proj) => (
						<SidebarMenuLink key={proj.name}
							proj={proj} />
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

function WorkProjectsGroup() {
	const workProjects = projects.filter(proj => proj.type == projectType.Work);
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Work Projects</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{workProjects.map((proj) => (
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

