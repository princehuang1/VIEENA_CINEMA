import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SeatSelector from '../components/SeatSelector'; // 這裡引入座位選擇器

function BookingConfirmationPage() {
  const navigate = useNavigate();
  const { movieId } = useParams();

  const handleCancel = () => {
    navigate(-1); // 返回上一頁
  };

  const handleFinalConfirm = () => {
    // 這裡未來會處理付款邏輯
    alert("訂單確認！準備進入付款流程..."); 
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-20 py-8 flex flex-col items-center justify-center">
        
        <h1 className="text-4xl font-bold text-white mb-8">選擇座位</h1>
        
        {/* 座位選擇器置中顯示 */}
        <div className="w-full max-w-4xl">
          <SeatSelector />
        </div>

        {/* 底部按鈕區塊 */}
        <div className="w-full max-w-4xl flex justify-between items-center mt-12">
            {/* 左下角：取消按鈕 */}
            <button 
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-10 rounded-full transition duration-300 text-lg"
            >
                取消
            </button>

            {/* 右下角：確認按鈕 */}
            <button 
                onClick={handleFinalConfirm}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-10 rounded-full transition duration-300 text-lg shadow-lg hover:shadow-purple-500/50"
            >
                確認
            </button>
        </div>

      </main>
    </div>
  );
}

export default BookingConfirmationPage;