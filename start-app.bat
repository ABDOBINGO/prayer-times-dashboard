@echo off
echo Starting Prayer Times Dashboard...
echo.

:: Start the backend server
start cmd /k "npm run server"

:: Wait for 2 seconds to let the backend server start
timeout /t 2 /nobreak > nul

:: Start the frontend
start cmd /k "npm start"

echo.
echo Both servers are starting...
echo Frontend will be available at: http://localhost:3000
echo Backend is running at: http://localhost:5000
echo.
echo Press any key to close all servers...
pause > nul

:: Kill all node processes when the user presses a key
taskkill /F /IM node.exe > nul 2>&1 