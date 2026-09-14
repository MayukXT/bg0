import type * as React from 'react'

import { cn } from '#/lib/utils'

function Progress({
  value = 0,
  className,
  ...props
}: React.ComponentProps<'div'> & { value?: number }) {
  const percent = Math.min(100, Math.max(0, value))
  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      className={cn(
        'relative h-1.5 w-full overflow-hidden rounded-full bg-muted',
        className,
      )}
      {...props}
    >
      <div
        className="h-full bg-foreground transition-[width] duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

export { Progress }
