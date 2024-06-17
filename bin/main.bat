@echo off
set AVD_NAME=%1
set ANDROID_HOME="C:\Users\costa\AppData\Local\Android\Sdk"
"%ANDROID_HOME%\emulator\emulator" -avd %AVD_NAME%
