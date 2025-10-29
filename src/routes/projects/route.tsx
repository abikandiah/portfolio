import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar"
import { projectsByType } from '@/constants/project'
import { Project } from '@/types/ProjectTypes'

export const Route = createFileRoute('/projects')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<SidebarProvider className='px-3 xl:px-0 mt-8'>
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
			<Link to="/projects/$projectKey"
				params={{ projectKey: proj.pathname }}
			>
				{({ isActive }) => (
					<SidebarMenuButton asChild isActive={isActive}>
						<span className="text-gray-700">{proj.name}</span>
					</SidebarMenuButton>
				)}
			</Link>
		</SidebarMenuItem>
	)
}
