import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar"
import { Project, projects } from '@/constants/project'

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

			{/* {Array.isArray(proj.sections) && proj.sections.length > 0 && (
				<SidebarMenuSub>
					{proj.sections.map(section => (
						<SidebarMenuSubLink key={section.pathname}
							parentTo={to} section={section} href={href} />
					))}
				</SidebarMenuSub>
			)} */}

		</SidebarMenuItem>
	)
}

// function SidebarMenuSubLink({ parentTo, section, href }: { parentTo: string; section: ProjectSection; href: string }) {
// 	const to = parentTo + '#' + section.pathname;

// 	return (
// 		<SidebarMenuSubItem>
// 			<SidebarMenuSubButton asChild isActive={to === href}>
// 				<Link to={to}>
// 					<span>{section.title}</span>
// 				</Link>
// 			</SidebarMenuSubButton>
// 		</SidebarMenuSubItem>
// 	)
// }
