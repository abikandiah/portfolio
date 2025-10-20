import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider } from "@/components/ui/sidebar"
import { projects } from '@/constants/project'

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
								<SidebarMenuItem key={proj.name}>
									<SidebarMenuButton asChild>
										<Link to={'/projects/' + proj.url}>
											<span>{proj.name}</span>
										</Link>
									</SidebarMenuButton>

									{Array.isArray(proj.sections) && proj.sections.length > 0 && (
										<SidebarMenuSub>
											{proj.sections.map(section => (
												<SidebarMenuSubItem key={section.pathname}>
													<SidebarMenuSubButton asChild>
														<Link to={'/projects/' + proj.url + '#' + section.pathname}>
															<span>{section.title}</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									)}

								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar >
	)
}
