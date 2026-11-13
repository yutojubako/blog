import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const searchBots = [
	'OAI-SearchBot',
	'Claude-SearchBot',
	'PerplexityBot',
	'ChatGPT-User',
	'Claude-User',
	'Perplexity-User'
]
const trainingBots = [
	'GPTBot',
	'ClaudeBot',
	'Google-Extended',
	'Applebot-Extended',
	'CCBot',
	'Bytespider',
	'Amazonbot'
]

const escapeXML = (value) =>
	value.replace(
		/[<>&"']/g,
		(char) =>
			({
				'<': '&lt;',
				'>': '&gt;',
				'&': '&amp;',
				'"': '&quot;',
				"'": '&apos;'
			})[char]
	)

export default function agentDiscovery() {
	let config
	return {
		name: 'agent-discovery',
		hooks: {
			'astro:config:done': ({ config: resolved }) => {
				config = resolved
			},
			'astro:build:done': async ({ dir, pages }) => {
				const root = new URL(`${config.base.replace(/\/$/, '')}/`, config.site)
				const url = (path) => new URL(path, root).href
				const write = async (path, content) => {
					const target = new URL(path, dir)
					await mkdir(new URL('.', target), { recursive: true })
					await writeFile(target, content)
				}
				// Include generated HTML pages, not Markdown/JSON endpoints or errors.
				const locations = [
					...new Set(
						pages
							.filter(({ pathname }) => !/^\/?404(?:\.html|\/)?$/.test(pathname))
							.map(({ pathname }) => url(pathname.replace(/^\//, '')))
					)
				].sort()
				await write(
					'sitemap.xml',
					`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locations.map((loc) => `  <url><loc>${escapeXML(loc)}</loc></url>`).join('\n')}\n</urlset>\n`
				)

				const allow = `Allow: ${root.pathname}\nDisallow: ${root.pathname}404.html\nContent-Signal: search=yes, ai-input=yes, ai-train=no`
				await write(
					'robots.txt',
					[
						'# GitHub Pages project copy: install at the origin /robots.txt to enforce these rules.',
						'# Content-Signal is an advisory extension, not an access-control mechanism.',
						`User-agent: *\n${allow}`,
						...searchBots.map((bot) => `User-agent: ${bot}\n${allow}`),
						...trainingBots.map((bot) => `User-agent: ${bot}\nDisallow: ${root.pathname}`),
						`Sitemap: ${url('sitemap.xml')}`,
						`Agentmap: ${url('.well-known/ai-catalog.json')}`
					].join('\n\n') + '\n'
				)

				const skill = await readFile(
					new URL('../public/.well-known/agent-skills/read-blog/SKILL.md', import.meta.url)
				)
				await write(
					'.well-known/agent-skills/index.json',
					JSON.stringify(
						{
							$schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
							skills: [
								{
									name: 'read-blog',
									type: 'skill-md',
									description: 'Find and read Yuto Imai’s published blog posts in Markdown.',
									url: url('.well-known/agent-skills/read-blog/SKILL.md'),
									digest: `sha256:${createHash('sha256').update(skill).digest('hex')}`
								}
							]
						},
						null,
						2
					) + '\n'
				)
				await write(
					'.well-known/ai-catalog.json',
					JSON.stringify(
						{
							specVersion: '1.0',
							host: { displayName: 'Yuto Imai — Blog', identifier: root.href },
							entries: [
								{
									identifier: `urn:air:${root.hostname}:blog:read-blog`,
									displayName: 'Read Yuto Imai’s blog',
									type: 'text/markdown',
									url: url('.well-known/agent-skills/read-blog/SKILL.md'),
									representativeQueries: [
										'Which blog posts has Yuto Imai published?',
										'Find Yuto Imai’s notes on machine learning.',
										'Read Yuto Imai’s YANS2025 report.'
									]
								}
							]
						},
						null,
						2
					) + '\n'
				)
			}
		}
	}
}
