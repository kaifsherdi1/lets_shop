const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend-user/src/assets/images');
const destDir = path.join(__dirname, 'backend/storage/app/public/products');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const mapping = {
    // Electronics
    'premium-wireless-headphones': 'category-electronics.png',
    'smart-watch-series-x': 'banner-img.png',
    'ultra-slim-14-laptop': 'banner-img.png',
    'mechanical-gaming-keyboard': 'category-electronics.png',
    '4k-mirrorless-camera': 'category-electronics.png',
    'bluetooth-portable-speaker': 'category-electronics.png',
    
    // Fashion
    'classic-leather-jacket': 'category-fashion.png',
    'designer-running-shoes': 'category-fashion.png',
    'elegant-silk-evening-dress': 'category-fashion.png',
    'handmade-italian-leather-bag': 'category-fashion.png',
    'minimalist-gold-watch': 'category-fashion.png',
    'premium-cotton-hoodie': 'category-fashion.png',
    
    // Home
    'automatic-espresso-machine': 'category-home.png',
    'smart-air-purifier': 'category-home.png',
    'professional-chef-knife-set': 'category-home.png',
    'dyson-style-cordless-vacuum': 'category-home.png',
    'minimalist-ceramic-dinnerware': 'category-home.png',
    'smart-led-ambient-light': 'category-home.png',
    
    // Sports
    'mountain-trail-bike': 'category-sports.png',
    'ultra-lightweight-2-person-tent': 'category-sports.png',
    'professional-yoga-mat': 'category-sports.png',
    'adjustable-dumbbell-set': 'category-sports.png',
    'advanced-hydration-backpack': 'category-sports.png',
    'waterproof-sports-action-cam': 'category-sports.png',
};

Object.entries(mapping).forEach(([slug, srcFile]) => {
    const srcPath = path.join(srcDir, srcFile);
    const destPath = path.join(destDir, `${slug}.png`);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${srcFile} to ${slug}.png`);
    } else {
        console.log(`Source file not found: ${srcPath}`);
    }
});
