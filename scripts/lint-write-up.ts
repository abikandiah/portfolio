import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { lintWriteUp } from '../plugins/write-up-lint.ts'

/*
 * Usage: npm run lint:content -- [slug ...] [--forbid "Name,Other Name"]
 *
 * Lints the named write-ups (all of them when none are named). Exits 1 on
 * errors — format violations or forbidden names — and 0 with warnings
 * printed otherwise.
 */

const CONTENT_DIR = resolve(import.meta.dirname, '../src/content/projects')

// Accepts both `--forbid "A,B"` and `--forbid="A,B"`.
const slugs: Array<string> = []
const forbid: Array<string> = []
const args = process.argv.slice(2)
for (let index = 0; index < args.length; index++) {
	const arg = args[index]
	let names: string | undefined
	if (arg === '--forbid') {
		names = args[++index]
	} else if (arg.startsWith('--forbid=')) {
		names = arg.slice('--forbid='.length)
	} else if (arg.startsWith('--')) {
		console.error(`Unknown option ${arg}`)
		process.exit(1)
	} else {
		slugs.push(arg)
	}
	if (names != null) {
		forbid.push(
			...names
				.split(',')
				.map((name) => name.trim())
				.filter(Boolean),
		)
	}
}

// Every project is a folder; anything else in the directory isn't a slug.
const targets =
	slugs.length > 0
		? slugs
		: readdirSync(CONTENT_DIR).filter((entry) =>
				statSync(join(CONTENT_DIR, entry)).isDirectory(),
			)

let errors = 0
let warnings = 0

for (const slug of targets) {
	for (const name of ['index.md', 'case-study.md']) {
		const file = join(CONTENT_DIR, slug, name)
		if (!existsSync(file)) {
			if (name === 'index.md') {
				console.error(`✖ ${slug}: no ${file}`)
				errors++
			}
			continue
		}

		const issues = lintWriteUp(readFileSync(file, 'utf8'), file, { forbid })
		for (const issue of issues) {
			const where = `${slug}/${name}${issue.line != null ? `:${issue.line}` : ''}`
			if (issue.level === 'error') {
				errors++
				console.error(`✖ ${where}  ${issue.message}`)
			} else {
				warnings++
				console.warn(`⚠ ${where}  ${issue.message}`)
			}
		}
	}
}

console.log(
	`\n${targets.length} write-up(s): ${errors} error(s), ${warnings} warning(s)`,
)
process.exit(errors > 0 ? 1 : 0)
