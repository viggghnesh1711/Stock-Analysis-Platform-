from supabase_client import supabase

def get_or_create_stock(stock_details):

    existing = (
        supabase
        .table("stocks")
        .select("id")
        .eq("symbol", stock_details["symbol"])
        .execute()
    )

    if existing.data:
        return existing.data[0]["id"]

    inserted = (
        supabase
        .table("stocks")
        .insert(stock_details)
        .execute()
    )

    return inserted.data[0]["id"]


def save_stock_history(stock_id, history):
    if not history:
        return

    rows = [{
        "stock_id": stock_id,
        "price_date": day["date"],
        "open_price": round(day["open"], 2),
        "high_price": round(day["high"], 2),
        "low_price": round(day["low"], 2),
        "close_price": round(day["close"], 2),
        "volume": int(day["volume"]),
    } for day in history]

    res = supabase.table("stock_prices") \
        .upsert(rows, on_conflict="stock_id,price_date") \
        .execute()

    if res.data:
        latest_date = max(r["price_date"] for r in res.data)
        supabase.table("stocks") \
            .update({"last_price_date": latest_date}) \
            .eq("id", stock_id) \
            .execute()


def update_stock_history(stock_id, history):
    if not history:
        return

    rows = [{
        "stock_id": stock_id,
        "price_date": day["date"],
        "open_price": round(day["open"], 2),
        "high_price": round(day["high"], 2),
        "low_price": round(day["low"], 2),
        "close_price": round(day["close"], 2),
        "volume": int(day["volume"]),
    } for day in history]

    res = supabase.table("stock_prices") \
        .upsert(rows, on_conflict="stock_id,price_date") \
        .execute()

    if res.data:
        latest_date = max(r["price_date"] for r in res.data)
        supabase.table("stocks") \
            .update({"last_price_date": latest_date}) \
            .eq("id", stock_id) \
            .execute()
