#!/usr/bin/env python3
"""
Add test data to MongoDB for Sollarity
"""

import os
import sys
import pymongo
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv(Path(__file__).parent.parent / "config" / ".env")

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")

def add_test_data():
    """Add sample memecoin data to MongoDB"""
    if not MONGO_URI:
        print("Error: MONGO_URI not found in environment variables")
        return False
        
    try:
        # Connect to MongoDB
        client = pymongo.MongoClient(MONGO_URI)
        db = client.sollarity
        
        # Sample coins data
        test_coins = [
            {
                "name": "Solana Doge",
                "symbol": "SDOGE",
                "address": "8RMnV1eD55iqUFJLMguPkYBkq8DCtk6ZCNTJDi3mCvVH",
                "image": "https://example.com/sdoge.png",
                "price": 0.00023,
                "priceChange24h": 5.2,
                "marketCap": 2500000,
                "volume24h": 350000,
                "liquidityUSD": 180000,
                "holderCount": 1200,
                "website": "https://solanadoge.example.com",
                "twitter": "https://twitter.com/solanadoge",
                "telegram": "https://t.me/solanadoge",
                "lpBurned": True,
                "scamProbability": 0.2,
                "lastUpdated": datetime.now()
            },
            {
                "name": "Moon Rocket",
                "symbol": "MRKT",
                "address": "9VQcTWH8uQZ4PsVBhoHSmRNWvGQXdmNXCF7YHiTGSQJF",
                "image": "https://example.com/mrkt.png",
                "price": 0.0000012,
                "priceChange24h": 120.5,
                "marketCap": 800000,
                "volume24h": 250000,
                "liquidityUSD": 50000,
                "holderCount": 450,
                "website": "",
                "twitter": "https://twitter.com/moonrocket",
                "telegram": "",
                "lpBurned": False,
                "scamProbability": 0.7,
                "lastUpdated": datetime.now()
            },
            {
                "name": "Solana Cat",
                "symbol": "SCAT",
                "address": "7KgNLMXCDg7YLKkmjLsZcJQkPn2UfKKfneTvzxwQyBag",
                "image": "https://example.com/scat.png",
                "price": 0.00045,
                "priceChange24h": -2.3,
                "marketCap": 4500000,
                "volume24h": 780000,
                "liquidityUSD": 320000,
                "holderCount": 2100,
                "website": "https://solanacat.example.com",
                "twitter": "https://twitter.com/solanacat",
                "telegram": "https://t.me/solanacat",
                "lpBurned": True,
                "scamProbability": 0.15,
                "lastUpdated": datetime.now()
            }
        ]
        
        # Add price history data
        price_history = [
            {
                "coinAddress": "8RMnV1eD55iqUFJLMguPkYBkq8DCtk6ZCNTJDi3mCvVH",
                "timestamp": datetime.now(),
                "price": 0.00023,
                "marketCap": 2500000,
                "volume": 350000,
                "liquidityUSD": 180000,
                "holderCount": 1200
            },
            {
                "coinAddress": "9VQcTWH8uQZ4PsVBhoHSmRNWvGQXdmNXCF7YHiTGSQJF",
                "timestamp": datetime.now(),
                "price": 0.0000012,
                "marketCap": 800000,
                "volume": 250000,
                "liquidityUSD": 50000,
                "holderCount": 450
            },
            {
                "coinAddress": "7KgNLMXCDg7YLKkmjLsZcJQkPn2UfKKfneTvzxwQyBag",
                "timestamp": datetime.now(),
                "price": 0.00045,
                "marketCap": 4500000,
                "volume": 780000,
                "liquidityUSD": 320000,
                "holderCount": 2100
            }
        ]
        
        # Insert data
        result_coins = db.coins.insert_many(test_coins)
        result_history = db.price_history.insert_many(price_history)
        
        # Add trending coins
        trending = [coin for coin in test_coins if coin["priceChange24h"] > 0]
        if trending:
            db.trending_coins.insert_many(trending)
            
        # Add safe investments
        safe = [coin for coin in test_coins if coin["scamProbability"] < 0.3]
        if safe:
            db.safe_investments.insert_many(safe)
            
        # Add scam alerts
        scams = [coin for coin in test_coins if coin["scamProbability"] > 0.5]
        if scams:
            db.scam_alerts.insert_many(scams)
        
        print(f"Added {len(result_coins.inserted_ids)} test coins to database")
        print(f"Added {len(result_history.inserted_ids)} price history records")
        print(f"Added {len(trending)} trending coins")
        print(f"Added {len(safe)} safe investments")
        print(f"Added {len(scams)} scam alerts")
        
        return True
    except Exception as e:
        print(f"Error adding test data: {e}")
        return False

if __name__ == "__main__":
    print("Adding test data to MongoDB...")
    success = add_test_data()
    if success:
        print("Test data added successfully!")
    else:
        print("Failed to add test data.")