import { Menu } from 'lucide-react'

import { GitHubIcon } from '#/components/icons'
import { Wordmark } from '#/components/logo'
import { ThemeToggle } from '#/components/theme-toggle'
import { Button } from '#/components/ui/button'
import { formatStars, GITHUB_URL } from '#/lib/site'

const links = [
  { href: '/docs', label: 'Docs' },
  { href: '/docs/library', label: 'Library' },
]

export function SiteHeader({ stars }: { stars: number | null }) {
  return (
    <header className="mx-auto grid h-14 w-full max-w-(--container-page) grid-cols-[1fr_auto] items-center px-5 sm:h-[68px] sm:px-8 md:grid-cols-[1fr_auto_1fr]">
      <Wordmark className="justify-self-start" />
      <nav
        aria-label="Main navigation"
        className="hidden items-center gap-7 justify-self-center text-sm font-medium text-muted-foreground md:flex"
      >
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="rounded-sm outline-none transition-colors duration-(--duration-quick) ease-(--ease-out) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-1.5 justify-self-end sm:gap-2">
        <ThemeToggle />
        <Button asChild size="sm" className="sm:h-9 sm:px-4">
          <a href={GITHUB_URL} aria-label="BG0 on GitHub">
            <GitHubIcon />
            {stars === null ? 'GitHub' : formatStars(stars)}
          </a>
        </Button>
        <Button
          variant="secondary"
          size="icon-sm"
          className="md:hidden"
          aria-label="Open menu"
          asChild
        >
          <a href="/docs">
            <Menu aria-hidden="true" />
          </a>
        </Button>
      </div>
    </header>
  )
}
