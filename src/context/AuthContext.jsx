import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveTicket } from '../utils/ticketRegistry';

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    firstName: "John",
    lastName: "Doe",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "081234567890",
    birthdate: "1998-05-15",
    password: "password123",
    membershipTier: "VIP Gold Member",
    flixPoints: 2450,
    memberSince: "Januari 2024",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80",
    watchlist: ["movie1", "movie2", "movie8"],
    ticketHistory: [
      {
        bookingId: "FLIX-98214532",
        movie: "Avatar: The Way of Water",
        movieId: "movie3",
        poster: "assets/Avatar-The-Way-of-Water-2022.jpg",
        cinema: "CINEFLIX RASUNA SAID",
        studio: "Studio 1 (Dolby Atmos)",
        date: "14 Mei 2026",
        time: "17:45",
        seats: ["F8", "F9"],
        totalPrice: 150000,
        paymentMethod: "GoPay",
        status: "LUNAS & VALID",
        paymentDate: "12 Mei 2026, 14:20 WIB",
        ticketCount: 2,
        serviceFee: 4000,
        buyerName: "John Doe",
        gate: "Gate 1 • Studio 1"
      },
      {
        bookingId: "CNF-77492015",
        movie: "Avengers: Endgame",
        movieId: "movie2",
        poster: "assets/Avengers-Endgame.jpg",
        cinema: "CINEFLIX GRAND INDONESIA",
        studio: "Studio IMAX 3D",
        date: "20 Mei 2026",
        time: "20:15",
        seats: ["D10", "D11", "D12"],
        totalPrice: 225000,
        paymentMethod: "DANA Wallet",
        status: "LUNAS & VALID",
        paymentDate: "10 Mei 2026, 18:30 WIB",
        ticketCount: 3,
        serviceFee: 4000,
        buyerName: "John Doe",
        gate: "Gate 3 • IMAX 3D"
      }
    ]
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize users & session
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('cineflix_users');
      let users = DEFAULT_USERS;
      if (!storedUsers) {
        localStorage.setItem('cineflix_users', JSON.stringify(DEFAULT_USERS));
      } else {
        try {
          users = JSON.parse(storedUsers);
        } catch {
          users = DEFAULT_USERS;
        }
      }

      // Pre-register all default tickets to registry
      users.forEach(u => {
        if (Array.isArray(u.ticketHistory)) {
          u.ticketHistory.forEach(t => saveTicket(t));
        }
      });

      // Check current session from localStorage or sessionStorage
      const currentSession = 
        localStorage.getItem('cineflix_active_user') || 
        sessionStorage.getItem('cineflix_current_user') || 
        sessionStorage.getItem('loggedInUser');

      if (currentSession) {
        try {
          const parsed = JSON.parse(currentSession);
          // Find fresh copy from users list
          const fresh = users.find(u => u.email.toLowerCase() === parsed.email.toLowerCase()) || parsed;
          setUser(fresh);
        } catch (e) {
          console.error('Failed to parse current user:', e);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUsers = () => {
    try {
      const users = localStorage.getItem('cineflix_users');
      return users ? JSON.parse(users) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem('cineflix_users', JSON.stringify(users));
  };

  const persistUserSession = (userData) => {
    setUser(userData);
    localStorage.setItem('cineflix_active_user', JSON.stringify(userData));
    sessionStorage.setItem('cineflix_current_user', JSON.stringify(userData));
    sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
  };

  const login = (email, password, rememberMe = false) => {
    const users = getUsers();
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!foundUser) {
      throw new Error("Email atau kata sandi yang Anda masukkan salah.");
    }

    persistUserSession(foundUser);

    if (rememberMe) {
      localStorage.setItem('cineflix_remembered_email', email);
    } else {
      localStorage.removeItem('cineflix_remembered_email');
    }

    return foundUser;
  };

  // Instant 1-click Demo Login
  const quickDemoLogin = () => {
    const users = getUsers();
    const demo = users[0] || DEFAULT_USERS[0];
    persistUserSession(demo);
    return demo;
  };

  const register = ({ firstName, lastName, email, phone, password }) => {
    const users = getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (existing) {
      throw new Error("Email ini sudah terdaftar. Silakan login atau gunakan email lain.");
    }

    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName} ${lastName}`.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      birthdate: "",
      password,
      membershipTier: "Member Standar",
      flixPoints: 100, // Welcome bonus points!
      memberSince: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=6a11cb&color=fff&size=256`,
      watchlist: [],
      ticketHistory: []
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    persistUserSession(newUser);

    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cineflix_active_user');
    sessionStorage.removeItem('cineflix_current_user');
    sessionStorage.removeItem('loggedInUser');
  };

  const updateProfile = (updatedFields) => {
    if (!user) return;
    const users = getUsers();
    const updatedUser = {
      ...user,
      ...updatedFields,
      name: updatedFields.firstName || updatedFields.lastName 
        ? `${updatedFields.firstName || user.firstName} ${updatedFields.lastName || user.lastName}`.trim()
        : user.name
    };

    const newUsers = users.map(u => u.email.toLowerCase() === user.email.toLowerCase() ? updatedUser : u);
    saveUsers(newUsers);
    persistUserSession(updatedUser);
  };

  const toggleWatchlist = (movieId) => {
    if (!user) return false;
    const currentList = user.watchlist || [];
    const exists = currentList.includes(movieId);
    const updatedList = exists 
      ? currentList.filter(id => id !== movieId)
      : [...currentList, movieId];

    updateProfile({ watchlist: updatedList });
    return !exists;
  };

  const addTicketToHistory = (ticket) => {
    if (!user || !ticket) return;
    
    // Save to global verified registry first so it is immediately scannable
    saveTicket(ticket);

    const currentHistory = user.ticketHistory || [];
    const updatedHistory = [ticket, ...currentHistory];
    
    // Also reward 50 points per ticket purchased!
    const seatsCount = Array.isArray(ticket.seats) ? ticket.seats.length : 1;
    const addedPoints = seatsCount * 50;

    updateProfile({
      ticketHistory: updatedHistory,
      flixPoints: (user.flixPoints || 0) + addedPoints
    });
  };

  const updateTicketInHistory = (bookingId, updateFields) => {
    if (!user) return;
    const currentHistory = user.ticketHistory || [];
    const updatedHistory = currentHistory.map(t => {
      if (String(t.bookingId).toUpperCase() === String(bookingId).toUpperCase()) {
        return { ...t, ...updateFields };
      }
      return t;
    });
    updateProfile({ ticketHistory: updatedHistory });
  };

  const resetPassword = (email, newPassword) => {
    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);

    if (userIndex === -1) {
      throw new Error("Email tidak ditemukan dalam sistem CineFlix.");
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword
    };

    saveUsers(updatedUsers);

    // If currently logged in user is this person, update session
    if (user && user.email.toLowerCase() === cleanEmail) {
      persistUserSession(updatedUsers[userIndex]);
    }

    return true;
  };

  const changePassword = (oldPassword, newPassword) => {
    if (!user) throw new Error("Anda belum login.");
    if (user.password !== oldPassword) {
      throw new Error("Kata sandi lama Anda salah.");
    }
    if (newPassword.length < 6) {
      throw new Error("Kata sandi baru minimal harus 6 karakter.");
    }

    return resetPassword(user.email, newPassword);
  };

  const redeemFlixPoints = (cost, voucherCode, rewardName) => {
    if (!user) throw new Error("Silakan login terlebih dahulu.");
    const currentPoints = user.flixPoints || 0;
    if (currentPoints < cost) {
      throw new Error(`Poin Flix Anda tidak mencukupi. Butuh ${cost} poin, saat ini Anda memiliki ${currentPoints} poin.`);
    }

    const newVouchers = user.vouchers || [];
    const rewardRecord = {
      id: `VCH-${Date.now()}`,
      code: voucherCode,
      name: rewardName,
      cost,
      claimedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    updateProfile({
      flixPoints: currentPoints - cost,
      vouchers: [rewardRecord, ...newVouchers]
    });

    return rewardRecord;
  };

  const addMerchOrder = (order) => {
    if (!user) return;
    const currentOrders = user.merchOrders || [];
    const pointsEarned = Math.floor((order.total || 0) / 1000);

    updateProfile({
      merchOrders: [order, ...currentOrders],
      flixPoints: (user.flixPoints || 0) + pointsEarned
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      quickDemoLogin,
      register,
      logout,
      updateProfile,
      toggleWatchlist,
      addTicketToHistory,
      updateTicketInHistory,
      resetPassword,
      changePassword,
      redeemFlixPoints,
      addMerchOrder
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
