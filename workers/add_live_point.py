import pymongo
from datetime import datetime
import os
from dotenv import load_dotenv
import requests

load_dotenv('../config/.env')

client = pymongo.MongoClient(os.getenv('MONGO_URI'))
db = client['test']
realtime_prices = db['realtime_prices']

def add_live_point():
    """Add a single live data point for testing"""
    try:
        # Get BONK price
        url = "https://api.coingecko.com/api/v3/simple/token_price/solana"
        params = {
            'contract_addresses': 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
            'vs_currencies': 'usd'
        }
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            address = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
            if address in data:
                price = float(data[address]['usd'])
                
                # Add to database
                realtime_prices.insert_one({
                    'address': address,
                    'symbol': 'BONK',
                    'price': price,
                    'timestamp': datetime.utcnow()
                })
                
                print(f"✅ Added BONK: ${price:.8f} at {datetime.now()}")
                
                # Show total points
                total = realtime_prices.count_documents({'address': address})
                print(f"📊 Total BONK points: {total}")
                
                return True
        
        print("❌ Failed to get price")
        return False
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    add_live_point()