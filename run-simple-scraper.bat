@echo off
echo Installing required Python packages...
pip install pymongo python-dotenv

echo.
echo Running simple scraper...
cd workers
python simple_scraper.py

echo.
echo Checking if data was added to MongoDB...
python check_data.py
pause