import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. 引入所有頁面
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import ShowtimePage from './pages/ShowtimePage'; 
import MovieInfoPage from './pages/MovieInfoPage';

function App() {
  return (
    <Routes>
      {/* 規則 1：首頁 */}
      <Route path="/" element={<HomePage />} />
      
      {/* 規則 2：場次查詢頁面  */}
      <Route path="/showtimes" element={<ShowtimePage />} />

      {/* 規則 3：電影資訊頁面  */}
      <Route path="/movie-info" element={<MovieInfoPage />} />

      {/* 規則 4：電影詳情頁面 */}
      <Route path="/movie/:movieId" element={<MovieDetailPage />} />

      {/* (未來可以在此新增 /login, /register 等路由) */}
    </Routes>
  );
}

export default App;