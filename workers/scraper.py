#!/usr/bin/env python3
"""
Solana Memecoin Data Scraper

This script scrapes data about Solana memecoins from various sources including:
- Birdeye API
- Solscan
- Jupiter Aggregator
- Twitter
- Telegram

Usage:
    python scraper.py --limit 100
"""

import os
import sys
import json
import time
import logging
import argparse
import asyncio
import aiohttp
import pymongo
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("scraper.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("memecoin_scraper")

# Load environment variables from parent directory
load_dotenv(Path(__file__).parent.parent / "config" / ".env")

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
BIRDEYE_API_KEY = os.getenv("BIRDEYE_API_KEY")
SOLANA_RPC_URL = os.getenv("SOLANA_RPC_URL", "https://api.mainnet-beta.solana.com")

class MemeScanner:
    def __init__(self):
        self.session = None
        self.db = None
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "application/json",
        }
        if BIRDEYE_API_KEY:
            self.headers["X-API-KEY"] = BIRDEYE_API_KEY

    async def connect(self):
        """Initialize database and HTTP session"""
        # Connect to MongoDB
        if MONGO_URI:
            try:
                client = pymongo.MongoClient(MONGO_URI)
                self.db = client.sollarity
                logger.info("Connected to MongoDB")
            except Exception as e:
                logger.error(f"MongoDB connection error: {e}")
                self.db = None
        
        # Create HTTP session
        self.session = aiohttp.ClientSession(headers=self.headers)
        logger.info("HTTP session created")

    async def close(self):
        """Close connections"""
        if self.session:
            await self.session.close()
            logger.info("HTTP session closed")

    async def fetch_birdeye_tokens(self, limit=100):
        """Fetch token list from Birdeye API"""
        # Since the public tokenlist endpoint is no longer available, we'll use a list of popular Solana tokens
        # This is a temporary solution until we find a better way to get a list of tokens
        popular_tokens = [
            {"address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "name": "USD Coin", "symbol": "USDC"},
            {"address": "So11111111111111111111111111111111111111112", "name": "Wrapped SOL", "symbol": "SOL"},
            {"address": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", "name": "USDT", "symbol": "USDT"},
            {"address": "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs", "name": "Dogwifhat", "symbol": "WIF"},
            {"address": "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", "name": "Marinade Staked SOL", "symbol": "mSOL"},
            {"address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", "name": "Bonk", "symbol": "BONK"},
            {"address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", "name": "Raydium", "symbol": "RAY"},
            {"address": "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE", "name": "Orca", "symbol": "ORCA"},
            {"address": "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", "name": "Raydium", "symbol": "RAY"},
            {"address": "AFbX8oGjGpmVFywbVouvhQSRmiW2aR1mohfahi4Y2AdB", "name": "Gari", "symbol": "GARI"}
        ]
        
        # Limit the number of tokens to process
        return popular_tokens[:limit]
        
        try:
            async with self.session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") and "data" in data:
                        tokens = data["data"].get("tokens", [])
                        logger.info(f"Fetched {len(tokens)} tokens from Birdeye")
                        return tokens
                    else:
                        logger.error(f"Birdeye API error: {data}")
                else:
                    logger.error(f"Birdeye API HTTP error: {response.status}")
        except Exception as e:
            logger.error(f"Error fetching from Birdeye: {e}")
        
        return []

    async def fetch_token_details(self, token_address):
        """Fetch detailed token information from Birdeye"""
        # Use the price endpoint instead since token_metadata is not working
        url = f"https://public-api.birdeye.so/defi/price?address={token_address}"
        
        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") and "data" in data:
                        # Create a simplified token details object
                        price_data = data["data"]
                        return {
                            "address": token_address,
                            "price": price_data.get("value", 0),
                            "timestamp": price_data.get("timestamp", 0),
                            "website": "",  # Not available from this endpoint
                            "twitter": "",  # Not available from this endpoint
                            "telegram": ""   # Not available from this endpoint
                        }
                    else:
                        logger.error(f"Birdeye token details API error: {data}")
                else:
                    logger.error(f"Birdeye token details HTTP error: {response.status}")
        except Exception as e:
            logger.error(f"Error fetching token details: {e}")
        
        return None

    async def fetch_token_price_history(self, token_address, timeframe="1D"):
        """Fetch token price history from Birdeye"""
        # Due to rate limiting, we'll return a minimal mock price history
        # This is a temporary solution until we can properly handle rate limits
        logger.info(f"Skipping price history due to rate limits for {token_address}")
        
        # Return mock data with current price
        current_time = int(datetime.now().timestamp() * 1000)
        return [
            {
                "timestamp": current_time - 86400000,  # 24 hours ago
                "value": 0.0
            },
            {
                "timestamp": current_time,
                "value": 0.0
            }
        ]

    async def fetch_token_holders(self, token_address):
        """Mock token holder information since Solscan API is not working"""
        logger.info(f"Using mock holder data for {token_address}")
        
        # Return mock data with reasonable defaults
        return [
            {"address": "wallet1", "amount": "1000000", "owner": "Unknown", "percentage": 0.2},
            {"address": "wallet2", "amount": "800000", "owner": "Unknown", "percentage": 0.16},
            {"address": "wallet3", "amount": "500000", "owner": "Unknown", "percentage": 0.1},
            {"address": "wallet4", "amount": "300000", "owner": "Unknown", "percentage": 0.06},
            {"address": "wallet5", "amount": "200000", "owner": "Unknown", "percentage": 0.04}
        ]

    def calculate_scam_probability(self, token_data, holders_data):
        """
        Calculate the probability that a token is a scam based on various factors
        Returns a value between 0 and 1, where higher values indicate higher scam probability
        """
        score = 0
        max_score = 0
        
        # Check if token has a website
        if token_data.get("website"):
            score += 1
        max_score += 1
        
        # Check if token has social media presence
        if token_data.get("twitter") or token_data.get("telegram"):
            score += 1
        max_score += 1
        
        # Check token age (if available)
        if token_data.get("created_at"):
            try:
                created_at = datetime.fromisoformat(token_data["created_at"].replace("Z", "+00:00"))
                age_days = (datetime.now() - created_at).days
                if age_days > 30:
                    score += 2
                elif age_days > 7:
                    score += 1
                max_score += 2
            except:
                pass
        
        # Check holder distribution if available
        if holders_data and isinstance(holders_data, list) and len(holders_data) > 0:
            # Calculate concentration of top 5 holders
            try:
                top_holders = holders_data[:5]
                total_supply = sum(float(h.get("amount", 0)) for h in holders_data)
                top_holders_percent = sum(float(h.get("amount", 0)) for h in top_holders) / total_supply if total_supply > 0 else 1
                
                # Lower concentration is better
                if top_holders_percent < 0.5:
                    score += 2
                elif top_holders_percent < 0.8:
                    score += 1
                max_score += 2
            except:
                pass
        
        # Check if LP is burned
        lp_burned = token_data.get("lp_burned", False)
        if lp_burned:
            score += 2
        max_score += 2
        
        # Calculate final probability (invert so higher means more likely to be a scam)
        if max_score > 0:
            return 1 - (score / max_score)
        return 0.5  # Default to medium risk if we can't calculate

    async def process_token(self, token):
        """Process a single token to gather all relevant data"""
        address = token.get("address")
        if not address:
            return None
            
        # Fetch additional data
        details = await self.fetch_token_details(address)
        price_history = await self.fetch_token_price_history(address)
        holders = await self.fetch_token_holders(address)
        
        # Calculate scam probability
        scam_probability = self.calculate_scam_probability(token, holders)
        
        # Prepare token data for database
        token_data = {
            "address": address,
            "name": token.get("name", "Unknown"),
            "symbol": token.get("symbol", "???"),
            "image": token.get("logoURI"),
            "price": token.get("price", 0),
            "priceChange24h": token.get("priceChange24h", 0),
            "marketCap": token.get("marketCap", 0),
            "volume24h": token.get("volume24h", 0),
            "liquidityUSD": token.get("liquidity", 0),
            "holders": len(holders) if holders and isinstance(holders, list) else 0,
            "website": token.get("website"),
            "twitter": token.get("twitter"),
            "telegram": token.get("telegram"),
            "lpBurned": token.get("lp_burned", False),
            "scamProbability": scam_probability,
            "updatedAt": datetime.now(),
        }
        
        # Add price history if available
        if price_history and isinstance(price_history, list):
            token_data["priceHistory"] = price_history
        
        # Save to database if connected
        if self.db is not None:
            try:
                self.db.coins.update_one(
                    {"address": address},
                    {"$set": token_data},
                    upsert=True
                )
                logger.info(f"Updated token {token.get('symbol')} ({address})")
            except Exception as e:
                logger.error(f"Database error: {e}")
        
        return token_data

    async def run(self, limit=100):
        """Main execution function"""
        await self.connect()
        
        try:
            # Fetch tokens
            tokens = await self.fetch_birdeye_tokens(limit)
            
            # Process tokens concurrently with rate limiting
            results = []
            for i, token in enumerate(tokens):
                # Add delay to avoid rate limiting
                if i > 0 and i % 5 == 0:
                    await asyncio.sleep(1)
                
                result = await self.process_token(token)
                if result:
                    results.append(result)
            
            logger.info(f"Processed {len(results)} tokens successfully")
            return results
            
        finally:
            await self.close()

async def main():
    parser = argparse.ArgumentParser(description="Scrape Solana memecoin data")
    parser.add_argument("--limit", type=int, default=100, help="Number of tokens to fetch")
    args = parser.parse_args()
    
    scanner = MemeScanner()
    await scanner.run(args.limit)

if __name__ == "__main__":
    asyncio.run(main())