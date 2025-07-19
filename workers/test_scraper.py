#!/usr/bin/env python3
"""
Test script to diagnose scraper issues
"""

import os
import sys
import json
import pymongo
import requests
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv(Path(__file__).parent.parent / "config" / ".env")

# Get environment variables
MONGO_URI = os.getenv("MONGO_URI")
BIRDEYE_API_KEY = os.getenv("BIRDEYE_API_KEY")

def test_mongodb():
    """Test MongoDB connection"""
    print("\n--- Testing MongoDB Connection ---")
    try:
        if not MONGO_URI:
            print("Error: MONGO_URI not found in environment variables")
            return False
            
        print(f"Connecting to: {MONGO_URI}")
        client = pymongo.MongoClient(MONGO_URI)
        
        # Test the connection
        client.admin.command('ping')
        print("MongoDB connection successful!")
        
        # Create a test document
        db = client.sollarity
        test_data = {
            "name": "Test Coin",
            "symbol": "TEST",
            "address": "test123456789",
            "price": 0.001,
            "marketCap": 1000000
        }
        
        # Insert test document
        result = db.coins.insert_one(test_data)
        print(f"Inserted test document with ID: {result.inserted_id}")
        
        # Verify it was inserted
        found = db.coins.find_one({"address": "test123456789"})
        if found:
            print("Test document successfully retrieved")
            
            # Clean up
            db.coins.delete_one({"address": "test123456789"})
            print("Test document deleted")
        else:
            print("Failed to retrieve test document")
            
        return True
    except Exception as e:
        print(f"MongoDB Error: {e}")
        return False

def test_birdeye_api():
    """Test Birdeye API connection"""
    print("\n--- Testing Birdeye API ---")
    try:
        if not BIRDEYE_API_KEY:
            print("Warning: BIRDEYE_API_KEY not found in environment variables")
            print("Attempting to connect without API key...")
        else:
            print("BIRDEYE_API_KEY found in environment variables")
            
        # Set up headers
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json"
        }
        
        if BIRDEYE_API_KEY:
            headers["X-API-KEY"] = BIRDEYE_API_KEY
            
        # Test API endpoint with USDC token address
        url = "https://public-api.birdeye.so/defi/price"
        params = {
            "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"  # USDC on Solana
        }
        
        print(f"Sending request to {url}")
        response = requests.get(url, params=params, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and "data" in data:
                price_data = data.get("data", {})
                print(f"Success! Received price data from Birdeye")
                print(f"USDC price: ${price_data.get('value', 0)}")
                return True
            else:
                print(f"API returned success=false or no data: {data}")
        else:
            print(f"API request failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            
        return False
    except Exception as e:
        print(f"Birdeye API Error: {e}")
        return False

if __name__ == "__main__":
    print("Running diagnostic tests for Sollarity scraper")
    
    # Test MongoDB
    mongodb_ok = test_mongodb()
    
    # Test Birdeye API
    birdeye_ok = test_birdeye_api()
    
    # Summary
    print("\n--- Test Summary ---")
    print(f"MongoDB Connection: {'✓ OK' if mongodb_ok else '✗ FAILED'}")
    print(f"Birdeye API: {'✓ OK' if birdeye_ok else '✗ FAILED'}")
    
    if not mongodb_ok or not birdeye_ok:
        print("\nTroubleshooting steps:")
        if not mongodb_ok:
            print("- Check your MongoDB connection string in config/.env")
            print("- Ensure MongoDB Atlas IP whitelist includes your IP address")
            print("- Verify MongoDB username and password are correct")
        if not birdeye_ok:
            print("- Check your BIRDEYE_API_KEY in config/.env")
            print("- Verify the Birdeye API is currently available")
            print("- Check if you've exceeded API rate limits")