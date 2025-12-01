import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  if (!movie) {
    return null;
  }

  
  // 現在 100% 使用從 API 傳來的 'movie.poster' 路徑就是正確的路徑。
  const posterUrl = movie.poster; 
  // ----------------------------------------------------

  return (
    <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
      
      {/* 我們恢復使用您首頁的「縱橫比」樣式 (aspect-[2/3])，
        這比固定高度 (h-72) 更能適應不同寬度，且保持海報比例 
      */}
      <img
        src={posterUrl} // 🎯 使用修正後的 posterUrl
        alt={movie.title}
        className="w-full aspect-[2/3] object-cover" // 保持海Normal報比例
        // 錯誤處理：如果圖片路徑錯誤(例如打錯字)，顯示一個錯誤
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src = 'https://via.placeholder.com/400x600?text=Image+Not+Found'; 
        }}
      />
      
      <div className="p-4">
        <h3 className="text-white text-xl font-bold mb-2 truncate" title={movie.title}>{movie.title}</h3>
        <p className="text-gray-400 text-sm mb-1">{movie.duration} | {movie.rating}</p>
        <p className="text-gray-500 text-xs mb-4">{movie.genre}</p> 
        
        {movie.isShowing ? (
          <Link 
            to={`/movie/${movie.id}`} 
            className="block text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full w-full transition duration-300"
          >
            取得門票
          </Link>
        ) : (
          <button className="bg-gray-700 text-gray-400 font-bold py-2 px-4 rounded-full w-full cursor-not-allowed">
            即將推出
          </button>
        )}
      </div>
    </div>
  );
}

export default MovieCard;