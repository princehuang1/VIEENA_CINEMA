import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

// 假資料
const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const seatsPerRow = 10;

// 🎯 固定 5 個假資料位置 (所有電影適用)
const takenSeats = ['A3', 'C6', 'E2', 'F8', 'G5']; 

const rowLabels = ['1', '2', '3', '4', '5', '6', '7', '8']; 

function SeatSelectPage() {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const location = useLocation();
  
  // 接收來自 MovieDetailPage 的資料
  const bookingData = location.state || {
    movie: null,
    theater: { name: '未知影城' },
    date: '',
    time: '',
    tickets: [],
    meals: [],
    totalPrice: 0
  };

  const [selectedSeats, setSelectedSeats] = useState([]);

  // 計算需要選擇的總座位數
  const requiredSeatsCount = bookingData.tickets.reduce((sum, t) => sum + t.count, 0);

  const handleSeatClick = (seatId) => {
    // 如果是被佔用的座位，直接忽略
    if (takenSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      // 取消選擇
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else {
      // 選擇座位 (不能超過票數)
      if (selectedSeats.length < requiredSeatsCount) {
        setSelectedSeats(prev => [...prev, seatId]);
      } else {
        alert(`您只購買了 ${requiredSeatsCount} 張票，無法選擇更多座位。`);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedSeats.length !== requiredSeatsCount) {
      alert(`請選擇 ${requiredSeatsCount} 個座位 (目前已選 ${selectedSeats.length})`);
      return;
    }

    // 前往確認頁面
    navigate(`/booking-confirmation/${movieId}`, {
      state: {
        ...bookingData,
        selectedSeats
      }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 md:px-20 py-8 flex flex-col items-center">
        
        <h1 className="text-3xl font-bold text-white mb-2">選擇座位</h1>
        <p className="text-gray-400 mb-8">
            {bookingData.movie?.movieName} | {bookingData.theater.name} | {bookingData.date} {bookingData.time}
        </p>
        <p className="text-purple-400 font-bold mb-6 text-lg">
            待選座位: {selectedSeats.length} / {requiredSeatsCount}
        </p>

        {/* 座位圖區域 */}
        <div className="bg-neutral-800 p-8 rounded-xl text-white shadow-2xl border border-neutral-700/50">
          {/* 銀幕 */}
          <div className="mb-10">
            <div className="h-2 bg-gray-500 rounded-t-[50%] w-3/4 mx-auto shadow-[0_10px_30px_rgba(255,255,255,0.1)]"></div>
            <p className="text-center text-xs text-gray-500 mt-3 tracking-widest">SCREEN</p>
          </div>

          <div className="flex justify-center gap-6">
            {/* 左側排號 */}
            <div className="flex flex-col space-y-2 justify-center mr-2">
              {rows.map((r) => (
                <div key={`left-${r}`} className="h-8 flex items-center justify-center text-gray-500 text-xs">
                  {r}
                </div>
              ))}
            </div>

            {/* 座位矩陣 */}
            <div className="flex flex-col items-center space-y-2">
              {rows.map(row => (
                <div key={row} className="flex space-x-2">
                  {Array.from({ length: seatsPerRow }, (_, i) => {
                    const seatNum = i + 1;
                    const seatId = `${row}${seatNum}`;
                    
                    let seatClass = 'bg-neutral-600 hover:bg-purple-500 cursor-pointer';
                    
                    // 🎯 樣式判斷邏輯
                    if (takenSeats.includes(seatId)) {
                        // 已被選：較亮的紅色 (bg-red-600)，且不可點擊
                        seatClass = 'bg-red-600 cursor-not-allowed shadow-inner';
                    } else if (selectedSeats.includes(seatId)) {
                        // 使用者目前選擇：紫色
                        seatClass = 'bg-purple-600 shadow-lg scale-110';
                    }

                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={takenSeats.includes(seatId)}
                        className={`w-8 h-8 rounded-t-lg rounded-b-md transition-all duration-200 ${seatClass} text-white text-[10px] font-bold flex items-center justify-center`}
                        title={seatId}
                      >
                        {/* 🎯 始終顯示座位號碼，不顯示 X */}
                        {seatNum}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
             
             {/* 右側排號 */}
             <div className="flex flex-col space-y-2 justify-center ml-2">
              {rows.map((r) => (
                <div key={`right-${r}`} className="h-8 flex items-center justify-center text-gray-500 text-xs">
                  {r}
                </div>
              ))}
            </div>
          </div>

          {/* 圖例 */}
          <div className="flex justify-center space-x-8 mt-10 pt-6 border-t border-neutral-700">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-neutral-600"></div><span className="text-xs text-gray-400">可選</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-purple-600"></div><span className="text-xs text-gray-400">已選</span></div>
            {/* 更新圖例顏色 */}
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-600"></div><span className="text-xs text-gray-400">已售出</span></div>
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="w-full max-w-4xl flex justify-between items-center mt-12 pb-12">
            <button 
                onClick={() => navigate(-1)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-10 rounded-full transition duration-300 text-lg flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                返回修改
            </button>

            <button 
                onClick={handleConfirm}
                disabled={selectedSeats.length !== requiredSeatsCount}
                className={`
                    font-bold py-3 px-12 rounded-full transition duration-300 text-lg shadow-lg flex items-center gap-2
                    ${selectedSeats.length === requiredSeatsCount
                        ? 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-purple-500/50 cursor-pointer transform hover:-translate-y-1'
                        : 'bg-neutral-700 text-gray-500 cursor-not-allowed'
                    }
                `}
            >
                確認座位
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
        </div>

      </main>
    </div>
  );
}

export default SeatSelectPage;