@echo off
echo Starting deployment process for Prayer Times Dashboard...
echo.

:: Check if netlify-cli is installed
where netlify >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing netlify-cli globally...
    npm install -g netlify-cli
)

:: Install dependencies
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing dependencies
    pause
    exit /b %errorlevel%
)

:: Build the project
echo.
echo Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo Error building project
    pause
    exit /b %errorlevel%
)

:: Deploy to Netlify
echo.
echo Deploying to Netlify...
netlify deploy --prod --dir=build

echo.
echo Deployment process completed!
echo Please add these EXACT environment variables in your Netlify dashboard:
echo.
echo 1. REACT_APP_SUPABASE_URL
echo    Value: https://klexiojzlwxjhdxgszks.supabase.co
echo.
echo 2. REACT_APP_SUPABASE_KEY
echo    Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsZXhpb2p6bHd4amhkeGdzemtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzgzMTczMSwiZXhwIjoyMDQ5NDA3NzMxfQ.9uZdYl2UlE2KEWDhB5HjyuhU-ImMRJ4vTu5dapklWXU
echo.
echo 3. REACT_APP_SMTP_USER
echo    Value: knight007youtu@gmail.com
echo.
echo 4. REACT_APP_SMTP_PASS
echo    Value: iqbg knti cmho msle
echo.
echo 5. REACT_APP_SMTP_PORT
echo    Value: 465
echo.
echo 6. REACT_APP_DASHBOARD_PASSWORD
echo    Value: ABDOKNIGHT2007@2009
echo.
echo 7. REACT_APP_BACKEND_URL
echo    Value: https://prayer-times-dashboard-backend.onrender.com
echo.
echo Steps to add environment variables:
echo 1. Go to your Netlify dashboard
echo 2. Go to Site settings ^> Environment variables
echo 3. Add each variable and its value exactly as shown above
echo.
echo Press any key to exit...
pause > nul 