import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

// 商城頁面的篩選類別
const storeCategories = [
    { label: '遊戲商城', status: 'Game' },
    { label: '電影周邊', status: 'Merchandise' }, // 對應資料庫的 category
    { label: '餐飲', status: 'Concession' },      // 對應資料庫的 category
];

// 橫幅新聞資料 (保持不變)
const newsData = [
    { 
        id: 1, 
        title: '《GTA6》罪惡之城的浪潮再度席捲', 
        desc: '《GTA6》將玩家帶回充滿霓虹與危險的罪惡之城...',
        image: '/posters/GTA6.jpg', 
        link: 'https://www.4gamers.com.tw/news/detail/71567/gta6-delayed-to-2026'
    },
    // ... (其他新聞資料保持不變)
];

// 新聞輪播元件 (保持不變)
const NewsCarousel = () => { /* ...保持原樣... */ return <div>...</div>; };

// 遊戲卡片元件 (保持不變)
const GameItemCard = ({ item }) => (
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

// 一般商品卡片 (周邊 & 餐飲)
const StoreItemCard = ({ item }) => (
    <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-xl hover:shadow-purple-500/30 transition-all duration-300 h-full">
      <img
        src={item.image || 'https://via.placeholder.com/400x400?text=Item'}
        alt={item.name}
        className="w-full aspect-square object-cover" 
      />
      <div className="p-4">
        <h3 className="text-white text-lg font-bold mb-1 truncate">{item.name}</h3>
        {item.content && <p className="text-gray-400 text-xs mb-2 truncate">{item.content}</p>}
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
  
  // 資料來源 State
  const [games, setGames] = useState([]); 
  const [concessionsAndMerch, setConcessionsAndMerch] = useState([]); // 存放從 Concessions 表抓回來的所有東西
  const [loading, setLoading] = useState(true);

  // 1. 抓取資料 (Games 和 Concessions)
  useEffect(() => {
    const fetchGames = axios.get('http://localhost:4000/api/games');
    const fetchConcessions = axios.get('http://localhost:4000/api/concessions');

    Promise.all([fetchGames, fetchConcessions])
      .then(([gamesRes, concessionsRes]) => {
        setGames(gamesRes.data);
        setConcessionsAndMerch(concessionsRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("抓取資料失敗:", err);
        setLoading(false);
      });
  }, []);

  // 2. 篩選與排序邏輯
  useEffect(() => {
    if (activeFilter === 'Game') {
      setFilteredItems(games);
    } else {
      // 從混合的資料中篩選出當前類別 (Merchandise 或 Concession)
      // 注意：舊資料若沒有 category，預設視為 'Concession' (這取決於 SQL 是否執行成功，前端也做個防呆)
      let items = concessionsAndMerch.filter(item => {
         const cat = item.category || 'Concession'; // 若無欄位預設為 Concession
         return cat === activeFilter;
      });

      // 🎯 針對「餐飲 (Concession)」的特殊排序邏輯
      if (activeFilter === 'Concession') {
        const priority = ['基本套餐', '高級套餐', '豪華套餐'];
        
        items.sort((a, b) => {
          const indexA = priority.indexOf(a.name);
          const indexB = priority.indexOf(b.name);

          // 如果兩個都在優先名單中，按名單順序排
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          // 如果 A 在名單中，A 排前面
          if (indexA !== -1) return -1;
          // 如果 B 在名單中，B 排前面
          if (indexB !== -1) return 1;
          // 都不在名單中，維持原樣 (或可按 ID 排序)
          return 0; 
        });
      }

      setFilteredItems(items);
    }
  }, [activeFilter, games, concessionsAndMerch]);

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
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans overflow-x-hidden">
      <Navbar />
      
      <main className="container mx-auto px-20 py-8"> 
        
        <h1 className="text-4xl font-bold text-white mb-8">商城</h1>

        <div className="flex space-x-4 mb-10">
          {storeCategories.map(cat => (
              <FilterButton key={cat.status} label={cat.label} status={cat.status} />
          ))}
        </div>

        {/* 商品列表網格 */}
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-16">
          {loading ? (
             <p className="col-span-full text-gray-400 text-center">載入中...</p>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
                activeFilter === 'Game' 
                ? <GameItemCard key={item.gameId} item={item} />
                : <StoreItemCard key={item.id} item={item} />
            ))
          ) : (
            <p className="col-span-full text-gray-400 text-center">此分類暫無商品。</p>
          )}
        </div>
        
      </main>

      {/* 只有在「遊戲商城」分類時，才顯示底部的橫幅 */}
      {activeFilter === 'Game' && (
          // 這裡請確保你有保留 NewsCarousel 元件的定義
          <div className="relative w-full overflow-hidden py-16 pb-24 bg-neutral-900/50">
             {/* NewsCarousel 的內容可以直接放這裡，或是保持原樣引入 */}
             <h2 className="text-5xl text-white text-center mb-12 font-bold tracking-wider">《最新消息》</h2>
             {/* ...NewsCarousel 邏輯... (為節省篇幅，請保留原有的 NewsCarousel 代碼) */}
          </div>
      )}
    </div>
  );
}

export default StorePage;