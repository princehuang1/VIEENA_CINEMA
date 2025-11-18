import React from 'react';

// 假資料
const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const seatsPerRow = 10;
const takenSeats = ['A3', 'A4', 'B5', 'B6', 'C9', 'D4', 'E8', 'E9', 'F1', 'F10']; 
const rowLabels = ['1', '2', '3', '4', '5', '6', '7', '8']; 

// 🎯 接收 props，讓父層元件可以控制它
function SeatSelector({ selectedSeats = [], onSeatSelect }) {
  
  const handleSeatClick = (seatId) => {
    if (takenSeats.includes(seatId)) {
      return; 
    }
    
    // 計算新的座位陣列
    const newSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter(s => s !== seatId)
      : [...selectedSeats, seatId];
      
    // 通知父層更新
    if (onSeatSelect) {
      onSeatSelect(newSeats);
    }
  };

  return (
    <div className="bg-neutral-800 p-6 rounded-xl text-white">
      {/* 1. 銀幕 */}
      <div className="mb-6">
        <div className="h-2 bg-gray-600 rounded-t-full w-3/4 mx-auto"></div>
        <p className="text-center text-sm text-white mt-2">銀幕在此</p>
      </div>

      {/* 2. 座位圖 */}
      <div className="flex justify-center gap-4 md:gap-6">
        
        {/* 左側排數 */}
        <div className="flex flex-col space-y-2 justify-center">
          {rowLabels.map(label => (
            <div key={`left-${label}`} className="w-8 h-8 flex items-center justify-center text-white font-bold text-lg">
              {label}
            </div>
          ))}
        </div>

        {/* 中間座位 */}
        <div className="flex flex-col items-center space-y-2">
          {rows.map(row => (
            <div key={row} className="flex space-x-1 md:space-x-2">
              {Array.from({ length: seatsPerRow }, (_, i) => {
                const seatNum = i + 1;
                const seatId = `${row}${seatNum}`;
                let seatClass = '';

                if (takenSeats.includes(seatId)) {
                  seatClass = 'bg-red-600 cursor-not-allowed'; 
                } else if (selectedSeats.includes(seatId)) {
                  seatClass = 'bg-purple-600'; 
                } else {
                  seatClass = 'bg-neutral-600 hover:bg-purple-500'; 
                }

                return (
                  <button
                    key={seatId}
                    onClick={() => handleSeatClick(seatId)}
                    className={`w-6 h-6 md:w-8 md:h-8 rounded-md transition-colors duration-200 ${seatClass} 
                                text-white text-xs font-bold flex items-center justify-center`}
                  >
                    {seatNum} 
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* 右側排數 */}
        <div className="flex flex-col space-y-2 justify-center">
          {rowLabels.map(label => (
            <div key={`right-${label}`} className="w-8 h-8 flex items-center justify-center text-white font-bold text-lg">
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* 3. 圖例 */}
      <div className="flex justify-center space-x-6 mt-8">
        <div className="flex items-center"><div className="w-5 h-5 rounded-md bg-neutral-600 mr-2"></div><span className="text-sm text-gray-400">可選擇</span></div>
        <div className="flex items-center"><div className="w-5 h-5 rounded-md bg-purple-600 mr-2"></div><span className="text-sm text-gray-400">已選擇</span></div>
        <div className="flex items-center"><div className="w-5 h-5 rounded-md bg-red-600 mr-2"></div><span className="text-sm text-gray-400">已售出</span></div>
      </div>
    </div>
  );
}

export default SeatSelector;