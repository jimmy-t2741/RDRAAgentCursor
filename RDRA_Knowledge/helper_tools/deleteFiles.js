const fs = require('fs');
const path = require('path');
/*
    生成したファイルの削除
*/
// 削除対象のフォルダーパス
const targetFolders = [
    '0_RDRAZeroOne/phase1',
    '0_RDRAZeroOne/phase2',
    '0_RDRAZeroOne/phase3',
    '0_RDRAZeroOne/phase4',
    '1_RDRA',
    '1_RDRA/Validation',
    '2_RDRASpec',
    '2_RDRASpec/Validation',
];

// 削除対象の特定ファイル（オプション）
const targetFiles = ['1_RDRA/関連データ.txt'];

/**
 * 指定されたファイルを削除する関数
 * @param {string} filePath - 削除対象のファイルパス
 */
function deleteSpecificFile(filePath) {
    try {
        // ファイルが存在するかチェック
        if (!fs.existsSync(filePath)) {
            console.log(`ファイルが存在しません: ${filePath}`);
            return false;
        }

        const stats = fs.statSync(filePath);
        
        if (!stats.isFile()) {
            console.log(`指定されたパスはファイルではありません: ${filePath}`);
            return false;
        }

        fs.unlinkSync(filePath);
        console.log(`ファイル削除完了: ${filePath}`);
        return true;
        
    } catch (error) {
        console.error(`ファイル削除エラー: ${filePath} - ${error.message}`);
        return false;
    }
}

/**
 * 複数の特定ファイルを削除する関数
 * @param {string[]} filePaths - 削除対象のファイルパスの配列
 */
function deleteSpecificFiles(filePaths) {
    console.log(`\n=== 特定ファイルの削除開始 ===`);
    
    let successCount = 0;
    let failCount = 0;
    
    filePaths.forEach(filePath => {
        if (deleteSpecificFile(filePath)) {
            successCount++;
        } else {
            failCount++;
        }
    });
    
    console.log(`=== 特定ファイルの削除完了 ===`);
    console.log(`成功: ${successCount}件, 失敗: ${failCount}件`);
}

/**
 * 指定されたフォルダー内のファイルを削除する関数
 * @param {string} folderPath - 削除対象のフォルダーパス
 */
function deleteFilesInFolder(folderPath) {
    try {
        // フォルダーが存在するかチェック
        if (!fs.existsSync(folderPath)) {
            console.log(`フォルダーが存在しません: ${folderPath}`);
            return;
        }

        // フォルダー内のファイル一覧を取得
        const files = fs.readdirSync(folderPath);
        
        if (files.length === 0) {
            console.log(`フォルダーは空です: ${folderPath}`);
            return;
        }

        console.log(`\n=== ${folderPath} のファイル削除開始 ===`);
        
        // 各ファイルを削除
        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isFile()) {
                // .keepファイルは削除しない
                if (file === '.keep') {
                    console.log(`スキップ（.keepファイル）: ${file}`);
                    return;
                }
                
                try {
                    fs.unlinkSync(filePath);
                    console.log(`削除完了: ${file}`);
                } catch (error) {
                    console.error(`ファイル削除エラー: ${file} - ${error.message}`);
                }
            } else if (stats.isDirectory()) {
                console.log(`スキップ（ディレクトリ）: ${file}`);
            }
        });
        
        console.log(`=== ${folderPath} のファイル削除完了 ===`);
        
    } catch (error) {
        console.error(`エラーが発生しました: ${folderPath} - ${error.message}`);
    }
}

/**
 * メイン実行関数
 */
function main() {
    console.log('ファイル削除プログラムを開始します...\n');
    
    // 特定ファイルの削除（targetFilesに指定がある場合）
    if (targetFiles.length > 0) {
        deleteSpecificFiles(targetFiles);
    }
    
    // 各対象フォルダーに対して削除処理を実行
    targetFolders.forEach(folder => {
        deleteFilesInFolder(folder);
    });
    
    console.log('\nすべての削除処理が完了しました。');
}

// プログラム実行
if (require.main === module) {
    main();
}

module.exports = { 
    deleteFilesInFolder, 
    deleteSpecificFile, 
    deleteSpecificFiles, 
    targetFolders, 
    targetFiles 
};