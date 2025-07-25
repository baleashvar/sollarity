import pymongo
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv('../config/.env')

client = pymongo.MongoClient(os.getenv('MONGO_URI'))
db = client['test']
realtime_prices = db['realtime_prices']

def check_data():
    """Check what data exists in database"""
    print("🔍 Checking database data...")
    
    total_count = realtime_prices.count_documents({})
    print(f"📊 Total data points: {total_count}")
    
    if total_count == 0:
        print("❌ No data found!")
        return
    
    # Check by token
    tokens = ['BONK', 'WIF', 'POPCAT']
    for symbol in tokens:
        count = realtime_prices.count_documents({'symbol': symbol})
        print(f"  {symbol}: {count} points")
        
        if count > 0:
            # Get latest price
            latest = realtime_prices.find_one(
                {'symbol': symbol}, 
                sort=[('timestamp', -1)]
            )
            print(f"    Latest: ${latest['price']:.8f} at {latest['timestamp']}")
    
    # Check time range
    oldest = realtime_prices.find_one({}, sort=[('timestamp', 1)])
    newest = realtime_prices.find_one({}, sort=[('timestamp', -1)])
    
    if oldest and newest:
        print(f"\n📅 Data range:")
        print(f"  Oldest: {oldest['timestamp']}")
        print(f"  Newest: {newest['timestamp']}")
        
        # Check 24h coverage
        now = datetime.utcnow()
        day_ago = now - timedelta(hours=24)
        recent_count = realtime_prices.count_documents({
            'timestamp': {'$gte': day_ago}
        })
        print(f"  Last 24h: {recent_count} points")

def test_server_query():
    """Test the query that server uses"""
    print("\n🔍 Testing server query...")
    
    address = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'  # BONK
    now = datetime.utcnow()
    from_time = now - timedelta(hours=24)
    
    data = list(realtime_prices.find({
        'address': address,
        'timestamp': {'$gte': from_time},
        'price': {'$gt': 0}
    }).sort([('timestamp', 1)]))
    
    print(f"📊 Query result for BONK (24h): {len(data)} points")
    
    if data:
        print(f"  First: ${data[0]['price']:.8f} at {data[0]['timestamp']}")
        print(f"  Last:  ${data[-1]['price']:.8f} at {data[-1]['timestamp']}")
    else:
        print("  ❌ No data found for server query!")

if __name__ == "__main__":
    check_data()
    test_server_query()