import React from 'react'
import { TrendingUp, Activity, Lightbulb } from 'lucide-react'

function Cards() {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
      
      {/* WEEK PERFORMANCE */}
      <Card>
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">This Week</p>
          <TrendingUp className="h-4 w-4 text-emerald-400" />
        </div>

        <div className="mt-4">
          <p className="text-3xl font-semibold text-zinc-100">
            +4.8%
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Strong upward momentum
          </p>
        </div>

        <div className="mt-4 h-1 rounded-full bg-stone-800 overflow-hidden">
          <div className="h-full w-[68%] bg-emerald-400/70 rounded-full" />
        </div>
      </Card>

      {/* MARKET ACTIVITY */}
      <Card>
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">Market Activity</p>
          <Activity className="h-4 w-4 text-indigo-400" />
        </div>

        <div className="mt-4">
          <p className="text-3xl font-semibold text-zinc-100">
            High
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Volume above average
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          <Badge>Volatility ↑</Badge>
          <Badge>Liquidity Good</Badge>
        </div>
      </Card>

      {/* INSIGHT */}
      <Card>
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">Insight</p>
          <Lightbulb className="h-4 w-4 text-yellow-400" />
        </div>

        <div className="mt-4">
          <p className="text-base font-medium text-zinc-100">
            Buyers dominating near resistance
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Breakout possible if volume sustains
          </p>
        </div>
      </Card>

    </div>
  )
}

export default Cards
function Card({ children }) {
  return (
    <div
      className="
        rounded-3xl p-5
        bg-stone-900/70 backdrop-blur-xl
        border border-zinc-800/60
        hover:border-zinc-700
        transition
      "
    >
      {children}
    </div>
  )
}
    
function Badge({ children }) {
  return (
    <span className="
      rounded-full px-3 py-1
      text-xs text-zinc-300
      bg-stone-800/60
    ">
      {children}
    </span>
  )
}
