import React from 'react'

const stocky = {
  price: '1,456.20',
  currency: 'INR',
  change: -5.40,
  change_percent: 0.37
}

function StockHeader({stocks,data}) {

  const latest = data[data.length - 1]
  const previous = data[data.length - 2]

  const price = latest.close_price

  const change = latest.close_price - previous.close_price

  const changePercent =
    ((change / previous.close_price) * 100).toFixed(2)

  const lastDate = latest.price_date

    const stock = stocks?.[0]  
    if (!stock) return null

return (
  <div className="flex items-end justify-between border-b border-zinc-800 pb-4 mb-4 w-full gap-3">

    <div className="min-w-0">
      <h1 className="text-lg md:text-3xl font-semibold tracking-tight text-zinc-100 truncate">
        {stock.company_name}
      </h1>

      <div className="mt-1 flex flex-wrap items-center text-[11px] md:text-sm text-zinc-400">
        <span>{stock.symbol}</span>
        <span className="mx-2">•</span>
        <span>{stock.exchange}</span>
        <span className="mx-2">•</span>
        <span>{stock.country}</span>
      </div>
    </div>

    <div className="text-right leading-tight shrink-0">
      <div className="flex items-end justify-end gap-1 md:gap-2">
        <span className="text-xl md:text-3xl font-semibold tracking-tight text-zinc-100">
          ₹{price.toFixed(2)}
        </span>
        <span className="mb-1 text-[10px] md:text-sm text-zinc-400">
          INR
        </span>
      </div>

      <div
        className={`mt-1 flex items-center justify-end gap-1 text-[11px] md:text-sm
          ${change < 0 ? 'text-red-400' : 'text-emerald-400'}
        `}
      >
        {change < 0 ? '↓' : '↑'}
        <span>
          {change.toFixed(2)} ({changePercent}%)
        </span>
        <span className="text-zinc-500">
          as of {lastDate}
        </span>
      </div>
    </div>

  </div>
)

}

export default StockHeader