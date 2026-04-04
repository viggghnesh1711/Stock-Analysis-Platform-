'use client'

import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function Searchbar() {
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setLoading(false)
      return
    }

    setLoading(true)

    const timer = setTimeout(async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Suggestion?query=${query}`
      )
      const data = await res.json()
      setSuggestions(data)
      setLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  function handleSelect(stock) {
    router.push(`/stock/${stock.symbol}`)
    setQuery('')
    setSuggestions([])
  }

  return (
  <div className="relative w-full max-w-md md:max-w-sm">

    {/* INPUT */}
    <div
      className="
        relative flex items-center
        h-11 md:h-9
        rounded-xl md:rounded-md
        bg-stone-800/70
        border border-zinc-700/70
        focus-within:ring-2 focus-within:ring-indigo-500/40
        transition mx-3
      "
    >
      <Search className="ml-4 md:ml-3 h-5 w-5 md:h-4 md:w-4 text-zinc-400" />

      <input
        type="text"
        placeholder="Search stocks or symbols..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
          w-full bg-transparent
          px-4 md:px-3
          text-base md:text-sm
          text-zinc-200
          placeholder:text-zinc-500
          focus:outline-none
        "
      />
    </div>

    {/* DROPDOWN */}
    {(loading || suggestions.length > 0 || query.length >= 2) && (
      <div
        className="
          absolute top-full mt-2 w-full
          rounded-xl
          bg-stone-900/95 backdrop-blur-xl
          border border-zinc-800
          shadow-2xl
          overflow-hidden
          z-50
        "
      >
        {loading && (
          <div className="px-5 py-4 text-sm text-zinc-400">
            Searching…
          </div>
        )}

        {!loading && query.length >= 2 && suggestions.length === 0 && (
          <div className="px-5 py-4 text-sm text-zinc-400">
            No stocks found
          </div>
        )}

        {!loading &&
          suggestions.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleSelect(stock)}
              className="
                w-full text-left px-5 py-4 md:py-2
                flex items-center justify-between
                hover:bg-stone-800/60
                active:bg-stone-700/60
                transition
              "
            >
              <span className="text-sm md:text-xs text-zinc-200">
                {stock.company_name}
              </span>

              <span className="text-xs text-zinc-500">
                {stock.symbol}
              </span>
            </button>
          ))}
      </div>
    )}
  </div>
)
}

export default Searchbar
