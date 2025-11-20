import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ShowtimeSelector from '../components/ShowtimeSelector';
import MealSelector from "../components/MealSelector";

// 🎯 輔助函數：根據電影資料產生媒體清單 (1部影片 + N張圖片)
const getMediaForMovie = (movie) => {
  if (!movie) return [];

  const mediaList = [];

  // 1. 處理預告片 (從資料庫讀取 trailerUrl)
  // 如果資料庫沒填，就給一個預設值 (Rick Roll) 避免空白
  const trailerSrc = movie.trailerUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  
  mediaList.push({
    type: 'video',
    src: trailerSrc
  });

  // 2. 處理劇照 (從資料庫讀取 stills JSON 字串)
  let images = [];
  try {
    if (movie.stills) {
      // 資料庫存的是像 '["/a.jpg", "/b.jpg"]' 的字串，需轉回陣列
      images = JSON.parse(movie.stills);
    }
  } catch (e) {
    console.error("解析劇照 JSON 失敗:", e);
  }

  // 3. 組合清單
  if (images.length > 0) {
    images.forEach(imgSrc => {
      mediaList.push({ type: 'image', src: imgSrc });
    });
  } else {
    // 🎯 防呆機制：如果資料庫沒填劇照，自動用「海報」重複 4 次來填空
    // 這樣即使您還沒去資料庫加圖片，版面也不會壞掉
    for (let i = 0; i < 4; i++) {
      mediaList.push({ type: 'image', src: movie.posterUrl });
    }
  }

  return mediaList;
};

function MovieDetailPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  
  // --- State ---
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  
  // 輪播圖 State
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaData, setMediaData] = useState([]); 
  const itemsPerView = 3; // 一次顯示 3 格

  const defaultPosterUrl = 'https://via.placeholder.com/600x900?text=Image+Not+Found';

  // --- Fetch Data ---
  useEffect(() => {
    setImageError(false);
    setLoading(true);
    setCurrentMediaIndex(0); // 重置輪播位置

    axios.get(`http://localhost:4000/api/movies/${movieId}`)
      .then(response => {
        const fetchedMovie = response.data;
        setMovie(fetchedMovie);
        
        // 🎯 資料回來後，立刻產生對應的媒體清單
        setMediaData(getMediaForMovie(fetchedMovie));
        
        setLoading(false);
      })
      .catch(err => {
        console.error("抓取單一電影資料失敗:", err);
        setError("無法載入電影資料");
        setLoading(false);
      });
  }, [movieId]);

  // --- Handlers ---
  const handleConfirm = () => {
    navigate(`/booking-confirmation/${movieId}`);
  };

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

  // --- Render Loading/Error ---
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans">
        <Navbar />
        <main className="container mx-auto px-20 py-8">
          <p className="text-lg text-gray-300 mt-4">資料載入中...</p>
        </main>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans">
        <Navbar />
        <main className="container mx-auto px-20 py-8">
          <h1 className="text-4xl font-bold text-red-500">{error || "找不到電影"}</h1>
        </main>
      </div>
    );
  }

  const posterToShow = imageError ? defaultPosterUrl : movie.posterUrl;

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans">
      <Navbar />
      
      {/* --- 頂部模糊橫幅 --- */}
      <section 
        className="relative w-full h-[50vh] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${posterToShow})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      </section>

      {/* --- 主要內容區塊 --- */}
      <main className="container mx-auto px-20 py-8 -mt-[20vh] relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* 左側：電影海報 */}
          <div className="w-full md:w-1/3">
            <img 
              src={posterToShow} 
              alt={movie.movieName}
              className="rounded-xl shadow-lg w-full"
              onError={() => {
                if (!imageError) setImageError(true);
              }}
            />
          </div>

          {/* 右側：資訊與選擇器 */}
          <div className="w-full md:w-2/3 space-y-8">
            
            {/* 1. 電影基本資訊 */}
            <div>
              <h1 className="text-5xl font-extrabold text-white mb-3">{movie.movieName}</h1>
              <div className="flex space-x-4 text-gray-400 mb-4">
                <span>{movie.movieDurationMinutes}</span>
                <span>|</span>
                <span>{movie.movieType}</span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">劇情簡介</h2>
              <p className="text-lg text-gray-300 mb-6">
                {movie.synopsis || "暫無簡介"}
              </p>

              {/* 詳細資訊表格 */}
              <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700 space-y-2">
                <p className="text-gray-300">
                  <span className="font-bold text-white mr-2">電影種類:</span> 
                  {movie.movieType}
                </p>
                <p className="text-gray-300">
                  <span className="font-bold text-white mr-2">導演:</span> 
                  {movie.director || 'N/A'}
                </p>
                <p className="text-gray-300">
                  <span className="font-bold text-white mr-2">演員:</span> 
                  {movie.actors || 'N/A'}
                </p>
                <p className="text-gray-300">
                  <span className="font-bold text-white mr-2">語言:</span> 
                  {movie.language || '未知'}
                </p>
              </div>
            </div>

            {/* 🎯 2. 多媒體輪播 (無標題版本) */}
            {/* mb-8 確保與下方的分隔線保持距離 */}
            <div className="relative group mb-8"> 
              
              {/* 輪播視窗 */}
              <div className="relative overflow-hidden rounded-xl">
                {/* 滑動軌道 */}
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentMediaIndex * (100 / itemsPerView)}%)` }}
                >
                  {mediaData.map((item, index) => (
                    <div key={index} className="min-w-[33.333%] px-1 box-border">
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
                            alt={`Still ${index}`} 
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 左箭頭 (只有當不在第一頁時顯示) */}
              {currentMediaIndex > 0 && (
                <button 
                  onClick={prevSlide}
                  className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              )}

              {/* 右箭頭 (只有當後面還有內容時顯示) */}
              {currentMediaIndex < (mediaData.length - itemsPerView) && (
                <button 
                  onClick={nextSlide}
                  className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              )}
            </div>
            
            <hr className="border-gray-700" />

            {/* 3. 場次選擇 */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">選擇場次</h2>
              <ShowtimeSelector />
            </div>

            {/* 4. 餐飲加購 */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">加購餐飲</h2>
              <MealSelector />
              
              {/* 確認按鈕 */}
              <div className="flex justify-end pt-6">
                <button 
                  onClick={handleConfirm}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-10 rounded-full transition duration-300 text-lg shadow-lg hover:shadow-purple-500/50"
                >
                  確認
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default MovieDetailPage;