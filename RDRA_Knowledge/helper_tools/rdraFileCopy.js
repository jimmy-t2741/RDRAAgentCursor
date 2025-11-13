const fs = require('fs');
const path = require('path');
/*
    以下のファイルを1_RDRAフォルダー
    0_RDRAZeroOne/phase3   => 'アクター.tsv', '外部システム.tsv', 'バリエーション.tsv'
    0_RDRAZeroOne/phase4   => 'BUC.tsv', '情報.tsv', '状態.tsv', '条件.tsv'
*/
// コピー設定
const copyConfig = {
  phase3: {
    sourceDir: '0_RDRAZeroOne/phase3',
    targetDir: '1_RDRA',
    files: ['アクター.tsv', '外部システム.tsv', 'バリエーション.tsv']
  },
  phase4: {
    sourceDir: '0_RDRAZeroOne/phase4',
    targetDir: '1_RDRA',
    files: ['BUC.tsv', '情報.tsv', '状態.tsv', '条件.tsv']
  }
};

// ファイルの存在確認
function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

// ファイルをコピー
function copyFile(source, target) {
  try {
    fs.copyFileSync(source, target);
    console.log(`✓ コピー完了: ${path.basename(source)}`);
    return true;
  } catch (error) {
    console.error(`✗ コピー失敗: ${path.basename(source)} - ${error.message}`);
    return false;
  }
}

// 必要なファイルが存在するかチェック
function validateFiles() {
  console.log('=== ファイル存在チェック ===');
  let allFilesExist = true;
  const missingFiles = [];

  for (const [phase, config] of Object.entries(copyConfig)) {
    console.log(`\n${phase}フォルダーのチェック:`);
    
    for (const fileName of config.files) {
      const filePath = path.join(config.sourceDir, fileName);
      if (checkFileExists(filePath)) {
        console.log(`  ✓ ${fileName} - 存在`);
      } else {
        console.log(`  ✗ ${fileName} - 存在しない`);
        allFilesExist = false;
        missingFiles.push(`${config.sourceDir}/${fileName}`);
      }
    }
  }

  if (!allFilesExist) {
    console.log('\n⚠️  以下のファイルが見つかりません:');
    missingFiles.forEach(file => console.log(`  - ${file}`));
    console.log('\n必要なファイルが揃っていないため、コピーを実行しません。');
    return false;
  }

  return true;
}

// 対象フォルダーの存在確認と作成
function ensureTargetDirectory(targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`対象フォルダーを作成しました: ${targetDir}`);
  }
}

// メイン実行関数
function main() {
  console.log('=== RDRAファイルコピープログラム ===\n');

  // ファイル存在チェック
  if (!validateFiles()) {
    process.exit(1);
  }

  console.log('\n=== ファイルコピー開始 ===');
  
  let successCount = 0;
  let totalFiles = 0;

  for (const [phase, config] of Object.entries(copyConfig)) {
    console.log(`\n${phase}からのコピー:`);
    
    // 対象フォルダーの存在確認
    ensureTargetDirectory(config.targetDir);
    
    for (const fileName of config.files) {
      const sourcePath = path.join(config.sourceDir, fileName);
      const targetPath = path.join(config.targetDir, fileName);
      
      totalFiles++;
      
      // 既存ファイルの確認
      if (checkFileExists(targetPath)) {
        console.log(`  上書き対象: ${fileName}`);
      }
      
      // ファイルコピー実行
      if (copyFile(sourcePath, targetPath)) {
        successCount++;
      }
    }
  }

  console.log('\n=== コピー結果 ===');
  console.log(`成功: ${successCount}/${totalFiles} ファイル`);
  
  if (successCount === totalFiles) {
    console.log('✓ すべてのファイルのコピーが完了しました！');
  } else {
    console.log('⚠️  一部のファイルのコピーに失敗しました。');
  }

  // 最終確認
  console.log('\n=== 最終確認 ===');
  const allRequiredFiles = [
    ...copyConfig.phase3.files,
    ...copyConfig.phase4.files
  ];
  
  // 重複除去
  const uniqueFiles = [...new Set(allRequiredFiles)];
  
  for (const fileName of uniqueFiles) {
    const targetPath = path.join(copyConfig.phase3.targetDir, fileName);
    if (checkFileExists(targetPath)) {
      console.log(`✓ ${fileName} - 配置確認`);
    } else {
      console.log(`✗ ${fileName} - 配置未確認`);
    }
  }
}

// プログラム実行
if (require.main === module) {
  main();
}

module.exports = { main, copyConfig };