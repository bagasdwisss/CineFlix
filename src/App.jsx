import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages
import Intro from './pages/Intro';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import SeatSelection from './pages/SeatSelection';
import Payment from './pages/Payment';
import Receipt from './pages/Receipt';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import EventPayment from './pages/EventPayment';
import Foods from './pages/Foods';
import FoodPayment from './pages/FoodPayment';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import TicketVerify from './pages/TicketVerify';
import Merchandise from './pages/Merchandise';
import GiftCards from './pages/GiftCards';

// Helper component to scroll to top on every route transition
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isIntroPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#f8f9fa] flex flex-col font-['Poppins',sans-serif] selection:bg-purple-600 selection:text-white">
      <ScrollToTop />

      {/* Render Navbar only when not in full-screen Intro */}
      {!isIntroPage && <Navbar />}

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/seat-selection" element={<SeatSelection />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/receipt" element={<Receipt />} />
          
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/payment" element={<EventPayment />} />

          <Route path="/foods" element={<Foods />} />
          <Route path="/foods/payment" element={<FoodPayment />} />

          <Route path="/merchandise" element={<Merchandise />} />
          <Route path="/gift-cards" element={<GiftCards />} />

          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verify/:bookingId" element={<TicketVerify />} />
          <Route path="/verify" element={<TicketVerify />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      {/* Render Footer & Chatbot only when not in Intro */}
      {!isIntroPage && <Footer />}
      {!isIntroPage && <Chatbot />}
    </div>
  );
}
