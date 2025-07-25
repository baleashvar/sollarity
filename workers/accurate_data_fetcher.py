import requests
import time
import pymongo
from datetime import datetime
import os
from dotenv import load_dotenv
import json

load_dotenv('../config/.env')

client = pymongo.MongoClient(os.getenv('MONGO_URI'))
db = client['test']
coins_collection = db['coins']

# Known token addresses with correct decimals
TOKENS = {
    'BONK': {
        'address': 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        'decimals': 5,
        'name': 'Bonk',
        'symbol': 'BONK'
    },
    'WIF': {
        'address': 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
        'decimals': 6,
        'name': 'dogwifhat',
        'symbol': 'WIF'
    },
    'POPCAT': {
        'address': '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
        'decimals': 9,
        'name': 'Popcat',
        'symbol': 'POPCAT'
    }
}

def get_jupiter_price(token_address):
    """Get price from Jupiter API"""
    try:
        url = f"https://price.jup.ag/v4/price?ids={token_address}"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if token_address in data['data']:
                return float(data['data'][token_address]['price'])
    except:
        pass
    return None

def get_coingecko_data(token_address):
    """Get comprehensive data from CoinGecko"""
    try:
        url = f"https://api.coingecko.com/api/v3/simple/token_price/solana"
        params = {
            'contract_addresses': token_address,
            'vs_currencies': 'usd',
            'include_market_cap': 'true',
            'include_24hr_vol': 'true',
            'include_24hr_change': 'true'
        }
        
        response = requests.get(url, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if token_address in data:
                token_data = data[token_address]
                return {
                    'price': float(token_data.get('usd', 0)),
                    'market_cap': float(token_data.get('usd_market_cap', 0)),
                    'volume_24h': float(token_data.get('usd_24h_vol', 0)),
                    'price_change_24h': float(token_data.get('usd_24h_change', 0)) / 100
                }
    except:
        pass
    return None

def get_birdeye_data(token_address):
    """Get data from Birdeye API"""
    try:
        headers = {'X-API-KEY': os.getenv('BIRDEYE_API_KEY')}
        url = f"https://public-api.birdeye.so/defi/token_overview"
        params = {'address': token_address}
        
        response = requests.get(url, headers=headers, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('data'):
                token_data = data['data']
                return {
                    'price': float(token_data.get('price', 0)),
                    'volume_24h': float(token_data.get('v24hUSD', 0)),
                    'liquidity': float(token_data.get('liquidity', 0)),
                    'market_cap': float(token_data.get('mc', 0))
                }
    except:
        pass
    return None

def get_solana_supply(token_address):
    """Get token supply from Solana RPC"""
    try:
        rpc_url = os.getenv('SOLANA_RPC_URL')
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getTokenSupply",
            "params": [token_address]
        }
        
        response = requests.post(rpc_url, json=payload, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if 'result' in data and 'value' in data['result']:
                supply_info = data['result']['value']
                return {
                    'total_supply': float(supply_info.get('amount', 0)),
                    'decimals': int(supply_info.get('decimals', 0))
                }
    except:
        pass
    return None

def calculate_weighted_price(prices, volumes):
    """Calculate volume-weighted average price"""
    if not prices or not volumes:
        return None
    
    total_volume = sum(volumes)
    if total_volume == 0:
        return sum(prices) / len(prices)  # Simple average if no volume data
    
    weighted_sum = sum(price * volume for price, volume in zip(prices, volumes))
    return weighted_sum / total_volume

def normalize_price(raw_price, decimals):
    """Normalize price based on token decimals"""
    if raw_price and decimals:
        return raw_price / (10 ** decimals)
    return raw_price

def fetch_accurate_token_data(token_info):
    """Fetch accurate data from multiple sources"""
    address = token_info['address']
    decimals = token_info['decimals']
    
    print(f"Fetching data for {token_info['name']}...")
    
    # Get data from multiple sources
    jupiter_price = get_jupiter_price(address)
    coingecko_data = get_coingecko_data(address)
    birdeye_data = get_birdeye_data(address)
    supply_data = get_solana_supply(address)
    
    # Collect prices and volumes for weighted average
    prices = []
    volumes = []
    
    if jupiter_price:
        prices.append(jupiter_price)
        volumes.append(1)  # Default weight
    
    if coingecko_data and coingecko_data['price']:
        prices.append(coingecko_data['price'])
        volumes.append(coingecko_data.get('volume_24h', 1))
    
    if birdeye_data and birdeye_data['price']:
        prices.append(birdeye_data['price'])
        volumes.append(birdeye_data.get('volume_24h', 1))
    
    # Calculate final price
    final_price = calculate_weighted_price(prices, volumes)
    if not final_price and coingecko_data:
        final_price = coingecko_data['price']
    
    # Use CoinGecko as primary source for market data
    market_cap = coingecko_data['market_cap'] if coingecko_data else 0
    volume_24h = coingecko_data['volume_24h'] if coingecko_data else 0
    price_change_24h = coingecko_data['price_change_24h'] if coingecko_data else 0
    
    # Use Birdeye for liquidity if available
    liquidity = birdeye_data['liquidity'] if birdeye_data else market_cap * 0.1
    
    # Calculate market cap from supply if needed
    if supply_data and final_price and not market_cap:
        circulating_supply = supply_data['total_supply'] / (10 ** supply_data['decimals'])
        market_cap = final_price * circulating_supply
    
    return {
        'address': address,
        'name': token_info['name'],
        'symbol': token_info['symbol'],
        'price': round(final_price, 8) if final_price else 0,
        'marketCap': market_cap,
        'volume24h': volume_24h,
        'priceChange24h': price_change_24h,
        'liquidityUSD': liquidity,
        'holderCount': 50000,  # Placeholder - would need Helius API
        'lpBurned': True,  # Placeholder - would need on-chain analysis
        'scamProbability': 0.1,  # Low for established tokens
        'decimals': decimals,
        'lastUpdated': datetime.utcnow(),
        'sources': {
            'jupiter': jupiter_price is not None,
            'coingecko': coingecko_data is not None,
            'birdeye': birdeye_data is not None
        }
    }

def update_accurate_data():
    """Update database with accurate token data"""
    print("🚀 Fetching accurate token data from multiple sources...")
    
    # Clear existing data
    coins_collection.delete_many({})
    
    for token_key, token_info in TOKENS.items():
        try:
            accurate_data = fetch_accurate_token_data(token_info)
            
            if accurate_data['price'] > 0:
                coins_collection.insert_one(accurate_data)
                
                print(f"✅ {token_info['name']}")
                print(f"   Price: ${accurate_data['price']:.8f}")
                print(f"   Market Cap: ${accurate_data['marketCap']:,.0f}")
                print(f"   Volume 24h: ${accurate_data['volume24h']:,.0f}")
                print(f"   Sources: {list(k for k, v in accurate_data['sources'].items() if v)}")
                print()
            else:
                print(f"❌ Failed to get price for {token_info['name']}")
            
            time.sleep(1)  # Rate limiting
            
        except Exception as e:
            print(f"❌ Error processing {token_info['name']}: {e}")
    
    print("✅ Accurate data update completed!")

if __name__ == "__main__":
    update_accurate_data()