from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

scheduler = BackgroundScheduler()

def test_job():
    print("Running job at:", datetime.now())

def start_scheduler():
    scheduler.add_job(test_job, "interval", seconds=5)
    scheduler.start()