import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function DonePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 flex flex-col items-center justify-center pb-20">
        
        {/* 成功圖示與動畫容器 */}
        <div className="bg-neutral-800 p-10 rounded-3xl shadow-2xl border border-neutral-700 text-center max-w-md w-full animate-fade-in-up">
          
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="3" 
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            恭喜完成購買！
          </h1>
          
          <p className="text-gray-400 mb-8">
            您的訂單已確認，票券資訊將寄送至您的電子信箱。
          </p>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-1"
          >
            回首頁
          </button>
        </div>

      </main>
    </div>
  );
}

export default DonePage;