import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

// 🎯 這是商城頁面的篩選類別
const storeCategories = [
    { label: '遊戲商城', status: 'Game' },
    { label: '電影周邊', status: 'Merchandise' },
    { label: '餐飲', status: 'Concession' },
];

// ----------------------------------------------------------------------
// 假資料
// ----------------------------------------------------------------------
const mockItems = [
    // 遊戲商城 (10個)
    { id: 1, name: '對馬戰鬼', category: 'Game', price: 1500, image: '/posters/對馬戰鬼.avif' },
    { id: 2, name: '33號遠征隊', category: 'Game', price: 1790, image: '/posters/33號.avif' },
    { id: 3, name: 'FF7 Rebirth', category: 'Game', price: 1390, image: '/posters/FF7Rebirth.avif' },
    { id: 4, name: '地平線西域境地', category: 'Game', price: 1690, image: '/posters/地平線.avif' },
    { id: 5, name: '尼爾 自動人形', category: 'Game', price: 990, image: '/posters/尼爾.avif' },
    { id: 6, name: '惡靈古堡4', category: 'Game', price: 1190, image: '/posters/惡靈古堡4.avif' },
    { id: 7, name: 'FF16', category: 'Game', price: 1490, image: '/posters/FF16.webp' },
    { id: 8, name: 'Cyberpunk 2077', category: 'Game', price: 1090, image: '/posters/Cyberpunk 2077.avif' },
    { id: 9, name: '空洞騎士', category: 'Game', price: 1890, image: '/posters/空洞騎士.avif' },
    { id: 10, name: '艾爾登法環', category: 'Game', price: 1990, image: '/posters/艾爾登法環.webp' },

    // 電影周邊 (假資料)
    { id: 11, name: '波奇塔爆米花桶', category: 'Merchandise', price: 999, image: '/posters/波奇塔爆米花桶.jpg' },
    { id: 12, name: '蕾潔海報', category: 'Merchandise', price: 450, image: '/posters/蕾潔海報.jpg' },
    { id: 15, name: '鏈鋸人明信片', category: 'Merchandise', price: 1200, image: '/posters/明信片.webp' }, 
    
    // 餐飲 (假資料)
    { id: 13, name: '豪華套餐', category: 'Concession', price: 500, image: '/posters/豪華套餐.jpg' },
    
];

// 遊戲商城使用的卡片組件 (保持不變)
const GameItemCard = ({ item }) => (
  <div className="group cursor-pointer relative rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
    <img
        src={item.image || 'https://via.placeholder.com/400x400?text=Game'}
        alt={item.name}
        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4">
      <h3 className="text-white text-sm md:text-base font-bold truncate group-hover:text-purple-400 transition-colors text-left">
        {item.name}
      </h3>
      <p className="text-gray-300 text-xs mt-1 text-left">$ {item.price}</p>
    </div>
  </div>
);

// 🎯 一般商品卡片 (周邊、餐飲用) - 已更新
const StoreItemCard = ({ item }) => (
    <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
      <img
        src={item.image || 'https://via.placeholder.com/400x400?text=Item'}
        alt={item.name}
        // 🎯 修改：這裡改為 aspect-square (1:1 正方形)，原本是 aspect-[4/3]
        className="w-full aspect-square object-cover" 
      />
      <div className="p-4">
        <h3 className="text-white text-lg font-bold mb-1 truncate">{item.name}</h3>
        <p className="text-purple-400 text-base mb-3">$ {item.price}</p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full w-full transition duration-300 text-sm">
          立即購買
        </button>
      </div>
    </div>
  );


function StorePage() {
  const [activeFilter, setActiveFilter] = useState(storeCategories[0].status); 
  const [filteredItems, setFilteredItems] = useState([]);
  
  useEffect(() => {
    const filterData = mockItems.filter(item => item.category === activeFilter);
    setFilteredItems(filterData);
  }, [activeFilter]);


  const FilterButton = ({ label, status }) => (
    <button
      onClick={() => setActiveFilter(status)}
      className={`py-2 px-6 rounded-full font-semibold transition-colors duration-300
        ${activeFilter === status
          ? 'bg-purple-600 text-white' 
          : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600' 
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans">
      <Navbar />
      
      <main className="container mx-auto px-20 py-8"> 
        
        <h1 className="text-4xl font-bold text-white mb-8">商城</h1>

        <div className="flex space-x-4 mb-10">
          {storeCategories.map(cat => (
              <FilterButton key={cat.status} label={cat.label} status={cat.status} />
          ))}
        </div>

        {/* 3. 商品列表網格 */}
        {/* 🎯 修改：現在所有分類都統一使用 5 欄佈局 (lg:grid-cols-5) */}
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
                activeFilter === 'Game' 
                ? <GameItemCard key={item.id} item={item} />
                : <StoreItemCard key={item.id} item={item} />
            ))
          ) : (
            <p className="col-span-full text-gray-400 text-center">此分類暫無商品。</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default StorePage;