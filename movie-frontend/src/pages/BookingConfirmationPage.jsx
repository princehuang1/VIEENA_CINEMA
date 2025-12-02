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
        
        {/* 訂單資訊卡片 */}
        <div className="w-full max-w-3xl bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl border border-neutral-700">
            <div className="w-full p-8 md:p-12 flex flex-col justify-between">
                <div>
                    <div className="border-b border-gray-700 pb-6 mb-6">
                        <h2 className="text-3xl font-extrabold text-white mb-2">{movie?.movieName}</h2>
                        <p className="text-purple-400 font-medium text-lg">{theater.name}</p>
                    </div>

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

                    <div className="bg-neutral-700/30 rounded-xl p-6 space-y-3">
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">購買明細</p>
                        {tickets.map((t, i) => (
                            <div key={`t-${i}`} className="flex justify-between text-gray-300 border-b border-gray-700/50 pb-2 last:border-0 last:pb-0">
                                <span>{t.name} <span className="text-gray-500">x{t.count}</span></span>
                                <span>$ {t.price * t.count}</span>
                            </div>
                        ))}
                        {meals.map((m, i) => (
                            <div key={`m-${i}`} className="flex justify-between text-gray-300 border-b border-gray-700/50 pb-2 last:border-0 last:pb-0">
                                <span>{m.name} <span className="text-gray-500">x{m.count}</span></span>
                                <span>$ {m.price * m.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 總金額留在卡片內，作為總結 */}
                <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center">
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">總金額</p>
                    <p className="text-5xl font-bold text-white tracking-tight">$ {totalPrice}</p>
                </div>
            </div>
        </div>

        {/* 🎯 修改：底部按鈕區塊 (移出卡片，與 SeatSelectPage 樣式一致) */}
        <div className="w-full max-w-3xl flex justify-between items-center mt-12 pb-12">
            <button 
                onClick={() => navigate(-1)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-10 rounded-full transition duration-300 text-lg flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                上一步
            </button>

            <button 
                onClick={handlePayment}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-12 rounded-full transition duration-300 text-lg shadow-lg hover:shadow-purple-500/50 flex items-center gap-2 transform hover:-translate-y-1"
            >
                前往付款
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
            </button>
        </div>

      </main>
    </div>
  );
}

export default BookingConfirmationPage;