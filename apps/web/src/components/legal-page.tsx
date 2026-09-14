import type * as React from 'react'

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <main className="mx-auto max-w-[720px] px-5 pt-10 pb-20 sm:px-8 sm:pt-16 sm:pb-28">
      <h1 className="text-[30px] font-semibold leading-9 tracking-[-0.025em] sm:text-[40px] sm:leading-[46px] sm:tracking-[-0.03em]">
        {title}
      </h1>
      <p className="mt-3 text-sm text-faint-foreground">
        Last updated {updated}
      </p>
      <div className="mt-8 flex flex-col gap-6 text-[15px] leading-6 text-muted-foreground [&_h2]:mt-4 [&_h2]:text-[19px] [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_h2]:text-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </main>
  )
}
