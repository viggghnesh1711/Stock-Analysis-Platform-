from fastapi import APIRouter
from supabase_client import supabase
import redis
import json
import os
import math
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

def safe_value(val):
    if val is None:
        return None
    if isinstance(val, float):
        if math.isnan(val) or math.isinf(val):
            return None
    return val


@router.get("")
async def show_stocks():
    cache_key = "stocks:ohlc"

    cached = r.get(cache_key)
    if cached:
        print("REDIS HIT ⚡")
        return json.loads(cached)

    print("REDIS MISS ❌")

    # 📦 Fetch stocks
    stocks_res = supabase.table("stocks") \
        .select("id, symbol, company_name, last_price_date") \
        .in_("symbol", TARGET_STOCKS) \
        .execute()

    stocks = stocks_res.data

    if not stocks:
        return {"stocks": [], "count": 0}

    stock_ids = [str(s["id"]) for s in stocks]

    # 🔥 STEP 1: Get global latest date (from stocks)
    global_latest_date = max(
        [s["last_price_date"] for s in stocks if s["last_price_date"]],
        default=None
    )

    print("GLOBAL DATE:", global_latest_date)

    # 🔥 STEP 2: Fetch prices ONLY for that date
    prices_res = supabase.table("stock_prices") \
        .select("stock_id, price_date, open_price, high_price, low_price, close_price, volume") \
        .in_("stock_id", stock_ids) \
        .eq("price_date", global_latest_date) \
        .execute()

    prices = prices_res.data

    # 🔥 STEP 3: Map found prices
    price_map = {
        str(p["stock_id"]): p
        for p in prices
    }

    # 🔥 STEP 4: Find missing stocks
    missing_ids = [
        sid for sid in stock_ids
        if sid not in price_map
    ]

    # 🔥 STEP 5: Fallback → latest available price
    if missing_ids:
        fallback_res = supabase.table("stock_prices") \
            .select("stock_id, price_date, open_price, high_price, low_price, close_price, volume") \
            .in_("stock_id", missing_ids) \
            .order("price_date", desc=True) \
            .execute()

        fallback_prices = fallback_res.data

        for p in fallback_prices:
            sid = str(p["stock_id"])
            if sid not in price_map:
                price_map[sid] = p

    # 🔥 STEP 6: Build response
    final_data = []

    for stock in stocks:
        sid = str(stock["id"])
        p = price_map.get(sid)

        final_data.append({
            "name": stock["company_name"],
            "symbol": stock["symbol"],

            "open": safe_value(p["open_price"]) if p else None,
            "high": safe_value(p["high_price"]) if p else None,
            "low": safe_value(p["low_price"]) if p else None,
            "close": safe_value(p["close_price"]) if p else None,
            "volume": int(p["volume"]) if p and p["volume"] else None,

            "date": p["price_date"] if p else None
        })

    result = {
        "stocks": final_data,
        "count": len(final_data),
        "global_date": global_latest_date
    }

    # 🔥 Cache result
    try:
        r.set(cache_key, json.dumps(result, allow_nan=False), ex=86400)
    except Exception as e:
        print("Cache error:", e)

    return result