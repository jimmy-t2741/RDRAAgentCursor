#!/bin/bash
# macOSの場合のコマンド
# $1:claude $2:プロンプト

# UTF-8エンコーディングを設定
export LANG=ja_JP.UTF-8
export LC_ALL=ja_JP.UTF-8

# 引数を実行
"$1" "$2"

# 実行後にキー入力待ち
echo ""
echo "処理が完了しました。Enterキーを押してターミナルを閉じてください..."
read -r
