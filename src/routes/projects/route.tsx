import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar"
import { projects } from '@/constants/project'

export const Route = createFileRoute('/projects')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<SidebarProvider>
			<ProjectSideBar />
			<div className="flex flex-col">
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
								<SidebarMenuItem key={proj.name}>
									<SidebarMenuButton asChild>
										<Link to={'/projects/' + proj.url}>
											{/* <item.icon /> */}
											<span>{proj.name}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
