import React from 'react';
import { Link } from 'react-router-dom';

function ShowtimeMovieCard({ movie }) {
  const language = "英語 / 日語 (字幕)"; 

  return (
    // 🎯 卡片整體高度將由左側海報決定
    <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-xl flex transition-all duration-300 ease-in-out hover:shadow-purple-500/30">
      
      {/* 左側海報 */}
      <div className="w-1/3 md:w-1/4 flex-shrink-0 h-76"> 
        <img 
          src={movie.posterUrl} 
          alt={movie.movieName}
          className="w-full h-full object-cover" 
        />
      </div>

      {/* 右側：電影資訊 */}
      <div className="flex-grow px-5 md:px-6 py-3 flex flex-col justify-between">
        
        {/* 上方文字區塊 */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{movie.movieName}</h2> 
          <p className="text-sm text-gray-400 mb-4">{movie.movieDurationMinutes}</p> {/* 增加這裡的 mb，讓時間跟下面資訊分開一點 */}
          
          {/* 🎯 修改這裡：將 space-y-0.5 改為 space-y-2，加大行距 */}
          <div className="text-sm text-gray-300 space-y-2 mb-0"> 
            <p><span className="font-semibold text-gray-400">電影種類:</span> {movie.movieType}</p>
            <p><span className="font-semibold text-gray-400">導演:</span> {movie.director || 'N/A'}</p>
            <p><span className="font-semibold text-gray-400">演員:</span> {movie.actors || 'N/A'}</p>
            <p><span className="font-semibold text-gray-400">語言:</span> {language}</p>
          </div>
        </div>
        
        {/* 按鈕區塊 */}
        <div className="flex space-x-4 mt-4 ml-auto">
          <Link 
            to={`/movie/${movie.movieId}`}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 text-sm"
          >
            取得門票
          </Link>
          <button className="bg-transparent border border-gray-400 text-gray-200 hover:border-white hover:text-white font-bold py-2 px-6 rounded-full transition duration-300 text-sm">
            觀看預告片
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShowtimeMovieCard;