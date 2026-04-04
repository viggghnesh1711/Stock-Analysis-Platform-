import { useMemo } from "react";

export function usecomparison({
    dragStart,
    dragEnd,
    data
    }){

    return useMemo(() => {
    
    if (!dragStart || !dragEnd) return null

    const startDate = dragStart < dragEnd ? dragStart : dragEnd
    const endDate = dragEnd > dragStart ? dragEnd : dragStart

    const startPoint = data.find(d => d.price_date === startDate)
    const endPoint = data.find(d => d.price_date === endDate)

    if (!startPoint || !endPoint) return null

    const change = endPoint.close_price - startPoint.close_price
    const percent = (change / startPoint.close_price) * 100
    const duration =
      (new Date(endDate) - new Date(startDate)) /
      (1000 * 60 * 60 * 24)

    const filteredData = data.filter((item) => {
    return item.price_date >= startDate && item.price_date <= endDate
    })
    const prices = filteredData.map(item => item.close_price)
    const highest = Math.max(...prices)
    const lowest = Math.min(...prices)


    return {
      startDate,
      endDate,
      startPrice: startPoint.close_price,
      endPrice: endPoint.close_price,
      change,
      percent,
      duration,
      highest,
      lowest
    }

  }, [dragStart, dragEnd, data])

}