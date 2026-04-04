from fastapi import APIRouter
from datetime import date, timedelta
from supabase_client import supabase

router = APIRouter(prefix="/StockRange")

RANGE_MAP = {
    "1W": 7,
    "1M": 30,
    "6M": 180,
    "1Y": 365
}

@router.get("")
def getstockrange(symbol, range):

    stock_res = (
        supabase
        .table("stocks")
        .select("id")
        .eq("symbol", symbol)
        .limit(1)
        .execute()
    )

    if not stock_res.data:
        return {"error": "Stock not found"}

    stock_id = stock_res.data[0]["id"]

    query = (
        supabase
        .table("stock_prices")
        .select("price_date, open_price, high_price, low_price, close_price, volume")
        .eq("stock_id", stock_id)
    )

    if range != "MAX":
        days = RANGE_MAP.get(range)
        if not days:
            return {"error": "Invalid range"}

        from_date = (date.today() - timedelta(days=days)).isoformat()
        query = query.gte("price_date", from_date)

    history = query.execute().data

    print("STOCK RANGE GOT...")
    return {
        "symbol": symbol,
        "range": range,
        "prices": history
    }
