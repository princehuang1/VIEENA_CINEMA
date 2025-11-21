import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// 假資料
// 🎯 新增 screenshots 欄位：您可以在這裡定義每款遊戲要顯示幾張截圖，以及路徑為何
const mockItems = [
    { 
        id: 1, 
        name: '對馬戰鬼', 
        category: 'Game', 
        price: 1500, 
        image: '/posters/對馬戰鬼.jpg', 
        trailer: 'https://www.youtube.com/embed/SrnvY8bSLjI', 
        screenshots: [
            '/posters/對馬戰鬼.jpg', '/posters/對馬戰鬼.jpg', '/posters/對馬戰鬼.jpg', '/posters/對馬戰鬼.jpg' 
        ]
    },
    { 
        id: 2, 
        name: 'SILENT HILL f', 
        category: 'Game', 
        price: 1790, 
        image: '/posters/silenthill.jpg', 
        trailer: 'https://www.youtube.com/embed/N_kGf1tV67I', // 🎯 更新預告片
        // 沒寫 screenshots 欄位 -> 會自動跑預設 (5張圖)
    },
    { 
        id: 3, 
        name: 'FF7 Rebirth', 
        category: 'Game', 
        price: 1390, 
        image: '/posters/FF7Rebirth.jpg', 
        trailer: 'https://www.youtube.com/embed/okGnXYjvJRM', 
        screenshots: [
            '/posters/FF7Rebirth.jpg', '/posters/FF7Rebirth.jpg', '/posters/FF7Rebirth.jpg', '/posters/FF7Rebirth.jpg', '/posters/FF7Rebirth.jpg', '/posters/FF7Rebirth.jpg' 
        ]
    },
    { 
        id: 4, 
        name: '地平線西域境地', 
        category: 'Game', 
        price: 1690, 
        image: '/posters/地平線.jpg', 
        trailer: 'https://www.youtube.com/embed/Lq594XmpPBg' 
    },
    { 
        id: 5, 
        name: '劍星', 
        category: 'Game', 
        price: 1590, 
        image: '/posters/劍星.jpg', 
        trailer: 'https://www.youtube.com/embed/ayek3ZzWb1E' 
    },
    { 
        id: 6, 
        name: '惡靈古堡4', 
        category: 'Game', 
        price: 1190, 
        image: '/posters/惡靈古堡4.jpg', 
        trailer: 'https://www.youtube.com/embed/Id2EaldBaWw' 
    },
    { 
        id: 7, 
        name: 'FF16', 
        category: 'Game', 
        price: 1490, 
        image: '/posters/FF16.jpg', 
        trailer: 'https://www.youtube.com/embed/Y6M2cqm7Jl0' 
    },
    { 
        id: 8, 
        name: 'Cyberpunk 2077', 
        category: 'Game', 
        price: 1090, 
        image: '/posters/Cyberpunk 2077.jpg', 
        trailer: 'https://www.youtube.com/embed/8X2kIfS6fb8' 
    },
    { 
        id: 9, 
        name: '空洞騎士', 
        category: 'Game', 
        price: 990, 
        image: '/posters/空洞騎士.jpg', 
        trailer: 'https://www.youtube.com/embed/FzzsWP2GWmg' 
    },
    { 
        id: 10, 
        name: '艾爾登法環', 
        category: 'Game', 
        price: 1990, 
        image: '/posters/艾爾登法環.jpg', 
        trailer: 'https://www.youtube.com/embed/E3Huy2cdih0' 
    },
];

