"use client"
import React, { useEffect, useState } from "react"
import Header from "../stock/[symbol]/Header"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Searchbar from "@/components/Searchbar"
import Loader from "@/components/Loader"
import Rightone from "./Rightone"

export default function Page() {
  const [data, setData] = useState(null)
  const [stocks, setStocks] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      console.log(process.env.NEXT_PUBLIC_API_URL)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)
      const json = await res.json()
      setData(json)
    }
    loadData()
  }, [])

  useEffect(() => {
    async function loadStocks() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stocks/`)
      const json = await res.json()
      setStocks(json.stocks)
    }
    loadStocks()
  }, [])

  

  if (!data || !stocks) {
    return <Loader/>
  }

  return (
    <div className="min-h-screen text-zinc-100 overflow-hidden">
      
   <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full"
      >
        <Header />
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="w-full py-6 md:hidden"
      >
        <Searchbar/>
      </motion.div>

      <div className="px-4 md:px-10 py-6 md:py-6 overflow-hidden">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between md:gap-3 md:mb-8 mb-6">
          <h1 className="text-2xl font-semibold">Market Dashboard</h1>

          <span className="text-xs md:px-3 py-1 rounded-md text-zinc-400 w-fit">
            Updated: {data.updated_at}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

          <div className="lg:col-span-7 space-y-8">

            <div>
              <h2 className="text-xl font-semibold mb-5">Top Gainers</h2>

              <div className="flex gap-5 overflow-x-auto no-scrollbar">
                {data.gainers.map((item, i) => (
                  <motion.div
                    key={item.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.04 }}
                    className="relative min-w-[220px] p-5 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden"
                  >
                    <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-green-500/20 blur-3xl rounded-full" />
                    <p className="text-xs text-zinc-400">{item.symbol}</p>
                    <h3 className="text-base font-semibold mt-1">{item.name}</h3>

                    <div className="mt-3">
                      <p className="text-xl font-semibold">₹{item.price}</p>
                      <p className="text-green-400 text-sm mt-1">
                        +{item.change_percent}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-5">Top Losers</h2>

              <div className="flex gap-5 overflow-x-auto no-scrollbar">
                {data.losers.map((item, i) => (
                  <motion.div
                    key={item.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.04 }}
                    className="relative min-w-[220px] p-5 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden"
                  >
                    <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-red-500/20 blur-3xl rounded-full" />

                    <p className="text-xs text-zinc-400">{item.symbol}</p>
                    <h3 className="text-base font-semibold mt-1">{item.name}</h3>

                    <div className="mt-3">
                      <p className="text-xl font-semibold">₹{item.price}</p>
                      <p className="text-red-400 text-sm mt-1">
                        {item.change_percent}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        
        <Rightone/>  
         
        </div>

      </div>
    </div>
  )
}