@echo off
rem Windowsの場合のコマンド
chcp 65001 >nul
rem %1:claude %2"llm_menu.mdファイルの「menu()」を実行する"
%1 %2
pause
