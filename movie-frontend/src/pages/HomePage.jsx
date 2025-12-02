import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

// --- 輪播圖專用電影 
const carouselMoviesData = [
    {
      id: 3, 
      title: '蜘蛛人：穿越蜘蛛宇宙',
      description: '邁爾斯·莫拉萊斯回歸，展開一場史詩般的冒險，穿梭於無數平行宇宙，遇見各式各樣的蜘蛛人夥伴。',
      poster: '/posters/蜘蛛.jpg', 
      trailerLink: 'https://www.youtube.com/watch?v=shW9i6k8cB0', 
    },
    {
      id: 12, 
      title: '阿凡達：水之道',
      description: '傑克·薩利與他在系外行星潘朵拉上新組成的家庭一起生活。當一個熟悉的威脅捲土重來,傑克必須與奈蒂莉和納美人軍隊並肩作戰,保衛他們的星球。',
      poster: '/posters/Homepage01.jpg', 
      trailerLink: 'https://www.youtube.com/watch?v=T-8MtZ2kY98', 
    },
    {
      id: 1, 
      title: '沙丘：第二部',
      description: '在命運的召喚下，保羅踏入沙漠最深處。沙漠的傳說正在甦醒，而真正的試煉才正要開始...',
      poster: '/posters/Homepage02.jpg', 
      trailerLink: 'https://www.youtube.com/watch?v=5b6bKqgn7y8', 
    },
    {
      id: 2, 
      title: '『#鏈鋸人 #蕾潔篇』',
      description: '電次與惡魔「鏈鋸惡魔」波奇塔簽訂契約，成為鏈鋸人，過著狩獵惡魔的日子。某天,他遇見了某個女孩。她的出現，將顛覆電次平穩的生活...',
      poster: '/posters/Homepage03.jpg', 
      trailerLink: 'https://www.youtube.com/watch?v=c--np1lcdgQ', 
    },
    {
      id: 8, 
      title: '美女與野獸',
      description: '在一座被遺忘的魔法城堡裡，一名少女意外踏入了命運的交會，在前方等待她的將是隱藏著奇特的魔法與未解的秘密...',
      poster: '/posters/Homepage04.jpg', 
      trailerLink: 'https://www.youtube.com/watch?v=F3iNnze3yi0', 
    },
];

// --- 最新消息資料 ---
const newsItems = [
    {
        id: 'A',
        title: 'BabyMonster',
        desc: '《BabyMonster》2025年台北演唱會確定！林口體育館開唱、票價、售票時間、VIP 福利一覽',
        image: '/posters/Homepage-A.jpg', 
        link: 'https://reurl.cc/Yk8x9L' 
    },
    {
        id: 'B',
        title: '死侍 3',
        desc: '《死侍與金鋼狼》重大消息 | 金剛狼在《死侍3》回歸！預告解析與獨家片段...',
        image: '/posters/Homepage-B.jpg',
        link: 'https://www.marieclaire.com.tw/entertainment/movie/68490/deadpool-3-ryan-reynolds-hugh-jackman' 
    },
    {
        id: 'C',
        title: '英雄聯盟',
        desc: '《英雄聯盟》最強飛昇者「不滅冥聖」薩亨登場!',
        image: '/posters/Homepage-C.jpg', 
        link: 'https://www.ludens.com.tw/league-of-legends-zaahen-new-champion-lore-explained/' 
    },
    {
        id: 'D',
        title: 'TWICE 2025',
        desc: 'TWICE演唱會2025台灣站來了！11月高雄開唱，子瑜首度回台演出',
        image: '/posters/Homepage-D.jpg', 
        link: 'https://www.marieclaire.com.tw/entertainment/music/86642/twice-this-is-for-world-tour' 
    },
    {
        id: 'E',
        title: '黃金樹幽影',
        desc: '《艾爾登法環 黃金樹幽影》最新boss"穿刺者-梅瑟莫"',
        image: '/posters/Homepage-E.jpg', 
        link: 'https://www.4gamers.com.tw/news/detail/65525/elden-ring-legendary-player-let-me-solo-her-has-new-target' 
    }
];

