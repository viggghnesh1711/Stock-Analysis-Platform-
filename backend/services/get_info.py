import yfinance as yf

def get_info(symbol: str):
    ticker = yf.Ticker(symbol)

    try:
        raw = ticker.get_info()   

    except Exception:
        raw = {}

    if not raw:
        print("❌ Info not fetched")
        return None

    cleaned_info = {
        "symbol": symbol.upper(),
        "company_name": raw.get("longName") or raw.get("shortName"),
        "exchange": raw.get("exchange"),
        "country": raw.get("country") or resolve_country(raw),
        "currency": raw.get("currency"),
    }

    return cleaned_info

def resolve_country(raw):
    symbol = raw.get("symbol", "")
    currency = raw.get("currency")
    timezone = raw.get("exchangeTimezoneName")
    exchange = raw.get("fullExchangeName")

    if symbol.endswith(".NS") or symbol.endswith(".BO"):
        return "India"

    if currency == "INR":
        return "India"

    if timezone == "Asia/Kolkata":
        return "India"

    if exchange == "NSE" or exchange == "BSE":
        return "India"

    return "Unknown"