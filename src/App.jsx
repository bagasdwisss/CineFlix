import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import CinematicLoader from './components/common/CinematicLoader';
import PWAInstallBanner from './components/common/PWAInstallBanner';

// Code-Splitting: Lazy load pages for lightning-fast initial load & small bundle size
const Intro = lazy(() => import('./pages/Intro'));
const Home = lazy(() => import('./pages/Home'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const Booking = lazy(() => import('./pages/Booking'));
const SeatSelection = lazy(() => import('./pages/SeatSelection'));
const Payment = lazy(() => import('./pages/Payment'));
const Receipt = lazy(() => import('./pages/Receipt'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const EventPayment = lazy(() => import('./pages/EventPayment'));
const Foods = lazy(() => import('./pages/Foods'));
const FoodPayment = lazy(() => import('./pages/FoodPayment'));
const Merchandise = lazy(() => import('./pages/Merchandise'));
const GiftCards = lazy(() => import('./pages/GiftCards'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const TicketVerify = lazy(() => import('./pages/TicketVerify'));
const StaffScanner = lazy(() => import('./pages/StaffScanner'));

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

      {/* Main Content Area with Suspense Code-Splitting */}
      <main className="flex-1">
        <Suspense fallback={<CinematicLoader />}>
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
            <Route path="/scanner" element={<StaffScanner />} />

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* Render Footer & Chatbot only when not in Intro */}
      {!isIntroPage && <Footer />}
      {!isIntroPage && <Chatbot />}

      {/* PWA Home Screen Install Banner */}
      <PWAInstallBanner />
    </div>
  );
}
