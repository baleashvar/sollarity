@echo off
echo Installing dependencies for Sollarity project...

echo.
echo === Installing client dependencies ===
cd client
call npm install
cd ..

echo.
echo === Installing server dependencies ===
cd server
call npm install
cd ..

echo.
echo === Creating Python virtual environment and installing dependencies ===
cd workers
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
echo Virtual environment created and activated. Use 'venv\Scripts\activate.bat' to activate it in the future.
cd ..

echo.
echo All dependencies installed successfully!
pause