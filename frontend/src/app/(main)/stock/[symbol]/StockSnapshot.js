'use client'
import { usecomparison } from '@/hooks/usecomparison'
import React, { useMemo } from 'react'
import Rightcard from './rightcard'

export default function StockSnapshot({
  compareMode,
  setCompareMode,
  dragStart,
  dragEnd,
  setDragStart,
  setDragEnd,
  data,
  stocks
}) {

  const handleReset = () => {
    setDragStart(null)
    setDragEnd(null)
  }

  const comparison  = usecomparison({dragStart,dragEnd,data})
  const isPositive = comparison?.change > 0

 return (
  <div
    className="
      flex-1 h-full
      rounded-2xl md:rounded-3xl
      p-4 md:p-6
      bg-stone-900/70 backdrop-blur-2xl
      border border-zinc-800/60
      flex flex-col
      gap-6 md:gap-10
    "
  >

    {compareMode ? (
      <>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleReset}
            className="
              w-full h-10 md:h-11 rounded-xl
              text-sm font-medium
              bg-amber-500/15 text-amber-300
              hover:bg-amber-500/25
              transition
            ">
            Reset Compare
          </button>

          <button
            onClick={() => setCompareMode(false)}
            className="
              w-full h-10 md:h-11 rounded-xl
              text-sm
              bg-stone-800/60 text-zinc-300
              hover:bg-stone-800
              transition
            ">
            Exit Compare
          </button>
        </div>

        {!comparison && (
          <div className="mt-4 md:mt-10 space-y-5 md:space-y-6">
            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-wide text-zinc-500 mb-1 md:mb-2">
                Start Date
              </p>
              <p className="text-base md:text-lg font-medium text-zinc-100">
                {dragStart ? dragStart : "Select on chart"}
              </p>
            </div>

            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-wide text-zinc-500 mb-1 md:mb-2">
                End Date
              </p>
              <p className="text-base md:text-lg font-medium text-zinc-100">
                {dragEnd ? dragEnd : "Select on chart"}
              </p>
            </div>
          </div>
        )}

        {comparison && (
          <div className="mt-6 md:mt-10 space-y-6 md:space-y-8">

            <div className="flex flex-col items-start gap-1 md:gap-2">
              <p className="text-[10px] md:text-xs uppercase tracking-wide text-zinc-500">
                Performance
              </p>

              <p
                className={`text-3xl md:text-4xl font-semibold ${
                  isPositive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {comparison.percent.toFixed(2)}%
              </p>

              <p className="text-xs md:text-sm text-zinc-400">
                {isPositive ? "+" : ""}
                {comparison.change.toFixed(2)} over {comparison.duration} days
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
              <Stat label="Start Price" value={comparison.startPrice.toFixed(2)} />
              <Stat label="End Price" value={comparison.endPrice.toFixed(2)} />
              <Stat label="Highest" value={comparison.highest.toFixed(2)} />
              <Stat label="Lowest" value={comparison.lowest.toFixed(2)} />
            </div>

            <div className="pt-3 md:pt-4 border-t border-zinc-800 text-xs md:text-sm text-zinc-400">
              From {comparison.startDate} → {comparison.endDate}
            </div>

          </div>
        )}

      </>
    ) : (
      <Rightcard setCompareMode={setCompareMode} data={data} stocks={stocks}/>
    )}
  </div>
)

}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-base font-medium text-zinc-100">
        {value}
      </span>
    </div>
  )
}
