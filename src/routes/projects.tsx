import { createFileRoute, Link, Outlet, type LinkComponentProps } from '@tanstack/react-router';

import { Banner } from '@abumble/design-system/components/Banner';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger, useSidebar } from "@abumble/design-system/components/Sidebar";
import { projectsByType } from '@/constants/project';
import type { onClickCallback } from '@abumble/design-system/types';
import { Project } from '@/types/ProjectTypes';
import { stringToBoolean } from '@abumble/design-system/utils';
import { useCallback, useState } from 'react';
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

			<div className="flex flex-col center-page mt-8">

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

	const closeMobileSidebar = useCallback(function () {
		if (state.isMobile) {
			state.setOpenMobile(false);
		}
	}, [state]);

	return (
		<>
			<Sidebar
				className='flex flex-col h-[calc(100vh-2.5rem)] bg-card -ml-3 group-data-[state=expanded]:px-2'
				collapsible='icon'
			>
				<SidebarContent className='py-2'>
					{state.open && Object.keys(projectsByType).map(type => {
						const projects = projectsByType[type];
						return (
							<ProjectsGroup key={type} closeMobileSidebar={closeMobileSidebar}
								type={type} projects={projects} />
						)
					})}
				</SidebarContent>

				{!state.isMobile &&
					<SidebarFooter className='shrink-0 border-t mb-2'>
						<SidebarTrigger className="ml-auto" />
					</SidebarFooter>
				}

				<SidebarRail />
			</Sidebar >

			{state.isMobile &&
				<SidebarTrigger
					className='fixed bottom-4 left-4'
					variant="outline"
				/>
			}
		</>
	)
}

interface ProjectsGroupProps {
	type: string;
	projects: Project[];
	closeMobileSidebar: onClickCallback<HTMLAnchorElement>;
}

function ProjectsGroup({ type, projects, closeMobileSidebar }: ProjectsGroupProps) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>
				{type}
			</SidebarGroupLabel>

			<SidebarGroupContent>
				<SidebarMenu>
					{projects.map((proj) => (
						<SidebarMenuLink key={proj.name}
							proj={proj} onClick={closeMobileSidebar} />
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

function SidebarMenuLink({ proj, ...props }: { proj: Project } & LinkComponentProps) {
	return (
		<SidebarMenuItem>
			<Link to="/projects/$projectKey"
				params={{ projectKey: proj.pathname }}
				{...props}
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

