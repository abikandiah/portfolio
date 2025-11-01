import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

import { Banner } from '@/components/ui/banner';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { projectsByType } from '@/constants/project';
import { Project } from '@/types/ProjectTypes';
import { stringToBoolean } from '@/utils';
import { useState } from 'react';
import { DisclaimerBody } from './disclaimer';

export const Route = createFileRoute('/projects')({
	component: RouteComponent,
})


const DISCLAIMER_DISMISSED_KEY = "bee_disclaimer_dismissed";

function RouteComponent() {
	const [dismissed, setDismissed] = useState(stringToBoolean(localStorage.getItem(DISCLAIMER_DISMISSED_KEY)));

	function onDisclaimerDismiss() {
		localStorage.setItem(DISCLAIMER_DISMISSED_KEY, true.toString());
		setDismissed(true);
	}

	return (
		<SidebarProvider>
			<ProjectSideBar />

			<div className="flex flex-col center-page mt-12">

				{!dismissed &&
					<Banner className="mb-4"
						type='info'
						title="Portfolio Disclaimer"
						hideIcon
						onClose={onDisclaimerDismiss}
					>
						<DisclaimerBody />
					</Banner>
				}

				<Outlet />
			</div>
		</SidebarProvider >
	)
}

function ProjectSideBar() {
	const state = useSidebar();

	return (
		<Sidebar
			className='flex flex-col h-[calc(100vh-2.5rem)] bg-card -ml-3 group-data-[state=expanded]:px-2'
			collapsible='icon'
		>
			<SidebarContent className='py-2'>
				{state.open && Object.keys(projectsByType).map(type => {
					const projects = projectsByType[type];
					return (
						<ProjectsGroup key={type} type={type} projects={projects} />
					)
				})}
			</SidebarContent>

			<SidebarFooter className='shrink-0 border-t'>
				<SidebarTrigger className="ml-auto" />
			</SidebarFooter>

			<SidebarRail />
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
