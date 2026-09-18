import { cn } from '@abumble/design-system/utils'
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { TProjectType } from '@/types/ProjectTypes'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { PageDescription, PageHeader } from '@/components/ui'
import { projects, projectsByType } from '@/constants/project'

export const Route = createFileRoute('/projects/')({
	component: RouteComponent,
})

type TCategoryFilter = TProjectType | 'All'

const CATEGORY_OPTIONS: Array<TCategoryFilter> = [
	'All',
	...(Object.keys(projectsByType) as Array<TProjectType>),
]

function RouteComponent() {
	const [category, setCategory] = useState<TCategoryFilter>('All')
	const [query, setQuery] = useState('')

	const filteredProjects = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase()

		return projects.filter((proj) => {
			const matchesCategory = category === 'All' || proj.type === category
			const matchesQuery =
				normalizedQuery === '' ||
				proj.name.toLowerCase().includes(normalizedQuery) ||
				proj.description.toLowerCase().includes(normalizedQuery)

			return matchesCategory && matchesQuery
		})
	}, [category, query])

	return (
		<div className="flex flex-col gap-6 px-3">
			<div>
				<PageHeader size="sm">Projects</PageHeader>

				<PageDescription size="sm" className="mt-1">
					A collection of things I've built, at work and on my own.
				</PageDescription>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<CategoryFilter value={category} onChange={setCategory} />
				<SearchInput value={query} onChange={setQuery} />
			</div>

			{filteredProjects.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					No projects match "{query}".
				</p>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filteredProjects.map((proj) => (
						<ProjectCard key={proj.name} proj={proj} />
					))}
				</div>
			)}
		</div>
	)
}

function CategoryFilter({
	value,
	onChange,
}: {
	value: TCategoryFilter
	onChange: (value: TCategoryFilter) => void
}) {
	return (
		<div className="flex items-center gap-1">
			{CATEGORY_OPTIONS.map((option) => (
				<button
					key={option}
					type="button"
					onClick={() => onChange(option)}
					className={cn(
						'rounded px-3 py-1.5 text-sm font-medium transition-colors',
						value === option
							? 'bg-foreground/8 text-foreground'
							: 'text-muted-foreground hover:bg-foreground/6 hover:text-foreground',
					)}
				>
					{option}
				</button>
			))}
		</div>
	)
}

function SearchInput({
	value,
	onChange,
}: {
	value: string
	onChange: (value: string) => void
}) {
	return (
		<div className="relative">
			<Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<input
				type="search"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder="Search projects..."
				className="w-full rounded border bg-background py-1.5 pr-3 pl-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-56"
			/>
		</div>
	)
}
