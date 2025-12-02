import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 接收 onMealChange 回調函數
function MealSelector({ onMealChange }) {
  const [concessionData, setConcessionData] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // 1. 從 API 獲取餐飲資料
  useEffect(() => {
    axios.get('http://localhost:4000/api/concessions')
      .then(res => {
        setConcessionData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("無法載入餐飲資料:", err);
        setLoading(false);
      });
  }, []);

  // 2. 處理數量變更
  const handleCountChange = (id, delta) => {
    setCounts(prevCounts => {
      const newCount = Math.max(0, (prevCounts[id] || 0) + delta);
      const newCounts = { ...prevCounts, [id]: newCount };
      
      // 🎯 當數量改變時，計算出完整的已選列表回傳給父層
      if (onMealChange) {
        // 將 counts 物件轉換為陣列格式: [{...itemData, count: 2}, ...]
        const selectedMeals = concessionData.map(item => ({
            ...item,
            count: newCounts[item.id] || 0
        })).filter(item => item.count > 0);
        
        onMealChange(selectedMeals);
      }

      return newCounts;
    });
  };

  if (loading) return <p className="text-gray-400">載入餐飲中...</p>;

  return (
    <div className="bg-neutral-800 p-6 rounded-xl text-white">
      <div className="space-y-4">
        {concessionData.map(item => (
          <div 
            key={item.id} 
            className="flex items-center bg-neutral-700 p-4 rounded-lg hover:bg-neutral-600 transition-colors"
          >
            {/* 1. 圖片 (含錯誤處理) */}
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-16 h-16 object-cover rounded-md flex-shrink-0" 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Food'; }}
            />
            {/* 2. 品名、內容、價格 */}
            <div className="ml-4 flex-grow">
              <h4 className="text-lg font-semibold text-white">{item.name}</h4>
              <p className="text-sm text-gray-400">{item.content}</p>
              <p className="text-sm text-purple-300 font-bold">$ {item.price}</p>
            </div>
            
            {/* 3. 計數器 (🎯 已修改樣式：加入灰底背景與票券一致) */}
            <div className="flex items-center space-x-4 flex-shrink-0 bg-black/20 p-2 rounded-full">
              <button 
                onClick={() => handleCountChange(item.id, -1)}
                className="w-8 h-8 rounded-full bg-purple-600 text-white text-lg font-bold flex items-center justify-center hover:bg-purple-700 transition relative z-10 shadow-lg"
              >
                -
              </button>
              <span className="text-xl font-bold text-white w-8 text-center">
                {counts[item.id] || 0}
              </span>
              <button 
                onClick={() => handleCountChange(item.id, 1)}
                className="w-8 h-8 rounded-full bg-purple-600 text-white text-lg font-bold flex items-center justify-center hover:bg-purple-700 transition relative z-10 shadow-lg"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MealSelector;