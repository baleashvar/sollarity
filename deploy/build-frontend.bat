@echo off
echo Building Sollarity Frontend for AWS S3...

cd ..\client
npm install
npm run build

echo Frontend build completed!
echo Build files are in client\build\
echo Ready to upload to S3 bucket