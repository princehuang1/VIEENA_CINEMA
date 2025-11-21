// posters全部轉檔成jpg
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 所以直接往下找 public/posters 就可以了
const postersDir = path.join(__dirname, 'public', 'posters');

// 支援的原始格式
const supportedExts = ['.webp', '.avif', '.png', '.jpeg'];

fs.readdir(postersDir, (err, files) => {
    if (err) {
        console.error('無法讀取資料夾:', err);
        console.error('請確認您的路徑是否正確:', postersDir);
        return;
    }

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        const name = path.basename(file, ext);
        const inputPath = path.join(postersDir, file);
        const outputPath = path.join(postersDir, `${name}.jpg`);

        // 如果檔案是圖片，且不是 jpg，就進行轉換
        if (supportedExts.includes(ext) && ext !== '.jpg') {
            
            sharp(inputPath)
                .jpeg({ quality: 90 }) 
                .toFile(outputPath)
                .then(() => {
                    console.log(`✅ 成功轉換: ${file} -> ${name}.jpg`);
                    
                    // (選用) 轉換後刪除舊檔 (若不需要請保持註解)
                    // fs.unlinkSync(inputPath); 
                })
                .catch(err => {
                    console.error(`❌ 轉換失敗: ${file}`, err);
                });
        }
    });
});