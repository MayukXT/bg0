import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '#/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap outline-none transition-[background-color,box-shadow,color,filter] duration-(--duration-quick) ease-(--ease-out) select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-linear-to-b from-(--primary-gradient-from) to-(--primary-gradient-to) text-primary-foreground shadow-[inset_0_1px_0_var(--primary-highlight),inset_0_-1px_0_var(--primary-shade),0_1px_2px_rgba(0,0,0,0.5)] hover:brightness-[1.04] active:brightness-[0.97]',
        secondary:
          'border border-input bg-linear-to-b from-(--secondary-gradient-from) to-(--secondary-gradient-to) text-secondary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-accent hover:from-accent hover:to-accent',
        outline:
          'border border-input bg-transparent text-foreground hover:bg-accent',
        ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground',
        link: 'text-foreground underline-offset-4 hover:underline',
        destructive:
          'bg-destructive text-destructive-foreground hover:brightness-110',
      },
      size: {
        sm: 'h-8 px-3.5 text-[13px] [&_svg]:size-3.5',
        default: 'h-9 px-4 text-[13px] [&_svg]:size-4',
        lg: 'h-10 px-[18px] text-sm [&_svg]:size-4',
        xl: 'h-13 px-6 text-base [&_svg]:size-[18px]',
        icon: 'size-9 [&_svg]:size-4',
        'icon-sm': 'size-8 [&_svg]:size-3.5',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
