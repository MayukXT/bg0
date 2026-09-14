import { createFileRoute } from '@tanstack/react-router'

/**
 * The docs are a separate Blume app (apps/docs) built with `/docs` as its
 * base. In production a Vercel rewrite serves it directly; this route is the
 * fallback and the development path, proxying to the docs origin so
 * bg0.dev/docs works without a second hostname.
 */
const DOCS_ORIGIN = (
  process.env.BG0_DOCS_ORIGIN ?? 'http://127.0.0.1:4321'
).replace(/\/$/, '')

const DROPPED_HEADERS = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'keep-alive',
  'transfer-encoding',
])

async function proxyDocs(request: Request): Promise<Response> {
  const incoming = new URL(request.url)
  const target = `${DOCS_ORIGIN}${incoming.pathname}${incoming.search}`

  let response: Response
  try {
    response = await fetch(target, {
      method: request.method,
      headers: { accept: request.headers.get('accept') ?? '*/*' },
      redirect: 'manual',
    })
  } catch {
    return new Response('Docs are not running. Start apps/docs.', {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }

  const headers = new Headers()
  response.headers.forEach((value, key) => {
    if (!DROPPED_HEADERS.has(key.toLowerCase())) headers.set(key, value)
  })
  const location = response.headers.get('location')
  if (location?.startsWith(DOCS_ORIGIN)) {
    headers.set('location', location.slice(DOCS_ORIGIN.length))
  }
  return new Response(response.body, { status: response.status, headers })
}

export const Route = createFileRoute('/docs/$')({
  server: {
    handlers: {
      GET: ({ request }) => proxyDocs(request),
      HEAD: ({ request }) => proxyDocs(request),
    },
  },
})
