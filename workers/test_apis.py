import requests
import os
from dotenv import load_dotenv

load_dotenv('../config/.env')

def test_coingecko():
    """Test CoinGecko API"""
    try:
        address = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'  # BONK
        url = f"https://api.coingecko.com/api/v3/simple/token_price/solana"
        params = {
            'contract_addresses': address,
            'vs_currencies': 'usd'
        }
        response = requests.get(url, params=params, timeout=10)
        print(f"CoinGecko Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"CoinGecko Response: {data}")
            if address in data:
                price = data[address]['usd']
                print(f"✅ CoinGecko BONK Price: ${price}")
                return True
        return False
    except Exception as e:
        print(f"❌ CoinGecko Error: {e}")
        return False

def test_birdeye():
    """Test Birdeye API"""
    try:
        address = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'  # BONK
        headers = {'X-API-KEY': os.getenv('BIRDEYE_API_KEY')}
        url = f"https://public-api.birdeye.so/defi/price"
        params = {'address': address}
        response = requests.get(url, headers=headers, params=params, timeout=10)
        print(f"Birdeye Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Birdeye Response: {data}")
            if data.get('success') and data.get('data', {}).get('value'):
                price = data['data']['value']
                print(f"✅ Birdeye BONK Price: ${price}")
                return True
        return False
    except Exception as e:
        print(f"❌ Birdeye Error: {e}")
        return False

def test_jupiter():
    """Test Jupiter API"""
    try:
        address = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'  # BONK
        url = f"https://price.jup.ag/v4/price?ids={address}"
        response = requests.get(url, timeout=10)
        print(f"Jupiter Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Jupiter Response: {data}")
            if 'data' in data and address in data['data']:
                price = data['data'][address]['price']
                print(f"✅ Jupiter BONK Price: ${price}")
                return True
        return False
    except Exception as e:
        print(f"❌ Jupiter Error: {e}")
        return False

def main():
    print("🧪 Testing Price APIs")
    print("=" * 30)
    
    coingecko_works = test_coingecko()
    print()
    birdeye_works = test_birdeye()
    print()
    jupiter_works = test_jupiter()
    
    print("\n" + "=" * 30)
    print("📊 API Test Results:")
    print(f"CoinGecko: {'✅ Working' if coingecko_works else '❌ Failed'}")
    print(f"Birdeye:   {'✅ Working' if birdeye_works else '❌ Failed'}")
    print(f"Jupiter:   {'✅ Working' if jupiter_works else '❌ Failed'}")
    
    if not any([coingecko_works, birdeye_works, jupiter_works]):
        print("\n⚠️  All APIs failed! Check your internet connection.")
    else:
        print(f"\n✅ {sum([coingecko_works, birdeye_works, jupiter_works])} API(s) working")

if __name__ == "__main__":
    main()