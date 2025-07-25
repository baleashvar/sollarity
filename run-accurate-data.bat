@echo off
echo Accurate Multi-Source Data Fetcher
echo ==================================

echo 🎯 Fetching BONK, WIF, POPCAT from multiple sources
echo 📊 Jupiter + CoinGecko + Birdeye APIs
echo 💰 Volume-weighted average pricing
echo 🔢 Proper decimal normalization
echo 📈 Real market cap calculation
echo.

cd workers
python accurate_data_fetcher.py

echo.
echo ✅ Accurate data fetched!
echo Check console for price comparisons.
pause