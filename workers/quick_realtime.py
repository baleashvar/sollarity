import requests
import time
import pymongo
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv('../config/.env')

client = pymongo.MongoClient(os.getenv('MONGO_URI'))
db = client['test']
realtime_prices = db['realtime_prices']

TOKENS = [
    {'address': 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', 'symbol': 'BONK'},
    {'address': 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', 'symbol': 'WIF'},
    {'address': '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', 'symbol': 'POPCAT'}
]

def get_price_coingecko(address):
    """Get price from CoinGecko"""
    try:
        url = f"https://api.coingecko.com/api/v3/simple/token_price/solana"
        params = {'contract_addresses': address, 'vs_currencies': 'usd'}
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if address in data and 'usd' in data[address]:
                return float(data[address]['usd'])
    except:
        pass
    return None

def collect_now():
    """Collect prices immediately"""
    print(f"📊 Collecting at {datetime.now()}")
    
    for token in TOKENS:
        price = get_price_coingecko(token['address'])
        if price:
            realtime_prices.insert_one({
                'address': token['address'],
                'symbol': token['symbol'],
                'price': price,
                'timestamp': datetime.utcnow()
            })
            print(f"  ✅ {token['symbol']}: ${price:.8f}")
        else:
            print(f"  ❌ {token['symbol']}: Failed")
    
    total = realtime_prices.count_documents({})
    print(f"📈 Total points: {total}")

def generate_initial_data():
    """Generate 24 hours of data points for immediate testing"""
    print("🚀 Generating initial 24h data...")
    
    # Clear existing data
    realtime_prices.delete_many({})
    
    for token in TOKENS:
        print(f"Generating data for {token['symbol']}...")
        
        # Get current price
        current_price = get_price_coingecko(token['address'])
        if not current_price:
            current_price = 0.00001 if token['symbol'] == 'BONK' else 0.5
        
        # Generate 24 hours of data (every 10 minutes = 144 points)
        for i in range(144):
            # Small random variation
            variation = 1 + (random.uniform(-0.02, 0.02))  # ±2%
            price = current_price * variation
            
            timestamp = datetime.utcnow() - timedelta(minutes=(144-i) * 10)
            
            realtime_prices.insert_one({
                'address': token['address'],
                'symbol': token['symbol'],
                'price': price,
                'timestamp': timestamp
            })
        
        print(f"  ✅ {token['symbol']}: 144 data points")
    
    print("✅ Initial data generated!")

def run_continuous():
    """Run continuous collection every 2 minutes"""
    print("🔄 Starting continuous collection (every 2 minutes)")
    
    # Generate initial data first
    generate_initial_data()
    
    # Then collect real data continuously
    while True:
        try:
            collect_now()
            print("⏰ Waiting 2 minutes...")
            time.sleep(120)  # 2 minutes
        except KeyboardInterrupt:
            print("\n🛑 Stopped by user")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
            time.sleep(60)  # Wait 1 minute on error

if __name__ == "__main__":
    import random
    run_continuous()