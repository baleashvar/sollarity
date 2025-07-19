@echo off
echo Restoring original React files...

cd client
if exist src\App.jsx.bak (
  del src\App.jsx
  ren src\App.jsx.bak App.jsx
  echo Restored App.jsx
)

if exist src\index.js.bak (
  del src\index.js
  ren src\index.js.bak index.js
  echo Restored index.js
)

if exist src\App.css.bak (
  del src\App.css
  ren src\App.css.bak App.css
  echo Restored App.css
)

echo Files restored successfully!