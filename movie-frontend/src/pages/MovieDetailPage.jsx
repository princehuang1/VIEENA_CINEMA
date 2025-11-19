import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import Navbar from '../components/Navbar';
import ShowtimeSelector from '../components/ShowtimeSelector';
import MealSelector from "../components/MealSelector"; 

function MovieDetailPage() {
  const { movieId } = useParams(); 
  const navigate = useNavigate(); 
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imageError, setImageError] = useState(false);
  const defaultPosterUrl = 'https://via.placeholder.com/600x900?text=Image+Not+Found';

  useEffect(() => {
    setImageError(false); 
    setLoading(true);

    axios.get(`http://localhost:4000/api/movies/${movieId}`)
      .then(response => {
        setMovie(response.data); 
        setLoading(false);
      })
      .catch(err => {
        console.error("抓取單一電影資料失敗:", err);
        setError("無法載入電影資料");
        setLoading(false);
      });
  }, [movieId]); 
  
  // 處理跳轉到確認頁面
  const handleConfirm = () => {
    navigate(`/booking-confirmation/${movieId}`); 
  };

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

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans">
      <Navbar />
      
      {/* --- 電影橫幅 --- */}
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

          {/* 右側：電影資訊 + 所有選擇器 */}
          <div className="w-full md:w-2/3 space-y-8">
            
            {/* 1. 電影資訊 */}
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

              {/* 🎯 詳細資訊：種類、導演、演員、語言 (全部從資料庫讀取) */}
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
                  {movie.language || '未知'} {/* 🎯 使用資料庫中的 language 欄位 */}
                </p>
              </div>
            </div>
            
            <hr className="border-gray-700" />

            {/* 2. 場次選擇 (影城/日期/票種) */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">選擇場次</h2>
              <ShowtimeSelector />
            </div>

            {/* 3. 餐飲加購 */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">加購餐飲</h2>
              <MealSelector />
              
              {/* 🎯 確認按鈕 */}
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