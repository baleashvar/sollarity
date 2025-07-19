@echo off
echo Rebuilding Tailwind CSS...
cd client
npx tailwindcss -i ./src/App.css -o ./src/tailwind-output.css --watch
echo Done!