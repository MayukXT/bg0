/** Single source for the public repository and site URLs. */
export const SITE_URL = 'https://bg0.dev'

export const GITHUB_REPO = process.env.BG0_GITHUB_REPO ?? 'opencoredev/bg0'
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`

export function formatStars(count: number): string {
  if (count < 1000) return String(count)
  const thousands = count / 1000
  return `${thousands < 10 ? thousands.toFixed(1).replace(/\.0$/, '') : Math.round(thousands)}k`
}
