import requests
import time
import pymongo
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import schedule

load_dotenv('../config/.env')

client = pymongo.MongoClient(os.getenv('MONGO_URI'))
db = client['test']
realtime_prices = db['realtime_prices']

# Real tokens to track
TOKENS = [
    {'address': 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', 'symbol': 'BONK'},
    {'address': 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', 'symbol': 'WIF'},
    {'address': '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', 'symbol': 'POPCAT'}
]

def get_current_price(token_address, symbol):
    """Get current price from multiple sources"""
    # Try CoinGecko first
    try:
        url = f"https://api.coingecko.com/api/v3/simple/token_price/solana"
        params = {
            'contract_addresses': token_address,
            'vs_currencies': 'usd'
        }
        response = requests.get(url, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if token_address in data and 'usd' in data[token_address]:
                return float(data[token_address]['usd'])
    except:
        pass
    
    # Try Birdeye as fallback
    try:
        headers = {'X-API-KEY': os.getenv('BIRDEYE_API_KEY')}
        url = f"https://public-api.birdeye.so/defi/price"
        params = {'address': token_address}
        response = requests.get(url, headers=headers, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('data', {}).get('value'):
                return float(data['data']['value'])
    except:
        pass
    
    # Try Jupiter as last resort
    try:
        url = f"https://price.jup.ag/v4/price?ids={token_address}"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if 'data' in data and token_address in data['data']:
                return float(data['data'][token_address]['price'])
    except:
        pass
    
    return None

def collect_realtime_data():
    """Collect current prices and store them"""
    print(f"📊 Collecting real-time data at {datetime.now()}")
    
    for token in TOKENS:
        try:
            price = get_current_price(token['address'], token['symbol'])
            if price:
                # Store real price point
                realtime_prices.insert_one({
                    'address': token['address'],
                    'symbol': token['symbol'],
                    'price': price,
                    'timestamp': datetime.utcnow()
                })
                print(f"  ✅ {token['symbol']}: ${price:.8f}")
            else:
                print(f"  ❌ {token['symbol']}: All APIs failed")
        except Exception as e:
            print(f"  ❌ {token['symbol']}: Error - {e}")
    
    # Show collection status
    total_points = realtime_prices.count_documents({})
    print(f"📊 Total data points collected: {total_points}")

def cleanup_old_data():
    """Remove data older than 24 hours"""
    cutoff = datetime.utcnow() - timedelta(hours=24)
    result = realtime_prices.delete_many({'timestamp': {'$lt': cutoff}})
    if result.deleted_count > 0:
        print(f"🗑️ Cleaned up {result.deleted_count} old records")

def start_realtime_collection():
    """Start collecting real-time data every 5 minutes"""
    print("🚀 Starting real-time price collection")
    print("⏰ Collecting every 5 minutes")
    print("📈 24-hour rolling window")
    
    # Collect immediately
    collect_realtime_data()
    
    # Schedule collection every 5 minutes
    schedule.every(5).minutes.do(collect_realtime_data)
    
    # Cleanup old data every hour
    schedule.every().hour.do(cleanup_old_data)
    
    # Keep running
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    start_realtime_collection()