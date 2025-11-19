import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. 引入所有頁面
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import ShowtimePage from './pages/ShowtimePage'; 
import MovieInfoPage from './pages/MovieInfoPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage'; 
import StorePage from "./pages/StorePage";

function App() {
  return (
    <Routes>
      {/* 首頁 */}
      <Route path="/" element={<HomePage />} />
      
      {/* 場次查詢頁面 */}
      <Route path="/showtimes" element={<ShowtimePage />} />

      {/* 電影資訊頁面 */}
      <Route path="/movie-info" element={<MovieInfoPage />} />

      {/* 電影詳情頁面(隨便點一部電影) */}
      <Route path="/movie/:movieId" element={<MovieDetailPage />} />

      {/* 訂票確認頁面 (包含座位選擇) */}
      <Route path="/booking-confirmation/:movieId" element={<BookingConfirmationPage />} />

      {/* 商城頁面 */}
      <Route path="/store" element={<StorePage />} />


    </Routes>
  );
}

export default App;