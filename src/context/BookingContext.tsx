// context/BookingContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface BookingData {
  id: string;
  serviceCategory: string[];
  serviceType: string;
  dateTime: string[];
  address: string;
  jobTitle: string;
  minBudget: string;
  maxBudget: string;
  description: string;
  uploadedFiles: File[];
}

interface BookingContextType {
  bookingData: BookingData | null;
  setBookingData: (data: BookingData) => void;
  clearBookingData: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookingData, setBookingDataState] = useState<BookingData | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("bookingData");
    if (savedData) {
      try {
        setBookingDataState(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to parse booking data from localStorage", error);
      }
    }
  }, []);

  const setBookingData = (data: BookingData) => {
    setBookingDataState(data);
    localStorage.setItem("bookingData", JSON.stringify(data));
  };

  const clearBookingData = () => {
    setBookingDataState(null);
    localStorage.removeItem("bookingData");
  };

  return (
    <BookingContext.Provider
      value={{ bookingData, setBookingData, clearBookingData }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
