@echo off
echo Installing required Python packages...
pip install pymongo python-dotenv

echo.
echo Running scraper (limited to 10 coins for testing)...
cd workers
python scraper.py --limit 10

echo.
echo Checking if data was added to MongoDB...
python check_data.py
pause