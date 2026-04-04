from fastapi import FastAPI
from routes import stockdetails
from routes import suggestionns
from routes import stockrange
from routes import dashboard
from routes import allstocks
from fastapi.middleware.cors import CORSMiddleware
from services.scheduler_service import run_stock_pipeline
from services.pipeline_control import should_run_today,mark_as_ran
from fastapi import BackgroundTasks
import redis
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stockdetails.router)
app.include_router(suggestionns.router)
app.include_router(stockrange.router)
app.include_router(dashboard.router)
app.include_router(allstocks.router)

r = redis.from_url(
    os.getenv("REDIS_URL"),
    decode_responses=True
)


@app.get("/")
def root(background_tasks: BackgroundTasks):
    if should_run_today():
        print("Running pipeline today 🚀")

        def task():
            run_stock_pipeline()
            r.delete("stocks:ohlc")
            print("Cache cleared ✅")
            mark_as_ran()

        background_tasks.add_task(task)

    else:
        print("Already ran today ✅")

    return {"message": "App running"}   
    