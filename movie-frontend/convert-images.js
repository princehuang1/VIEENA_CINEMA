const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 確保路徑指向 movie-frontend/public/posters
const postersDir = path.join(__dirname, 'public', 'posters');

// 🎯 新增 '.svg' 到支援列表中
// 這樣被標示為 "Edge HTML Document" 的 SVG 檔案也會被轉成 JPG
const supportedExts = ['.webp', '.avif', '.png', '.jpeg', '.svg'];

fs.readdir(postersDir, (err, files) => {
    if (err) {
        console.error('無法讀取資料夾:', err);
        return;
    }

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        const name = path.basename(file, ext);
        const inputPath = path.join(postersDir, file);
        const outputPath = path.join(postersDir, `${name}.jpg`);

        if (supportedExts.includes(ext) && ext !== '.jpg') {
            
            sharp(inputPath)
                .jpeg({ quality: 90 })
                // SVG 轉 JPG 時，透明背景會變黑色。如果希望背景變白色，可以加入 .flatten({ background: '#ffffff' })
                .flatten({ background: '#ffffff' }) 
                .toFile(outputPath)
                .then(() => {
                    console.log(`✅ 成功轉換: ${file} -> ${name}.jpg`);
                    
                    // 轉換後刪除原始檔
                    fs.unlinkSync(inputPath); 
                })
                .catch(err => {
                    console.error(`❌ 轉換失敗: ${file}`, err);
                });
        }
    });
});