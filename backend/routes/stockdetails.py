from fastapi import APIRouter
from supabase_client import supabase
from services.get_info import get_info
from services.get_history import get_history
from services.stocksdb import get_or_create_stock
from services.stocksdb import save_stock_history
from services.get_missinghistory import fetch_missing_history
from services.stocksdb import update_stock_history
from datetime import date

router = APIRouter(prefix="/StockName/")

@router.get("")
def getstockdetails(symbol):

    response = (
        supabase.table("stocks")
        .select("*")
        .eq("symbol",symbol)
        .execute()
    )
    stock = response.data[0] if response.data else None
    today_date = date.today().isoformat()

    if stock:
        print("STOCK PRESENT...")

        last_date = stock["last_price_date"]
        print(stock["last_price_date"])

        if last_date < today_date:
            stock_history = fetch_missing_history(stock["symbol"], last_date)
            update_stock_history(stock["id"], stock_history)
        else:
            print("DB is already up to date")


    else:
        print("STOCK NOT PRESENT...")

        stock_details = get_info(symbol)
        stock_history = get_history(symbol)

        if not stock_details or not stock_history:
            return {"error": "Failed to fetch stock data"}

        stock_id = get_or_create_stock(stock_details)
        save_stock_history(stock_id, stock_history)

    
    stockinfo =(
        supabase.table("stocks")
        .select("*")
        .eq("symbol",symbol)
        .execute()
    ).data
    print("STOCK INFO SAVED :",stockinfo)

    prices = (
        supabase
        .table("stock_prices")
        .select("price_date, open_price, high_price, low_price, close_price, volume")
        .eq("stock_id", stockinfo[0]["id"])
        .order("price_date")
        .execute()
    ).data

    return {"status": "ok",
            "stockdetails":stockinfo,
            "prices":prices
            }
