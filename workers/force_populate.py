import pymongo
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import random

load_dotenv('../config/.env')

client = pymongo.MongoClient(os.getenv('MONGO_URI'))
db = client['test']

# Try both collections
realtime_prices = db['realtime_prices']
price_histories = db['pricehistories']

def force_populate():
    """Force populate both collections with data"""
    print("🚀 Force populating data...")
    
    # Clear both collections
    realtime_prices.delete_many({})
    price_histories.delete_many({})
    
    # BONK address
    address = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
    base_price = 0.00002341
    
    print(f"📊 Generating data for BONK...")
    
    # Generate 24 hours of data (every 10 minutes = 144 points)
    for i in range(144):
        # Small variation
        variation = 1 + random.uniform(-0.05, 0.05)  # ±5%
        price = base_price * variation
        timestamp = datetime.utcnow() - timedelta(minutes=(144-i) * 10)
        volume = random.uniform(1000, 5000)
        
        # Add to realtime_prices
        realtime_prices.insert_one({
            'address': address,
            'symbol': 'BONK',
            'price': price,
            'timestamp': timestamp
        })
        
        # Add to pricehistories (fallback)
        price_histories.insert_one({
            'coinAddress': address,
            'price': price,
            'timestamp': timestamp,
            'volume': volume
        })
    
    # Check counts
    rt_count = realtime_prices.count_documents({'address': address})
    ph_count = price_histories.count_documents({'coinAddress': address})
    
    print(f"✅ Added {rt_count} points to realtime_prices")
    print(f"✅ Added {ph_count} points to pricehistories")
    print("📈 Both collections populated!")

if __name__ == "__main__":
    force_populate()