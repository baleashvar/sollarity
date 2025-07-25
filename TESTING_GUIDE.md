# Testing Guide - Accurate Data System

## 🧪 Quick Test

```bash
test-accuracy.bat
```

This will:
1. Fetch accurate data from APIs
2. Start server and client
3. Open testing environment

## 📊 Manual Verification Steps

### 1. **Price Accuracy Test**
- Go to [CoinGecko BONK](https://www.coingecko.com/en/coins/bonk)
- Compare with your app's BONK price
- Should match within 2-5%

### 2. **Market Cap Verification**
- Check CoinGecko market cap
- Verify formula: `price × circulating supply`
- Should be close to CoinGecko value

### 3. **Volume & Liquidity Check**
- Compare 24h volume with CoinGecko
- Check liquidity makes sense (usually 10-30% of market cap)

### 4. **Chart Functionality**
- Test all timeframes: 1h, 24h, 7d, 30d
- Verify different data points per timeframe
- Check smooth curves (no vertical lines)

## 🔧 Automated Testing

```bash
cd workers
python test_api_accuracy.py
```

**Expected Output:**
```
🧪 Testing BONK Price Accuracy
========================================
Token: Bonk (BONK)
Address: DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
Decimals: 5

📊 Price Comparison:
Jupiter:   $0.00002341
CoinGecko: $0.00002338
Birdeye:   $0.00002345

📈 Price Variance: 1.2%
✅ Price accuracy: GOOD (< 5% variance)
```

## 🐛 Troubleshooting

### Price Doesn't Match CoinGecko
- Check API keys in `.env`
- Verify token addresses are correct
- Check decimal places (BONK = 5 decimals)

### No Data in Database
```bash
run-accurate-data.bat
```

### Server Errors
```bash
cd server
npm start
```

### Charts Not Loading
```bash
cd client
npm start
```

## ✅ Success Criteria

- **Price Variance**: < 5% from CoinGecko
- **Market Cap**: Calculated correctly
- **Charts**: Smooth curves, different timeframes
- **Data Sources**: Multiple APIs working
- **Real-time**: Fresh data on refresh

## 🎯 Production Checklist

- [ ] BONK price matches CoinGecko ±2%
- [ ] Market cap calculation correct
- [ ] All timeframes show different data
- [ ] Charts display smoothly
- [ ] No API errors in console
- [ ] Database updates successfully
- [ ] Payment system works
- [ ] Mobile responsive

Your system is ready when all tests pass!