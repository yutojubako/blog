import type { APIRoute } from 'astro'
import { getAllPosts, sortMDByDate } from '@/utils'

export const GET: APIRoute = async ({ site }) => {
	const root = new URL(import.meta.env.BASE_URL, site)
	const posts = sortMDByDate(await getAllPosts()).map((post) => ({
		title: post.data.title,
		description: post.data.description,
		tags: post.data.tags,
		published: post.data.publishDate.toISOString(),
		updated: post.data.updatedDate?.toISOString(),
		url: new URL(`blog/${post.slug}/`, root).href,
		markdown: new URL(`markdown/${post.slug}.md`, root).href
	}))
	return new Response(JSON.stringify(posts, null, 2) + '\n', {
		headers: { 'Content-Type': 'application/json' }
	})
}
