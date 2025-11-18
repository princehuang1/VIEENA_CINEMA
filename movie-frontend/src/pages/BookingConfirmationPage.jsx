import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SeatSelector from '../components/SeatSelector';

function BookingConfirmationPage() {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const location = useLocation();

  // 1. 接收從上一頁 (MovieDetailPage) 傳來的資料
  // 如果沒有資料 (例如直接輸入網址進入)，則使用預設空值以防報錯
  const bookingData = location.state || {
    tickets: [], // { name, price, count }
    meals: [],   // { name, price, count }
    theatre: { name: '未選擇影城' },
    date: { dayName: '', dayNum: '' },
    time: ''
  };

  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // 2. 抓取電影資料 (為了顯示片名)
  useEffect(() => {
    axios.get(`http://localhost:4000/api/movies/${movieId}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error("無法抓取電影資料", err));
  }, [movieId]);

  // 3. 計算總金額 (票價 + 餐點)
  const calculateTotal = () => {
    const ticketsTotal = bookingData.tickets.reduce((sum, item) => sum + (item.price * item.count), 0);
    const mealsTotal = bookingData.meals.reduce((sum, item) => sum + (item.price * item.count), 0);
    return ticketsTotal + mealsTotal;
  };

  // 4. 計算總票數 (用來檢查座位數是否正確)
  const totalTicketsCount = bookingData.tickets.reduce((sum, item) => sum + item.count, 0);

  // 按鈕邏輯：取消
  const handleCancel = () => {
    if (isConfirmed) {
      setIsConfirmed(false); // 如果已確認，取消則回到選位狀態
    } else {
      navigate(-1); // 返回上一頁
    }
  };

  // 按鈕邏輯：確認 / 付款
  const handleConfirm = () => {
    // 檢查座位數是否等於票數 (如果上一頁有選票的話)
    if (totalTicketsCount > 0 && selectedSeats.length !== totalTicketsCount) {
      alert(`您購買了 ${totalTicketsCount} 張票，請選擇 ${totalTicketsCount} 個座位。`);
      return;
    }
    if (selectedSeats.length === 0 && totalTicketsCount === 0) {
        // 如果完全沒選票也沒選位(極端情況)，至少要選一個位子
         if (selectedSeats.length === 0) {
            alert("請至少選擇一個座位");
            return;
         }
    }


    if (!isConfirmed) {
      setIsConfirmed(true); // 第一次點擊：鎖定並顯示明細
    } else {
      alert("訂單已送出！進入付款流程..."); // 第二次點擊：付款
      // navigate('/payment', { state: { ...bookingData, seats: selectedSeats, total: calculateTotal() } });
    }
  };

  // 如果沒有從上一頁傳來資料，顯示提示 (開發除錯用)
  if (!location.state) {
    console.warn("警告：此頁面沒有接收到 bookingData，可能是直接輸入網址進入的。");
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-20 py-8 flex flex-col items-center justify-center">
        
        <h1 className="text-4xl font-bold text-white mb-2">選擇座位</h1>
        {movie && <p className="text-gray-400 mb-8">{movie.movieName} | {bookingData.theatre.name}</p>}
        
        {/* 座位選擇器 */}
        <div className={`w-full max-w-4xl transition-all duration-500 ${isConfirmed ? 'opacity-80 pointer-events-none' : ''}`}>
          <SeatSelector 
             selectedSeats={selectedSeats}
             onSeatSelect={setSelectedSeats}
          />
        </div>

        {/* 🎯 訂單資訊區塊 (確認後顯示) */}
        {isConfirmed && (
          <div className="w-full max-w-4xl mt-8 bg-neutral-800 p-8 rounded-xl shadow-lg border border-purple-500/30 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">訂單確認</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* 左側：明細列表 */}
              <div className="space-y-4">
                {/* 顯示影城與時間 */}
                <div className="pb-2 border-b border-gray-700">
                    <p className="text-purple-400 font-semibold">場次資訊</p>
                    <p className="text-gray-300">{bookingData.theatre.name}</p>
                    <p className="text-gray-300">{bookingData.date.dayNum}日 ({bookingData.date.dayName})</p>
                </div>

                {/* 顯示票種 */}
                {bookingData.tickets.length > 0 && (
                    <div>
                        <p className="text-purple-400 font-semibold">電影票</p>
                        {bookingData.tickets.map((t, i) => (
                            t.count > 0 && (
                                <div key={i} className="flex justify-between text-gray-300">
                                    <span>{t.name} x{t.count}</span>
                                    <span>$ {t.price * t.count}</span>
                                </div>
                            )
                        ))}
                    </div>
                )}

                {/* 顯示餐點 */}
                {bookingData.meals.length > 0 && (
                    <div>
                        <p className="text-purple-400 font-semibold">餐飲</p>
                        {bookingData.meals.map((m, i) => (
                             m.count > 0 && (
                                <div key={i} className="flex justify-between text-gray-300">
                                    <span>{m.name} x{m.count}</span>
                                    <span>$ {m.price * m.count}</span>
                                </div>
                            )
                        ))}
                    </div>
                )}
              </div>

              {/* 右側：座位與總計 */}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-purple-400 font-semibold mb-2">已選座位</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.length > 0 ? (
                        selectedSeats.map(seat => (
                        <span key={seat} className="bg-purple-900 text-purple-100 px-3 py-1 rounded-md text-sm font-bold">
                            {seat}
                        </span>
                        ))
                    ) : (
                        <span className="text-gray-500">未選擇</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-gray-700 flex justify-between items-end">
                  <span className="text-gray-400">總金額</span>
                  <span className="text-4xl font-bold text-white">$ {calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 底部按鈕區塊 */}
        <div className="w-full max-w-4xl flex justify-between items-center mt-12 pb-12">
            {/* 左下角：取消按鈕 */}
            <button 
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-10 rounded-full transition duration-300 text-lg"
            >
                {isConfirmed ? "修改座位" : "取消"}
            </button>

            {/* 右下角：確認/付款按鈕 */}
            <button 
                onClick={handleConfirm}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-10 rounded-full transition duration-300 text-lg shadow-lg hover:shadow-purple-500/50"
            >
                {isConfirmed ? "進行付款" : "確認"}
            </button>
        </div>

      </main>
    </div>
  );
}

export default BookingConfirmationPage;

