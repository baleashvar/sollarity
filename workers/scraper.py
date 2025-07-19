#!/usr/bin/env python3
"""
Sollarity - Solana Memecoin Scraper
This script fetches data about Solana memecoins from various sources.
"""

import os
import asyncio
import aiohttp
import json
import time
import logging
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config', '.env')
load_dotenv(env_path)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('sollarity-scraper')

# Constants
BIRDEYE_API_URL = "https://public-api.birdeye.so/public"
SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com"
RAYDIUM_API_URL = "https://api.raydium.io/v2"

# Get API key from environment variables
API_KEY = os.getenv('BIRDEYE_API_KEY', 'YOUR_BIRDEYE_API_KEY')

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI')
if not MONGO_URI:
    logger.error("MongoDB URI not found in environment variables. Check your .env file.")
    raise ValueError("MongoDB URI not found in environment variables")

logger.info(f"Connecting to MongoDB at {MONGO_URI.split('@')[1] if '@' in MONGO_URI else 'localhost'}")
try:
    client = MongoClient(MONGO_URI)
    # Test connection
    client.admin.command('ping')
    logger.info("MongoDB connection successful")
    db = client.get_database()
except Exception as e:
    logger.error(f"MongoDB connection failed: {str(e)}")
    raise

async def fetch_token_info(session, token_address):
    """Fetch basic token information from Birdeye API"""
    headers = {
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
    }
    
    url = f"{BIRDEYE_API_URL}/token_list_full?address={token_address}"
    
    try:
        async with session.get(url, headers=headers) as response:
            if response.status == 200:
                data = await response.json()
                return data.get('data', {})
            else:
                logger.error(f"Error fetching token info: {response.status}")
                return None
    except Exception as e:
        logger.error(f"Exception fetching token info: {str(e)}")
        return None

async def fetch_token_price(session, token_address):
    """Fetch token price data from Birdeye API"""
    headers = {
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
    }
    
    url = f"{BIRDEYE_API_URL}/price?address={token_address}"
    
    try:
        async with session.get(url, headers=headers) as response:
            if response.status == 200:
                data = await response.json()
                return data.get('data', {})
            else:
                logger.error(f"Error fetching token price: {response.status}")
                return None
    except Exception as e:
        logger.error(f"Exception fetching token price: {str(e)}")
        return None

async def fetch_token_holders(session, token_address):
    """Fetch token holder information using Solana RPC"""
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTokenLargestAccounts",
        "params": [token_address]
    }
    
    try:
        async with session.post(SOLANA_RPC_URL, json=payload) as response:
            if response.status == 200:
                data = await response.json()
                return data.get('result', {}).get('value', [])
            else:
                logger.error(f"Error fetching token holders: {response.status}")
                return None
    except Exception as e:
        logger.error(f"Exception fetching token holders: {str(e)}")
        return None

async def fetch_raydium_pairs():
    """Fetch all trading pairs from Raydium"""
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f"{RAYDIUM_API_URL}/pairs") as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get('data', [])
                else:
                    logger.error(f"Error fetching Raydium pairs: {response.status}")
                    return []
        except Exception as e:
            logger.error(f"Exception fetching Raydium pairs: {str(e)}")
            return []

