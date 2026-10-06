@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "PKG=hre.dev.springboot_backend"
set "LEVEL=INFO"

if /i not "%~1"=="run" goto usage

rem En .cmd el "=" separa argumentos: "-log=debug" llega como %2=-log y %3=debug
if "%~2"=="" goto start
if /i not "%~2"=="-log" goto usage
set "LEVEL="
for %%L in (ERROR WARN INFO DEBUG TRACE) do if /i "%~3"=="%%L" set "LEVEL=%%L"
if not defined LEVEL goto usage

:start
echo Nivel de log (%PKG%): %LEVEL%
call .\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--logging.level.%PKG%=%LEVEL%"
exit /b %errorlevel%

:usage
echo Uso: spring-task run [-log=error^|warn^|info^|debug^|trace]
echo   -log   opcional, por defecto info
exit /b 1