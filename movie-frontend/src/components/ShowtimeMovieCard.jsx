import React from 'react';
import { Link } from 'react-router-dom';

function ShowtimeMovieCard({ movie }) {
  const language = "英語 / 日語 (字幕)"; 
  // 🎯 這裡是用來示意的假時間資料
  const mockTimes = ["10:30", "13:15", "15:40", "18:20", "21:00"];

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
          <p className="text-sm text-gray-400 mb-4">{movie.movieDurationMinutes}</p> 
          
          <div className="text-sm text-gray-300 space-y-2 mb-0"> 
            <p><span className="font-semibold text-gray-400">電影種類:</span> {movie.movieType}</p>
            <p><span className="font-semibold text-gray-400">導演:</span> {movie.director || 'N/A'}</p>
            <p><span className="font-semibold text-gray-400">演員:</span> {movie.actors || 'N/A'}</p>
            <p><span className="font-semibold text-gray-400">語言:</span> {language}</p>
          </div>

          {/* 🔥 新增區域：可選時間示意 (位於語言下方) */}
          <div className="mt-4 border-t border-neutral-700 pt-3">
             <span className="text-xs font-semibold text-gray-400 mb-2 block">今日場次:</span>
             <div className="flex flex-wrap gap-2">
               {mockTimes.map((time, index) => (
                 <button 
                   key={index}
                   className="text-xs bg-neutral-700 hover:bg-purple-600 text-gray-200 py-1 px-3 rounded transition-colors duration-200"
                 >
                   {time}
                 </button>
               ))}
             </div>
          </div>
          {/* 🔥 新增區域結束 */}

        </div>
        
        {/* 按鈕區塊 (位於時間下方) */}
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