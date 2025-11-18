import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. 引入所有頁面
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import ShowtimePage from './pages/ShowtimePage'; 
import MovieInfoPage from './pages/MovieInfoPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage'; // 🎯 引入新頁面

function App() {
  return (
    <Routes>
      {/* 規則 1：首頁 */}
      <Route path="/" element={<HomePage />} />
      
      {/* 規則 2：場次查詢頁面 */}
      <Route path="/showtimes" element={<ShowtimePage />} />

      {/* 規則 3：電影總覽頁面 */}
      <Route path="/movie-info" element={<MovieInfoPage />} />

      {/* 規則 4：電影詳情頁面 */}
      <Route path="/movie/:movieId" element={<MovieDetailPage />} />

      {/* 🎯 規則 5：訂票確認頁面 (包含座位選擇) */}
      <Route path="/booking-confirmation/:movieId" element={<BookingConfirmationPage />} />

    </Routes>
  );
}

export default App;