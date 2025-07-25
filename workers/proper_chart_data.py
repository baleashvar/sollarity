import pymongo
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import random
import math

load_dotenv('../config/.env')

client = pymongo.MongoClient(os.getenv('MONGO_URI'))
db = client['test']
coins_collection = db['coins']
price_history_collection = db['pricehistories']

def generate_proper_price_data(base_price, address):
    """Generate proper continuous price data like real trading platforms"""
    history_points = []
    current_price = base_price
    
    # Generate 7 days of 5-minute data (2016 points)
    for i in range(2016):
        # Create realistic price movement with multiple factors
        
        # 1. Random walk component (±0.1%)
        random_walk = random.uniform(-0.001, 0.001)
        
        # 2. Hourly trend (creates natural waves)
        hourly_trend = math.sin(i * 2 * math.pi / 12) * 0.002  # 12 points = 1 hour
        
        # 3. Daily cycle (creates daily patterns)
        daily_cycle = math.sin(i * 2 * math.pi / 288) * 0.005  # 288 points = 1 day
        
        # 4. Weekly trend (creates longer-term movement)
        weekly_trend = math.sin(i * 2 * math.pi / 2016) * 0.01  # Full dataset = 1 week
        
        # 5. Occasional volatility spikes (realistic market behavior)
        volatility_spike = 0
        if random.random() < 0.02:  # 2% chance of spike
            volatility_spike = random.uniform(-0.02, 0.02)
        
        # Combine all factors
        total_change = random_walk + hourly_trend + daily_cycle + weekly_trend + volatility_spike
        
        # Apply change
        current_price = current_price * (1 + total_change)
        
        # Keep within reasonable bounds (±20% from base)
        current_price = max(current_price, base_price * 0.8)
        current_price = min(current_price, base_price * 1.2)
        
        # Create timestamp (5-minute intervals)
        timestamp = datetime.utcnow() - timedelta(minutes=(2016-i) * 5)
        
        # Volume correlates with price movement
        volume_multiplier = 1 + abs(total_change) * 10
        volume = base_price * random.uniform(1000, 3000) * volume_multiplier
        
        history_points.append({
            'coinAddress': address,
            'price': round(current_price, 10),
            'timestamp': timestamp,
            'volume': round(volume, 2)
        })
    
    return history_points

def populate_proper_chart_data():
    """Populate database with proper continuous price data"""
    print("🚀 Generating proper continuous price data...")
    
    # Clear existing price history
    price_history_collection.delete_many({})
    
    # Get existing coins
    coins = list(coins_collection.find().limit(10))
    if not coins:
        print("❌ No coins found")
        return
    
    print(f"📊 Generating proper price data for {len(coins)} coins...")
    
    for coin in coins:
        address = coin['address']
        base_price = coin.get('price', 0.001)
        name = coin.get('name', 'Unknown')
        
        print(f"Processing {name}...")
        
        # Generate proper continuous data
        price_data = generate_proper_price_data(base_price, address)
        
        # Insert all data points
        if price_data:
            price_history_collection.insert_many(price_data)
            
            # Show price range for verification
            prices = [p['price'] for p in price_data]
            min_price = min(prices)
            max_price = max(prices)
            price_change = ((max_price - min_price) / base_price) * 100
            
            print(f"✅ {name} - {len(price_data)} points, range: ${min_price:.6f} - ${max_price:.6f} ({price_change:.1f}% variation)")
    
    print("✅ Proper continuous price data generated!")
    print("📈 Charts will now show smooth, realistic curves")
    print("⏱️  5-minute resolution for all timeframes")

if __name__ == "__main__":
    populate_proper_chart_data()