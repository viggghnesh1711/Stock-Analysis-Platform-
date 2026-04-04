"use client"
import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Trash2 } from "lucide-react"

function Listwatch() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      setLoading(false)
      return
    }

    const fetchWatchlist = async () => {
      try {

          const { data: watchData, error } = await supabase
            .from("watchlist")
            .select("*") 
            .eq("user_id",user.id) 

        const stockIds = watchData.map((item) => item.stock_id)

        if (stockIds.length === 0) {
          setWatchlist([])
          return
        }

        const { data: allStocks, error: stockError } = await supabase
          .from("stocks")
          .select("id, symbol, company_name")

        if (stockError) {
          console.error(stockError)
          return
        }

        const filteredStocks = allStocks.filter((stock) =>
          stockIds.includes(stock.id)
        )

        const enriched = await Promise.all(
          filteredStocks.map(async (stock) => {
            const { data: prices } = await supabase
              .from("stock_prices")
              .select("close_price")
              .eq("stock_id", stock.id)
              .order("price_date", { ascending: false })
              .limit(2)

            const current = prices?.[0]?.close_price || 0
            const prev = prices?.[1]?.close_price || current

            const change = current - prev
            const percent = prev !== 0 ? (change / prev) * 100 : 0

            return {
              id: stock.id,
              symbol: stock.symbol,
              company_name: stock.company_name,
              price: current,
              change,
              percent,
            }
          })
        )

        setWatchlist(enriched)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWatchlist()
  }, [user, isLoaded])

  const handleClick = (symbol) => {
    router.push(`/stock/${symbol}`)
  }

  const handleRemove = async (e, stockId) => {
    e.stopPropagation()

    try {
      await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", user.id)
        .eq("stock_id", stockId)

      setWatchlist((prev) =>
        prev.filter((item) => item.id !== stockId)
      )

      toast.success("Removed from watchlist")
    } catch (err) {
      console.error(err)
      toast.error("Failed to remove")
    }
  }

  return (
    <div className="p-3 md:p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-zinc-100">
          Watchlist
        </h2>
        <span className="text-xs text-zinc-500">
          Updated today
        </span>
      </div>

      {loading ? (
        <p className="text-zinc-400">Loading...</p>
      ) : !user ? (
        <p className="text-zinc-500 text-sm">
          Please sign in to view your watchlist
        </p>
      ) : watchlist.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          No stocks added yet 📊
        </p>
      ) : (

        <div className="
          grid gap-4
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        ">
          {watchlist.map((stock) => {
            const isUp = stock.change >= 0

            return (
              <div
                key={stock.id}
                onClick={() => handleClick(stock.symbol)}
                className="
                  relative cursor-pointer
                  p-4 rounded-xl
                  bg-zinc-900/70 backdrop-blur-md
                  border border-zinc-800
                  hover:bg-zinc-900
                  transition-all duration-200
                "
              >

                <button
                  onClick={(e) => handleRemove(e, stock.id)}
                  className="
                    absolute top-2 right-2
                    p-1.5 rounded-md
                    bg-zinc-800 hover:bg-red-500/20
                    text-zinc-400 hover:text-red-400
                    transition
                  "
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="mb-3">
                  <h3 className="text-zinc-100 font-semibold text-sm">
                    {stock.symbol}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-1">
                    {stock.company_name}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold text-zinc-100">
                    ₹{stock.price.toFixed(2)}
                  </span>

                  <span
                    className={`text-xs font-medium ${
                      isUp ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isUp ? "+" : ""}
                    {stock.change.toFixed(2)} (
                    {stock.percent.toFixed(2)}%)
                  </span>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Listwatch