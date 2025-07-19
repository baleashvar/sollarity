#!/usr/bin/env python3
"""
Solana Memecoin Data Analyzer

This script analyzes scraped memecoin data to:
- Identify potential scams
- Calculate risk scores
- Generate trend reports
- Identify promising investment opportunities

Usage:
    python analyzer.py --days 7
"""

import os
import sys
import json
import logging
import argparse
import pymongo
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("analyzer.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("memecoin_analyzer")

# Load environment variables from parent directory
load_dotenv(Path(__file__).parent.parent / "config" / ".env")

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")

class MemeAnalyzer:
    def __init__(self):
        self.db = None
        self.coins_df = None
        self.history_df = None

    def connect_db(self):
        """Connect to MongoDB database"""
        if MONGO_URI:
            try:
                client = pymongo.MongoClient(MONGO_URI)
                self.db = client.sollarity
                logger.info("Connected to MongoDB")
                return True
            except Exception as e:
                logger.error(f"MongoDB connection error: {e}")
        return False

    def load_data(self, days=7):
        """Load coin data from database into pandas DataFrame"""
        if not self.db:
            logger.error("Database not connected")
            return False
        
        try:
            # Get current coins
            coins = list(self.db.coins.find({}))
            self.coins_df = pd.DataFrame(coins)
            
            # Get historical data
            cutoff_date = datetime.now() - timedelta(days=days)
            history = list(self.db.coin_history.find({"timestamp": {"$gte": cutoff_date}}))
            self.history_df = pd.DataFrame(history)
            
            logger.info(f"Loaded {len(self.coins_df)} coins and {len(self.history_df)} historical records")
            return True
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            return False

    def identify_scams(self):
        """Identify potential scam tokens based on various indicators"""
        if self.coins_df is None or len(self.coins_df) == 0:
            logger.error("No coin data available")
            return []
        
        # Filter coins with high scam probability
        high_risk = self.coins_df[self.coins_df['scamProbability'] > 0.7].copy()
        
        # Additional scam indicators
        scam_indicators = []
        for _, coin in high_risk.iterrows():
            indicators = []
            
            # Check for extremely high concentration of holders
            if coin.get('holders', 0) < 10:
                indicators.append("Very few holders")
            
            # Check for LP not burned
            if not coin.get('lpBurned', False):
                indicators.append("LP not burned")
            
            # Check for missing website/socials
            if not coin.get('website') and not coin.get('twitter') and not coin.get('telegram'):
                indicators.append("No website or social media")
            
            # Check for suspicious price movements
            if coin.get('priceChange24h', 0) > 500:  # 500% in 24h is suspicious
                indicators.append("Extreme price increase")
            
            # Add to results if we have indicators
            if indicators:
                scam_indicators.append({
                    "address": coin['address'],
                    "name": coin.get('name', 'Unknown'),
                    "symbol": coin.get('symbol', '???'),
                    "scamProbability": coin['scamProbability'],
                    "indicators": indicators
                })
        
        logger.info(f"Identified {len(scam_indicators)} potential scam tokens")
        return scam_indicators

    def find_trending_coins(self):
        """Find trending coins based on price, volume, and social metrics"""
        if self.coins_df is None or len(self.coins_df) == 0:
            logger.error("No coin data available")
            return []
        
        # Filter out likely scams
        legitimate_coins = self.coins_df[self.coins_df['scamProbability'] < 0.5].copy()
        
        # Calculate trend score based on price change and volume
        legitimate_coins['trendScore'] = (
            legitimate_coins['priceChange24h'].fillna(0) * 0.6 + 
            (legitimate_coins['volume24h'] / legitimate_coins['marketCap'].clip(lower=1)).fillna(0) * 0.4
        )
        
        # Sort by trend score
        trending = legitimate_coins.sort_values('trendScore', ascending=False).head(10)
        
        # Format results
        trending_coins = []
        for _, coin in trending.iterrows():
            trending_coins.append({
                "address": coin['address'],
                "name": coin.get('name', 'Unknown'),
                "symbol": coin.get('symbol', '???'),
                "price": coin.get('price', 0),
                "priceChange24h": coin.get('priceChange24h', 0),
                "marketCap": coin.get('marketCap', 0),
                "volume24h": coin.get('volume24h', 0),
                "trendScore": coin.get('trendScore', 0)
            })
        
        logger.info(f"Identified {len(trending_coins)} trending coins")
        return trending_coins

    def find_safe_investments(self):
        """Find relatively safe investment opportunities"""
        if self.coins_df is None or len(self.coins_df) == 0:
            logger.error("No coin data available")
            return []
        
        # Filter for safer coins
        safe_coins = self.coins_df[
            (self.coins_df['scamProbability'] < 0.3) & 
            (self.coins_df['lpBurned'] == True) &
            (self.coins_df['marketCap'] > 100000)  # At least $100k market cap
        ].copy()
        
        # Calculate safety score
        safe_coins['safetyScore'] = (
            (1 - safe_coins['scamProbability']) * 0.5 +
            (safe_coins['holders'].clip(lower=1, upper=1000) / 1000) * 0.3 +
            (safe_coins['liquidityUSD'] / safe_coins['marketCap'].clip(lower=1)).fillna(0).clip(upper=1) * 0.2
        )
        
        # Sort by safety score
        safest = safe_coins.sort_values('safetyScore', ascending=False).head(10)
        
        # Format results
        safe_investments = []
        for _, coin in safest.iterrows():
            safe_investments.append({
                "address": coin['address'],
                "name": coin.get('name', 'Unknown'),
                "symbol": coin.get('symbol', '???'),
                "price": coin.get('price', 0),
                "marketCap": coin.get('marketCap', 0),
                "holders": coin.get('holders', 0),
                "safetyScore": coin.get('safetyScore', 0)
            })
        
        logger.info(f"Identified {len(safe_investments)} safe investment opportunities")
        return safe_investments

    def generate_market_report(self):
        """Generate overall market report for memecoins"""
        if self.coins_df is None or len(self.coins_df) == 0:
            logger.error("No coin data available")
            return None
        
        try:
            # Calculate market statistics
            total_market_cap = self.coins_df['marketCap'].sum()
            total_volume_24h = self.coins_df['volume24h'].sum()
            avg_price_change = self.coins_df['priceChange24h'].mean()
            
            # Count coins by risk category
            low_risk = len(self.coins_df[self.coins_df['scamProbability'] < 0.3])
            medium_risk = len(self.coins_df[(self.coins_df['scamProbability'] >= 0.3) & 
                                          (self.coins_df['scamProbability'] < 0.7)])
            high_risk = len(self.coins_df[self.coins_df['scamProbability'] >= 0.7])
            
            # Generate report
            report = {
                "timestamp": datetime.now(),
                "totalCoins": len(self.coins_df),
                "totalMarketCap": total_market_cap,
                "totalVolume24h": total_volume_24h,
                "avgPriceChange24h": avg_price_change,
                "riskDistribution": {
                    "lowRisk": low_risk,
                    "mediumRisk": medium_risk,
                    "highRisk": high_risk
                }
            }
            
            # Save report to database
            if self.db:
                self.db.market_reports.insert_one(report)
                logger.info("Market report saved to database")
            
            return report
        except Exception as e:
            logger.error(f"Error generating market report: {e}")
            return None

    def save_analysis_results(self, results):
        """Save analysis results to database"""
        if not self.db:
            logger.error("Database not connected")
            return False
        
        try:
            # Save trending coins
            if 'trending' in results:
                self.db.trending_coins.delete_many({})  # Clear previous results
                if results['trending']:
                    self.db.trending_coins.insert_many(results['trending'])
            
            # Save safe investments
            if 'safe' in results:
                self.db.safe_investments.delete_many({})  # Clear previous results
                if results['safe']:
                    self.db.safe_investments.insert_many(results['safe'])
            
            # Save scam alerts
            if 'scams' in results:
                self.db.scam_alerts.delete_many({})  # Clear previous results
                if results['scams']:
                    self.db.scam_alerts.insert_many(results['scams'])
            
            logger.info("Analysis results saved to database")
            return True
        except Exception as e:
            logger.error(f"Error saving analysis results: {e}")
            return False

    def run(self, days=7):
        """Run the full analysis pipeline"""
        # Connect to database
        if not self.connect_db():
            return False
        
        # Load data
        if not self.load_data(days):
            return False
        
        # Run analyses
        scams = self.identify_scams()
        trending = self.find_trending_coins()
        safe = self.find_safe_investments()
        report = self.generate_market_report()
        
        # Compile results
        results = {
            "scams": scams,
            "trending": trending,
            "safe": safe,
            "report": report
        }
        
        # Save results
        self.save_analysis_results(results)
        
        return results

def main():
    parser = argparse.ArgumentParser(description="Analyze Solana memecoin data")
    parser.add_argument("--days", type=int, default=7, help="Number of days of historical data to analyze")
    args = parser.parse_args()
    
    analyzer = MemeAnalyzer()
    results = analyzer.run(args.days)
    
    if results:
        # Print summary
        print(f"\nAnalysis Summary:")
        print(f"- Identified {len(results['scams'])} potential scam tokens")
        print(f"- Found {len(results['trending'])} trending coins")
        print(f"- Recommended {len(results['safe'])} safer investment options")
        
        if results['report']:
            print(f"\nMarket Overview:")
            print(f"- Total Market Cap: ${results['report']['totalMarketCap']:,.2f}")
            print(f"- 24h Volume: ${results['report']['totalVolume24h']:,.2f}")
            print(f"- Avg 24h Price Change: {results['report']['avgPriceChange24h']:.2f}%")

if __name__ == "__main__":
    main()