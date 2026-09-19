@echo off
title Bitcoin Intelligence Launcher
echo ================================================
echo  Bitcoin Traffic Intelligence - Starting...
echo ================================================
cd /d "D:\Analysis Bitcoin\server"
start "BTC Backend (port 5000)" cmd /k "title BTC Backend (port 5000) && node server.js"
cd /d "D:\Analysis Bitcoin\client"
start "BTC Vite Dev (port 5173)" cmd /k "title BTC Vite Dev (port 5173) && npm run dev"
echo.
echo  Waiting for servers...
timeout /t 6 /nobreak >nul
echo  Opening the app in your browser...
start http://localhost:5000
echo  Keep these two console windows open while using the app.
echo  If a window closes, the server for that window is down.
echo  To stop everything, close both console windows.
echo ================================================
exit