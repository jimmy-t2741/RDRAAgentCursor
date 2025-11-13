# RDRAGraphを表示

## 目的

0_RDRAZeroOneで作成したモデルをRDRAGraphで確認します

## 前提条件

- `1_RDRA/` にRDRA定義ファイルが含まれていること
- Linuxの場合、`xclip`がインストールされていること（または`xsel --clipboard --input`を使用）

## 実施内容

以下のコマンドをターミナルで実行してください（OSに応じて選択）：

### MacOS

```bash
node RDRA_Knowledge/helper_tools/makeGraphData.js
cat "1_RDRA/関連データ.txt" | pbcopy
open "https://vsa.co.jp/rdratool/graph/v0.94/index.html?clipboard"
```

### Linux

```bash
node RDRA_Knowledge/helper_tools/makeGraphData.js
cat "1_RDRA/関連データ.txt" | xclip -selection clipboard
xdg-open "https://vsa.co.jp/rdratool/graph/v0.94/index.html?clipboard"
```

### Windows (コマンドプロンプト)

```cmd
node RDRA_Knowledge\helper_tools\makeGraphData.js
type "1_RDRA\関連データ.txt" | clip
start https://vsa.co.jp/rdratool/graph/v0.94/index.html?clipboard
```
