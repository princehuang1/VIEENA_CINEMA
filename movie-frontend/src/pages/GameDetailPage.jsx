import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const mockItems = [
    { id: 1, name: '對馬戰鬼', category: 'Game', price: 1500, image: '/posters/對馬戰鬼.avif' },
    { id: 2, name: 'SILENT HILL f', category: 'Game', price: 1790, image: '/posters/silenthill.avif' },
    { id: 3, name: 'FF7 Rebirth', category: 'Game', price: 1390, image: '/posters/FF7Rebirth.avif' },
    { id: 4, name: '地平線西域境地', category: 'Game', price: 1690, image: '/posters/地平線.avif' },
    { id: 5, name: '尼爾 自動人形', category: 'Game', price: 990, image: '/posters/尼爾.avif' },
    { id: 6, name: '惡靈古堡4', category: 'Game', price: 1190, image: '/posters/惡靈古堡4.avif' },
    { id: 7, name: 'FF16', category: 'Game', price: 1490, image: '/posters/FF16.webp' },
    { id: 8, name: 'Cyberpunk 2077', category: 'Game', price: 1090, image: '/posters/Cyberpunk 2077.avif' },
    { id: 9, name: '空洞騎士', category: 'Game', price: 1890, image: '/posters/空洞騎士.avif' },
    { id: 10, name: '艾爾登法環', category: 'Game', price: 1990, image: '/posters/艾爾登法環.webp' },
];

function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = mockItems.find(item => item.id === parseInt(id));

  if (!game) {
    return <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">找不到遊戲</div>;
  }

  const getDetailImageUrl = (originalPath) => {
    if (!originalPath) return '';
    const lastDotIndex = originalPath.lastIndexOf('.');
    if (lastDotIndex === -1) return originalPath; 
    
    const namePart = originalPath.substring(0, lastDotIndex);
    const extPart = originalPath.substring(lastDotIndex);
    return `${namePart}02${extPart}`;
  };

  const detailImage = getDetailImageUrl(game.image);

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans overflow-x-hidden">
      <Navbar />

      {/* ======================================================== */}
      {/* 1. 頂部橫幅區塊 (Hero Section) - 包含大圖與主要購買資訊 */}
      {/* ======================================================== */}
      <div className="relative w-full">
        
        {/* 底圖：高度由圖片自動撐開，但設定最大高度限制 */}
        <img 
            src={detailImage} 
            alt={game.name} 
            // 🎯 修改處：
            // w-full: 寬度全滿
            // h-auto: 讓圖片保持原始比例
            // max-h-[85vh]: 設定一個最大高度 (約螢幕 85%)，防止直式圖片把頁面撐太長
            // object-cover: 如果圖片超過 max-h，多餘部分裁切掉，保持滿版不變形
            // object-top: 裁切時優先保留圖片上方 (通常重點在上面)
            className="w-full h-auto max-h-[85vh] object-cover object-top block align-top" 
            onError={(e) => { e.target.src = game.image; }}
        />

        {/* 漸層遮罩 1：整體變暗，讓文字清楚 */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent lg:bg-gradient-to-r lg:from-neutral-900 lg:via-neutral-900/40 lg:to-transparent"></div>
        
        {/* 🎯 漸層遮罩 2：底部邊緣融合 (Fade to Black) */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900 to-transparent"></div>

        {/* 橫幅內容層 */}
        <div className="absolute inset-0 flex flex-col justify-center">
            <div className="container mx-auto px-8 lg:px-20">
                
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

                    <div className="mb-8">
                        <div className="flex items-baseline gap-4">
                            <p className="text-4xl lg:text-5xl font-bold text-white drop-shadow-md">NT$ {game.price}</p>
                            <p className="text-gray-400 text-xl line-through">NT$ {Math.round(game.price * 1.2)}</p>
                        </div>
                        <p className="text-purple-400 text-sm mt-2 font-medium bg-black/40 w-fit px-2 py-1 rounded">
                            省下 20% • 優惠截止於 2025/12/25
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-12 rounded-full transition duration-300 text-lg shadow-lg hover:shadow-orange-600/40 flex-grow sm:flex-grow-0 text-center">
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
                </div>
            </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. 下方詳細內容區塊 (這是您之後要放內容的地方) */}
      {/* ======================================================== */}
      <div className="container mx-auto px-8 lg:px-20 py-12">
        
        {/* 這裡示範一些簡單的後續內容 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* 左邊兩欄：遊戲介紹 */}
            <div className="lg:col-span-2 space-y-8">
                <section>
                    <h3 className="text-2xl font-bold text-white mb-4">關於這款遊戲</h3>
                    <p className="text-gray-400 leading-loose">
                        這是一個預留的文字區塊。您可以在這裡放入更詳細的遊戲介紹、故事背景、玩法說明等等。
                        隨著頁面往下捲動，上方的橫幅會自然地留在上方。
                        <br /><br />
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-white mb-4">螢幕截圖</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-video bg-neutral-800 rounded-lg flex items-center justify-center text-gray-600">截圖 1</div>
                        <div className="aspect-video bg-neutral-800 rounded-lg flex items-center justify-center text-gray-600">截圖 2</div>
                    </div>
                </section>
            </div>

            {/* 右邊一欄：規格資訊 */}
            <div className="bg-neutral-800 p-6 rounded-xl h-fit">
                <h3 className="text-xl font-bold text-white mb-4">詳細資訊</h3>
                <ul className="space-y-4 text-gray-400 text-sm">
                    <li className="flex justify-between border-b border-gray-700 pb-2">
                        <span>發行商</span>
                        <span className="text-white">Konami</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-700 pb-2">
                        <span>平台</span>
                        <span className="text-white">PS5</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-700 pb-2">
                        <span>類型</span>
                        <span className="text-white">恐怖, 冒險</span>
                    </li>
                    <li className="flex justify-between pt-2">
                        <span>發售日</span>
                        <span className="text-white">2025/12/25</span>
                    </li>
                </ul>
            </div>

        </div>
      </div>

    </div>
  );
}

export default GameDetailPage;