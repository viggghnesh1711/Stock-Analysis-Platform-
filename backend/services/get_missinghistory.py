import yfinance as yf
from datetime import datetime, timedelta

def fetch_missing_history(symbol, last_price_date):

    last_price_date = datetime.fromisoformat(last_price_date).date()
    start_date = last_price_date + timedelta(days=1)

    ticker = yf.Ticker(symbol)
    df = ticker.history(
        start=start_date.isoformat()
    )

    df = df.reset_index()

    cleaned_data = []  

    if df.empty:
        return cleaned_data 

    df = df[["Date", "Open", "High", "Low", "Close", "Volume"]]

    for _, row in df.iterrows():
        cleaned_data.append({
            "date": row["Date"].strftime("%Y-%m-%d"),
            "open": round(float(row["Open"]), 2),
            "high": round(float(row["High"]), 2),
            "low": round(float(row["Low"]), 2),
            "close": round(float(row["Close"]), 2),
            "volume": int(row["Volume"]),
        })


    return cleaned_data
