import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
// 移除 MealSelector import

// --- 資料區 ---

// 影城資料
const theatresData = [
  { id: 1, name: '台北信義影城' },
  { id: 2, name: '台北中山影城' },
  { id: 3, name: '新北板橋影城' },
];

// 假資料：模擬該電影的場次時間
const mockTimes = ["10:30", "13:15", "15:40", "18:20", "21:00"];

// 移除 ticketTypesData 與 helper functions (getBgClass 等)，已移至 TicketMealPage

// 🎯 輔助函數：根據電影資料產生媒體清單
const getMediaForMovie = (movie) => {
  if (!movie) return [];
  const mediaList = [];
  const trailerSrc = movie.trailerUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  mediaList.push({ type: 'video', src: trailerSrc });

  let images = [];
  try {
    if (movie.stills) images = JSON.parse(movie.stills);
  } catch (e) {
    console.error("解析劇照 JSON 失敗:", e);
  }

  if (images.length > 0) {
    images.forEach(imgSrc => mediaList.push({ type: 'image', src: imgSrc }));
  } else {
    for (let i = 0; i < 4; i++) {
      mediaList.push({ type: 'image', src: movie.posterUrl });
    }
  }
  return mediaList;
};

function MovieDetailPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 

  // --- 初始化 State ---
  const initialTheatreId = location.state?.theatreId || theatresData[0].id;
  const initialTime = location.state?.selectedTime || null;
  const initialDateStr = location.state?.selectedDate; 
  const initialDateObj = initialDateStr ? new Date(initialDateStr) : new Date();

  // --- Component State ---
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // 選擇器 State
  const [selectedTheatre, setSelectedTheatre] = useState(initialTheatreId);
  const [selectedTime, setSelectedTime] = useState(initialTime);

  // 移除 ticketCounts 與 selectedMeals State

  // 輪播 State
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaData, setMediaData] = useState([]); 
  const itemsPerView = 3;

  const defaultPosterUrl = 'https://via.placeholder.com/600x900?text=Image+Not+Found';

  // --- 日期選擇器邏輯 ---
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
    monthOptions.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: `${d.getFullYear()}年 ${d.getMonth() + 1}月`
    });
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
    return (
      selectedDateObject.getDate() === day &&
      selectedDateObject.getMonth() === viewMonth &&
      selectedDateObject.getFullYear() === viewYear
    );
  };
  
  const formattedSelectedDate = `${selectedDateObject.getFullYear()}/${selectedDateObject.getMonth() + 1}/${selectedDateObject.getDate()}`;

  // --- Fetch Data ---
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
        console.error("抓取單一電影資料失敗:", err);
        setError("無法載入電影資料");
        setLoading(false);
      });
  }, [movieId]);

  // --- Handlers ---
  const handleConfirm = () => {
    if (!selectedTime) {
      alert("請先選擇場次時間！");
      window.scrollTo({ top: 600, behavior: 'smooth' });
      return;
    }

    const selectedTheatreObj = theatresData.find(t => t.id === selectedTheatre);

    // 🎯 修改：導向 TicketMealPage
    navigate(`/ticket-meal/${movieId}`, {
      state: {
        movie,
        theater: selectedTheatreObj,
        date: formattedSelectedDate,
        time: selectedTime,
      }
    });
  };

  const nextSlide = () => {
    if (currentMediaIndex < mediaData.length - itemsPerView) {
      setCurrentMediaIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(prev => prev - 1);
    }
  };

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
          
          {/* 左側海報 */}
          <div className="w-full md:w-1/3">
            <img src={posterToShow} alt={movie.movieName} className="rounded-xl shadow-2xl w-full border border-neutral-700" onError={() => setImageError(true)} />
          </div>

          {/* 右側資訊與選擇 */}
          <div className="w-full md:w-2/3 space-y-8">
            
            {/* 1. 電影基本資訊 */}
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">{movie.movieName}</h1>
              
              <h2 className="text-2xl font-bold text-white mt-4 mb-4">劇情簡介</h2>
              <p className="text-lg text-gray-300 mb-6">{movie.synopsis || "暫無簡介"}</p>
              
              {/* 資訊欄位 */}
              <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700 space-y-2 text-sm">
                 <p className="text-gray-300"><span className="font-bold text-white mr-2">片長:</span>{movie.movieDurationMinutes}</p>
                 <p className="text-gray-300"><span className="font-bold text-white mr-2">類型:</span>{movie.movieType}</p>
                 <p className="text-gray-300"><span className="font-bold text-white mr-2">導演:</span>{movie.director || 'N/A'}</p>
                 <p className="text-gray-300"><span className="font-bold text-white mr-2">演員:</span>{movie.actors || 'N/A'}</p>
                 <p className="text-gray-300"><span className="font-bold text-white mr-2">語言:</span>{movie.language || '未知'}</p>
                 <p className="text-gray-300"><span className="font-bold text-white mr-2">上映日期:</span>{movie.releaseDate || 'N/A'}</p>
              </div>
            </div>

            {/* 2. 多媒體輪播 */}
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

            {/* 3. 場次、日期、時間選擇 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-2 h-8 bg-purple-600 mr-3 rounded-full"></span>
                選擇場次與時間
              </h2>
              
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

            {/* 下一步按鈕 */}
            <div className="flex flex-col items-end pt-8">
               <button onClick={handleConfirm} disabled={!selectedTime} className={`font-bold py-4 px-12 rounded-full transition duration-300 text-xl shadow-lg ${selectedTime ? 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-purple-500/50 cursor-pointer transform hover:-translate-y-1' : 'bg-neutral-700 text-gray-500 cursor-not-allowed'}`}>
                 下一步：選擇票種
               </button>
               {!selectedTime && <p className="text-sm text-red-400 mt-3 animate-pulse">* 請選擇「場次時間」才能繼續</p>}
            </div>
           
          </div>
        </div>
      </main>
    </div>
  );
}

export default MovieDetailPage;