import * as TabsPrimitive from '@radix-ui/react-tabs'
import type * as React from 'react'
import { useLayoutEffect, useRef } from 'react'

import { cn } from '#/lib/utils'

function Tabs(props: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />
}

/**
 * Sliding pill (transitions.dev "Tabs sliding").
 * The pill measures the active trigger and tweens between positions.
 * First paint and resizes write the position without a transition.
 */
function TabsList({
  className,
  pillClassName,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  pillClassName?: string
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const list = listRef.current
    const pill = pillRef.current
    if (!list || !pill) return

    const moveTo = (animate: boolean) => {
      const active = list.querySelector<HTMLElement>(
        '[data-slot="tabs-trigger"][data-state="active"]',
      )
      if (!active) return
      if (!animate) {
        const previous = pill.style.transition
        pill.style.transition = 'none'
        pill.style.transform = `translateX(${active.offsetLeft}px)`
        pill.style.width = `${active.offsetWidth}px`
        void pill.offsetWidth
        pill.style.transition = previous
      } else {
        pill.style.transform = `translateX(${active.offsetLeft}px)`
        pill.style.width = `${active.offsetWidth}px`
      }
    }

    moveTo(false)
    const mutations = new MutationObserver(() => moveTo(true))
    mutations.observe(list, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-state'],
    })
    const resize = new ResizeObserver(() => moveTo(false))
    resize.observe(list)
    return () => {
      mutations.disconnect()
      resize.disconnect()
    }
  }, [])

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="tabs-list"
      className={cn('t-tabs inline-flex items-center gap-0.5', className)}
      {...props}
    >
      <span
        ref={pillRef}
        aria-hidden="true"
        className={cn('t-tabs-pill bg-accent', pillClassName)}
      />
      {children}
    </TabsPrimitive.List>
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'inline-flex h-7 cursor-pointer items-center justify-center rounded-full px-2.5 text-xs font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 data-[state=active]:text-foreground',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('t-stage outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
