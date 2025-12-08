import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ShowtimeMovieCard({ movie, onError, theatreId, selectedDate }) {
  // 移除原本寫死的 language 變數
  // const language = "英語 / 日語 (字幕)"; 
  
  const mockTimes = ["10:30", "13:15", "15:40", "18:20", "21:00"];

  const [selectedTime, setSelectedTime] = useState(null);

  const handleTicketClick = (e) => {
    if (!selectedTime) {
      e.preventDefault();
      if (onError) onError(); 
    }
  };

  // 1. 取得資料庫原始連結
  const rawTrailerUrl = movie.trailerUrl;

  // 2. 轉換連結函式：將 /embed/ 轉為 /watch?v=
  const getWatchUrl = (url) => {
    if (!url) return null;
    if (url.includes('/embed/')) {
      return url.replace('/embed/', '/watch?v=');
    }
    return url;
  };

  const watchUrl = getWatchUrl(rawTrailerUrl);

  return (
    <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-xl flex transition-all duration-300 ease-in-out hover:shadow-purple-500/30">
      
      <div className="w-1/3 md:w-1/4 flex-shrink-0 h-76"> 
        <img 
          src={movie.posterUrl} 
          alt={movie.movieName}
          className="w-full h-full object-cover" 
        />
      </div>

      <div className="flex-grow px-5 md:px-6 py-3 flex flex-col justify-between">
        
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{movie.movieName}</h2> 
          
          <div className="text-sm text-gray-300 space-y-2 mb-0"> 
            <p><span className="font-semibold text-gray-400">片長:</span> {movie.movieDurationMinutes}</p>
            <p><span className="font-semibold text-gray-400">電影種類:</span> {movie.movieType}</p>
            <p><span className="font-semibold text-gray-400">導演:</span> {movie.director || 'N/A'}</p>
            <p><span className="font-semibold text-gray-400">演員:</span> {movie.actors || 'N/A'}</p>
            
            {/* 🔥 修改這裡：讀取 movie.language，若無資料則預設顯示 '英語' */}
            <p><span className="font-semibold text-gray-400">語言:</span> {movie.language || '英語'}</p>
          </div>

          <div className="mt-4 border-t border-neutral-700 pt-3">
              <p className="text-gray-400 text-sm font-semibold mb-2">時段:</p>
              
              <div className="flex flex-wrap gap-2">
                {mockTimes.map((time, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedTime(time)} 
                    className={`
                      text-xs py-1 px-3 rounded transition-colors duration-200
                      ${selectedTime === time 
                        ? 'bg-purple-600 text-white font-bold shadow-lg' 
                        : 'bg-neutral-700 text-gray-200 hover:bg-neutral-600'
                      }
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-4 ml-auto">
          <Link 
            to={`/movie/${movie.movieId}`}
            state={{ 
                selectedTime: selectedTime,
                theatreId: theatreId,
                selectedDate: selectedDate 
            }}
            onClick={handleTicketClick} 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 text-sm flex items-center justify-center"
          >
            取得門票
          </Link>
          
          {/* 3. 使用轉換後的 watchUrl */}
          <a
            href={watchUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className={`
              bg-transparent border border-gray-400 text-gray-200 
              hover:border-white hover:text-white 
              font-bold py-2 px-6 rounded-full transition duration-300 text-sm 
              flex items-center justify-center no-underline
              ${!watchUrl ? 'opacity-50 cursor-not-allowed' : ''} 
            `}
            onClick={(e) => !watchUrl && e.preventDefault()}
          >
            觀看預告片
          </a>
        </div>
      </div>
    </div>
  );
}

export default ShowtimeMovieCard;