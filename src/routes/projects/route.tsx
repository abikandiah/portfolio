import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar"
import { projects, Project } from '@/constants/project'

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
				<SidebarGroup>
					<SidebarGroupLabel>Projects</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{projects.map((proj) => (
								<SidebarMenuLink key={proj.name}
									proj={proj} />
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar >
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

