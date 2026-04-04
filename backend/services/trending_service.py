import httpx
from datetime import date
import os
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("INDIAN_API_URL")
API_KEY = os.getenv("INDIAN_API_KEY")


async def fetch_trending_data():
    headers = {
        "X-Api-Key": API_KEY
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(API_URL, headers=headers)

        if response.status_code != 200:
            raise Exception("API failed")

        return response.json()
    
def transform_trending(data):
    gainers = []
    losers = []
    today = date.today().isoformat()

    gainers_data = data["trending_stocks"]["top_gainers"][:5]
    losers_data = data["trending_stocks"]["top_losers"][:5]

    for item in gainers_data:
        gainers.append({
            "symbol": item["ric"],
            "name": item["company_name"],
            "price": float(item["price"]),
            "change_percent": float(item["percent_change"]),
            "api_at": item["date"],
            "fetched_at":today
        })

    for item in losers_data:
        losers.append({
            "symbol": item["ric"],
            "name": item["company_name"],
            "price": float(item["price"]),
            "change_percent": float(item["percent_change"]),
            "api_at": item["date"],
            "fetched_at":today
        })

    return gainers, losers