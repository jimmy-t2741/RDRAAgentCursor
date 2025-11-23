# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### changed

- 妥当性検証ストーリー作成ナレッジの追加
  - `/2_RDRASpec/Validation/Spec妥当性検証ストーリー.md`
- フォルダー構成のルール修正
  - `/.cursor/rules/common.mdc`
- RDRAZeroOne指示ファイルの修正
  - `/RDRA_Knowledge/0_ZeroOne指示.md`
- 不要な処理の削除
  - `/RDRA_Knowledge/helper_tools/makeZeroOneData.js`
- RDRAスプレッドシート展開コマンド実行後の出力メッセージの修正
  - `/.cursor/commands/02-RDRA/02-RDRASpressheetに展開.md`

## [0.6.1] - 2025-11-15

### Changed

- gitignoreのファイル追加
  - 成果物フォルダ下の`.keep`以外のファイル
    - `/0_RDRAZeroOne`
    - `/1_RDRA`
    - `/2_RDRASpec`
  - `初期要望.txt`
  - `妥当性検証環境.csv`
- ファイル名の変更
  - `/初期要望.txt` → `/初期要望.sample.txt`
  - `/妥当性検証環境.csv` → `/妥当性検証環境.sample.csv`
- READMEの修正
  - `初期要望.txt`と`妥当性検証環境.csv`の作り方を追記
  - 推奨拡張機能の追記


## [0.6.0] - 2025-11-13

### Added

- 神崎さんが作成した[RDRAAgent_v0.6](https://github.com/kanzaki/RDRAAgent_v0.6)をベースに、Cursorで活用できるように変換
  - 4フェーズのRDRA定義プロセス実装
  - RDRAGraph連携機能
  - 画面プロトタイプ表示機能
  - アクター別画面表示機能
  - 妥当性検証機能
