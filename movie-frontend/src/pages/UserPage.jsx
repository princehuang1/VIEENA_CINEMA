import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 讀取 LocalStorage 使用者
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/signin'); // 沒登入就踢去登入頁
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // 2. 抓取訂單紀錄
    axios.get(`http://localhost:4000/api/users/${parsedUser.userId}/orders`)
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("無法取得訂單", err);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    alert('已登出');
    navigate('/');
  };

  if (loading || !user) return <div className="min-h-screen bg-neutral-900 text-white p-10">載入中...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans">
      <Navbar />
      <div className="container mx-auto px-6 md:px-20 py-12">
        
        {/* 會員資訊區塊 */}
        <div className="bg-neutral-800 p-8 rounded-2xl shadow-xl border border-neutral-700 mb-10 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">會員中心</h1>
            <p className="text-gray-400">歡迎回來，<span className="text-purple-400 font-bold text-xl">{user.userName}</span></p>
            <div className="mt-4 text-sm text-gray-500 space-y-1">
              <p>帳號: {user.userEmail}</p>
              <p>電話: {user.userPhone}</p>
              <p>註冊日期: {user.createdAt}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-6 md:mt-0 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition"
          >
            登出
          </button>
        </div>

        {/* 訂單紀錄區塊 */}
        <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-purple-600">歷史訂單</h2>
        
        <div className="space-y-6">
          {orders.length === 0 ? (
            <p className="text-gray-500">目前沒有訂單紀錄。</p>
          ) : (
            orders.map(order => (
              <div key={order.bookingId} className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 hover:border-purple-500/50 transition">
                <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-2">
                  <div>
                    <span className={`px-2 py-1 text-xs rounded font-bold mr-2 ${order.type === 'Store' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}`}>
                      {order.type === 'Store' ? '商城購物' : '電影訂票'}
                    </span>
                    <span className="text-gray-400 text-sm">訂單編號 #{order.bookingId}</span>
                  </div>
                  <span className="text-xl font-bold text-white">$ {order.totalPrice}</span>
                </div>

                {/* 顯示商品內容 (解析 JSON) */}
                <div className="space-y-2">
                  {/* 如果是電影票，這裡的 items 結構可能會稍微不同，視你 PaymentPage 怎麼存 */}
                  {/* 假設結構是統一的 {name, count, price, ...} */}
                  
                  {/* 1. 顯示電影/商品名稱 (從 items 裡抓，或是當初存的時候有特別記) */}
                  {/* 為了簡化，直接列出 items 陣列 */}
                  {order.items && Array.isArray(order.items.tickets) && order.items.tickets.map((t, idx) => (
                     <div key={`t-${idx}`} className="flex justify-between text-gray-300">
                        <span>🎫 {t.name} x {t.count}</span>
                        <span>$ {t.price * t.count}</span>
                     </div>
                  ))}

                  {order.items && Array.isArray(order.items.meals) && order.items.meals.map((m, idx) => (
                     <div key={`m-${idx}`} className="flex justify-between text-gray-300">
                        <span>🍔 {m.name} x {m.count}</span>
                        <span>$ {m.price * m.count}</span>
                     </div>
                  ))}

                  {/* 如果訂單結構單純是 items 陣列 (例如商城) */}
                  {order.items && Array.isArray(order.items) && !order.items.tickets && order.items.map((item, idx) => (
                      <div key={`i-${idx}`} className="flex justify-between text-gray-300">
                        <span>🛍️ {item.name} x {item.count}</span>
                        <span>$ {item.price * item.count}</span>
                     </div>
                  ))}
                  
                  {/* 顯示電影特有資訊 */}
                  {order.type !== 'Store' && order.items && order.items.movie && (
                      <div className="mt-2 pt-2 border-t border-gray-700 text-sm text-gray-400">
                          <p>電影: {order.items.movie.movieName}</p>
                          <p>影城: {order.items.theater?.name}</p>
                          <p>時間: {order.items.date} {order.items.time}</p>
                          {order.items.selectedSeats && <p>座位: {order.items.selectedSeats.join(', ')}</p>}
                      </div>
                  )}
                </div>
                
                <div className="mt-4 text-right">
                    <span className="text-green-400 text-sm font-bold">訂單完成</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default UserPage;