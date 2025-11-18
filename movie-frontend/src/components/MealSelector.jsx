import React, { useState } from 'react';

// 假資料 (未來從 API 獲取)
const concessionData = [
  // 單點
  { id: 1, name: '爆米花', 
    content: '爆米花 x1', 
    price: 200, 
    image: 'https://img.freepik.com/premium-photo/popcorn-black-background_693425-8918.jpg' 
  }, 
  { id: 2, name: '可樂', 
    content: '可樂 x1', 
    price: 50, 
    image: 'https://png.pngtree.com/thumb_back/fw800/background/20221020/pngtree-coca-cola-on-black-background-in-kuala-lumpur-photo-image_34310300.jpg' 
  }, 
  { id: 3, name: '熱狗', 
    content: '熱狗 x1', 
    price: 130, 
    image: 'https://media.istockphoto.com/id/1208823232/zh/%E7%85%A7%E7%89%87/%E4%B8%B9%E9%BA%A5%E7%86%B1%E7%8B%97%E8%88%87%E9%86%83%E9%BB%83%E7%93%9C%E7%82%92%E6%B4%8B%E8%94%A5%E5%92%8C%E7%86%B1%E7%8B%97%E8%88%87%E8%8A%A5%E6%9C%AB%E7%94%9F%E8%8F%9C%E5%92%8C%E8%BE%A3%E6%A4%92%E5%9C%A8%E9%BB%91%E8%89%B2%E8%83%8C%E6%99%AF.jpg?s=612x612&w=0&k=20&c=yV7EuZGBkGvv8yuM4hWJFHZzCoTilUXSKAdyWYapNaE=' 
  },
  { id: 4, name: '薯條', 
    content: '薯條 x1', 
    price: 150, 
    image: 'https://as2.ftcdn.net/jpg/01/74/15/09/1000_F_174150907_z5sULTSnejnRouxdo9DFrW0G2QqJfWGU.jpg' 
  },
  // 套餐
  { id: 5, name: '基本套餐', 
    content: '爆米花 x1, 可樂 x1', 
    price: 220, 
    image: 'https://leoburnett.co.uk/wp-content/uploads/2024/05/The-Meal-PR-Still-2000x1125.jpg' 
  },
  { id: 6, name: '高級套餐', 
    content: '爆米花 x1, 可樂 x1, 薯條 x1', 
    price: 350, 
    image: 'https://leoburnett.co.uk/wp-content/uploads/2024/05/The-Meal-PR-Still-2000x1125.jpg' 
  },
  { id: 7, name: '豪華套餐', 
    content: '爆米花 x1, 可樂 x1, 薯條 x1, 熱狗 x1', 
    price: 450, 
    image: 'https://leoburnett.co.uk/wp-content/uploads/2024/05/The-Meal-PR-Still-2000x1125.jpg' 
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
          //  這就是您要的「一般造型」(深灰矩形)，不是票券
          <div 
            key={item.id} 
            className="flex items-center bg-neutral-700 p-4 rounded-lg"
          >
            {/* 1. 圖片 */}
            <img 
              src={item.image} 
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