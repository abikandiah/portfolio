import { Banner } from '@abumble/design-system/components/Banner'
import { CodeDisplay } from '@abumble/design-system/components/CodeDisplay'
import {
	OrderedList,
	UnorderedList,
} from '@abumble/design-system/components/List'
import { Skeleton } from '@abumble/design-system/components/Skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@abumble/design-system/components/Table'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import type { Components } from 'hast-util-to-jsx-runtime'
import type { Root } from 'hast'
import type { ComponentProps, ReactNode } from 'react'
import { Diagram } from '@/components/projects/content/Diagram'
import { SectionAnchor } from '@/components/projects/Section'
import { TextLink } from '@/components/ui'

/*
 * Renders a write-up tree compiled by plugins/project-content.ts. Every
 * element the format produces maps to a component here, so the look of all
 * Markdown write-ups is decided in one place. The custom tags (banner,
 * steps, diagram, ...) are the format's blocks; see
 * .claude/skills/write-project/format.md.
 */

const PROJECT_LINK = /^\/projects\/([a-z0-9-]+)$/

// The plain text of rendered children — a heading's title even when it
// mixes text with inline code or emphasis.
function textOf(node: ReactNode): string {
	if (typeof node === 'string' || typeof node === 'number') {
		return String(node)
	}
	if (Array.isArray(node)) {
		return node.map(textOf).join('')
	}
	if (node != null && typeof node === 'object' && 'props' in node) {
		return textOf((node.props as { children?: ReactNode }).children)
	}
	return ''
}

function ContentLink({ href = '', children }: ComponentProps<'a'>) {
	const projectLink = PROJECT_LINK.exec(href)
	if (projectLink != null) {
		return (
			<TextLink
				to="/projects/$projectKey"
				params={{ projectKey: projectLink[1] }}
			>
				{children}
			</TextLink>
		)
	}
	// A mail link hands off to the mail app, so there's no page to open in
	// a new tab.
	if (href.startsWith('mailto:')) {
		return (
			<a href={href} className="text-link">
				{children}
			</a>
		)
	}
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="text-link"
		>
			{children}
		</a>
	)
}

function SubHeading({ id, children }: ComponentProps<'h3'>) {
	const title = textOf(children)
	return (
		<h3
			id={id}
			// Focusable from script only, so jumping here from the TOC can move
			// keyboard focus to the heading (see scrollToHash).
			tabIndex={id != null ? -1 : undefined}
			className="sub-heading group/heading flex scroll-mt-20 items-center gap-1.5 outline-none"
		>
			{children}
			{id != null && <SectionAnchor id={id} title={title} />}
		</h3>
	)
}

function ContentBanner({
	type = 'info',
	title,
	children,
}: {
	type?: ComponentProps<typeof Banner>['type']
	title?: string
	children?: React.ReactNode
}) {
	// role="note", not the design system's default "alert" — these are
	// static asides, and an alert would be announced by screen readers on
	// every page load.
	return (
		<Banner type={type} title={title} role="note" className="write-up-banner">
			{children}
		</Banner>
	)
}

function Steps({ children, start, ...props }: ComponentProps<'ol'>) {
	// The numbers are drawn by a CSS counter, which ignores the list's own
	// start — so a list beginning at 3 resets the counter to 2.
	return (
		<ol
			className="write-up-steps"
			start={start}
			style={
				start != null && start !== 1
					? { counterReset: `write-up-step ${start - 1}` }
					: undefined
			}
			{...props}
		>
			{children}
		</ol>
	)
}

function TermList(props: ComponentProps<'dl'>) {
	return <dl className="write-up-terms" {...props} />
}

function CodeBlock({ code, language }: { code?: string; language?: string }) {
	return <CodeDisplay code={code} language={language} />
}

// Stands in for detail that's deliberately withheld (proprietary or
// security-sensitive), so the surrounding text still reads as complete.
function Redacted({ lines = '1' }: { lines?: string }) {
	return (
		<Skeleton
			variant="none"
			aria-label="Detail withheld"
			role="img"
			className="w-full lg:w-[80%] xl:w-[70%]"
			style={{ height: `${Number(lines) * 1.5}rem` }}
		/>
	)
}

const components = {
	a: ContentLink,
	h3: SubHeading,
	strong: (props: ComponentProps<'strong'>) => (
		<strong className="font-semibold" {...props} />
	),
	code: (props: ComponentProps<'code'>) => <code className="code" {...props} />,
	ul: (props: ComponentProps<'ul'>) => <UnorderedList {...props} />,
	ol: (props: ComponentProps<'ol'>) => <OrderedList {...props} />,
	table: Table,
	thead: TableHeader,
	tbody: TableBody,
	tr: TableRow,
	th: TableHead,
	td: TableCell,
	dl: TermList,
	banner: ContentBanner,
	steps: Steps,
	diagram: Diagram,
	codeblock: CodeBlock,
	redacted: Redacted,
} as unknown as Partial<Components>

function WriteUpContent({ tree }: { tree: Root }) {
	return toJsxRuntime(tree, { Fragment, jsx, jsxs, components })
}

export { WriteUpContent }
