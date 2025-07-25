import requests
import json

def test_api():
    """Test server API endpoints"""
    print("🧪 Testing Server API")
    print("=" * 30)
    
    # Test 1: Get coins
    try:
        response = requests.get('http://localhost:5000/api/coins', timeout=10)
        print(f"GET /api/coins: {response.status_code}")
        if response.status_code == 200:
            coins = response.json()
            print(f"  Found {len(coins)} coins")
            bonk = next((c for c in coins if c['symbol'] == 'BONK'), None)
            if bonk:
                print(f"  ✅ BONK found: {bonk['address'][:10]}...")
            else:
                print("  ❌ BONK not found in coins")
        else:
            print(f"  ❌ Error: {response.text}")
    except Exception as e:
        print(f"  ❌ Connection error: {e}")
    
    print()
    
    # Test 2: Get BONK price history
    bonk_address = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
    try:
        url = f'http://localhost:5000/api/analytics/history?address={bonk_address}&timeframe=24h'
        response = requests.get(url, timeout=10)
        print(f"GET /api/analytics/history: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            points = data.get('points', [])
            print(f"  Found {len(points)} price points")
            if points:
                print(f"  ✅ First point: ${points[0]['c']:.8f}")
                print(f"  ✅ Last point: ${points[-1]['c']:.8f}")
                print(f"  ✅ Time range: {len(points)} points")
            else:
                print("  ❌ No price points returned")
                print(f"  Response: {data}")
        else:
            print(f"  ❌ Error: {response.text}")
    except Exception as e:
        print(f"  ❌ Connection error: {e}")

if __name__ == "__main__":
    test_api()