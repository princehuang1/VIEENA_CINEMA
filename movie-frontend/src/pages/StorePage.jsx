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

// 靜態資料 (電影周邊 & 餐飲)
const staticMerchandiseItems = [
    { id: 11, name: '波奇塔爆米花桶', category: 'Merchandise', price: 999, image: '/posters/波奇塔爆米花桶.jpg' },
    { id: 12, name: '鏈鋸人爆米花桶', category: 'Merchandise', price: 999, image: '/posters/鏈鋸人爆米花桶.jpg' },
    { id: 13, name: '鏈鋸人海報', category: 'Merchandise', price: 300, image: '/posters/鏈鋸人海報.jpg' }, 
    { id: 14, name: '波奇塔夜燈', category: 'Merchandise', price: 1500, image: '/posters/波奇塔夜燈.jpg' },
    { id: 15, name: '鏈鋸人桌上小物', category: 'Merchandise', price: 1000, image: '/posters/鏈鋸人桌上小物.jpg' },
    { id: 16, name: 'FF7 娃娃', category: 'Merchandise', price: 1200, image: '/posters/FF7 娃娃.jpg' },
    { id: 17, name: 'FF7 音樂盒', category: 'Merchandise', price: 800, image: '/posters/FF7 音樂盒.jpg' },
    { id: 18, name: 'FF7 音樂合輯', category: 'Merchandise', price: 1000, image: '/posters/FF7 音樂合輯2.jpg' },
    { id: 19, name: '賽菲羅斯海報', category: 'Merchandise', price: 5000, image: '/posters/賽菲羅斯海報.jpg' },
    { id: 20, name: 'FF7明信片', category: 'Merchandise', price: 1000, image: '/posters/FF7明信片.jpg' },




    { id: 16, name: '基本套餐', category: 'Concession', price: 220, image: '/posters/基本套餐.jpg' },
    { id: 17, name: '高級套餐', category: 'Concession', price: 300, image: '/posters/高級套餐.jpg' },
    { id: 18, name: '豪華套餐', category: 'Concession', price: 500, image: '/posters/豪華套餐.jpg' },
];

// 🎯 新增：橫幅新聞資料 (您可以稍後換成 API 或真實資料)
const newsData = [
    { 
        id: 1, 
        title: '《地平線 西域禁地》：創造活靈活現的人物', 
        desc: '《地平線 西域禁地》的世界充滿活力，有著壯麗的風景、兇猛的機器出沒，還有豐富盛盛的文化。這片大地曾是法羅機器瘟疫...',
        image: '/posters/地平線.jpg', // 暫用遊戲圖
        author: 'Narae Lee', 
        role: 'Guerrilla資深社群經理',
        date: 'Nov 01, 2023'
    },
    { 
        id: 2, 
        title: '《地平線 西域禁地》完全版將登陸PlayStation 5主機與PC平台', 
        desc: '《地平線 西域禁地》完全版將在10月6日登陸PlayStation 5主機！接續《Horizon ...》',
        image: '/posters/地平線.jpg', 
        author: 'Mathijs de Jonge', 
        role: 'Guerrilla 遊戲總監',
        date: 'Sep 28, 2023'
    },
    { 
        id: 3, 
        title: 'Guerrilla工作室迎向20週年', 
        desc: '我們在2003年成立Guerrilla時，遊戲產業正處於很有意思的年代。PS2在三年前推出，且深受好評，大家...',
        image: '/posters/地平線.jpg', 
        author: 'Jan-Bart van Beek', 
        role: 'Guerrilla工作室總監暨工作室藝術總監',
        date: 'May 19, 2023'
    },
    { 
        id: 4, 
        title: '突破極限：以PS VR2探索地平線', 
        desc: 'Call of the Mountain 開發團隊分享他們如何利用 PS VR2 的新功能...',
        image: '/posters/地平線.jpg', 
        author: 'PlayStation Blog', 
        role: '編輯團隊',
        date: 'Feb 22, 2023'
    },
    { 
        id: 5, 
        title: '亞蘿伊的旅程：從零之曙光到西域禁地', 
        desc: '回顧亞蘿伊如何從被放逐者成為拯救世界的英雄...',
        image: '/posters/地平線.jpg', 
        author: 'Guerrilla', 
        role: '敘事團隊',
        date: 'Jan 15, 2023'
    },
];

// ----------------------------------------------------------------------
// 🎯 元件：新聞輪播橫幅 (Peek Carousel)
// ----------------------------------------------------------------------
const NewsCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? newsData.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === newsData.length - 1 ? 0 : prev + 1));
    };

    // 計算 translateX: 我們希望 currentIndex 居中
    // 假設每個卡片寬 30%，gap 2%
    // 為了讓當前項目居中，我們需要位移： - (index * 32%) + (螢幕中間偏移)
    // 這裡用一個簡單的算法：每次移動 33.33% (card + gap)
    
    return (
        <div className="relative w-full overflow-hidden py-12">
            
            {/* 標題 */}
            <h2 className="text-3xl text-white text-center mb-8">《地平線 西域禁地》 最新消息</h2>

            {/* 輪播軌道容器 */}
            <div className="relative flex items-center justify-center h-[450px]">
                
                {/* 絕對定位的軌道，控制滑動 */}
                <div 
                    className="flex transition-transform duration-500 ease-out absolute left-1/2"
                    style={{ 
                        transform: `translateX(calc(-50% - ${currentIndex * 340}px))` // 340px = 卡片寬(320) + 間距(20)
                    }}
                >
                    {newsData.map((item, index) => {
                        const isActive = index === currentIndex;
                        return (
                            <div 
                                key={item.id} 
                                className={`
                                    w-[320px] h-[400px] mx-[10px] flex-shrink-0 rounded-xl overflow-hidden bg-neutral-800 shadow-lg transition-all duration-500
                                    ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-60 hover:opacity-80'}
                                `}
                            >
                                {/* 圖片區 */}
                                <div className="h-48 overflow-hidden">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>

                                {/* 文字區 */}
                                <div className="p-5 flex flex-col h-[calc(100%-12rem)] justify-between">
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>
                                        <p className="text-gray-400 text-sm line-clamp-3">{item.desc}</p>
                                    </div>
                                    
                                    {/* 底部資訊 + 按鈕 */}
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center mr-2">
                                                <span className="text-black font-bold">G</span>
                                            </div>
                                            <div>
                                                <p className="text-gray-300 text-xs font-bold">{item.author}</p>
                                                <p className="text-gray-500 text-[10px]">{item.date}</p>
                                            </div>
                                        </div>
                                        
                                        {/* 🎯 了解更多按鈕 */}
                                        <button className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 px-4 rounded-full transition">
                                            了解更多
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 左箭頭 (懸浮) */}
            <button 
                onClick={handlePrev}
                className="absolute left-4 lg:left-20 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* 右箭頭 (懸浮) */}
            <button 
                onClick={handleNext}
                className="absolute right-4 lg:right-20 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    );
};

// ----------------------------------------------------------------------
// 遊戲卡片元件
// ----------------------------------------------------------------------
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
  const [games, setGames] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:4000/api/games')
      .then(res => {
        setGames(res.data); 
        setLoading(false);
      })
      .catch(err => {
        console.error("抓取遊戲資料失敗:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activeFilter === 'Game') {
      setFilteredItems(games);
    } else {
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
          {loading && activeFilter === 'Game' ? (
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
        
        {/* 🎯 只有在「遊戲商城」分類時，才顯示底部的橫幅 */}
        {activeFilter === 'Game' && (
            <NewsCarousel />
        )}

      </main>
    </div>
  );
}

export default StorePage;