import type { APIRoute, GetStaticPaths } from 'astro'
import type { CollectionEntry } from 'astro:content'
import { getAllPosts } from '@/utils'

export const getStaticPaths = (async () =>
	(await getAllPosts()).map((post) => ({
		params: { slug: post.slug },
		props: { post }
	}))) satisfies GetStaticPaths

export const GET: APIRoute = ({ props, site }) => {
	const post = props.post as CollectionEntry<'post'>
	const canonical = new URL(`${import.meta.env.BASE_URL}blog/${post.slug}/`, site).href
	const markdown = `# ${post.data.title}\n\nSource: ${canonical}\nPublished: ${post.data.publishDate.toISOString().slice(0, 10)}\n\n${post.body}\n`
	return new Response(markdown, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
}
