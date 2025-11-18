import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ShowtimeMovieCard from '../components/ShowtimeMovieCard'; // 引入我們剛才做的新卡片

// --- 複製自 ShowtimeSelector.jsx 的輔助資料 ---
// (未來這些也應該從 API 獲取)
const getNext7Days = () => {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({ dayName: days[date.getDay()], dayNum: date.getDate().toString() });
  }
  return dates;
};
const theatresData = [
  { id: 1, name: '台北信義影城' },
  { id: 2, name: '台北中山影城' },
  { id: 3, name: '新北板橋影城' },
];
// --- 輔助資料結束 ---


function ShowtimePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 篩選器的狀態 (目前僅為 UI，尚無過濾功能)
  const [selectedTheatre, setSelectedTheatre] = useState(theatresData[0].id);
  const [selectedDate, setSelectedDate] = useState(0); // 0 = 今天
  const dates = getNext7Days();

  // 載入頁面時，抓取所有「現正熱映」的電影
  useEffect(() => {
    axios.get('http://localhost:4000/api/movies?status=Now Playing')
      .then(response => {
        setMovies(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("抓取電影資料失敗:", err);
        setLoading(false);
      });
  }, []); // 空陣列確保只在載入時執行一次

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans">
      <Navbar />
      
      {/* 依照參考圖 (showtime01.jpg) 製作的主內容區塊 */}
      <main className="container mx-auto px-20 py-8"> {/* 保持 px-20 的左右邊距 */}
        
        <h1 className="text-4xl font-bold text-white mb-8">場次查詢</h1>

        {/* --- 篩選器區塊 --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          
          {/* 左側：影城選擇 (Select Theatre) */}
          <div className="w-full md:w-1/3">
            <label htmlFor="theatre-select" className="block text-sm font-medium text-gray-300 mb-2">
              Select Theatre
            </label>
            <select
              id="theatre-select"
              value={selectedTheatre}
              onChange={(e) => setSelectedTheatre(Number(e.target.value))}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {theatresData.map(theatre => (
                <option key={theatre.id} value={theatre.id}>
                  {theatre.name}
                </option>
              ))}
            </select>
          </div>

          {/* 右側：日期選擇 (Select date) */}
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-300 mb-3 md:text-right">
              Select date
            </label>
            {/* 調整為參考圖的大小 (h-16 w-16) */}
            <div className="flex justify-end space-x-2">
              {dates.map((date, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(index)}
                  className={`flex flex-col items-center justify-center h-16 w-16 rounded-full transition-all duration-300
                    ${selectedDate === index 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
                    }
                  `}
                >
                  <span className="text-xs">{date.dayName}</span>
                  <span className="text-xl font-bold">{date.dayNum}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- 電影列表區塊 --- */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {loading ? (
            <p className="text-lg text-gray-400">正在載入電影...</p>
          ) : (
            // 遍歷 API 抓回來的電影，並使用新卡片元件顯示
            movies.map(movie => (
              <ShowtimeMovieCard key={movie.movieId} movie={movie} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default ShowtimePage;