function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = mockItems.find(item => item.id === parseInt(id));

  // 輪播圖狀態
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const itemsPerView = 3; 

  if (!game) {
    return <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">找不到遊戲</div>;
  }

  // --- 輔助函式 ---
  
  // 1. 取得背景大圖 (自動轉 02)
  const getDetailImageUrl = (originalPath) => {
    if (!originalPath) return '';
    const lastDotIndex = originalPath.lastIndexOf('.');
    if (lastDotIndex === -1) return originalPath; 
    const namePart = originalPath.substring(0, lastDotIndex);
    const extPart = originalPath.substring(lastDotIndex);
    return `${namePart}02${extPart}`;
  };

  // 2. 自動生成媒體清單
  const getMediaList = () => {
    const list = [];
    
    // 第一格：固定放預告片 (若 mockItems 沒填，給個預設值)
    list.push({ 
        type: 'video', 
        src: game.trailer || 'https://www.youtube.com/embed/dQw4w9WgXcQ' 
    });
    
    // 後面幾格：顯示截圖
    // 🎯 邏輯：如果有設定 screenshots 就用設定的，沒有就自動產生 5 張封面圖
    if (game.screenshots && game.screenshots.length > 0) {
        game.screenshots.forEach(src => {
            list.push({ type: 'image', src: src });
        });
    } else {
        // 預設自動產生 5 張 (避免空白)
        for (let i = 0; i < 5; i++) {
            list.push({ type: 'image', src: game.image });
        }
    }
    
    return list;
  };

  const detailImage = getDetailImageUrl(game.image);
  const mediaData = getMediaList();

  // 輪播控制
  const nextSlide = () => {
    if (currentMediaIndex < mediaData.length - itemsPerView) {
      setCurrentMediaIndex(prev => prev + 1);
    }
  };
  const prevSlide = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans overflow-x-hidden relative flex flex-col">
      
      {/* ======================================================== */}
      {/* 1. 上半部：全螢幕大圖橫幅 */}
      {/* ======================================================== */}
      <div className="relative w-full">
        {/* 背景圖 */}
        <img 
            src={detailImage} 
            alt={game.name} 
            className="w-full h-auto max-h-[85vh] object-cover object-top block align-top" 
            onError={(e) => { e.target.src = game.image; }}
        />
        
        {/* 漸層遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent lg:bg-gradient-to-r lg:from-neutral-900 lg:via-neutral-900/40 lg:to-transparent"></div>
        
        {/* 底部漸層接合 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900 to-transparent"></div>

        {/* 內容層 */}
        <div className="absolute inset-0 flex flex-col">
            <div className="relative z-20">
                <Navbar />
            </div>

            <main className="flex-1 container mx-auto px-8 lg:px-20 flex flex-col justify-center">
                
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-8 text-gray-300 hover:text-white transition flex items-center gap-2 w-fit bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm"
                >
                    ← 返回商城
                </button>

                <div className="max-w-2xl">
                    <h1 className="text-4xl lg:text-7xl font-extrabold text-white mb-2 drop-shadow-lg">{game.name}</h1>
                    <p className="text-gray-300 text-lg lg:text-xl mb-6 flex items-center gap-3 drop-shadow-md">
                        KONAMI DIGITAL ENTERTAINMENT
                        <span className="text-xs border border-gray-400 px-2 py-0.5 rounded bg-black/20 backdrop-blur-sm">PS5</span>
                    </p>

                    {/* 只保留目前價格 */}
                    <div className="mb-8">
                        <p className="text-4xl lg:text-5xl font-bold text-white drop-shadow-md">NT$ {game.price}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        {/* 按鈕為紫色 */}
                        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-12 rounded-full transition duration-300 text-lg shadow-lg hover:shadow-purple-600/40 flex-grow sm:flex-grow-0 text-center">
                            加入購物籃
                        </button>
                        <button className="p-4 rounded-full border border-gray-500 hover:border-white hover:bg-white/10 transition backdrop-blur-sm w-fit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>

                    <p className="text-gray-200 text-lg mb-8 leading-relaxed drop-shadow-md max-w-xl hidden md:block">
                        探索未知的恐懼與美麗。這款遊戲將帶領玩家進入一個充滿謎團的世界，
                        擁有令人驚嘆的視覺效果與深刻的故事劇情。
                        <br />
                        現在預購即可獲得獨家特典服裝與數位原聲帶。
                    </p>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-300 max-w-md">
                        <div className="flex items-center gap-2"><span className="text-white text-lg">●</span> 可離線遊玩</div>
                        <div className="flex items-center gap-2"><span className="text-white text-lg">●</span> 1 名玩家</div>
                        <div className="flex items-center gap-2"><span className="text-white text-lg">●</span> 支援震動功能</div>
                        <div className="flex items-center gap-2"><span className="text-white text-lg">●</span> PS5 Pro 增強</div>
                    </div>
                </div>
            </main>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. 下方多媒體輪播區塊 */}
      {/* ======================================================== */}
      <div className="container mx-auto px-8 lg:px-20 py-12 relative group">
        
        {/* 輪播容器 */}
        <div className="relative overflow-hidden rounded-xl">
            {/* 滑動軌道 */}
            <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentMediaIndex * (100 / itemsPerView)}%)` }}
            >
                {mediaData.map((item, index) => (
                    <div key={index} className="min-w-[33.333%] px-2 box-border">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-lg border border-neutral-700 group-hover:border-purple-500/50 transition-colors">
                            {item.type === 'video' ? (
                                <iframe 
                                    className="w-full h-full"
                                    src={item.src} 
                                    title="Trailer" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <img 
                                    src={item.src} 
                                    alt={`Screenshot ${index}`} 
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 左箭頭 */}
        {currentMediaIndex > 0 && (
            <button 
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg transition-all transform -translate-x-1/2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
        )}

        {/* 右箭頭 */}
        {currentMediaIndex < (mediaData.length - itemsPerView) && (
            <button 
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg transition-all transform translate-x-1/2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        )}

      </div>

    </div>
  );
}

export default GameDetailPage;