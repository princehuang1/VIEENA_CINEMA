import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

// 商城頁面的篩選類別
const storeCategories = [
    { label: '遊戲商城', status: 'Game' },
    { label: '電影周邊', status: 'Merchandise' },
    { label: '餐飲', status: 'Concession' },
];

// ----------------------------------------------------------------------
// 靜態資料 (電影周邊 & 餐飲)
// 因為目前資料庫只有 Games 表格，所以這些先暫時放在前端
// 🎯 已將圖片副檔名統一修改為 .jpg
// ----------------------------------------------------------------------
const staticMerchandiseItems = [
    // 電影周邊
    { id: 11, name: '波奇塔爆米花桶', category: 'Merchandise', price: 999, image: '/posters/波奇塔爆米花桶.jpg' },
    { id: 12, name: '蕾潔海報', category: 'Merchandise', price: 450, image: '/posters/蕾潔海報.jpg' },
    { id: 15, name: '鏈鋸人明信片', category: 'Merchandise', price: 1200, image: '/posters/明信片.jpg' }, 
    
    // 餐飲
    { id: 13, name: '豪華套餐', category: 'Concession', price: 500, image: '/posters/豪華套餐.jpg' },
];

// ----------------------------------------------------------------------
// 元件：遊戲卡片 (可點擊跳轉)
// ----------------------------------------------------------------------
const GameItemCard = ({ item }) => (
  // 注意：資料庫的主鍵是 gameId，所以這裡連結要用 item.gameId
  <Link to={`/store/game/${item.gameId}`} className="block h-full">
    <div className="group cursor-pointer relative rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 h-full">
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
  </Link>
);

// ----------------------------------------------------------------------
// 元件：一般商品卡片 (周邊、餐飲用，無跳轉功能)
// ----------------------------------------------------------------------
const StoreItemCard = ({ item }) => (
    <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-xl hover:shadow-purple-500/30 transition-all duration-300 h-full">
      <img
        src={item.image || 'https://via.placeholder.com/400x400?text=Item'}
        alt={item.name}
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
  const [games, setGames] = useState([]); // 儲存從 API 抓回來的遊戲
  const [loading, setLoading] = useState(true);

  // 1. 載入時抓取遊戲資料
  useEffect(() => {
    axios.get('http://localhost:4000/api/games')
      .then(res => {
        setGames(res.data); // 將資料庫的遊戲存入 state
        setLoading(false);
      })
      .catch(err => {
        console.error("抓取遊戲資料失敗:", err);
        setLoading(false);
      });
  }, []);

  // 2. 當篩選器或遊戲資料改變時，更新顯示列表
  useEffect(() => {
    if (activeFilter === 'Game') {
      // 如果選遊戲，顯示 API 抓回來的資料
      setFilteredItems(games);
    } else {
      // 如果選其他，顯示前端寫死的靜態資料
      const filtered = staticMerchandiseItems.filter(item => item.category === activeFilter);
      setFilteredItems(filtered);
    }
  }, [activeFilter, games]);

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

        {/* 商品列表網格 */}
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          
          {loading && activeFilter === 'Game' ? (
             <p className="col-span-full text-gray-400 text-center">載入中...</p>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
                activeFilter === 'Game' 
                // 資料庫的 id 是 gameId
                ? <GameItemCard key={item.gameId} item={item} />
                // 靜態資料的 id 是 id
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