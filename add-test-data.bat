@echo off
echo Adding test data to MongoDB...
cd workers
python add_test_data.py
echo.
echo Checking if data was added...
python check_data.py
pause