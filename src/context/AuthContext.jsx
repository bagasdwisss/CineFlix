import React, { createContext, useContext, useState, useEffect } from 'react';

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
    watchlist: ["movie1", "movie2", "movie8"],
    ticketHistory: [
      {
        bookingId: "FLIX-98214532",
        movie: "Avatar: The Way of Water",
        cinema: "CINEFLIX RASUNA SAID",
        date: "14/05/2025",
        time: "17:45",
        seats: ["F8", "F9"],
        totalPrice: 150000,
        paymentMethod: "Gopay",
        status: "Berhasil",
        paymentDate: "12 Mei 2025, 14:20"
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
      if (!storedUsers) {
        localStorage.setItem('cineflix_users', JSON.stringify(DEFAULT_USERS));
      }

      // Check legacy or current session
      const currentSession = sessionStorage.getItem('cineflix_current_user') || sessionStorage.getItem('loggedInUser');
      if (currentSession) {
        try {
          const parsed = JSON.parse(currentSession);
          setUser(parsed);
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

  const login = (email, password, rememberMe = false) => {
    const users = getUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!foundUser) {
      throw new Error("Email atau kata sandi yang Anda masukkan salah.");
    }

    setUser(foundUser);
    sessionStorage.setItem('cineflix_current_user', JSON.stringify(foundUser));
    sessionStorage.setItem('loggedInUser', JSON.stringify(foundUser)); // Legacy compatibility

    if (rememberMe) {
      localStorage.setItem('cineflix_remembered_email', email);
    } else {
      localStorage.removeItem('cineflix_remembered_email');
    }

    return foundUser;
  };

  const register = ({ firstName, lastName, email, phone, password }) => {
    const users = getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      throw new Error("Email ini sudah terdaftar. Silakan login atau gunakan email lain.");
    }

    const newUser = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone: phone || "",
      birthdate: "",
      password,
      watchlist: [],
      ticketHistory: []
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    setUser(newUser);
    sessionStorage.setItem('cineflix_current_user', JSON.stringify(newUser));
    sessionStorage.setItem('loggedInUser', JSON.stringify(newUser));

    return newUser;
  };

  const logout = () => {
    setUser(null);
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

    const newUsers = users.map(u => u.email === user.email ? updatedUser : u);
    saveUsers(newUsers);
    setUser(updatedUser);
    sessionStorage.setItem('cineflix_current_user', JSON.stringify(updatedUser));
    sessionStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
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
    if (!user) return;
    const currentHistory = user.ticketHistory || [];
    const updatedHistory = [ticket, ...currentHistory];
    updateProfile({ ticketHistory: updatedHistory });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      toggleWatchlist,
      addTicketToHistory
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
