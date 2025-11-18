import React, { useState } from 'react';

// 輔助函數：取得未來 7 天的日期
const getNext7Days = () => {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      dayName: days[date.getDay()],
      dayNum: date.getDate().toString(),
    });
  }
  return dates;
};

// 票種資料 (包含新票種和描述)
const ticketTypesData = [
  { id: 1, name: '學生票', price: 250, desc: '需出示學生證' },
  { id: 2, name: '全票', price: 300, desc: '一般觀眾適用' }, 
  { id: 3, name: '優選收藏套票', price: 500, desc: '電影票x1、海報x1', style: 'bronze' },
  { id: 4, name: '豪華典藏套票', price: 800, desc: '電影票x1、海報x1、特典x1', style: 'silver' },
  { id: 5, name: '尊爵不凡套票', price: 1300, desc: '電影票x1、海報x1、特典x1、明信片組x1、豪華套餐x1', style: 'gold' },
];

// 影城資料
const theatresData = [
  { id: 1, name: '台北信義影城' },
  { id: 2, name: '台北中山影城' },
  { id: 3, name: '新北板橋影城' },
];


function ShowtimeSelector() {
  const [selectedTheatre, setSelectedTheatre] = useState(theatresData[0].id);
  const [selectedDate, setSelectedDate] = useState(0);
  const [ticketCounts, setTicketCounts] = useState({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  });

  const dates = getNext7Days();

  const handleCountChange = (id, delta) => {
    setTicketCounts(prevCounts => ({
      ...prevCounts,
      [id]: Math.max(0, (prevCounts[id] || 0) + delta)
    }));
  };

  //  定義 CSS 變數
  const notchSize = '16px'; // 缺口深度
  const notchHalfHeight = '10px'; // 缺口垂直寬度的一半

  //  手繪草圖的 clipPath 路徑(票造型)
  const ticketClipPath = `polygon(
    0% 0%,                         /* 左上角 */
    100% 0%,                        /* 右上角 */
    100% calc(50% - ${notchHalfHeight}),  /* 右側缺口上緣 */
    calc(100% - ${notchSize}) 50%,   /* 右側缺口尖端 */
    100% calc(50% + ${notchHalfHeight}),  /* 右側缺口下緣 */
    100% 100%,                       /* 右下角 */
    0% 100%,                        /* 左下角 */
    0% calc(50% + ${notchHalfHeight}),  /* 左側缺口下緣 */
    ${notchSize} 50%,              /* 左側缺口尖端 */
    0% calc(50% - ${notchHalfHeight})   /* 左側缺口上緣 */
  )`;

  // 輔助函數：根據 style 屬性回傳背景類別
  const getBgClass = (style) => {
    switch (style) {
      case 'gold': return 'bg-gradient-to-r from-yellow-600 to-yellow-800 text-yellow-100 shadow-yellow-500/40';
      case 'silver': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-gray-400/40';
      case 'bronze': return 'bg-gradient-to-r from-orange-800 to-orange-900 text-orange-100 shadow-orange-600/40';
      default: return 'bg-neutral-700 text-white shadow-purple-500/20';
    }
  };

  // 輔助函數：根據 style 屬性回傳文字顏色類別
  const getTextClass = (style) => {
      switch (style) {
        case 'gold': return 'text-yellow-100';
        case 'silver': return 'text-gray-100';
        case 'bronze': return 'text-orange-100';
        default: return 'text-white';
      }
  };
  
  const getSubTextClass = (style) => {
      switch (style) {
        case 'gold': return 'text-yellow-200';
        case 'silver': return 'text-gray-200';
        case 'bronze': return 'text-orange-200';
        default: return 'text-gray-400';
      }
  };


  return (
    <div className="bg-neutral-800 p-6 rounded-xl text-white">
      
      {/* 1. 影城選擇 */}
      <div className="mb-6">
        <label htmlFor="theatre-select" className="block text-sm font-medium text-gray-300 mb-2">
          選擇影城
        </label>
        <select
          id="theatre-select"
          value={selectedTheatre}
          onChange={(e) => setSelectedTheatre(Number(e.target.value))}
          className="w-full bg-neutral-700 border border-neutral-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {theatresData.map(theatre => (
            <option key={theatre.id} value={theatre.id}>
              {theatre.name}
            </option>
          ))}
        </select>
      </div>

      {/* 2. 日期選擇 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          選擇日期
        </label>
        <div className="flex justify-between space-x-2 overflow-x-auto pb-2"> {/* 增加 overflow-x-auto 以防手機版溢出 */}
          {dates.map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(index)}
              className={`flex-1 min-w-[60px] flex flex-col items-center justify-center h-20 rounded-full transition-all duration-300
                ${selectedDate === index 
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
                }
              `}
            >
              <span className="text-xs font-medium">{date.dayName}</span>
              <span className="text-2xl font-bold">{date.dayNum}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* 3. 票種與張數選擇 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          選擇票種與張數
        </label>
        <div className="space-y-4">

          {ticketTypesData.map(ticket => (
            <div 
              key={ticket.id} 
              //  使用 helper function 決定樣式
              className={`relative flex justify-between items-center py-3 px-8 rounded-md shadow-md transition-all duration-300
                ${getBgClass(ticket.style)}
              `}
              // 應用 clipPath 樣式
              style={{ clipPath: ticketClipPath }}
            >
              {/* 票券的文字內容 */}
              <div>
                <h4 className={`text-lg font-semibold ${getTextClass(ticket.style)}`}>{ticket.name}</h4>
                <div className="flex items-baseline gap-2">
                    <p className={`text-sm font-bold ${getSubTextClass(ticket.style)}`}>$ {ticket.price}</p>
                    <p className={`text-xs ${getSubTextClass(ticket.style)} opacity-80`}>{ticket.desc}</p>
                </div>
              </div>
              
              {/* 票數增減按鈕 */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleCountChange(ticket.id, -1)}
                  className="w-8 h-8 rounded-full bg-purple-600 text-white text-lg font-bold flex items-center justify-center hover:bg-purple-700 transition z-10 relative" // z-10 確保可點擊
                >
                  -
                </button>
                <span className={`text-xl font-bold w-8 text-center ${getTextClass(ticket.style)}`}>
                  {ticketCounts[ticket.id] || 0}
                </span>
                <button 
                  onClick={() => handleCountChange(ticket.id, 1)}
                  className="w-8 h-8 rounded-full bg-purple-600 text-white text-lg font-bold flex items-center justify-center hover:bg-purple-700 transition z-10 relative" // z-10 確保可點擊
                >
                  +
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}

export default ShowtimeSelector;