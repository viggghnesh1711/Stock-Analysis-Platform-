from datetime import datetime
import pytz
from supabase_client import supabase

PIPELINE_KEY = "stock_pipeline"


def should_run_today():
    IST = pytz.timezone("Asia/Kolkata")
    today = datetime.now(IST).date().isoformat()

    res = supabase.table("pipeline_runs") \
        .select("last_run_date") \
        .eq("key", PIPELINE_KEY) \
        .execute()

    if not res.data:
        return True

    last_run = res.data[0]["last_run_date"]

    return last_run != today


def mark_as_ran():
    IST = pytz.timezone("Asia/Kolkata")
    today = datetime.now(IST).date().isoformat()
    print("sdf",today)

    supabase.table("pipeline_runs").upsert({
        "key": PIPELINE_KEY,
        "last_run_date": today
    }).execute()