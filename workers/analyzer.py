#!/usr/bin/env python3
"""
Sollarity - Memecoin Risk Analyzer
This script analyzes memecoin data to determine risk factors and scam probability.
"""

import os
import json
import logging
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
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
logger = logging.getLogger('sollarity-analyzer')

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

def calculate_risk_score(coin_data):
    """
    Calculate a risk score for a memecoin based on various factors.
    
    Args:
        coin_data (dict): Dictionary containing coin metrics
        
    Returns:
        tuple: (risk_score, risk_factors)
    """
    risk_score = 0.0
    risk_factors = []
    
    # Check for low liquidity
    if coin_data.get('liquidityUSD', 0) < 10000:  # Less than $10k liquidity
        risk_factor_weight = min(0.3, 3000 / max(coin_data.get('liquidityUSD', 1), 1))
        risk_score += risk_factor_weight
        risk_factors.append({
            "factor": "Low liquidity",
            "description": f"Only ${coin_data.get('liquidityUSD', 0):,.2f} in liquidity",
            "severity": "high" if risk_factor_weight > 0.2 else "medium"
        })
    
    # Check for high insider ownership
    insider_percentage = coin_data.get('insiderPercentage', 0)
    if insider_percentage > 15:
        risk_factor_weight = min(0.4, (insider_percentage - 15) / 85 * 0.4)
        risk_score += risk_factor_weight
        risk_factors.append({
            "factor": "High insider ownership",
            "description": f"Top wallet owns {insider_percentage:.2f}% of supply",
            "severity": "high" if insider_percentage > 30 else "medium"
        })
    
    # Check if LP is not burned
    if not coin_data.get('lpBurned', False):
        risk_score += 0.15
        risk_factors.append({
            "factor": "LP not burned",
            "description": "Liquidity provider tokens are not burned",
            "severity": "medium"
        })
    
    # Check for low holder count
    holder_count = coin_data.get('holderCount', 0)
    if holder_count < 100:
        risk_factor_weight = min(0.2, (100 - holder_count) / 100 * 0.2)
        risk_score += risk_factor_weight
        risk_factors.append({
            "factor": "Few holders",
            "description": f"Only {holder_count} unique holders",
            "severity": "medium" if holder_count < 50 else "low"
        })
    
    # Check for suspicious price movements
    price_change = coin_data.get('priceChange24h', 0)
    if price_change < -0.5:  # More than 50% drop in 24h
        risk_score += 0.25
        risk_factors.append({
            "factor": "Significant price drop",
            "description": f"{price_change * 100:.2f}% price drop in 24h",
            "severity": "high"
        })
    
    # Cap risk score at 1.0
    risk_score = min(risk_score, 1.0)
    
    return risk_score, risk_factors

def analyze_historical_patterns(coin_address):
    """
    Analyze historical price patterns for a coin to detect manipulation.
    
    Args:
        coin_address (str): The coin's contract address
        
    Returns:
        dict: Analysis results
    """
    # Get historical price data from MongoDB
    price_history = list(db.PriceHistory.find(
        {"coinAddress": coin_address},
        {"_id": 0, "timestamp": 1, "price": 1, "volume": 1}
    ).sort("timestamp", 1))
    
    if not price_history or len(price_history) < 5:
        return {
            "hasEnoughData": False,
            "manipulationDetected": False,
            "pumpAndDumpPattern": False,
            "volatility": 0
        }
    
    # Convert to pandas DataFrame for analysis
    df = pd.DataFrame(price_history)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.set_index('timestamp')
    
    # Calculate volatility
    if len(df) > 1:
        returns = df['price'].pct_change().dropna()
        volatility = returns.std() * np.sqrt(len(returns))
    else:
        volatility = 0
    
    # Detect pump and dump patterns (simplified)
    # Look for rapid price increase followed by rapid decrease
    if len(df) >= 10:
        max_price_idx = df['price'].idxmax()
        max_price = df.loc[max_price_idx, 'price']
        
        # Check if max price is at least 2x the starting price
        start_price = df['price'].iloc[0]
        if max_price >= start_price * 2:
            # Check if price dropped significantly after the peak
            after_peak = df.loc[df.index > max_price_idx]
            if len(after_peak) > 0:
                min_after_peak = after_peak['price'].min()
                if min_after_peak <= max_price * 0.5:
                    pump_and_dump = True
                else:
                    pump_and_dump = False
            else:
                pump_and_dump = False
        else:
            pump_and_dump = False
    else:
        pump_and_dump = False
    
    return {
        "hasEnoughData": True,
        "manipulationDetected": volatility > 0.5,  # High volatility threshold
        "pumpAndDumpPattern": pump_and_dump,
        "volatility": volatility
    }

def update_coin_risk_scores():
    """Update risk scores for all coins in the database"""
    logger.info("Starting risk score update for all coins")
    
    # Get all active coins
    coins = list(db.Coin.find({"isActive": True}))
    logger.info(f"Found {len(coins)} active coins to analyze")
    
    for coin in coins:
        try:
            # Analyze historical patterns
            historical_analysis = analyze_historical_patterns(coin['address'])
            
            # Calculate risk score
            risk_score, risk_factors = calculate_risk_score(coin)
            
            # Add additional risk factors from historical analysis
            if historical_analysis.get('hasEnoughData'):
                if historical_analysis.get('pumpAndDumpPattern'):
                    risk_score = min(risk_score + 0.3, 1.0)
                    risk_factors.append({
                        "factor": "Pump and dump pattern",
                        "description": "Price history shows pump and dump pattern",
                        "severity": "high"
                    })
                
                if historical_analysis.get('manipulationDetected'):
                    risk_score = min(risk_score + 0.2, 1.0)
                    risk_factors.append({
                        "factor": "Unusual volatility",
                        "description": f"Abnormal price volatility detected: {historical_analysis.get('volatility'):.2f}",
                        "severity": "medium"
                    })
            
            # Update the coin in the database
            db.Coin.update_one(
                {"address": coin['address']},
                {
                    "$set": {
                        "scamProbability": risk_score,
                        "riskFactors": risk_factors,
                        "lastUpdated": datetime.now()
                    }
                }
            )
            
            logger.info(f"Updated risk score for {coin['symbol']}: {risk_score:.2f}")
            
        except Exception as e:
            logger.error(f"Error analyzing coin {coin.get('symbol')}: {str(e)}")
    
    logger.info("Completed risk score update for all coins")

def main():
    """Main function to run the analyzer"""
    logger.info("Starting Sollarity memecoin analyzer")
    
    try:
        update_coin_risk_scores()
    except Exception as e:
        logger.error(f"Error in main analyzer process: {str(e)}")
    
    logger.info("Analyzer completed")

if __name__ == "__main__":
    main()