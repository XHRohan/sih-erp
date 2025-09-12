@echo off
echo Starting Online Classroom System...
echo.

echo Installing server dependencies...
cd server
call npm install
echo.

echo Starting Socket.IO server...
start "Socket.IO Server" cmd /k "npm start"
echo Socket.IO server started on port 3001
echo.

echo Waiting 3 seconds for server to initialize...
timeout /t 3 /nobreak > nul

cd ..
echo Starting Next.js application...
start "Next.js App" cmd /k "npm run dev"
echo Next.js app will start on port 3000
echo.

echo Both servers are starting...
echo - Socket.IO Server: http://localhost:3001
echo - Next.js App: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul