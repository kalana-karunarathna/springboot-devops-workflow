@echo off
setlocal

set "BASEDIR=%~dp0"
set "TOOLS_DIR=%BASEDIR%.tools"
set "MAVEN_DIR=%TOOLS_DIR%\apache-maven-3.9.9"
set "MAVEN_CMD=%MAVEN_DIR%\bin\mvn.cmd"

if not exist "%MAVEN_CMD%" (
  powershell -ExecutionPolicy Bypass -File "%BASEDIR%tools\install-maven.ps1"
)

call "%MAVEN_CMD%" %*