async def analyze_token(token_address):
    """Analyze a token and gather all relevant information"""
    async with aiohttp.ClientSession() as session:
        # Fetch data in parallel
        token_info_task = fetch_token_info(session, token_address)
        token_price_task = fetch_token_price(session, token_address)
        token_holders_task = fetch_token_holders(session, token_address)
        
        # Await all tasks
        token_info = await token_info_task
        token_price = await token_price_task
        token_holders = await token_holders_task
        
        if not token_info or not token_price:
            logger.warning(f"Could not fetch complete data for {token_address}")
            return None
        
        # Calculate insider percentage (simplified)
        insider_percentage = 0
        if token_holders and len(token_holders) > 0:
            # Consider top holder percentage as a simple metric
            top_holder = token_holders[0]
            insider_percentage = float(top_holder.get('uiAmount', 0)) / float(token_info.get('supply', 1)) * 100
        
        # Determine if LP is burned (simplified check - would need more complex logic in production)
        lp_burned = False  # This would require checking specific LP token addresses
        
        # Calculate scam probability based on simple heuristics
        scam_probability = 0.0
        risk_factors = []
        
        # Check for high insider percentage
        if insider_percentage > 20:
            scam_probability += 0.3
            risk_factors.append({
                "factor": "High insider ownership",
                "description": f"Top wallet owns {insider_percentage:.2f}% of supply",
                "severity": "high"
            })
        
        # Check for low liquidity
        liquidity_usd = token_price.get('liquidity', 0)
        if liquidity_usd < 10000:  # Less than $10k liquidity
            scam_probability += 0.2
            risk_factors.append({
                "factor": "Low liquidity",
                "description": f"Only ${liquidity_usd:.2f} in liquidity",
                "severity": "medium"
            })
        
        # Check if LP is not burned
        if not lp_burned:
            scam_probability += 0.1
            risk_factors.append({
                "factor": "LP not burned",
                "description": "Liquidity provider tokens are not burned",
                "severity": "medium"
            })
        
        # Cap probability at 1.0
        scam_probability = min(scam_probability, 1.0)
        
        # Compile token data
        token_data = {
            "symbol": token_info.get('symbol', ''),
            "name": token_info.get('name', ''),
            "address": token_address,
            "image": token_info.get('logoURI', ''),
            "marketCap": token_price.get('marketCap', 0),
            "price": token_price.get('value', 0),
            "volume24h": token_price.get('volume', 0),
            "priceChange24h": token_price.get('priceChange24h', 0),
            "liquidityUSD": liquidity_usd,
            "lpBurned": lp_burned,
            "holderCount": len(token_holders) if token_holders else 0,
            "insiderPercentage": insider_percentage,
            "scamProbability": scam_probability,
            "riskFactors": risk_factors,
            "lastUpdated": datetime.now().isoformat()
        }
        
        return token_data

async def main():
    """Main function to run the scraper"""
    logger.info("Starting Sollarity memecoin scraper")
    
    # Fetch all Raydium pairs
    pairs = await fetch_raydium_pairs()
    logger.info(f"Found {len(pairs)} trading pairs on Raydium")
    
    # Filter for potential memecoins (simplified approach)
    memecoin_candidates = []
    for pair in pairs:
        # Simple filter: look for tokens with "meme" keywords or low market cap
        token_name = pair.get('name', '').lower()
        market_cap = pair.get('marketCap', 0)
        
        if any(keyword in token_name for keyword in ['dog', 'cat', 'pepe', 'meme', 'shib', 'inu']) or \
           (market_cap > 0 and market_cap < 10000000):  # Less than $10M market cap
            memecoin_candidates.append(pair)
    
    logger.info(f"Identified {len(memecoin_candidates)} potential memecoins")
    
    # Analyze top 10 candidates (limit for demo purposes)
    results = []
    for candidate in memecoin_candidates[:10]:
        token_address = candidate.get('mintAddress')
        if token_address:
            logger.info(f"Analyzing token: {candidate.get('name')} ({token_address})")
            token_data = await analyze_token(token_address)
            if token_data:
                results.append(token_data)
            # Be nice to APIs with a small delay
            await asyncio.sleep(1)
    
    # Save results to MongoDB
    if results:
        for token_data in results:
            try:
                # Use upsert to update if exists or insert if new
                db.Coin.update_one(
                    {"address": token_data["address"]},
                    {"$set": token_data},
                    upsert=True
                )
                
                # Also save to price history
                price_history = {
                    "coinAddress": token_data["address"],
                    "timestamp": datetime.now(),
                    "price": token_data["price"],
                    "marketCap": token_data["marketCap"],
                    "volume": token_data["volume24h"],
                    "liquidityUSD": token_data["liquidityUSD"],
                    "holderCount": token_data["holderCount"]
                }
                db.PriceHistory.insert_one(price_history)
                
            except Exception as e:
                logger.error(f"Error saving token data to MongoDB: {str(e)}")
    
    # Also save to a JSON file for backup
    with open('memecoin_data.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    logger.info(f"Scraper completed. Analyzed and saved {len(results)} tokens to MongoDB.")

if __name__ == "__main__":
    asyncio.run(main())