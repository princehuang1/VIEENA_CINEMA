import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios'; 
import Navbar from '../components/Navbar';
import ShowtimeSelector from '../components/ShowtimeSelector'; // 1. 引入場次選擇器
import MealSelector from "../components/MealSelector"; // 2. 引入新元件 (餐飲)
import SeatSelector from '../components/SeatSelector'; // 3. 引入新元件 (座位)

function MovieDetailPage() {
  const { movieId } = useParams(); 
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans">
      <Navbar />
      
      {/* --- 電影橫幅 --- */}
      <section 
        className="relative w-full h-[50vh] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${movie.posterUrl})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      </section>

      {/* --- 主要內容區塊 --- */}
      <main className="container mx-auto px-20 py-8 -mt-[20vh] relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* 左側：電影海報 */}
          <div className="w-full md:w-1/3">
            <img 
              src={movie.posterUrl} 
              alt={movie.movieName}
              className="rounded-xl shadow-lg w-full"
            />
          </div>

          {/* 右側：電影資訊 + 所有選擇器 */}
          <div className="w-full md:w-2/3 space-y-8"> {/* 增加 space-y-8 讓區塊間有間距 */}
            
            {/* 1. 電影資訊 */}
            <div>
              <h1 className="text-5xl font-extrabold text-white mb-3">{movie.movieName}</h1>
              <div className="flex space-x-4 text-gray-400 mb-4">
                <span>{movie.movieDurationMinutes}</span>
                <span>|</span>
                <span>{movie.movieType}</span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">劇情簡介</h2>
              <p className="text-lg text-gray-300 mb-8">
                {movie.synopsis || "暫無簡介"}
              </p>
            </div>
            
            <hr className="border-gray-700" />

            {/* 2. 場次選擇 (影城/日期/票種) */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">選擇場次</h2>
              <ShowtimeSelector />
            </div>

            {/* 3. 🎯 新增：餐飲加購 */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">加購餐飲</h2>
              <MealSelector />
            </div>
            
            {/* 4. 🎯 新增：座位選擇 */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">選擇座位</h2>
              <SeatSelector />
            </div>

            {/* 5. 🎯 新增：確認按鈕 */}
            <div className="flex justify-end pt-4">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-10 rounded-full transition duration-300 text-lg">
                確認
              </button>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default MovieDetailPage;