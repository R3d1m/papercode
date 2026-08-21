@echo off
title PaperCode Local Runner
echo ========================================================
echo Starting PaperCode (Backend on 5000 + Frontend on 3000)
echo ========================================================
echo.

start "PaperCode Backend (Port 5000)" cmd /k "npm run server"
start "PaperCode Frontend (Port 3000)" cmd /k "npm run dev"

echo Both servers launched!
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:5000
