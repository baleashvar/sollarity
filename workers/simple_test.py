import time
import requests

def wait_and_test():
    """Wait for server and test"""
    print("⏰ Waiting for server to start...")
    
    for i in range(10):
        try:
            response = requests.get('http://localhost:5000/health', timeout=2)
            if response.status_code == 200:
                print("✅ Server is running!")
                break
        except:
            print(f"  Attempt {i+1}/10...")
            time.sleep(2)
    else:
        print("❌ Server not responding")
        return
    
    # Test BONK data
    try:
        bonk_address = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
        url = f'http://localhost:5000/api/analytics/history?address={bonk_address}&timeframe=24h'
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            points = data.get('points', [])
            print(f"📊 BONK data: {len(points)} points")
            if points:
                print(f"  First: ${points[0]['c']:.8f}")
                print(f"  Last: ${points[-1]['c']:.8f}")
                print("✅ Charts should work now!")
            else:
                print("❌ No data points")
        else:
            print(f"❌ API error: {response.status_code}")
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    wait_and_test()