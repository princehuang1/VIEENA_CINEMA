import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- State ---
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 輪播圖 State
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const itemsPerView = 3; 

  // --- Fetch Data ---
  useEffect(() => {
    axios.get(`http://localhost:4000/api/games/${id}`)
      .then(res => {
        setGame(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching game:", err);
        setLoading(false);
      });
  }, [id]);

  // --- Helper Functions ---
  const getDetailImageUrl = (originalPath) => {
    if (!originalPath) return '';
    const lastDotIndex = originalPath.lastIndexOf('.');
    if (lastDotIndex === -1) return originalPath; 
    const namePart = originalPath.substring(0, lastDotIndex);
    const extPart = originalPath.substring(lastDotIndex);
    return `${namePart}02${extPart}`;
  };

  const getMediaList = () => {
    const list = [];
    list.push({ 
        type: 'video', 
        src: game.trailer || 'https://www.youtube.com/embed/dQw4w9WgXcQ' 
    });
    
    try {
        if (game.screenshots) {
            const shots = JSON.parse(game.screenshots);
            if (Array.isArray(shots)) {
                shots.forEach(src => list.push({ type: 'image', src }));
            }
        }
    } catch (e) {
        console.error("JSON Parse Error:", e);
    }

    if (list.length === 1) {
       for(let i=0; i<5; i++) list.push({ type: 'image', src: game.image });
    }
    return list;
  };

  // 🎯 解析特色內容
  const getFeatureList = () => {
    try {
        if (game.features) {
            return JSON.parse(game.features);
        }
    } catch (e) {
        console.error("JSON Parse Error (Features):", e);
    }
    return [
        { title: '深入冒險世界', desc: '探索前所未見的奇幻景觀，揭開隱藏在歷史背後的真相。', image: game.image },
        { title: '極致戰鬥體驗', desc: '感受流暢且具深度的戰鬥系統，挑戰強大的敵人與首領。', image: game.image }
    ];
  };

  // 🔥 修改這裡：處理購買邏輯，跳轉到訂單確認頁
  const handleBuyGame = () => {
    if (!game) return;

    const bookingData = {
        movie: { movieName: game.name }, // 借用欄位
        theater: { name: '數位遊戲商城' },
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        selectedSeats: [], // 無座位
        tickets: [],
        meals: [{ name: `${game.name} (數位版)`, price: game.price, count: 1 }], // 將遊戲視為商品
        totalPrice: game.price,
        isStore: true // 標記為商城訂單
    };

    navigate(`/booking-confirmation/game-${game.gameId}`, { state: bookingData });
  };

  // --- Loading / Error ---
  if (loading) return <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">載入中...</div>;
  if (!game) return <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">找不到遊戲</div>;

  const detailImage = getDetailImageUrl(game.image);
  const mediaData = getMediaList();
  const featureData = getFeatureList();

  // --- Carousel Controls ---
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
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans overflow-x-hidden flex flex-col">
      
      {/* Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* ======================================================== */}
      {/* 1. 頂部橫幅區塊 (Hero Section) */}
      {/* ======================================================== */}
      <div className="relative w-full">
        <img 
            src={detailImage} 
            alt={game.name} 
            className="w-full h-auto max-h-[85vh] object-cover object-top block align-top" 
            onError={(e) => { e.target.src = game.image; }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent lg:bg-gradient-to-r lg:from-neutral-900 lg:via-neutral-900/40 lg:to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-center">
            <div className="container mx-auto px-8 lg:px-20">
                <button onClick={() => navigate(-1)} className="mb-8 text-gray-300 hover:text-white transition flex items-center gap-2 w-fit bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">← 返回商城</button>

                <div className="max-w-2xl">
                    <h1 className="text-4xl lg:text-7xl font-extrabold text-white mb-2 drop-shadow-lg">{game.name}</h1>
                    <p className="text-gray-300 text-lg lg:text-xl mb-6 flex items-center gap-3 drop-shadow-md">KONAMI DIGITAL ENTERTAINMENT<span className="text-xs border border-gray-400 px-2 py-0.5 rounded bg-black/20 backdrop-blur-sm">PS5</span></p>
                    <div className="mb-8"><p className="text-4xl lg:text-5xl font-bold text-white drop-shadow-md">NT$ {game.price}</p></div>
                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        {/* 🔥 綁定 handleBuyGame 事件 */}
                        <button 
                            onClick={handleBuyGame}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-12 rounded-full transition duration-300 text-lg shadow-lg hover:shadow-purple-600/40 flex-grow sm:flex-grow-0 text-center"
                        >
                            立即購買
                        </button>
                        <button className="p-4 rounded-full border border-gray-500 hover:border-white hover:bg-white/10 transition backdrop-blur-sm w-fit"><svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
                    </div>
                    <p className="text-gray-200 text-lg mb-8 leading-relaxed drop-shadow-md max-w-xl hidden md:block">探索未知的恐懼與美麗。這款遊戲將帶領玩家進入一個充滿謎團的世界，擁有令人驚嘆的視覺效果與深刻的故事劇情。<br />現在預購即可獲得獨家特典服裝與數位原聲帶。</p>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-300 max-w-md">
                        <div className="flex items-center gap-2"><span className="text-white text-lg">●</span> 可離線遊玩</div>
                        <div className="flex items-center gap-2"><span className="text-white text-lg">●</span> 1 名玩家</div>
                        <div className="flex items-center gap-2"><span className="text-white text-lg">●</span> 支援震動功能</div>
                        <div className="flex items-center gap-2"><span className="text-white text-lg">●</span> PS5 Pro 增強</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. 多媒體輪播區塊 (Media Carousel) */}
      {/* ======================================================== */}
      <div className="container mx-auto px-4 lg:px-8 py-12 max-w-[90%] relative group">
        <div className="relative overflow-hidden rounded-xl">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentMediaIndex * (100 / itemsPerView)}%)` }}>
                {mediaData.map((item, index) => (
                    <div key={index} className="min-w-[33.333%] px-3 box-border">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border border-neutral-700 group-hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
                            {item.type === 'video' ? (
                                <iframe className="w-full h-full" src={item.src} title="Trailer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            ) : (
                                <img src={item.src} alt={`Screenshot ${index}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        {currentMediaIndex > 0 && (
            <button onClick={prevSlide} className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-purple-600 hover:bg-purple-500 text-white rounded-full p-4 shadow-2xl transition-all transform hover:scale-110"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
        )}
        {currentMediaIndex < (mediaData.length - itemsPerView) && (
            <button onClick={nextSlide} className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-purple-600 hover:bg-purple-500 text-white rounded-full p-4 shadow-2xl transition-all transform hover:scale-110"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. 特色標題區塊 */}
      {/* ======================================================== */}
      <div className="container mx-auto px-8 lg:px-20 mt-24 mb-12 text-center">
         <h2 className="text-3xl lg:text-5xl font-bold text-white">
           立即購買《{game.name}》
         </h2>
      </div>

      {/* ======================================================== */}
      {/* 4. 圖文介紹橫幅區塊 (Feature Sections) */}
      {/* ======================================================== */}
      <div className="container mx-auto px-8 lg:px-20 pb-24 space-y-24">
        
        {featureData.map((feature, index) => (
            <div 
                key={index} 
                className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16`}
            >
                {/* 文字區 */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                        {feature.title}
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        {feature.desc}
                    </p>
                </div>
                {/* 圖片區 */}
                <div className="w-full md:w-1/2">
                    <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
                        <img src={feature.image} alt={feature.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                </div>
            </div>
        ))}

      </div>

    </div>
  );
}

export default GameDetailPage;