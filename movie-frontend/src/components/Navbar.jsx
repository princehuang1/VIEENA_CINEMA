import React from 'react';
import { Link } from 'react-router-dom'; //  1. 引入 Link

function Navbar() {
  return (
    <nav className="bg-neutral-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo  */}
        <div className="text-white text-2xl font-bold">
          VIENNA <span className="text-purple-500">CINEMA</span>
        </div>

        {/* 導覽連結  */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-300 hover:text-white transition duration-300">首頁</Link>
          <Link to="/showtimes" className="text-gray-300 hover:text-white transition duration-300">場次查詢</Link>
          <Link to="/theaters" className="text-gray-300 hover:text-white transition duration-300">影城</Link>
          <Link to="/movie-info" className="text-gray-300 hover:text-white transition duration-300">電影資訊</Link>
          <Link to="/store" className="text-gray-300 hover:text-white transition duration-300">商城</Link>
        </div>

        {/* 登入/註冊按鈕 */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white transition duration-300">登入</button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">
            註冊
          </button>
        </div>

        {/* 行動版選單按鈕 */}
        <div className="md:hidden">
          <button className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;