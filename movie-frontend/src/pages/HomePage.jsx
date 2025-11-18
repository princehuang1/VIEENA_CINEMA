import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 引入 axios
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

// --- 輪播圖專用電影 (3 部) ---
// 仍然保留這個陣列，因為輪播圖需要「特定」的 3 部電影和描述
// (未來您可以考慮為此建立一個新的 API /api/featured-movies)
const carouselMoviesData = [
    {
      id: 0, title: '阿凡達：水之道',
      description: '傑克·薩利與他在系外行星潘朵拉上新組成的家庭一起生活。當一個熟悉的威脅捲土重來,企圖完成之前未竟的事業時,傑克必須與奈蒂莉和納美人軍隊並肩作戰,保衛他們的星球。',
      poster: 'https://assets.survivalinternational.org/pictures/489/width1800-8825fd98d7fb9accd9d1499b693fc25b.jpg',
      ticketLink: '#', 
      trailerLink: 'https://www.youtube.com/watch?v=T-8MtZ2kY98', 
    },
    {
      id: 1, title: '沙丘：第二部',
      description: '亞崔迪家族的保羅在宿命的引導下，與契妮和弗雷曼人團結一心，誓將展開一場針對哈肯能家族的復仇，他必須在他一生所愛的兩者之間做出抉擇，並試圖阻止只有他能預見的可怕未來。',
      poster: 'https://images.wallpapersden.com/image/download/timothee-vs-austin-butler-dune-2-movie-fight_bmdoaWiUmZqaraWkpJRobWllrWdma2U.jpg',
      ticketLink: '#', 
      trailerLink: 'https://www.youtube.com/watch?v=5b6bKqgn7y8', 
    },
    {
      id: 2, title: '『#鏈鋸人 #蕾潔篇』',
      description: '電次與惡魔「鏈鋸惡魔」波奇塔簽訂契約，成為鏈鋸人，過著狩獵惡魔的日子。某天,他遇見了被稱為「炸彈惡魔」的女性惡魔人蕾潔。她的出現，將顛覆電次平穩的生活...。',
      poster: 'https://hips.hearstapps.com/hmg-prod/images/%E5%8A%87%E5%A0%B4%E7%89%88-%E9%8F%88%E9%8B%B8%E4%BA%BA-%E8%95%BE%E6%BD%94%E7%AF%87-%E7%B2%BE%E5%BD%A9%E5%8A%87%E7%85%A71-689ae0f2d8014.jpg?crop=1.00xw:0.744xh;0,0.130xh',
      ticketLink: '#', 
      trailerLink: 'https://www.youtube.com/watch?v=c--np1lcdgQ', 
    },
];

// 🎯 我們不再需要 nowShowingMovies 和 comingSoonMovies 的假資料，已刪除


