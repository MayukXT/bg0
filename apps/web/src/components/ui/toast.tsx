import { useEffect, useState } from 'react'

import { cn } from '#/lib/utils'

export interface ToastMessage {
  id: number
  text: string
  tone?: 'default' | 'error'
}

/** transitions.dev "Toast open / close", driven by a single `.is-open` class. */
export function Toast({
  message,
  onDone,
  durationMs = 2200,
}: {
  message: ToastMessage | null
  onDone: (id: number) => void
  durationMs?: number
}) {
  const [shown, setShown] = useState<ToastMessage | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!message) return
    setShown(message)
    const raise = requestAnimationFrame(() => setOpen(true))
    const hide = window.setTimeout(() => setOpen(false), durationMs)
    const clear = window.setTimeout(() => onDone(message.id), durationMs + 300)
    return () => {
      cancelAnimationFrame(raise)
      window.clearTimeout(hide)
      window.clearTimeout(clear)
    }
  }, [message, durationMs, onDone])

  if (!shown) return null
  return (
    <output
      className={cn(
        't-toast pointer-events-none fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-border bg-popover px-4 py-2 text-[13px] font-medium text-foreground shadow-[0_12px_32px_rgba(0,0,0,0.5)]',
        open && 'is-open',
        shown.tone === 'error' && 'border-destructive/40',
      )}
    >
      {shown.tone === 'error' ? (
        <span className="size-1.5 shrink-0 rounded-full bg-destructive" />
      ) : (
        <span className="size-1.5 shrink-0 rounded-full bg-success" />
      )}
      {shown.text}
    </output>
  )
}
