@echo off
echo Installing required Python packages...
pip install pymongo python-dotenv aiohttp

echo.
echo Running updated scraper with 3 tokens...
cd workers
python scraper.py --limit 3

echo.
echo Checking if data was added to MongoDB...
python check_data.py
pause