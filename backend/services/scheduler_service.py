from supabase_client import supabase
from services.get_missinghistory import fetch_missing_history
from services.stocksdb import update_stock_history
# from apscheduler.schedulers.background import BackgroundScheduler

# scheduler = BackgroundScheduler()

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

def run_stock_pipeline():
    print("Running stock pipeline 🚀")

    response = supabase.table("stocks") \
        .select("id, symbol, last_price_date") \
        .execute()

    stocks = response.data

    stock_map = {
        stock["symbol"]: {
            "id": stock["id"],
            "last_price_date": stock["last_price_date"]
        }
        for stock in stocks
        if stock["symbol"] in TARGET_STOCKS
    }

    print("Found stocks:", len(stock_map))

    for symbol, data in stock_map.items():
        stock_id = data["id"]
        last_price_date = data["last_price_date"]

        print(f"Processing {symbol}...")

        history = fetch_missing_history(symbol, last_price_date)

        if not history:
            print(f"{symbol} already up to date")
            continue

        update_stock_history(stock_id, history)

    print("Pipeline completed ✅")


# def start_scheduler():
#     if not scheduler.running:
#         print("Starting scheduler...")

#         # ✅ TEST MODE (use now)
#         scheduler.add_job(run_stock_pipeline, "interval", seconds=60)

#         # ✅ PRODUCTION MODE (later switch)
#         # scheduler.add_job(run_stock_pipeline, "cron", hour=18, minute=0)

#         scheduler.start()