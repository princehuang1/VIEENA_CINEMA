import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MealSelector from "../components/MealSelector";

// --- 資料與樣式設定 ---
const ticketTypesData = [
  { id: 1, name: '學生票', price: 250, desc: '需出示學生證' },
  { id: 2, name: '全票', price: 300, desc: '一般觀眾適用' },
  { id: 3, name: '優選收藏套票', price: 500, desc: '電影票x1、海報x1', style: 'bronze' },
  { id: 4, name: '豪華典藏套票', price: 800, desc: '電影票x1、海報x1、特典x1', style: 'silver' },
  { id: 5, name: '尊爵不凡套票', price: 1300, desc: '電影票x1、海報x1、特典x1、明信片組x1、豪華套餐x1', style: 'gold' },
];

const getBgClass = (style) => {
  switch (style) {
    case 'gold': return 'bg-gradient-to-r from-yellow-600 to-yellow-800 text-yellow-100 shadow-yellow-800/10';
    case 'silver': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-gray-400/40';
    case 'bronze': return 'bg-gradient-to-r from-[#b07e4c] to-[#855328] text-yellow-100 shadow-amber-500/20';
    default: return 'bg-neutral-800 text-white shadow-purple-500/20 border border-neutral-700';
  }
};

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

// CSS 變數 (票券造型)
const notchSize = '16px';
const notchHalfHeight = '10px';
const ticketClipPath = `polygon(
    0% 0%, 
    100% 0%, 
    100% calc(50% - ${notchHalfHeight}), 
    calc(100% - ${notchSize}) 50%, 
    100% calc(50% + ${notchHalfHeight}), 
    100% 100%, 
    0% 100%, 
    0% calc(50% + ${notchHalfHeight}), 
    ${notchSize} 50%, 
    0% calc(50% - ${notchHalfHeight}) 
)`;

function TicketMealPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { movieId } = useParams();

  // 接收上一頁 (MovieDetailPage) 的資料
  const prevData = location.state || {};
  const { movie, theater, date, time } = prevData;

  // --- State ---
  const [ticketCounts, setTicketCounts] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [selectedMeals, setSelectedMeals] = useState([]);

  // 每次進入此頁面，自動捲動到最上方
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- Handlers ---
  const handleTicketChange = (id, delta) => {
    setTicketCounts(prevCounts => ({
      ...prevCounts,
      [id]: Math.max(0, (prevCounts[id] || 0) + delta)
    }));
  };

  const totalTickets = Object.values(ticketCounts).reduce((a, b) => a + b, 0);

  const handleNextStep = () => {
    if (totalTickets === 0) {
      alert("請至少選擇一張票！");
      return;
    }

    // 計算並打包資料
    let ticketsPrice = 0;
    const selectedTickets = ticketTypesData.map(type => {
      const count = ticketCounts[type.id] || 0;
      if (count > 0) {
        ticketsPrice += count * type.price;
        return { ...type, count };
      }
      return null;
    }).filter(Boolean);

    const mealsPrice = selectedMeals.reduce((sum, m) => sum + (m.price * m.count), 0);
    const totalPrice = ticketsPrice + mealsPrice;

    // 前往選位頁面
    navigate(`/seat-selection/${movieId}`, {
      state: {
        movie,
        theater,
        date,
        time,
        tickets: selectedTickets,
        meals: selectedMeals,
        totalPrice,
      }
    });
  };

  if (!movie) {
      return <div className="min-h-screen bg-neutral-900 text-white flex justify-center items-center">資料遺失，請重新選擇電影</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans pb-20">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        
        <h1 className="text-3xl font-bold text-white mb-2 text-center">選擇票種與餐點</h1>
        <p className="text-gray-400 mb-10 text-center pb-6 border-b border-gray-700">
            {movie.movieName} | {theater.name} | <span className="text-purple-400 font-bold">{date} {time}</span>
        </p>

        <div className="flex flex-col gap-12">
            
            {/* 1. 票種選擇 */}
            <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <span className="w-1.5 h-6 bg-purple-600 mr-3 rounded-full"></span>
                    選擇票種
                </h2>
                
                <div className="space-y-4">
                    {ticketTypesData.map(ticket => (
                        <div 
                            key={ticket.id} 
                            className={`relative flex justify-between items-center py-5 px-8 shadow-lg transition-all duration-300 hover:scale-[1.01] ${getBgClass(ticket.style)}`} 
                            style={{ clipPath: ticketClipPath }}
                        >
                            <div>
                                <h4 className={`text-lg font-bold mb-1 ${getTextClass(ticket.style)}`}>{ticket.name}</h4>
                                <div className="flex items-center gap-3">
                                    <p className={`text-base font-bold ${getSubTextClass(ticket.style)}`}>$ {ticket.price}</p>
                                    <span className={`text-xs opacity-60 ${getSubTextClass(ticket.style)}`}>|</span>
                                    <p className={`text-xs ${getSubTextClass(ticket.style)} opacity-90`}>{ticket.desc}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 bg-black/20 p-2 rounded-full backdrop-blur-sm">
                                <button onClick={() => handleTicketChange(ticket.id, -1)} className="w-8 h-8 rounded-full bg-purple-600 text-white text-lg font-bold flex items-center justify-center hover:bg-purple-700 transition shadow-lg">-</button>
                                <span className={`text-xl font-bold w-8 text-center ${getTextClass(ticket.style)}`}>{ticketCounts[ticket.id] || 0}</span>
                                <button onClick={() => handleTicketChange(ticket.id, 1)} className="w-8 h-8 rounded-full bg-purple-600 text-white text-lg font-bold flex items-center justify-center hover:bg-purple-700 transition shadow-lg">+</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 text-right">
                    <span className="text-gray-400 mr-3">目前張數:</span>
                    <span className="text-3xl font-bold text-purple-400">{totalTickets} 張</span>
                </div>
            </section>

            <hr className="border-gray-700" />

            {/* 2. 餐飲加購 */}
            <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <span className="w-1.5 h-6 bg-purple-600 mr-3 rounded-full"></span>
                    加購餐飲
                </h2>
                <MealSelector onMealChange={setSelectedMeals} />
            </section>

            {/* 3. 底部按鈕區塊 */}
            <div className="flex justify-between items-start mt-8 pt-8 border-t border-gray-700">
                <button 
                    onClick={() => navigate(-1)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 text-lg flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    上一步
                </button>

                {/* 🔥 修改處：右側區塊改成 items-start (靠左對齊) */}
                <div className="flex flex-col items-start">
                    <button 
                        onClick={handleNextStep} 
                        disabled={totalTickets === 0} 
                        className={`font-bold py-3 px-12 rounded-full transition duration-300 text-xl shadow-lg flex items-center gap-2
                            ${totalTickets > 0 
                                ? 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-purple-500/50 cursor-pointer transform hover:-translate-y-1' 
                                : 'bg-neutral-700 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        前往選位
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    </button>
                    {/* 錯誤訊息會自動靠左對齊按鈕 */}
                    {totalTickets === 0 && <p className="text-sm text-red-400 mt-2 animate-pulse">* 請至少選擇一張票才能繼續</p>}
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}

export default TicketMealPage;