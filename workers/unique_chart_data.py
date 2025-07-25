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

def generate_unique_price_data(base_price, address, coin_name):
    """Generate unique price data for each coin"""
    history_points = []
    current_price = base_price
    
    # Create unique seed based on address
    address_seed = sum(ord(c) for c in address[:8])
    
    # Unique characteristics per coin
    volatility = 0.001 + (address_seed % 100) / 100000  # 0.001-0.002
    trend_direction = 1 if address_seed % 2 == 0 else -1  # Up or down trend
    cycle_phase = (address_seed % 360) * math.pi / 180  # Unique phase
    spike_frequency = 0.005 + (address_seed % 20) / 1000  # 0.005-0.025
    
    print(f"  {coin_name}: volatility={volatility:.4f}, trend={trend_direction}, phase={cycle_phase:.2f}")
    
    # Generate 7 days of 5-minute data (2016 points)
    for i in range(2016):
        # Set seed for this specific point
        random.seed(address_seed + i)
        
        # Unique random walk
        random_walk = random.uniform(-volatility, volatility)
        
        # Unique trend component
        trend_component = trend_direction * 0.0001 * math.sin(i / 100 + cycle_phase)
        
        # Unique hourly pattern
        hourly_pattern = math.sin(i * 2 * math.pi / 12 + cycle_phase) * volatility * 2
        
        # Unique daily cycle
        daily_cycle = math.cos(i * 2 * math.pi / 288 + cycle_phase * 1.5) * volatility * 3
        
        # Unique volatility spikes
        spike = 0
        if random.random() < spike_frequency:
            spike = random.uniform(-0.01, 0.01) * (1 + address_seed % 5)
        
        # Combine all factors
        total_change = random_walk + trend_component + hourly_pattern + daily_cycle + spike
        
        # Apply change
        current_price = current_price * (1 + total_change)
        
        # Unique bounds per coin
        lower_bound = base_price * (0.85 - (address_seed % 10) / 100)
        upper_bound = base_price * (1.15 + (address_seed % 15) / 100)
        current_price = max(current_price, lower_bound)
        current_price = min(current_price, upper_bound)
        
        # Create timestamp
        timestamp = datetime.utcnow() - timedelta(minutes=(2016-i) * 5)
        
        # Unique volume
        volume_base = base_price * (1000 + address_seed % 2000)
        volume = volume_base * (1 + abs(total_change) * 20)
        
        history_points.append({
            'coinAddress': address,
            'price': round(current_price, 10),
            'timestamp': timestamp,
            'volume': round(volume, 2)
        })
    
    # Reset random seed
    random.seed()
    return history_points

def generate_unique_charts():
    """Generate unique chart data for each coin"""
    print("🚀 Generating unique chart data for each coin...")
    
    # Clear existing price history
    price_history_collection.delete_many({})
    
    # Get existing coins
    coins = list(coins_collection.find())
    if not coins:
        print("❌ No coins found")
        return
    
    print(f"📊 Generating unique data for {len(coins)} coins...")
    
    for coin in coins:
        address = coin['address']
        base_price = coin.get('price', 0.001)
        name = coin.get('name', 'Unknown')
        
        print(f"Processing {name}...")
        
        # Generate unique data
        price_data = generate_unique_price_data(base_price, address, name)
        
        # Insert data
        if price_data:
            price_history_collection.insert_many(price_data)
            
            # Show unique characteristics
            prices = [p['price'] for p in price_data]
            min_price = min(prices)
            max_price = max(prices)
            avg_price = sum(prices) / len(prices)
            variation = ((max_price - min_price) / base_price) * 100
            
            print(f"  ✅ {len(price_data)} points")
            print(f"  📈 Range: ${min_price:.6f} - ${max_price:.6f}")
            print(f"  📊 Avg: ${avg_price:.6f}, Variation: {variation:.1f}%")
            print()
    
    print("✅ Unique chart data generated!")
    print("🎯 Each coin now has distinct price patterns")

if __name__ == "__main__":
    generate_unique_charts()