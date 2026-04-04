from fastapi import APIRouter
from datetime import date
from services.trending_service import fetch_trending_data, transform_trending
from supabase_client import supabase
import redis
import json
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/dashboard/")

r = redis.from_url(
    os.getenv("REDIS_URL"),
    decode_responses=True
)

@router.get("/")
async def get_dashboard():
    today = date.today().isoformat()
    cache_key = f"dashboard:{today}"

    cached = r.get(cache_key)
    if cached:
        print("REDIS HIT Dashboard⚡")
        return json.loads(cached)

    print("REDIS MISS ❌")

    
    existing = supabase.table("trending_snapshots") \
        .select("*") \
        .eq("fetched_at", today) \
        .execute()

    if existing.data and len(existing.data) > 0:
        gainers = [x for x in existing.data if x["type"] == "gainer"]
        losers = [x for x in existing.data if x["type"] == "loser"]

        fetched_date = existing.data[0]["api_at"] if existing.data else today

        response = {
            "gainers": gainers,
            "losers": losers,
            "updated_at": fetched_date
        }

        r.set(cache_key, json.dumps(response), ex=86400)

        print("DB → REDIS ✅")
        return response

    print("API CALL 🚀")
    raw_data = await fetch_trending_data()
    gainers, losers = transform_trending(raw_data)

    supabase.table("trending_snapshots") \
        .delete() \
        .neq("id", 0) \
        .execute()

    insert_data = []
    for g in gainers:
        g["type"] = "gainer"
        g["fetched_at"] = today
        insert_data.append(g)

    for l in losers:
        l["type"] = "loser"
        l["fetched_at"] = today
        insert_data.append(l)

    supabase.table("trending_snapshots") \
        .insert(insert_data) \
        .execute()

    response = {
        "gainers": gainers,
        "losers": losers,
         "updated_at": insert_data[0]["api_at"] if insert_data else today
    }

    
    r.set(cache_key, json.dumps(response), ex=86400)

    print("API → DB → REDIS ✅")

    return response