function HomePage() {
  const navigate = useNavigate(); 
  
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [loading, setLoading] = useState(true); 

  // --- 無限輪播邏輯設定 ---
  const extendedSlides = [
    carouselMoviesData[carouselMoviesData.length - 1],
    ...carouselMoviesData,
    carouselMoviesData[0]
  ];
  
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null);

  // 1. 自動播放 (已修正 Bug)
  useEffect(() => {
    // 🎯 關鍵修正：如果正在轉場中 (isTransitioning 為 true)，就不要設定計時器
    // 等到轉場結束 (onTransitionEnd -> isTransitioning 變 false) 後，
    // 這個 useEffect 會再次觸發，那時候再開始 8 秒倒數。
    if (isTransitioning) return;

    resetTimeout();
    timeoutRef.current = setTimeout(() => {
        handleNext();
    }, 8000); 

    return () => resetTimeout();
  }, [currentIndex, isTransitioning]); // 🎯 加入 isTransitioning 作為依賴

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // 2. 下一張 (往右滑)
  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  };

  // 3. 上一張 (往左滑)
  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  };

  // 4. 監聽 Transition End，處理瞬間跳轉 (無縫循環的核心)
  const handleTransitionEnd = () => {
    setIsTransitioning(false);

    // 如果滑到了最後一張 (複製的第0張)
    if (currentIndex === extendedSlides.length - 1) {
        setCurrentIndex(1); // 瞬間跳回真正的第0張 (index 1)
    }
    // 如果滑到了第一張 (複製的最後一張)
    if (currentIndex === 0) {
        setCurrentIndex(extendedSlides.length - 2); // 瞬間跳回真正的最後一張
    }
  };

  // 5. 抓取電影資料
  useEffect(() => {
    const fetchNowShowing = axios.get('http://localhost:4000/api/movies?status=Now Playing');
    const fetchComingSoon = axios.get('http://localhost:4000/api/movies?status=Coming Soon');

    Promise.all([fetchNowShowing, fetchComingSoon])
      .then((results) => {
        setNowShowingMovies(results[0].data); 
        setComingSoonMovies(results[1].data); 
        setLoading(false); 
      })
      .catch((error) => {
        console.error("錯誤：無法從 API 獲取電影資料", error);
        setLoading(false); 
      });
  }, []); 

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans">
      
      <Navbar />

      <main className="container mx-auto px-20 py-8"> 
        
        {/* === 輪播圖區塊 (無縫循環版) === */}
        <section className="relative w-full h-[60vh] md:h-[70vh] rounded-xl overflow-hidden mb-12 group">
          
          <div 
            className="flex w-full h-full"
            style={{ 
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: isTransitioning ? 'transform 0.7s ease-in-out' : 'none' 
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((movie, index) => (
              <div key={`${movie.id}-${index}`} className="min-w-full h-full relative flex-shrink-0">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="absolute inset-0 w-full h-full object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-90"></div>
                
                <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-10 lg:p-16 max-w-2xl">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
                    {movie.title}
                  </h1>
                  <p className="text-lg text-gray-300 mb-6 line-clamp-3">
                    {movie.description}
                  </p>
                  <div className="flex space-x-4">
                    <button 
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-lg hover:shadow-purple-500/50"
                    >
                      取得門票
                    </button>
                    <a 
                      href={movie.trailerLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-transparent border border-gray-400 text-gray-200 hover:border-white hover:text-white font-bold py-3 px-6 rounded-full transition duration-300 cursor-pointer flex items-center justify-center backdrop-blur-sm"
                    >
                      觀看預告片
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-purple-600/80 text-white p-4 rounded-full focus:outline-none transition-all duration-300 z-20 backdrop-blur-md border border-white/10 hover:scale-110"
          >
            &lt;
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-purple-600/80 text-white p-4 rounded-full focus:outline-none transition-all duration-300 z-20 backdrop-blur-md border border-white/10 hover:scale-110"
          >
            &gt;
          </button>
        </section>

        {/* === 現正熱映 === */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">現正熱映</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {loading ? (
              <p>資料載入中...</p>
            ) : (
              nowShowingMovies.slice(0, 10).map((movie) => (
                <MovieCard key={movie.movieId} movie={{
                  id: movie.movieId,
                  title: movie.movieName,
                  duration: movie.movieDurationMinutes,
                  rating: 'N/A', 
                  genre: movie.movieType,
                  poster: movie.posterUrl,
                  isShowing: true
                }} />
              ))
            )}
          </div>
        </section>

        {/* === 最新消息橫幅 === */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">最新消息</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左側大圖 */}
            <a 
                href={newsItems[0].link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block relative rounded-xl overflow-hidden shadow-xl group transition-all duration-300 h-96 border border-neutral-800 hover:border-purple-500/30"
            >
              <img
                src={newsItems[0].image} 
                alt={newsItems[0].title}
                className="w-full h-full object-cover brightness-90 group-hover:brightness-75 transition duration-500 transform group-hover:scale-105" 
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <h3 className="text-white text-3xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{newsItems[0].title}</h3>
                <p className="text-gray-200 text-xl">
                  {newsItems[0].desc}
                </p>
              </div>
            </a>

            {/* 右側小圖 */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              {newsItems.slice(1).map((item) => (
                  <a 
                    key={item.id}
                    href={item.link}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative rounded-xl overflow-hidden shadow-lg group transition-all duration-300 border border-neutral-800 hover:border-purple-500/30"
                  >
                    <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover brightness-90 group-hover:brightness-75 transition duration-500 transform group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                        <h4 className="text-white font-semibold text-md truncate group-hover:text-purple-400 transition-colors">{item.title}</h4>
                        <p className="text-gray-400 text-sm truncate">
                            {item.desc}
                        </p>
                    </div>
                  </a>
              ))}
            </div>
          </div>
        </section>

        {/* === 會員橫幅 === */}
        <section className="relative h-[40vh] rounded-xl overflow-hidden mb-12 group">
          <img
            src="https://images.unsplash.com/photo-1517604931442-7e0c8ed294c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Movie theater interior"
            className="absolute inset-0 w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent opacity-90"></div>
          
          <div className="relative z-10 flex flex-col justify-center h-full p-6 md:p-10 lg:p-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              立即加入會員
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              獲取最新消息與優惠
            </p>
            <div className="flex">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300">
                加入會員
              </button>
            </div>
          </div>
        </section>

        {/* === 即將推出 === */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">即將推出</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {loading ? (
              <p>資料載入中...</p>
            ) : (
              comingSoonMovies.slice(0, 5).map((movie) => (
                <MovieCard key={movie.movieId} movie={{
                  id: movie.movieId,
                  title: movie.movieName,
                  duration: movie.movieDurationMinutes,
                  rating: 'N/A',
                  genre: movie.movieType,
                  poster: movie.posterUrl,
                  isShowing: false
                }} />
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="bg-neutral-800 py-8 mt-12">
        <div className="container mx-auto text-center text-gray-400">
          &copy; 2025 VIENNA CINEMA. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default HomePage;