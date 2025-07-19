#!/usr/bin/env python3
"""
Simple Solana Memecoin Data Scraper

A simplified version that adds test data to MongoDB
"""

import os
import sys
import pymongo
import logging
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("simple_scraper")

# Load environment variables
load_dotenv(Path(__file__).parent.parent / "config" / ".env")

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")

def scrape_and_store():
    """Add sample memecoin data to MongoDB"""
    if not MONGO_URI:
        logger.error("MONGO_URI not found in environment variables")
        return False
        
    try:
        # Connect to MongoDB
        client = pymongo.MongoClient(MONGO_URI)
        db = client.sollarity
        logger.info("Connected to MongoDB")
        
        # Sample coins data (popular Solana tokens)
        coins = [
            {
                "name": "USD Coin",
                "symbol": "USDC",
                "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "image": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
                "price": 1.0,
                "priceChange24h": 0.01,
                "marketCap": 25000000000,
                "volume24h": 1500000000,
                "liquidityUSD": 500000000,
                "holderCount": 1000000,
                "website": "https://www.circle.com/en/usdc",
                "twitter": "https://twitter.com/circle",
                "telegram": "",
                "lpBurned": False,
                "scamProbability": 0.01,
                "lastUpdated": datetime.now()
            },
            {
                "name": "Wrapped SOL",
                "symbol": "SOL",
                "address": "So11111111111111111111111111111111111111112",
                "image": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
                "price": 150.25,
                "priceChange24h": 2.5,
                "marketCap": 65000000000,
                "volume24h": 2500000000,
                "liquidityUSD": 1000000000,
                "holderCount": 800000,
                "website": "https://solana.com",
                "twitter": "https://twitter.com/solana",
                "telegram": "https://t.me/solana",
                "lpBurned": False,
                "scamProbability": 0.01,
                "lastUpdated": datetime.now()
            },
            {
                "name": "Dogwifhat",
                "symbol": "WIF",
                "address": "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
                "image": "https://arweave.net/o-PY3iKn8TL7zzTXaIUT8BTGNNiOFj7HKnWRcHFKXBs",
                "price": 2.45,
                "priceChange24h": 15.2,
                "marketCap": 2500000000,
                "volume24h": 350000000,
                "liquidityUSD": 180000000,
                "holderCount": 120000,
                "website": "https://dogwifcoin.org",
                "twitter": "https://twitter.com/dogwifcoin",
                "telegram": "https://t.me/dogwifcoin",
                "lpBurned": True,
                "scamProbability": 0.2,
                "lastUpdated": datetime.now()
            },
            {
                "name": "Bonk",
                "symbol": "BONK",
                "address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                "image": "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q3PzDcbFEIcg",
                "price": 0.00002,
                "priceChange24h": 5.5,
                "marketCap": 1200000000,
                "volume24h": 75000000,
                "liquidityUSD": 50000000,
                "holderCount": 250000,
                "website": "https://bonkcoin.com",
                "twitter": "https://twitter.com/bonk_inu",
                "telegram": "https://t.me/bonk_inu",
                "lpBurned": True,
                "scamProbability": 0.15,
                "lastUpdated": datetime.now()
            },
            {
                "name": "Scam Token",
                "symbol": "SCAM",
                "address": "ScamTokenAddressXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "image": "",
                "price": 0.0000001,
                "priceChange24h": 500.0,
                "marketCap": 10000,
                "volume24h": 5000,
                "liquidityUSD": 2000,
                "holderCount": 5,
                "website": "",
                "twitter": "",
                "telegram": "",
                "lpBurned": False,
                "scamProbability": 0.95,
                "lastUpdated": datetime.now()
            }
        ]
        
        # Add price history data
        price_history = []
        for coin in coins:
            # Create 24 hourly price points for each coin
            base_price = coin["price"] * 0.9  # Start at 90% of current price
            for i in range(24):
                # Gradually increase price to current level
                factor = 0.9 + (0.1 * (i / 23))
                price_history.append({
                    "coinAddress": coin["address"],
                    "timestamp": datetime.now(),
                    "price": coin["price"] * factor,
                    "marketCap": coin["marketCap"] * factor,
                    "volume": coin["volume24h"] / 24,
                    "liquidityUSD": coin["liquidityUSD"],
                    "holderCount": coin["holderCount"]
                })
        
        # Insert data
        for coin in coins:
            db.coins.update_one(
                {"address": coin["address"]},
                {"$set": coin},
                upsert=True
            )
            logger.info(f"Added/updated coin: {coin['symbol']} ({coin['address']})")
            
        # Insert price history
        db.price_history.insert_many(price_history)
        logger.info(f"Added {len(price_history)} price history records")
            
        # Add trending coins (coins with positive price change)
        trending = [coin for coin in coins if coin["priceChange24h"] > 0]
        if trending:
            db.trending_coins.delete_many({})  # Clear previous
            db.trending_coins.insert_many(trending)
            logger.info(f"Added {len(trending)} trending coins")
            
        # Add safe investments (low scam probability)
        safe = [coin for coin in coins if coin["scamProbability"] < 0.3]
        if safe:
            db.safe_investments.delete_many({})  # Clear previous
            db.safe_investments.insert_many(safe)
            logger.info(f"Added {len(safe)} safe investments")
            
        # Add scam alerts (high scam probability)
        scams = [coin for coin in coins if coin["scamProbability"] > 0.5]
        if scams:
            db.scam_alerts.delete_many({})  # Clear previous
            db.scam_alerts.insert_many(scams)
            logger.info(f"Added {len(scams)} scam alerts")
        
        logger.info("Data scraping and storage complete!")
        return True
    except Exception as e:
        logger.error(f"Error: {e}")
        return False

if __name__ == "__main__":
    logger.info("Running simple scraper...")
    scrape_and_store()