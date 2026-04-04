from fastapi import APIRouter
from yfinance import Search

router = APIRouter(prefix="/Suggestion")

@router.get("")
def yahoo_suggest(query,limit=8 ):
    if len(query)<2:
        return[]
    
    search = Search(query)
    results = search.quotes

    suggestions = []

    for item in results:
        symbol = item.get("symbol", "")

        if not symbol.endswith(".NS") and not symbol.endswith(".BO"):
            continue

        if item.get("quoteType") != "EQUITY":
            continue

        if symbol.endswith(".BO"):
            ns_symbol = symbol.replace(".BO", ".NS")
            for s in suggestions:
                if s["symbol"] == ns_symbol:
                    break
            else:
                suggestions.append({
                    "symbol": symbol,
                    "company_name": item.get("shortname") or item.get("longname"),
                })
        else:
            suggestions.append({
                "symbol": symbol,
                "company_name": item.get("shortname") or item.get("longname"),
            })

        if len(suggestions) >= limit:
            break

    return suggestions