import { cn } from '#/lib/utils'

/** The BG0 mark. Same geometry as public/favicon.svg. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn('block size-[22px] shrink-0', className)}
    >
      <rect width="64" height="64" rx="17" fill="currentColor" />
      <circle cx="52.5" cy="52.5" r="20.5" fill="var(--background)" />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <a
      href="/"
      className={cn(
        'inline-flex items-center gap-2.5 rounded-md text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-[-0.01em]">
        bg0<span className="font-medium text-faint-foreground">.dev</span>
      </span>
    </a>
  )
}
