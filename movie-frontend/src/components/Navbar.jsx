import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // 引入 hooks

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // 用來監聽路徑變化，強迫刷新狀態
  const [user, setUser] = useState(null);

  // 檢查登入狀態
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]); // 當路由改變時重新檢查

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-neutral-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          VIENNA <span className="text-purple-500">CINEMA</span>
        </div>

        {/* 導覽連結 */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-300 hover:text-white transition duration-300">首頁</Link>
          <Link to="/showtimes" className="text-gray-300 hover:text-white transition duration-300">場次查詢</Link>
          <Link to="/theaters" className="text-gray-300 hover:text-white transition duration-300">影城</Link>
          <Link to="/movie-info" className="text-gray-300 hover:text-white transition duration-300">電影資訊</Link>
          <Link to="/store" className="text-gray-300 hover:text-white transition duration-300">商城</Link>
        </div>

        {/* 登入/註冊/會員 按鈕 */}
        <div className="flex items-center space-x-4">
          {user ? (
            // 已登入狀態
            <>
              <Link to="/user" className="text-purple-400 hover:text-purple-300 font-bold transition duration-300 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                    {user.userName.charAt(0)}
                </div>
                {user.userName}
              </Link>
              {/* 可選：登出按鈕放在這裡或UserPage都可以 */}
            </>
          ) : (
            // 未登入狀態
            <>
              <Link to="/signin" className="text-gray-300 hover:text-white transition duration-300">登入</Link>
              <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">
                註冊
              </Link>
            </>
          )}
        </div>

        {/* ... Mobile Menu Button (略) ... */}
      </div>
    </nav>
  );
}

export default Navbar;