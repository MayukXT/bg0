import { createServerFn } from '@tanstack/react-start'

import { GITHUB_REPO } from './site'

const CACHE_MS = 10 * 60 * 1000

let cached: { count: number | null; at: number } | undefined

/**
 * Live star count for the public repository, fetched on the server and
 * cached for ten minutes. Returns null when the repository is unreachable
 * so the UI can simply omit the number instead of showing a made-up one.
 */
export const getStarCount = createServerFn({ method: 'GET' }).handler(
  async (): Promise<number | null> => {
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.count
    let count: number | null = null
    try {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}`,
        {
          headers: {
            accept: 'application/vnd.github+json',
            'user-agent': 'bg0.dev',
            ...(process.env.GITHUB_TOKEN
              ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
              : {}),
          },
          signal: AbortSignal.timeout(4000),
        },
      )
      if (response.ok) {
        const data = (await response.json()) as { stargazers_count?: number }
        if (typeof data.stargazers_count === 'number')
          count = data.stargazers_count
      }
    } catch {
      count = null
    }
    cached = { count, at: Date.now() }
    return count
  },
)
