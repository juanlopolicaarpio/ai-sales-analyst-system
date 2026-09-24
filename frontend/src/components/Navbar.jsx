import React from 'react'

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 font-black text-slate-950">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">AI Sales Analyst</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Sales intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="hidden rounded-full border border-emerald-800 bg-emerald-950/60 px-3 py-1 text-emerald-300 sm:inline-flex">
            Synthetic demo
          </span>
          <a
            href="https://github.com/juanlopolicaarpio/ai-sales-analyst-system"
            className="rounded-lg border border-slate-700 px-3 py-2 font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            View source
          </a>
        </div>
      </div>
    </header>
  )
}
