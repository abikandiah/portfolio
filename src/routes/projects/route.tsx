import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import disclaimer from "@/assets/disclaimer.txt"
import { Banner, bannerType, type BannerProps, type TBannerType } from '@/components/ui/banner'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar"
import { projectsByType } from '@/constants/project'
import { Project } from '@/types/ProjectTypes'
import { stringToBoolean } from '@/utils'
import { useEffect, useState } from 'react'

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
		<SidebarProvider className='px-3 xl:px-0 mt-8'>
			<ProjectSideBar />
			<div className="flex flex-col w-full">

				{!dismissed &&
					<DisclaimerBanner
						className="mb-8"
						onClose={onDisclaimerDismiss} />
				}

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

function DisclaimerBanner(props: Omit<BannerProps, 'type' | 'message'>) {

	const [loading, setLoading] = useState(true);
	const [text, setText] = useState<string>("");
	const [type, setType] = useState<TBannerType>(bannerType.Note);

	useEffect(function () {
		fetch(disclaimer)
			.then(res => {
				return res.text();
			})
			.then(text => {
				setText(text);
			})
			.catch(error => {
				setType(bannerType.Alert)
				setText(error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<Banner loading={loading} type={type} title="Portoflio Disclaimer"
			hideIcon message={text} {...props}
		/>
	)
}

