from fastapi import APIRouter
from supabase_client import supabase
import redis
import json
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/stocks")

r = redis.from_url(
    os.getenv("REDIS_URL"),
    decode_responses=True
)

TARGET_STOCKS = [
    "ADANIENT.BO","ADANIPORTS.BO","TATATECH.NS","TATASTEEL.NS",
    "TECHM.NS","JSWSTEEL.NS","COALINDIA.NS","DRREDDY.BO",
    "SHRIRAMFIN.NS","CIPLA.NS","RELIANCE.NS","TCS.NS",
    "INFY.NS","HDFCBANK.NS","ICICIBANK.NS","KOTAKBANK.BO",
    "LT.NS","AXISBANK.NS","HINDUNILVR.NS","ITC.BO",
    "BHARTIARTL.NS","JSTL.BO","ASIANPAINT.NS","MARUTI.BO",
    "BAJFINANCE.NS","HCLTECH.NS","WIPRO.NS","TITAN.NS",
    "ULTRACEMCO.NS","SUNPHARMA.NS","NTPC.NS","POWERGRID.NS",
    "ONGC.NS"
]


@router.get("")
async def show_stocks():
    cache_key = "stocks:ohlc"

    cached = r.get(cache_key)
    if cached:
        print("REDIS HIT ohlc⚡")
        return json.loads(cached)

    print("REDIS MISS ❌")

    stocks_res = supabase.table("stocks") \
        .select("*") \
        .in_("symbol", TARGET_STOCKS) \
        .execute()

    stocks = stocks_res.data

    if not stocks:
        return {"stocks": [], "count": 0}

    latest_date = stocks[0]["last_price_date"]

    stock_ids = [s["id"] for s in stocks]

    prices_res = supabase.table("stock_prices") \
        .select("*") \
        .eq("price_date", latest_date) \
        .in_("stock_id", stock_ids) \
        .execute()

    prices = prices_res.data

    price_map = {
        str(p["stock_id"]): p for p in prices
    }

    final_data = []

    for stock in stocks:
        p = price_map.get(str(stock["id"]))

        final_data.append({
            "name": stock["company_name"],
            "symbol": stock["symbol"],
            "open": p["open_price"] if p else None,
            "high": p["high_price"] if p else None,
            "low": p["low_price"] if p else None,
            "close": p["close_price"] if p else None,
            "volume": p["volume"] if p else None,
            "date": latest_date
        })

    result = {
        "stocks": final_data,
        "count": len(final_data),
        "date": latest_date
    }

    r.set(cache_key, json.dumps(result), ex=86400)

    return result