function App() {
  const [currentSlide, setCurrentSlide] = useState(0); 
  const slides = carouselMoviesData; // 輪播圖使用靜態資料

  // 🎯 新增 State 來儲存從 API 獲取的電影
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [loading, setLoading] = useState(true); // 新增 loading 狀態

  // 🎯 使用 useEffect 在組件載入時呼叫 API
  useEffect(() => {
    
    // 1. 獲取「正在上映」的電影
    const fetchNowShowing = axios.get('http://localhost:4000/api/movies?status=Now Playing');
    
    // 2. 獲取「即將推出」的電影
    const fetchComingSoon = axios.get('http://localhost:4000/api/movies?status=Coming Soon');

    // 3. 等待兩個 API 都回傳資料
    Promise.all([fetchNowShowing, fetchComingSoon])
      .then((results) => {
        setNowShowingMovies(results[0].data); // 儲存「正在上映」的資料
        setComingSoonMovies(results[1].data); // 儲存「即將推出」的資料
        setLoading(false); // 資料載入完成，關閉 loading
      })
      .catch((error) => {
        console.error("錯誤：無法從 API 獲取電影資料", error);
        setLoading(false); // 即使出錯也要關閉 loading
      });

  }, []); // 空陣列 [] 確保這個 effect 只在組件「掛載」時執行一次

  // 自動播放效果
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 10000); // 🎯  10 秒切換一次

    return () => clearInterval(slideInterval); // 清除計時器
  }, [slides.length, currentSlide]); 

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };
  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };
  const currentMovie = slides[currentSlide];
  // --- 輪播圖功能結束 ---

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans">
      
      <Navbar />

      <main className="container mx-auto px-20 py-8"> {/*px-20是用來調整「左右邊距」*/}
        
        {/* 輪播圖區塊 (保持不變) */}
        <section className="relative w-full h-[60vh] md:h-[70vh] rounded-xl overflow-hidden mb-12 group">
          <img
            src={currentMovie.poster}
            alt={currentMovie.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out transform scale-105 group-hover:scale-100 brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-90"></div>
          
          <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-10 lg:p-16 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
              {currentMovie.title}
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              {currentMovie.description}
            </p>
            <div className="flex space-x-4">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300">
                取得門票
              </button>
              <a 
                href={currentMovie.trailerLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-transparent border border-gray-400 text-gray-200 hover:border-white hover:text-white font-bold py-3 px-6 rounded-full transition duration-300 cursor-pointer flex items-center justify-center"
              >
                觀看預告片
              </a>
            </div>
          </div>

          <button
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full focus:outline-none transition duration-300 z-20"
            aria-label="Previous slide"
          >
            &lt;
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full focus:outline-none transition duration-300 z-20"
            aria-label="Next slide"
          >
            &gt;
          </button>
        </section>

        {/* 正在上映電影 (8 部) */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">現正熱映</h2>
            <a href="#" className="text-purple-400 hover:text-purple-600 font-medium">查看全部</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {/*  顯示 loading 或 API 回傳的資料 */}
            {loading ? (
              <p>資料載入中...</p>
            ) : (
              // 🎯 【已修正】只選取前 8 部電影來顯示
              nowShowingMovies.slice(0, 8).map((movie) => (
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

{/*  === 「最新消息」橫幅 ===  */}
        <section className="mb-12">
          {/* 區塊標題 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">最新消息</h2>
            <a href="#" className="text-purple-400 hover:text-purple-600 font-medium">看全部</a>
          </div>

          {/* 主要網格 (1+4 佈局) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* --- 左側 (大型卡片) --- */}
            {/* 使用 relative 定位來讓文字疊加在圖片上 */}
            <div className="relative rounded-xl overflow-hidden shadow-xl group transition-all duration-300">
              <img
                src="https://practicaltyping.com/wp-content/uploads/2023/07/aerith.jpg" // 您提供的 FF7 圖片
                alt="FF7:remake"
                className="w-full h-96 object-cover brightness-90 group-hover:brightness-75 transition duration-300" // 大圖高度，增加亮度調整
              />
              {/* 文字疊加在圖片上 */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="text-white text-3xl font-bold mb-2">FF7:remake</h3>
                <p className="text-gray-200 text-xl">
                  由 Square Enix 開發的 《FINAL FANTASY VII REMAKE》將於 2026 年 1 月 22 日推出 Switch 2...
                </p>
              </div>
            </div>

            {/* --- 右側 (4 張小型卡片) --- */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              
              {/* 右側小卡片 1 */}
              <div className="relative rounded-xl overflow-hidden shadow-lg group transition-all duration-300">
                <img 
                src="https://m.media-amazon.com/images/M/MV5BNmE3ZTlhMTEtY2ZhNC00ODQ3LWFiOTMtOTEwOGIzMzdhNTY2XkEyXkFqcGc@._V1_QL75_UY281_CR31,0,500,281_.jpg" 
                alt="News 2" 
                className="w-full h-full object-cover brightness-90 group-hover:brightness-75 transition duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h4 className="text-white font-semibold text-md truncate">死恃 3</h4>
                  <p className="text-gray-400 text-sm truncate">
                  《死侍與金鋼狼》重大消息| 金剛狼在《死侍3》回歸！ · 《死侍與金鋼狼》預告解析| 漫威真正救世主降臨！ · 重大消息| CinemaCon死侍9分鐘獨家片段嘲諷Marvel客串超廉價！
                  </p>
                </div>
              </div>

              {/* 右側小卡片 2 */}
              <div className="relative rounded-xl overflow-hidden shadow-lg group transition-all duration-300">
                <img 
                src="https://sm.ign.com/ign_ap/gallery/s/stellar-bl/stellar-blade-screens_sfhs.jpg" 
                alt="News 3" 
                className="w-full h-full object-cover brightness-90 group-hover:brightness-75 transition duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h4 className="text-white font-semibold text-md truncate">劍星</h4>
                  <p className="text-gray-400 text-sm truncate">《劍星》將於6月12日推出PC版，PC版功能和規格正式公開</p>
                </div>
              </div>

              {/* 右側小卡片 3 */}
              <div className="relative rounded-xl overflow-hidden shadow-lg group transition-all duration-300">
                <img src="https://substackcdn.com/image/fetch/$s_!kRZN!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fdcc7124b-6df8-4dc9-b6cf-8c6a4bc52e8a_1388x788.png" 
                alt="News 4" 
                className="w-full h-full object-cover brightness-90 group-hover:brightness-75 transition duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h4 className="text-white font-semibold text-md truncate">Cyberpunk 2077</h4>
                  <p className="text-gray-400 text-sm truncate">科幻 RPG《電馭叛客 2077》（Cyberpunk 2077）舞台夜城（Night City）的炫目市容讓玩家意猶未竟，開發商 CD Projekt Red 曾透露正在開發代號「Project Orion」（獵戶座）的續作，近日《電馭叛客》系列 IP 創作者透露更多細節，包括一座全新的城市場景。</p>
                </div>
              </div>

              {/* 右側小卡片 4 */}
              <div className="relative rounded-xl overflow-hidden shadow-lg group transition-all duration-300">
                <img src="https://oyster.ignimgs.com/mediawiki/apis.ign.com/elden-ring/e/e5/20220307193717_1.jpg?width=1280" 
                alt="News 5" 
                className="w-full h-full object-cover brightness-130 group-hover:brightness-75 transition duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h4 className="text-white font-semibold text-md truncate">Elden Ring</h4>
                  <p className="text-gray-400 text-sm truncate">《艾爾登法環》米凱拉的鋒刃 瑪蓮妮亞登場！</p>
                </div>
              </div>
              
            </div>
          </div>
        </section>
        {/* 🎯 === 新增橫幅結束 === 🎯 */}

        {/* 會員橫幅 (保持不變) */}
        <section className="relative h-[40vh] rounded-xl overflow-hidden mb-12 group">
          {/* ... (會員橫幅的程式碼保持不變) ... */}
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


        {/* 即將上映電影 (4 部) */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">即將推出</h2>
            <a href="#" className="text-purple-400 hover:text-purple-600 font-medium">查看全部</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {/* 🎯 顯示 loading 或 API 回傳的資料 */}
            {loading ? (
              <p>資料載入中...</p>
            ) : (
              comingSoonMovies.map((movie) => (
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

      {/* 底部導覽 (黑紫風格) */}
      <footer className="bg-neutral-800 py-8 mt-12">
        <div className="container mx-auto text-center text-gray-400">
          &copy; 2025 VIENNA CINEMA. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;