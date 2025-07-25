@echo off
echo Full Debug Process
echo ==================

echo Step 1: Check database collections
cd workers
python check_collections.py

echo.
echo Step 2: Force populate data
python force_populate.py

echo.
echo Step 3: Check data again
python check_collections.py

echo.
echo Step 4: Test API endpoints
cd ..
call test-api-direct.bat

pause