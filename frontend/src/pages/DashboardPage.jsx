import React, { useEffect, useMemo, useState } from 'react'
import { FiActivity, FiArrowDownRight, FiArrowUpRight, FiBox, FiMessageSquare, FiSend, FiShoppingBag, FiTrendingUp } from 'react-icons/fi'
import Layout from '../components/Layout'
import { defaultAnswer, demoData } from '../data/demoData'
import { demoAPI } from '../utils/api'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const number = new Intl.NumberFormat('en-US')

function formatMetric(metric) {
  if (metric.format === 'currency') return currency.format(metric.value)
  if (metric.format === 'percentage') return `${metric.value.toFixed(2)}%`
  return number.format(metric.value)
}

function RevenueChart({ rows }) {
  const points = useMemo(() => {
    const values = rows.map((row) => row.revenue)
    const min = Math.min(...values)
    const max = Math.max(...values)
    return values.map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const y = 88 - ((value - min) / Math.max(max - min, 1)) * 68
      return `${x},${y}`
    }).join(' ')
  }, [rows])

  return (
    <div className="relative h-52 overflow-hidden rounded-2xl bg-gradient-to-b from-cyan-400/5 to-transparent">
      <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-slate-800" />
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-800" />
      <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-slate-800" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full p-3">
        <defs>
          <linearGradient id="revenue-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${points} 100,100`} fill="url(#revenue-area)" />
        <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="absolute bottom-2 left-3 text-[10px] text-slate-600">Sep 09</div>
      <div className="absolute bottom-2 right-3 text-[10px] text-slate-600">Sep 22</div>
    </div>
  )
}

function AnalystPanel() {
  const [question, setQuestion] = useState('What should I focus on this week?')
  const [result, setResult] = useState(defaultAnswer)
  const [loading, setLoading] = useState(false)

  async function ask(event) {
    event.preventDefault()
    if (question.trim().length < 3) return
    setLoading(true)
    try {
      setResult(await demoAPI.ask(question.trim()))
    } catch {
      setResult(defaultAnswer)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 via-slate-900 to-cyan-400/5 p-5 shadow-2xl shadow-indigo-950/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Grounded analyst</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Ask the business, not the dashboard</h2>
        </div>
        <FiMessageSquare className="h-5 w-5 text-indigo-300" />
      </div>

      <form onSubmit={ask} className="mt-4 flex gap-2">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400"
          placeholder="Ask about products, conversion, or regions"
        />
        <button disabled={loading} className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-400 text-slate-950 transition hover:bg-indigo-300 disabled:opacity-50" aria-label="Ask analyst">
          <FiSend />
        </button>
      </form>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/55 p-4">
        <div className="flex items-center gap-2 text-xs text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {result.confidence} confidence · evidence linked
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-200">{result.answer}</p>
        <div className="mt-4 space-y-2">
          {result.actions.map((action) => (
            <div key={action} className="flex gap-2 text-xs leading-5 text-slate-400">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
              {action}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {result.evidence.map((source) => (
            <span key={source.id} className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] text-slate-400">
              {source.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState(demoData)

  useEffect(() => {
    demoAPI.getOverview().then(setData).catch(() => setData(demoData))
  }, [])

  const icons = [FiTrendingUp, FiShoppingBag, FiBox, FiActivity]

  return (
    <Layout>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Commerce command center</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">{data.store.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">Synthetic executive analytics with anomaly detection, product diagnostics, and evidence-grounded AI recommendations.</p>
        </div>
        <p className="text-xs text-slate-500">Data through {data.store.as_of}</p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric, index) => {
          const Icon = icons[index]
          const positive = metric.change_pct >= 0
          return (
            <article key={metric.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium uppercase tracking-wider">{metric.label}</span>
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-4 text-2xl font-semibold text-white">{formatMetric(metric)}</p>
              <div className={`mt-2 flex items-center gap-1 text-xs ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {positive ? <FiArrowUpRight /> : <FiArrowDownRight />}
                {Math.abs(metric.change_pct).toFixed(metric.id === 'conversion' ? 2 : 1)}{metric.id === 'conversion' ? ' pts' : '%'} vs prior period
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Revenue pulse</p>
              <h2 className="mt-1 text-lg font-semibold text-white">Daily net revenue</h2>
            </div>
            <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-medium text-cyan-300">14 days</span>
          </div>
          <div className="mt-4"><RevenueChart rows={data.daily_sales} /></div>
        </section>
        <AnalystPanel />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="border-b border-slate-800 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Product performance</p>
          </div>
          <div className="divide-y divide-slate-800/80">
            {data.products.map((product) => (
              <div key={product.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-5 px-5 py-3.5 text-sm">
                <div>
                  <p className="font-medium text-slate-200">{product.name}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{number.format(product.units)} units</p>
                </div>
                <span className="text-slate-300">{currency.format(product.revenue)}</span>
                <span className={`w-16 text-right text-xs ${product.growth_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{product.growth_pct > 0 ? '+' : ''}{product.growth_pct}%</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Attention queue</p>
          <div className="mt-4 space-y-3">
            {data.alerts.map((alert) => (
              <article key={alert.id} className="rounded-xl border border-slate-800 bg-slate-950/45 p-3.5">
                <div className="flex items-start gap-3">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${alert.severity === 'high' ? 'bg-rose-400' : alert.severity === 'positive' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <div>
                    <h3 className="text-sm font-medium text-slate-200">{alert.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{alert.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}
