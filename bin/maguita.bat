@echo off
cd %~dp0
set PATH=%PATH%;"%~dp0"
cd ..
node bin\maguita.exe.js %*