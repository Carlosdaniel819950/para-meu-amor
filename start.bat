@echo off
echo ========================================
echo    PARA MEU AMOR - SERVIDOR PRIVADO
echo ========================================
echo.
echo Iniciando servidor...
echo.
echo Coloque suas fotos na pasta assets/ com os nomes:
echo - foto1.jpg
echo - foto2.jpg  
echo - foto3.jpg
echo.
echo Senhas configuradas: 13/09/2025, 14/09/2025, 13092025, 14092025
echo.
echo Abra http://localhost:3000 no navegador
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
pause
set SITE_PASSWORDS=13/09/2025,14/09/2025,13092025,14092025
node server.js