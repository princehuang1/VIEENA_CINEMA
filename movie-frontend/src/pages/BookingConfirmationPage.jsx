import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

function BookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = location.state || {
    tickets: [], 
    meals: [], 
    theater: { name: '未選擇' },
    date: '',
    time: '',
    selectedSeats: [],
    totalPrice: 0,
    movie: { movieName: '未知電影', posterUrl: '' }
  };

  const { movie, theater, date, time, tickets, meals, selectedSeats, totalPrice } = bookingData;

  const handlePayment = () => {
    alert("訂單已送出！進入付款流程...");
  };

  if (!location.state) {
    return (
        <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center flex-col">
            <h2 className="text-2xl mb-4">無訂單資料</h2>
            <button onClick={() => navigate('/')} className="text-purple-400 underline">回首頁</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 md:px-20 py-12 flex flex-col items-center">
        
        <h1 className="text-4xl font-bold text-white mb-8">訂單確認</h1>
        
        <div className="w-full max-w-5xl bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-neutral-700">
            
            {/* 左側：電影海報 */}
            <div className="w-full md:w-1/3 bg-black relative">
                {/* 🎯 修改：移除了左側的漸層陰影，圖片保持原樣 */}
                <img 
                    src={movie?.posterUrl || 'https://via.placeholder.com/400x600'} 
                    alt={movie?.movieName} 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* 右側：訂單詳情 */}
            <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-white mb-2">{movie?.movieName}</h2>
                    <p className="text-purple-400 font-medium text-lg mb-6">{theater.name}</p>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8 text-sm md:text-base">
                        <div>
                            <p className="text-gray-500 mb-1">日期</p>
                            <p className="text-white font-bold text-xl">{date}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">時間</p>
                            <p className="text-white font-bold text-xl">{time}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-500 mb-1">座位</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedSeats.map(seat => (
                                    <span key={seat} className="bg-purple-900/50 text-purple-200 border border-purple-500/30 px-3 py-1 rounded-lg font-bold">
                                        {seat}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 py-6 space-y-3">
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">購買明細</p>
                        {tickets.map((t, i) => (
                            <div key={`t-${i}`} className="flex justify-between text-gray-300">
                                <span>{t.name} <span className="text-gray-500">x{t.count}</span></span>
                                <span>$ {t.price * t.count}</span>
                            </div>
                        ))}
                        {/* 🎯 新增：顯示餐飲明細 */}
                        {meals.map((m, i) => (
                            <div key={`m-${i}`} className="flex justify-between text-gray-300">
                                <span>{m.name} <span className="text-gray-500">x{m.count}</span></span>
                                <span>$ {m.price * m.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <p className="text-gray-400 text-sm">總金額</p>
                        <p className="text-4xl font-bold text-white">$ {totalPrice}</p>
                    </div>
                    
                    <div className="flex gap-4 w-full md:w-auto">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex-1 md:flex-none px-6 py-3 rounded-full border border-gray-600 text-gray-300 hover:bg-gray-700 transition font-bold"
                        >
                            上一步
                        </button>
                        <button 
                            onClick={handlePayment}
                            className="flex-1 md:flex-none px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/30 transition font-bold"
                        >
                            前往付款
                        </button>
                    </div>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}

export default BookingConfirmationPage;