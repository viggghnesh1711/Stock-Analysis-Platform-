"use client"
import React, { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

function Rightone() {
  const [data, setData] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stocks`)
        const json = await res.json()

        setData(json)
        setLastUpdated(json.date)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const topStocks = useMemo(() => {
    if (!data?.stocks) return []

    return [...data.stocks]
      .map(s => ({
        ...s,
        change: (s.close ?? 0) - (s.open ?? 0)
      }))
      .sort((a, b) => b.change - a.change)
      .slice(0, 6)
  }, [data])

  if (!data) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="lg:col-span-3 mt-5 w-full ">
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:h-[480px] w-full rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg"
      >
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-white">
              Our Top Movers
            </h2>
            <p className="text-xs text-zinc-500">
              Based on latest price movement
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">
              Updated
            </p>
            <p className="text-xs text-zinc-300 font-medium">
              {lastUpdated || "--"}
            </p>
          </div>
        </div>

        <div className="flex-1 md:overflow-y-auto px-3 py-3 space-y-2 no-scrollbar">
          {topStocks.map((item, i) => {
            const isUp = item.close > item.open
            const change = (item.close ?? 0) - (item.open ?? 0)

            return (
              <motion.div
                key={item.symbol}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.015 }}
                onClick={() => router.push(`/stock/${item.symbol}`)}
                className="group relative flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition cursor-pointer"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-indigo-500/20 blur-2xl rounded-full" />
                </div>

                <div className="flex flex-col">
                  <p className="text-sm text-white font-medium">
                    {item.name || item.company_name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {item.symbol}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`text-sm font-semibold ${isUp ? "text-green-400" : "text-red-400"}`}>
                    ₹ {item.close ?? "-"}
                  </p>
                  <p className={`text-xs ${isUp ? "text-green-500" : "text-red-500"}`}>
                    {isUp ? "+" : ""}
                    {change.toFixed(2)}
                  </p>
                </div>

              </motion.div>
            )
          })}
        </div>
        

      </motion.div>
    </div>
  )
}

export default Rightone