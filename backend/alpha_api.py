# alpha_api.py
import requests
import os 
from dotenv import load_dotenv
from supabase_client import supabase

load_dotenv()
API_KEY = os.getenv("ALPHAVANTAGE_API")

def get_stock_data(symbol: str):
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": symbol,
        "apikey": API_KEY,
        "outputsize": "full"
    }

    print("api is called ...")
    res = requests.get(url, params=params, timeout=10)
    data = res.json()
    supabase.rpc("increment_api_usage", {"p_api_name": "alpha_vantage"}).execute()

    print(data)
    if "Time Series (Daily)" not in data:
        return None

    return data
