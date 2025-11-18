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

// 票種資料
const ticketTypesData = [
  { id: 1, name: '學生票', price: 250 },
  { id: 2, name: '全票', price: 300 }, 
  { id: 3, name: '尊爵不凡票', price: 500 },
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
    1: 0, 2: 0, 3: 0,
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
        <div className="flex justify-between space-x-2">
          {dates.map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(index)}
              className={`flex-1 flex flex-col items-center justify-center h-20 rounded-full transition-all duration-300
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
              //  新增 rounded-md
              className={`relative flex justify-between items-center py-3 px-8 rounded-md shadow-md transition-all duration-300
                ${ticket.name === '尊爵不凡票' 
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-800 text-yellow-100 shadow-yellow-500/40' // 金色背景
                  : 'bg-neutral-700 text-white shadow-purple-500/20' // 灰色背景
                }
              `}
              // 應用 clipPath 樣式
              style={{ clipPath: ticketClipPath }}
            >
              {/* 票券的文字內容 */}
              <div>
                <h4 className={`text-lg font-semibold ${ticket.name === '尊爵不凡票' ? 'text-yellow-100' : 'text-white'}`}>{ticket.name}</h4>
                <p className={`text-sm ${ticket.name === '尊爵不凡票' ? 'text-yellow-200' : 'text-gray-400'}`}>$ {ticket.price}</p>
              </div>
              
              {/* 票數增減按鈕 */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleCountChange(ticket.id, -1)}
                  className="w-8 h-8 rounded-full bg-purple-600 text-white text-lg font-bold flex items-center justify-center hover:bg-purple-700 transition"
                >
                  -
                </button>
                <span className={`text-xl font-bold w-8 text-center ${ticket.name === '尊爵不凡票' ? 'text-yellow-100' : 'text-white'}`}>
                  {ticketCounts[ticket.id] || 0}
                </span>
                <button 
                  onClick={() => handleCountChange(ticket.id, 1)}
                  className="w-8 h-8 rounded-full bg-purple-600 text-white text-lg font-bold flex items-center justify-center hover:bg-purple-700 transition"
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