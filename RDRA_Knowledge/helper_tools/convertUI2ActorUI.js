const fs = require('fs');
const path = require('path');

/**
 * ui.jsonを読み込んでactorUI.jsonの形式に構造変換する
 * 
 * 入力: ui.json (Business → BUC → Actor → Screen)
 * 出力: actorUI.json (Actor → Business → BUC → Screen)
 * 
 * values: fieldsの先頭項目の「項目名+"_"+番号」を3件追加
 */

// 2_RDRASpecディレクトリ内のui.jsonを読み込む
const inputFile = path.join(__dirname, '..', '..', '2_RDRASpec', 'ui.json');
const outputFile = path.join(__dirname, '..', '..', '2_RDRASpec', 'actor_ui.json');
console.log('入力ファイル:', inputFile);
console.log('出力ファイル:', outputFile);

try {
    // JSONファイルを読み込む
    const uiData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
    
    // アクター別のデータ構造を作成
    const actorMap = new Map();
    
    // ui.jsonの構造を走査
    uiData.businesses.forEach(business => {
        business.BUCs.forEach(buc => {
            buc.actors.forEach(actor => {
                const actorName = actor.actor_name;
                
                // アクターがまだMapに存在しない場合は初期化
                if (!actorMap.has(actorName)) {
                    actorMap.set(actorName, {
                        actor_name: actorName,
                        businesses: []
                    });
                }
                
                const actorData = actorMap.get(actorName);
                
                // 既存のビジネスを探す
                let businessData = actorData.businesses.find(
                    b => b.business_name === business.business_name
                );
                
                // ビジネスが存在しない場合は新規作成
                if (!businessData) {
                    businessData = {
                        business_name: business.business_name,
                        BUCs: []
                    };
                    actorData.businesses.push(businessData);
                }
                
                // BUCを追加（スクリーンと共に）
                const bucData = {
                    buc_name: buc.buc_name,
                    actor_name: actorName,
                    screens: actor.screens.map(screen => {
                        // values配列を生成
                        const values = generateValues(screen.fields);
                        
                        return {
                            screen_name: screen.screen_name,
                            fields: screen.fields,
                            operations: screen.operations,
                            data_access: screen.data_access,
                            values: values
                        };
                    })
                };
                
                businessData.BUCs.push(bucData);
            });
        });
    });
    
    // Mapを配列に変換
    const result = {
        actors: Array.from(actorMap.values())
    };
    
    // JSONファイルとして出力
    fs.writeFileSync(
        outputFile, 
        JSON.stringify(result, null, 2), 
        'utf-8'
    );
    
    console.log(`✓ 変換完了: ${outputFile}`);
    console.log(`  アクター数: ${result.actors.length}`);
    
    // 各アクターの情報を表示
    result.actors.forEach(actor => {
        const totalScreens = actor.businesses.reduce((sum, business) => {
            return sum + business.BUCs.reduce((bucSum, buc) => {
                return bucSum + buc.screens.length;
            }, 0);
        }, 0);
        console.log(`  - ${actor.actor_name}: ${actor.businesses.length}業務, ${totalScreens}画面`);
    });
    
} catch (error) {
    console.error('エラーが発生しました:', error.message);
    process.exit(1);
}

/**
 * fieldsの先頭項目から values配列を生成
 * @param {Array} fields - 項目配列
 * @returns {Array} - 「項目名_001」「項目名_002」「項目名_003」の配列
 */
function generateValues(fields) {
    if (!fields || fields.length === 0) {
        return ['データ001', 'データ002', 'データ003'];
    }
    
    const firstFieldName = fields[0].項目名;
    return [
        `${firstFieldName}001`,
        `${firstFieldName}002`,
        `${firstFieldName}003`
    ];
}

