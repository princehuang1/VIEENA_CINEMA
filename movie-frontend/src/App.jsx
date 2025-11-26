import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import ShowtimePage from './pages/ShowtimePage'; 
import MovieInfoPage from './pages/MovieInfoPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage'; 
import StorePage from "./pages/StorePage";
import GameDetailPage from "./pages/GameDetailPage"; 
import TheaterPage from "./pages/TheaterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/showtimes" element={<ShowtimePage />} />
      <Route path="/movie-info" element={<MovieInfoPage />} />
      <Route path="/movie/:movieId" element={<MovieDetailPage />} />
      <Route path="/booking-confirmation/:movieId" element={<BookingConfirmationPage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/theaters" element={<TheaterPage />} />

      {/* 新增遊戲詳情路由 */}
      <Route path="/store/game/:id" element={<GameDetailPage />} />

    </Routes>
  );
}

export default App;