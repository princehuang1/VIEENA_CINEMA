import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import MealSelector from "../components/MealSelector";

// --- 資料區 ---
const theatresData = [
  { id: 1, name: '台北信義影城' },
  { id: 2, name: '台北中山影城' },
  { id: 3, name: '新北板橋影城' },
];

const mockTimes = ["10:30", "13:15", "15:40", "18:20", "21:00"];

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
    default: return 'bg-neutral-700 text-white shadow-purple-500/20';
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

const getMediaForMovie = (movie) => {
  if (!movie) return [];
  const mediaList = [];
  const trailerSrc = movie.trailerUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  mediaList.push({ type: 'video', src: trailerSrc });
  let images = [];
  try { if (movie.stills) images = JSON.parse(movie.stills); } catch (e) { console.error("解析劇照失敗", e); }
  if (images.length > 0) images.forEach(imgSrc => mediaList.push({ type: 'image', src: imgSrc }));
  else for (let i = 0; i < 4; i++) mediaList.push({ type: 'image', src: movie.posterUrl });
  return mediaList;
};

function MovieDetailPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 

  const initialTheatreId = location.state?.theatreId || theatresData[0].id;
  const initialTime = location.state?.selectedTime || null;
  const initialDateStr = location.state?.selectedDate; 
  const initialDateObj = initialDateStr ? new Date(initialDateStr) : new Date();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  const [selectedTheatre, setSelectedTheatre] = useState(initialTheatreId);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [ticketCounts, setTicketCounts] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaData, setMediaData] = useState([]); 
  const itemsPerView = 3;

  const defaultPosterUrl = 'https://via.placeholder.com/600x900?text=Image+Not+Found';

  const today = new Date();
  const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const maxAllowedDate = new Date(todayZero);
  maxAllowedDate.setDate(todayZero.getDate() + 30);

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDateObject, setSelectedDateObject] = useState(initialDateObj);
  const [viewYear, setViewYear] = useState(initialDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDateObj.getMonth());
  const calendarRef = useRef(null);

  const monthOptions = [];
  for (let i = 0; i < 2; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    monthOptions.push({ year: d.getFullYear(), month: d.getMonth(), label: `${d.getFullYear()}年 ${d.getMonth() + 1}月` });
  }

  const handleMonthChange = (e) => {
    const [y, m] = e.target.value.split('-');
    setViewYear(parseInt(y));
    setViewMonth(parseInt(m));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(viewYear, viewMonth, day);
    if (isDateDisabled(day)) return;
    setSelectedDateObject(newDate);
    setShowCalendar(false);
    setSelectedTime(null);
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isDateDisabled = (day) => {
    const checkDate = new Date(viewYear, viewMonth, day);
    return checkDate < todayZero || checkDate > maxAllowedDate;
  };

  const isSelected = (day) => {
    return ( selectedDateObject.getDate() === day && selectedDateObject.getMonth() === viewMonth && selectedDateObject.getFullYear() === viewYear );
  };
  
  const formattedSelectedDate = `${selectedDateObject.getFullYear()}/${selectedDateObject.getMonth() + 1}/${selectedDateObject.getDate()}`;

  const notchSize = '16px'; 
  const notchHalfHeight = '10px'; 
  const ticketClipPath = `polygon(0% 0%, 100% 0%, 100% calc(50% - ${notchHalfHeight}), calc(100% - ${notchSize}) 50%, 100% calc(50% + ${notchHalfHeight}), 100% 100%, 0% 100%, 0% calc(50% + ${notchHalfHeight}), ${notchSize} 50%, 0% calc(50% - ${notchHalfHeight}))`;

  useEffect(() => {
    setImageError(false);
    setLoading(true);
    setCurrentMediaIndex(0);
    axios.get(`http://localhost:4000/api/movies/${movieId}`)
      .then(response => {
        const fetchedMovie = response.data;
        setMovie(fetchedMovie);
        setMediaData(getMediaForMovie(fetchedMovie));
        setLoading(false);
      })
      .catch(err => {
        console.error("抓取失敗:", err);
        setError("無法載入電影資料");
        setLoading(false);
      });
  }, [movieId]);

  const handleTicketChange = (id, delta) => {
    setTicketCounts(prev => ({ ...prev, [id]: Math.max(0, prev[id] + delta) }));
  };

  const totalTickets = Object.values(ticketCounts).reduce((a, b) => a + b, 0);

  const handleConfirm = () => {
    if (!selectedTime) {
      alert("請先選擇場次時間！");
      window.scrollTo({ top: 600, behavior: 'smooth' });
      return;
    }
    if (totalTickets === 0) {
      alert("請至少選擇一張票！");
      return;
    }

    // 🎯 資料打包：將票數 ID 對照表轉換為陣列，方便後續頁面顯示
    const selectedTickets = ticketTypesData.map(type => ({
        ...type,
        count: ticketCounts[type.id] || 0
    })).filter(t => t.count > 0);

    const selectedTheatreObj = theatresData.find(t => t.id === selectedTheatre);

    // 計算總金額
    const ticketsPrice = selectedTickets.reduce((sum, t) => sum + (t.price * t.count), 0);

    // 🎯 導向「選位頁面」，並傳遞所有已選資料
    navigate(`/seat-selection/${movieId}`, {
      state: {
        movie,
        theater: selectedTheatreObj,
        date: formattedSelectedDate,
        time: selectedTime,
        tickets: selectedTickets, // 傳遞陣列格式
        meals: [], // 暫時為空，若 MealSelector 有資料需在此整合
        totalPrice: ticketsPrice, // 暫時只算票價，餐飲若有需累加
      }
    });
  };

  const nextSlide = () => { if (currentMediaIndex < mediaData.length - itemsPerView) setCurrentMediaIndex(prev => prev + 1); };
  const prevSlide = () => { if (currentMediaIndex > 0) setCurrentMediaIndex(prev => prev - 1); };

  if (loading) return <div className="min-h-screen bg-neutral-900"><Navbar /><p className="text-center text-gray-300 mt-10">載入中...</p></div>;
  if (error || !movie) return <div className="min-h-screen bg-neutral-900"><Navbar /><p className="text-center text-red-500 mt-10">{error || "找不到電影"}</p></div>;

  const posterToShow = imageError ? defaultPosterUrl : movie.posterUrl;

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans pb-20">
      <Navbar />
      <section className="relative w-full h-[50vh] bg-cover bg-center" style={{ backgroundImage: `url(${posterToShow})` }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
        <button onClick={() => navigate(-1)} className="absolute top-8 left-8 z-30 flex items-center gap-2 bg-black/40 hover:bg-purple-600 text-white px-5 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 border border-white/10 group hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          <span className="font-bold tracking-wide">返回</span>
        </button>
      </section>

      <main className="container mx-auto px-6 md:px-20 py-8 -mt-[20vh] relative z-10">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/3">
            <img src={posterToShow} alt={movie.movieName} className="rounded-xl shadow-2xl w-full border border-neutral-700" onError={() => setImageError(true)} />
          </div>

          <div className="w-full md:w-2/3 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">{movie.movieName}</h1>
              <h2 className="text-2xl font-bold text-white mt-4 mb-4">劇情簡介</h2>
              <p className="text-lg text-gray-300 mb-6">{movie.synopsis || "暫無簡介"}</p>
              <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700 space-y-2 text-sm">
                 <p className="text-gray-300"><span className="font-bold text-white mr-2">片長:</span>{movie.movieDurationMinutes}</p>
                 <p className="text-gray-300"><span className="font-bold text-white mr-2">類型:</span>{movie.movieType}</p>
                 <p className="text-gray-300"><span className="font-bold text-white mr-2">導演:</span>{movie.director || 'N/A'}</p>
                 <p className="text-gray-300"><span className="font-bold text-white mr-2">演員:</span>{movie.actors || 'N/A'}</p>
                 <p className="text-gray-300"><span className="font-bold text-white mr-2">語言:</span>{movie.language || '未知'}</p>
              </div>
            </div>

            <div className="relative group">
              <div className="overflow-hidden rounded-xl">
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentMediaIndex * (100 / itemsPerView)}%)` }}>
                  {mediaData.map((item, index) => (
                    <div key={index} className="min-w-[33.333%] px-1 box-border">
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-neutral-700 group">
                        {item.type === 'video' ? (
                          <iframe className="w-full h-full" src={item.src} title="Trailer" frameBorder="0" allowFullScreen></iframe>
                        ) : (
                          <img src={item.src} alt={`Still ${index}`} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {currentMediaIndex > 0 && <button onClick={prevSlide} className="absolute left-[-15px] top-1/2 -translate-y-1/2 z-10 bg-purple-600 p-2 rounded-full shadow-lg text-white transition-all duration-300 hover:bg-purple-800 hover:scale-110"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>}
              {currentMediaIndex < (mediaData.length - itemsPerView) && <button onClick={nextSlide} className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-10 bg-purple-600 p-2 rounded-full shadow-lg text-white transition-all duration-300 hover:bg-purple-800 hover:scale-110"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>}
            </div>

            <hr className="border-gray-700" />

            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center"><span className="w-2 h-8 bg-purple-600 mr-3 rounded-full"></span>選擇場次與時間</h2>
              <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    <div className="w-full lg:w-1/2">
                      <label htmlFor="theatre-select" className="block text-sm font-medium text-gray-300 mb-2">選擇影城</label>
                      <select id="theatre-select" value={selectedTheatre} onChange={(e) => setSelectedTheatre(Number(e.target.value))} className="w-full bg-neutral-700 border border-neutral-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                        {theatresData.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div className="w-full lg:w-1/2 relative" ref={calendarRef}>
                      <label className="block text-sm font-medium text-gray-300 mb-2">選擇日期</label>
                      <button onClick={() => setShowCalendar(!showCalendar)} className="w-full bg-neutral-700 border border-neutral-600 rounded-lg py-3 px-4 text-left text-white focus:outline-none focus:ring-2 focus:ring-purple-500 flex justify-between items-center">
                        <span>{formattedSelectedDate}</span>
                        <svg className={`h-5 w-5 text-gray-400 transition-transform ${showCalendar ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                      {showCalendar && (
                        <div className="absolute top-full left-0 mt-2 w-full z-50 bg-neutral-800 border border-neutral-600 rounded-lg shadow-2xl p-4">
                          <div className="mb-4">
                            <select className="w-full bg-neutral-900 border border-neutral-600 rounded px-3 py-2 text-white" onChange={handleMonthChange} value={`${viewYear}-${viewMonth}`}>
                              {monthOptions.map(opt => <option key={`${opt.year}-${opt.month}`} value={`${opt.year}-${opt.month}`}>{opt.label}</option>)}
                            </select>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center mb-2">{['日', '一', '二', '三', '四', '五', '六'].map(d => <span key={d} className="text-xs text-gray-500 font-bold py-1">{d}</span>)}</div>
                          <div className="grid grid-cols-7 gap-1">
                            {blanks.map(b => <div key={`blank-${b}`} className="h-9 w-9"></div>)}
                            {daysArray.map(day => {
                              const disabled = isDateDisabled(day);
                              const selected = isSelected(day);
                              return <button key={day} disabled={disabled} onClick={() => handleDateClick(day)} className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center text-sm ${selected ? 'bg-purple-600 text-white font-bold' : disabled ? 'text-gray-500 opacity-20 cursor-default' : 'text-gray-300 hover:bg-neutral-700'}`}>{day}</button>;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-300 mb-3">選擇時段</label>
                   <div className="flex flex-wrap gap-3">
                     {mockTimes.map((time) => (
                       <button key={time} onClick={() => setSelectedTime(time)} className={`py-2 px-6 rounded-lg font-bold transition-all duration-200 border ${selectedTime === time ? 'bg-purple-600 text-white border-purple-600 shadow-lg scale-105' : 'bg-transparent text-gray-300 border-gray-600 hover:border-purple-500 hover:text-purple-400'}`}>{time}</button>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-700" />

            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center"><span className="w-2 h-8 bg-purple-600 mr-3 rounded-full"></span>選擇票種與張數</h2>
              <div className="space-y-4">
                {ticketTypesData.map(ticket => (
                  <div key={ticket.id} className={`relative flex flex-col sm:flex-row justify-between items-center py-4 px-6 sm:px-8 shadow-md transition-all duration-300 hover:scale-[1.01] ${getBgClass(ticket.style)}`} style={{ clipPath: ticketClipPath }}>
                    <div className="text-center sm:text-left mb-3 sm:mb-0">
                      <h4 className={`text-xl font-bold mb-1 ${getTextClass(ticket.style)}`}>{ticket.name}</h4>
                      <div className="flex items-center justify-center sm:justify-start gap-3">
                          <p className={`text-base font-bold ${getSubTextClass(ticket.style)}`}>$ {ticket.price}</p>
                          <span className={`text-xs opacity-60 ${getSubTextClass(ticket.style)}`}>|</span>
                          <p className={`text-xs ${getSubTextClass(ticket.style)} opacity-90`}>{ticket.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 bg-black/20 p-2 rounded-full">
                      <button onClick={() => handleTicketChange(ticket.id, -1)} className="w-8 h-8 rounded-full bg-purple-600 text-white text-lg font-bold flex items-center justify-center hover:bg-purple-700 transition relative z-10 shadow-lg">-</button>
                      <span className={`text-xl font-bold w-8 text-center ${getTextClass(ticket.style)}`}>{ticketCounts[ticket.id] || 0}</span>
                      <button onClick={() => handleTicketChange(ticket.id, 1)} className="w-8 h-8 rounded-full bg-purple-600 text-white text-lg font-bold flex items-center justify-center hover:bg-purple-700 transition relative z-10 shadow-lg">+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-right"><span className="text-gray-400 mr-3">總張數:</span><span className="text-3xl font-bold text-purple-400">{totalTickets} 張</span></div>
            </div>

            <hr className="border-gray-700" />

            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center"><span className="w-2 h-8 bg-purple-600 mr-3 rounded-full"></span>加購餐飲</h2>
              <MealSelector />
              <div className="flex flex-col items-end pt-8">
                <button onClick={handleConfirm} disabled={totalTickets === 0 || !selectedTime} className={`font-bold py-4 px-12 rounded-full transition duration-300 text-xl shadow-lg ${totalTickets > 0 && selectedTime ? 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-purple-500/50 cursor-pointer transform hover:-translate-y-1' : 'bg-neutral-700 text-gray-500 cursor-not-allowed'}`}>選位</button>
                {(totalTickets === 0 || !selectedTime) && <p className="text-sm text-red-400 mt-3 animate-pulse">* 請選擇「場次時間」並至少選擇「一張票」才能繼續</p>}
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default MovieDetailPage;