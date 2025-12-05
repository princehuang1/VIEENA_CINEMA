import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

function BookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 接收上一頁的資料
  const bookingData = location.state || {
    tickets: [], 
    meals: [], 
    theater: { name: '未選擇' },
    date: '',
    time: '',
    selectedSeats: [],
    totalPrice: 0,
    movie: { movieName: '未知商品' },
    isStore: false // 預設不是商城
  };

  const { movie, theater, date, time, tickets, meals, selectedSeats, totalPrice, isStore } = bookingData;

  const handlePayment = () => {
    // 傳送所有訂單資料到付款頁面
    // 如果是 store item，ID 可能是 undefined，給個預設值避免路徑錯誤
    navigate(`/payment/${movie?.id || 'store-item'}`, { 
        state: bookingData 
    });
  };

  if (!location.state) {
    return (
        <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center flex-col">
            <Navbar />
            <h2 className="text-2xl mb-4 mt-20">無訂單資料</h2>
            <button onClick={() => navigate('/')} className="text-purple-400 underline">回首頁</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 md:px-20 py-12 flex flex-col items-center">
        
        <h1 className="text-3xl font-bold text-white mb-8">確認訂單</h1>
        
        {/* 簡化後的卡片 */}
        <div className="w-full max-w-3xl bg-neutral-800 p-8 rounded-2xl shadow-xl border border-neutral-700">
            
            {/* 1. 標題區塊：商品/電影名稱 */}
            <div className="border-b border-gray-700 pb-6 mb-6">
                <p className="text-xs text-gray-500 mb-1">{isStore ? '商品名稱' : '電影'}</p>
                <h2 className="text-2xl font-bold text-white mb-2">{movie?.movieName}</h2>
                <p className="text-purple-400 text-sm">{theater.name}</p>
            </div>

            {/* 2. 資訊區塊：日期與時間 */}
            <div className="flex justify-between border-b border-gray-700 pb-6 mb-6">
                <div>
                    <p className="text-xs text-gray-500 mb-1">{isStore ? '訂購日期' : '日期'}</p>
                    <p className="text-white font-bold">{date}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">{isStore ? '訂購時間' : '時間'}</p>
                    <p className="text-white font-bold text-xl">{time}</p>
                </div>
            </div>

            {/* 3. 座位區塊：只有非商城訂單才顯示 */}
            {!isStore && selectedSeats.length > 0 && (
                <div className="border-b border-gray-700 pb-6 mb-6">
                    <p className="text-xs text-gray-500 mb-2">座位</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedSeats.map(seat => (
                            <span key={seat} className="bg-neutral-700 text-gray-200 px-3 py-1 rounded text-sm font-bold">
                                {seat}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. 購買項目明細 */}
            <div className="space-y-3 mb-8">
                <p className="text-xs text-gray-500 mb-1">明細</p>
                
                {/* 顯示票券 (商城通常無票券，除非有特別設定) */}
                {tickets.map((t, i) => (
                    <div key={`t-${i}`} className="flex justify-between text-sm">
                        <span className="text-gray-300">{t.name} <span className="text-gray-500">x{t.count}</span></span>
                        <span className="text-white">$ {t.price * t.count}</span>
                    </div>
                ))}

                {/* 顯示商品/餐飲 */}
                {meals.map((m, i) => (
                    <div key={`m-${i}`} className="flex justify-between text-sm">
                        <span className="text-gray-300">{m.name} <span className="text-gray-500">x{m.count}</span></span>
                        <span className="text-white">$ {m.price * m.count}</span>
                    </div>
                ))}
            </div>

            {/* 5. 總金額 */}
            <div className="flex justify-between items-center border-t border-gray-700 pt-6 mb-8">
                <span className="text-gray-400 font-bold">總金額</span>
                <span className="text-4xl font-bold text-purple-400">$ {totalPrice}</span>
            </div>

            {/* 按鈕區 */}
            <div className="flex gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="w-1/3 bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-3 rounded-full transition duration-300"
                >
                    返回
                </button>
                <button 
                    onClick={handlePayment}
                    className="w-2/3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full transition duration-300 shadow-lg hover:shadow-purple-500/50"
                >
                    前往付款
                </button>
            </div>

        </div>

      </main>
    </div>
  );
}

export default BookingConfirmationPage;