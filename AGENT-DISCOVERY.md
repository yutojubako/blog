# Agent discovery on GitHub Pages

The production build regenerates:

- `/blog/sitemap.xml`: canonical generated HTML pages, excluding 404.
- `/blog/robots.txt`: project policy copy. Search and AI input are allowed;
  named training crawlers are blocked (`ai-train=no`).
- `/blog/posts.json`: published-post index with canonical and Markdown URLs.
- `/blog/markdown/<slug>.md`: Markdown articles with source links and dates.
- `/blog/.well-known/agent-skills/index.json`: reading skill with a digest
  computed from the exact published SKILL.md bytes.
- `/blog/.well-known/ai-catalog.json`: experimental ARD discovery manifest.

Draft filtering uses the same content helper as the HTML pages and RSS feed.
Articles advertise their Markdown alternative in the HTML head. A read-only
`list_blog_posts` WebMCP tool is registered only in supporting browsers.
Run `npm test` and `npm run build` to validate generation and type checking.

## Hosting limitations and remaining work

This project owns `/blog/`, not the origin root. Crawlers do **not** use
`/blog/robots.txt` as robots policy. The owner of the `yutojubako.github.io`
repository must merge it into `https://yutojubako.github.io/robots.txt`, keeping
other project policies, and include both sitemap declarations:

```text
Sitemap: https://yutojubako.github.io/blog/sitemap.xml
Sitemap: https://yutojubako.github.io/maimai.github.io/sitemap.xml
```

Discovery files under `/blog/.well-known/` are HTML-linked fallbacks, not
origin-root well-known resources. Root-based scanners can still fail.

GitHub Pages does not support custom HTTP Link headers or Accept-based
Markdown negotiation. Markdown URLs are explicit alternatives, not negotiated
responses. An edge proxy or different host would be needed for those features
(including `Vary: Accept` and the negotiated `text/markdown` MIME type).
Build-time Response headers do not configure GitHub Pages response headers.
Verify HTTP 200, MIME types, and ARD's `Access-Control-Allow-Origin: *` after
deployment; local previews do not prove production behavior.

The GitHub-owned domain's DNS and DNSSEC cannot be configured here. DNS-AID
also needs an actual agent endpoint to advertise. This public static blog has
no API, OAuth issuer, protected API, registration service, or MCP server, so
API catalogs, OAuth metadata, auth.md, and MCP server cards are intentionally
not fabricated. Content Signals are advisory preferences, not enforcement.

These changes do not publish, push, deploy, or change DNS automatically.
