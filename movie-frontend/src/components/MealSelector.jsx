import React, { useState } from 'react';

// 假資料 (未來從 API 獲取)
const concessionData = [
  // 單點
  { id: 1, name: '爆米花', 
    content: '爆米花 x1', 
    price: 200, 
    image: '/posters/爆米花.avif' 
  }, 
  { id: 2, name: '可樂', 
    content: '可樂 x1', 
    price: 50, 
    image: '/posters/可樂.jpg' 
  }, 
  { id: 3, name: '熱狗', 
    content: '熱狗 x1', 
    price: 130, 
    image: '/posters/熱狗.jpg' 
  },
  { id: 4, name: '薯條', 
    content: '薯條 x1', 
    price: 150, 
    image: '/posters/薯條.jpg' 
  },
  { id: 5, name: '炸雞桶', 
    content: '炸雞 x4', 
    price: 200, 
    image: '/posters/炸雞桶.jpg' 
  },
  // 套餐
  { id: 6, name: '基本套餐', 
    content: '爆米花 x1, 可樂 x1', 
    price: 220, 
    image: '/posters/基本套餐.jpg' 
  },
  { id: 7, name: '高級套餐', 
    content: '爆米花 x1, 可樂 x1, 薯條 x1', 
    price: 300, 
    image: '/posters/高級套餐.jpg' 
  },
  { id: 8, name: '豪華套餐', 
    content: '爆米花 x1, 可樂 x1, 薯條 x1, 熱狗 x1, 炸雞盒 x1', 
    price: 500, 
    image: '/posters/豪華套餐.jpg' 
  },
];

function MealSelector() {
  const [counts, setCounts] = useState({});

  const handleCountChange = (id, delta) => {
    setCounts(prevCounts => ({
      ...prevCounts,
      [id]: Math.max(0, (prevCounts[id] || 0) + delta)
    }));
  };

  return (
    <div className="bg-neutral-800 p-6 rounded-xl text-white">
      <div className="space-y-4">
        {concessionData.map(item => (
          //  「一般造型」(深灰矩形)，不是票券
          <div 
            key={item.id} 
            className="flex items-center bg-neutral-700 p-4 rounded-lg"
          >
            {/* 1. 圖片 */}
            <img 
              src={item.image} // 🎯 使用修正後的本地路徑
              alt={item.name} 
              className="w-16 h-16 object-cover rounded-md flex-shrink-0" 
            />
            {/* 2. 品名、內容、價格 */}
            <div className="ml-4 flex-grow">
              <h4 className="text-lg font-semibold text-white">{item.name}</h4>
              <p className="text-sm text-gray-400">{item.content}</p>
              <p className="text-sm text-gray-400">$ {item.price}</p>
            </div>
            {/* 3. 計數器 */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <button 
                onClick={() => handleCountChange(item.id, -1)}
                className="w-8 h-8 rounded-full bg-purple-600 text-white text-lg font-bold flex items-center justify-center hover:bg-purple-700 transition"
              >
                -
              </button>
              <span className="text-xl font-bold text-white w-8 text-center">
                {counts[item.id] || 0}
              </span>
              <button 
                onClick={() => handleCountChange(item.id, 1)}
                className="w-8 h-8 rounded-full bg-purple-600 text-white text-lg font-bold flex items-center justify-center hover:bg-purple-700 transition"
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