"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function StockTable() {
  const [data, setData] = useState(null)
  const router = useRouter()
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stocks`)
        const data = await res.json()
        setData(data)
        setLastUpdated(data.date)

      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  if (!data) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="w-full mx-auto px-2 md:px-4 py-2 md:py-6 no-scrollbar">

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="flex flex-col gap-3 px-2 md:px-0 mb-7 md:flex-row md:items-center md:justify-between"
    >
      
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-white">
          Nifty-Based Top Stocks
        </h2>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Selected major stocks tracked with latest OHLC data
        </p>
      </div>

      <div className="flex items-center gap-2 md:flex-col md:items-end">
        <p className="text-xs text-gray-500">Last Updated</p>
        <p className="text-sm text-white font-medium">
          {lastUpdated || "--"}
        </p>
      </div>

    </motion.div>

      <div className="hidden md:block">

        <div className="grid grid-cols-6 px-4 py-3 text-xs text-gray-400 border-b border-white/10">
          <span>Name</span>
          <span>Symbol</span>
          <span className="text-right">Open</span>
          <span className="text-right">High</span>
          <span className="text-right">Low</span>
          <span className="text-right">Close</span>
        </div>

        <div className="divide-y divide-white/5">
          {data.stocks.map((stock, i) => {
            const isUp = stock.close > stock.open

            return (
              <motion.div
                key={stock.symbol}
                onClick={() => router.push(`/stock/${stock.symbol}`)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-6 px-4 py-3 items-center hover:bg-white/5 transition cursor-pointer"
              >
                <span className="text-white font-medium">
                  {stock.name}
                </span>

                <span className="text-gray-400 text-sm">
                  {stock.symbol}
                </span>

                <span className="text-right text-gray-300">
                  {stock.open ?? "-"}
                </span>

                <span className="text-right text-green-400">
                  {stock.high ?? "-"}
                </span>

                <span className="text-right text-red-400">
                  {stock.low ?? "-"}
                </span>

                <span className={`text-right font-semibold ${isUp ? "text-green-400" : "text-red-400"}`}>
                  {stock.close ?? "-"}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-3">
        {data.stocks.map((stock, i) => {
          const isUp = stock.close > stock.open

          return (
            <motion.div
              key={stock.symbol}
              onClick={() => router.push(`/stock/${stock.symbol}`)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition cursor-pointer"
            >
              {/* TOP */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">
                    {stock.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {stock.symbol}
                  </p>
                </div>

                
              </div>

              {/* OHLC ROW */}
              <div className="grid grid-cols-4 gap-2 mt-3 text-xs text-gray-400">
                <div>
                  <p>O</p>
                  <p className="text-white">{stock.open ?? "-"}</p>
                </div>
                <div>
                  <p>H</p>
                  <p className="text-green-400">{stock.high ?? "-"}</p>
                </div>
                <div>
                  <p>L</p>
                  <p className="text-red-400">{stock.low ?? "-"}</p>
                </div>
                <div>
                  <p>C</p>
                  <p className={`font-medium ${isUp ? "text-green-400" : "text-red-400"}`}>
                    {stock.close ?? "-"}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}