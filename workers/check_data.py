#!/usr/bin/env python3
"""
Simple MongoDB Data Check

Checks if data has been scraped and added to MongoDB.
"""

import os
import pymongo
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv(Path(__file__).parent.parent / "config" / ".env")

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")

def check_mongodb_data():
    if not MONGO_URI:
        print("Error: MONGO_URI environment variable not found")
        return
    
    try:
        # Connect to MongoDB
        client = pymongo.MongoClient(MONGO_URI)
        db = client.sollarity
        
        # Check connection
        print(f"Connected to MongoDB successfully")
        
        # Get collections
        collections = db.list_collection_names()
        print(f"Collections found: {', '.join(collections) if collections else 'None'}")
        
        # Check for coin data
        coins_count = db.coins.count_documents({}) if 'coins' in collections else 0
        print(f"\nCoins collection: {coins_count} documents")
        
        if coins_count > 0:
            # Show sample coin
            sample = db.coins.find_one({})
            print(f"Sample coin: {sample.get('name', 'Unknown')} ({sample.get('symbol', '???')})")
            print(f"Price: ${sample.get('price', 0)}")
            print(f"Market Cap: ${sample.get('marketCap', 0)}")
            
        # Check other collections
        print(f"\nOther collections:")
        for coll in ['price_history', 'trending_coins', 'safe_investments', 'scam_alerts']:
            count = db[coll].count_documents({}) if coll in collections else 0
            print(f"- {coll}: {count} documents")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("Checking MongoDB for scraped data...")
    check_mongodb_data()