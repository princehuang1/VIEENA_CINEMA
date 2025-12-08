import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import ShowtimePage from './pages/ShowtimePage'; 
import MovieInfoPage from './pages/MovieInfoPage';
import StorePage from "./pages/StorePage";
import GameDetailPage from "./pages/GameDetailPage"; 
import TheaterPage from "./pages/TheaterPage";
import SeatSelectPage from "./pages/SeatSelectPage"; 
import BookingConfirmationPage from './pages/BookingConfirmationPage'; 
import PaymentPage from './pages/PaymentPage';
import TicketMealPage from './pages/TicketMealPage'; 
import DonePage from './pages/DonePage'; 
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import UserPage from './pages/UserPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/showtimes" element={<ShowtimePage />} />
      <Route path="/movie-info" element={<MovieInfoPage />} />
      <Route path="/movie/:movieId" element={<MovieDetailPage />} />
      <Route path="/ticket-meal/:movieId" element={<TicketMealPage />} />
      <Route path="/seat-selection/:movieId" element={<SeatSelectPage />} />
      <Route path="/booking-confirmation/:movieId" element={<BookingConfirmationPage />} />
      <Route path="/payment/:movieId" element={<PaymentPage />} />
      <Route path="/done" element={<DonePage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/theaters" element={<TheaterPage />} />
      <Route path="/store/game/:id" element={<GameDetailPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/user" element={<UserPage />} />
    </Routes>
  );
}

export default App;