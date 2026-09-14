import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '#/lib/utils'

const kbdVariants = cva(
  'inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border px-1.5 font-mono text-[11px] leading-none whitespace-nowrap',
  {
    variants: {
      variant: {
        default:
          'border-input bg-background text-muted-foreground shadow-[0_1px_0_var(--input)]',
        onPrimary:
          'border-black/10 bg-black/6 text-primary-foreground/60 dark:text-[#6b6b6b]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

function Kbd({
  className,
  variant,
  ...props
}: React.ComponentProps<'kbd'> & VariantProps<typeof kbdVariants>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(kbdVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Kbd, kbdVariants }
