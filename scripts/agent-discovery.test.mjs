import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import test from 'node:test'
import agentDiscovery from './agent-discovery.mjs'

test('blog discovery stays in its own base path and excludes the error page', async () => {
	const directory = await mkdtemp(join(tmpdir(), 'blog-discovery-'))
	const dir = pathToFileURL(`${directory}/`)
	try {
		const integration = agentDiscovery()
		integration.hooks['astro:config:done']({
			config: { site: 'https://example.com', base: '/blog/' }
		})
		await integration.hooks['astro:build:done']({
			dir,
			pages: [{ pathname: '' }, { pathname: 'blog/article/' }, { pathname: '404.html' }]
		})
		const read = (path) => readFile(new URL(path, dir), 'utf8')
		const sitemap = await read('sitemap.xml')
		assert.ok(sitemap.includes('<loc>https://example.com/blog/blog/article/</loc>'))
		assert.ok(!sitemap.includes('404'))
		const robots = await read('robots.txt')
		assert.ok(robots.includes('Sitemap: https://example.com/blog/sitemap.xml'))
		assert.ok(robots.includes('User-agent: GPTBot\nDisallow: /blog/'))
		assert.ok(robots.includes('Content-Signal: search=yes, ai-input=yes, ai-train=no'))
		const index = JSON.parse(await read('.well-known/agent-skills/index.json'))
		const skill = await readFile(
			new URL('../public/.well-known/agent-skills/read-blog/SKILL.md', import.meta.url)
		)
		assert.equal(
			index.skills[0].digest,
			`sha256:${createHash('sha256').update(skill).digest('hex')}`
		)
		assert.equal(
			new URL('../../../posts.json', index.skills[0].url).href,
			'https://example.com/blog/posts.json'
		)
		const catalog = JSON.parse(await read('.well-known/ai-catalog.json'))
		assert.equal(catalog.entries[0].url, index.skills[0].url)
		assert.ok(!('data' in catalog.entries[0]))
	} finally {
		await rm(directory, { recursive: true })
	}
})
