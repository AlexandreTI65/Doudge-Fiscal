@echo off
REM Script para subir o sistema Classificação Fiscal NCM com IA automaticamente

REM Verifica se o Docker Desktop está rodando
REM Verifica se o Docker Desktop está rodando
tasklist /FI "IMAGENAME eq Docker Desktop.exe" 2>NUL | find /I /N "Docker Desktop.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Docker Desktop já está em execução.
) else (
    echo Iniciando Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    REM Aguarda o Docker Desktop iniciar completamente
    :waitloop
    timeout /t 5 >nul
    tasklist /FI "IMAGENAME eq Docker Desktop.exe" 2>NUL | find /I /N "Docker Desktop.exe">NUL
    if "%ERRORLEVEL%"=="0" goto docker_ready
    goto waitloop
    :docker_ready
    echo Docker Desktop iniciado.
    REM Aguarda o daemon do Docker responder
    :check_docker
    docker info >nul 2>&1
    if "%ERRORLEVEL%"=="0" goto docker_ok
    echo Aguardando o Docker daemon iniciar...
    timeout /t 3 >nul
    goto check_docker
    :docker_ok
    echo Docker daemon pronto.
)

cd /d "%~dp0"

REM Sobe os containers
cd classificacao-fiscal

echo Iniciando containers Docker...
docker compose up --build
