import requests
import json
from accurate_data_fetcher import get_jupiter_price, get_coingecko_data, get_birdeye_data, TOKENS

def test_bonk_accuracy():
    """Test BONK price accuracy across sources"""
    bonk_info = TOKENS['BONK']
    address = bonk_info['address']
    
    print("🧪 Testing BONK Price Accuracy")
    print("=" * 40)
    
    # Test each source
    jupiter_price = get_jupiter_price(address)
    coingecko_data = get_coingecko_data(address)
    birdeye_data = get_birdeye_data(address)
    
    print(f"Token: {bonk_info['name']} ({bonk_info['symbol']})")
    print(f"Address: {address}")
    print(f"Decimals: {bonk_info['decimals']}")
    print()
    
    # Compare prices
    print("📊 Price Comparison:")
    if jupiter_price:
        print(f"Jupiter:   ${jupiter_price:.8f}")
    else:
        print("Jupiter:   ❌ Failed")
        
    if coingecko_data:
        print(f"CoinGecko: ${coingecko_data['price']:.8f}")
        print(f"Market Cap: ${coingecko_data['market_cap']:,.0f}")
        print(f"Volume 24h: ${coingecko_data['volume_24h']:,.0f}")
    else:
        print("CoinGecko: ❌ Failed")
        
    if birdeye_data:
        print(f"Birdeye:   ${birdeye_data['price']:.8f}")
        print(f"Liquidity: ${birdeye_data['liquidity']:,.0f}")
    else:
        print("Birdeye:   ❌ Failed")
    
    # Calculate variance
    prices = []
    if jupiter_price: prices.append(jupiter_price)
    if coingecko_data: prices.append(coingecko_data['price'])
    if birdeye_data: prices.append(birdeye_data['price'])
    
    if len(prices) > 1:
        avg_price = sum(prices) / len(prices)
        max_variance = max(abs(p - avg_price) / avg_price * 100 for p in prices)
        print(f"\n📈 Price Variance: {max_variance:.2f}%")
        
        if max_variance < 5:
            print("✅ Price accuracy: GOOD (< 5% variance)")
        elif max_variance < 10:
            print("⚠️  Price accuracy: MODERATE (5-10% variance)")
        else:
            print("❌ Price accuracy: POOR (> 10% variance)")
    
    return {
        'jupiter': jupiter_price,
        'coingecko': coingecko_data,
        'birdeye': birdeye_data
    }

def test_database_data():
    """Test data stored in database"""
    try:
        response = requests.get('http://localhost:5000/api/coins', timeout=5)
        if response.status_code == 200:
            coins = response.json()
            
            print("\n🗄️  Database Test:")
            print("=" * 40)
            
            bonk_coin = next((c for c in coins if c['symbol'] == 'BONK'), None)
            if bonk_coin:
                print(f"✅ BONK found in database")
                print(f"Price: ${bonk_coin['price']:.8f}")
                print(f"Market Cap: ${bonk_coin['marketCap']:,.0f}")
                print(f"Volume 24h: ${bonk_coin['volume24h']:,.0f}")
                print(f"Decimals: {bonk_coin.get('decimals', 'N/A')}")
                
                # Test CoinGecko comparison
                coingecko_data = get_coingecko_data(TOKENS['BONK']['address'])
                if coingecko_data:
                    db_price = bonk_coin['price']
                    cg_price = coingecko_data['price']
                    variance = abs(db_price - cg_price) / cg_price * 100
                    
                    print(f"\n📊 CoinGecko Comparison:")
                    print(f"Database:  ${db_price:.8f}")
                    print(f"CoinGecko: ${cg_price:.8f}")
                    print(f"Variance:  {variance:.2f}%")
                    
                    if variance < 2:
                        print("✅ Database accuracy: EXCELLENT")
                    elif variance < 5:
                        print("✅ Database accuracy: GOOD")
                    else:
                        print("⚠️  Database accuracy: NEEDS IMPROVEMENT")
            else:
                print("❌ BONK not found in database")
        else:
            print("❌ Cannot connect to server")
    except:
        print("❌ Server not running or unreachable")

def test_price_history():
    """Test price history endpoint"""
    try:
        bonk_address = TOKENS['BONK']['address']
        response = requests.get(f'http://localhost:5000/api/analytics/history?address={bonk_address}&timeframe=24h', timeout=5)
        
        print("\n📈 Price History Test:")
        print("=" * 40)
        
        if response.status_code == 200:
            data = response.json()
            points = data.get('points', data) if isinstance(data, dict) else data
            
            print(f"✅ Price history retrieved")
            print(f"Data points: {len(points)}")
            
            if points:
                first_point = points[0]
                last_point = points[-1]
                print(f"First: ${first_point['price']:.8f} at {first_point['timestamp']}")
                print(f"Last:  ${last_point['price']:.8f} at {last_point['timestamp']}")
                
                # Test different timeframes
                timeframes = ['1h', '24h', '7d', '30d']
                for tf in timeframes:
                    tf_response = requests.get(f'http://localhost:5000/api/analytics/history?address={bonk_address}&timeframe={tf}', timeout=5)
                    if tf_response.status_code == 200:
                        tf_data = tf_response.json()
                        tf_points = tf_data.get('points', tf_data) if isinstance(tf_data, dict) else tf_data
                        print(f"  {tf}: {len(tf_points)} points")
                    else:
                        print(f"  {tf}: ❌ Failed")
            else:
                print("⚠️  No price history data")
        else:
            print("❌ Price history endpoint failed")
    except:
        print("❌ Cannot test price history")

def run_all_tests():
    """Run all accuracy tests"""
    print("🚀 Starting Accuracy Tests")
    print("=" * 50)
    
    # Test 1: API accuracy
    api_results = test_bonk_accuracy()
    
    # Test 2: Database accuracy
    test_database_data()
    
    # Test 3: Price history
    test_price_history()
    
    print("\n" + "=" * 50)
    print("🏁 Testing Complete!")
    print("\nNext Steps:")
    print("1. If prices don't match CoinGecko, check API keys")
    print("2. If database is empty, run: run-accurate-data.bat")
    print("3. If server errors, check: npm start in server folder")
    print("4. Compare results with CoinGecko.com manually")

if __name__ == "__main__":
    run_all_tests()