import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  // Movie Ticket Booking State
  const [bookingData, setBookingData] = useState(() => {
    try {
      const saved = localStorage.getItem('cineflix_current_booking') || localStorage.getItem('bookingData');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Latest Receipt Data
  const [latestReceipt, setLatestReceipt] = useState(() => {
    try {
      const saved = localStorage.getItem('cineflix_receipt') || localStorage.getItem('receiptData');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Food Cart State
  const [foodCart, setFoodCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cineflix_food_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Event Order State
  const [eventOrder, setEventOrder] = useState(() => {
    try {
      const saved = sessionStorage.getItem('eventOrderData') || localStorage.getItem('cineflix_event_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    if (bookingData) {
      localStorage.setItem('cineflix_current_booking', JSON.stringify(bookingData));
      localStorage.setItem('bookingData', JSON.stringify(bookingData));
    }
  }, [bookingData]);

  useEffect(() => {
    if (latestReceipt) {
      localStorage.setItem('cineflix_receipt', JSON.stringify(latestReceipt));
      localStorage.setItem('receiptData', JSON.stringify(latestReceipt));
    }
  }, [latestReceipt]);

  useEffect(() => {
    localStorage.setItem('cineflix_food_cart', JSON.stringify(foodCart));
  }, [foodCart]);

  useEffect(() => {
    if (eventOrder) {
      sessionStorage.setItem('eventOrderData', JSON.stringify(eventOrder));
      localStorage.setItem('cineflix_event_order', JSON.stringify(eventOrder));
    }
  }, [eventOrder]);

  /**
   * Slot-based occupied seats persistence
   * Key format: "SLOT_{movieId}_{cinema}_{date}_{time}"
   */
  const getSlotOccupiedSeats = useCallback((slotKey, defaultOccupied = []) => {
    try {
      const stored = localStorage.getItem(`cineflix_slot_${slotKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.from(new Set([...defaultOccupied, ...parsed]));
      }
    } catch (e) {
      console.error('Failed to load slot seats:', e);
    }
    return defaultOccupied;
  }, []);

  const reserveSlotSeats = useCallback((slotKey, seatsToReserve) => {
    try {
      const current = getSlotOccupiedSeats(slotKey);
      const updated = Array.from(new Set([...current, ...seatsToReserve]));
      localStorage.setItem(`cineflix_slot_${slotKey}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to reserve slot seats:', e);
    }
  }, [getSlotOccupiedSeats]);

  // Food Cart Operations
  const addFoodItem = (food, qty = 1, note = '') => {
    setFoodCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === food.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
          note: note || updated[existingIndex].note
        };
        return updated;
      }
      return [...prev, { ...food, quantity: qty, note }];
    });
  };

  const updateFoodQty = (foodId, qty) => {
    if (qty <= 0) {
      removeFoodItem(foodId);
    } else {
      setFoodCart((prev) =>
        prev.map((item) => (item.id === foodId ? { ...item, quantity: qty } : item))
      );
    }
  };

  const removeFoodItem = (foodId) => {
    setFoodCart((prev) => prev.filter((item) => item.id !== foodId));
  };

  const clearFoodCart = () => {
    setFoodCart([]);
    localStorage.removeItem('cineflix_food_cart');
  };

  const foodSubtotal = foodCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setBookingData,
        latestReceipt,
        setLatestReceipt,
        foodCart,
        addFoodItem,
        updateFoodQty,
        removeFoodItem,
        clearFoodCart,
        foodSubtotal,
        eventOrder,
        setEventOrder,
        getSlotOccupiedSeats,
        reserveSlotSeats
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
