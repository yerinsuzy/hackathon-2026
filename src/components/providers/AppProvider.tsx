"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";

interface AppContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialization from local storage
  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("hackathon_user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse hackathon_user");
      }
    }
  }, []);

  // Sync to local storage whenever state changes, after mount
  useEffect(() => {
    if (isMounted) {
      if (currentUser) {
        localStorage.setItem("hackathon_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("hackathon_user");
      }
    }
  }, [currentUser, isMounted]);

  const login = (user: User) => {
    setCurrentUser(user);
    // Since we now use DB, we can optionally register them to the DB as well.
    // We will let the voting process handle their existence, or a separate action if needed.
  };

  const logout = () => {
    setCurrentUser(null);
  };

  if (!isMounted) return null;

  return (
    <AppContext.Provider
      value={{ currentUser, login, logout }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppBaseContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppBaseContext must be used within an AppProvider");
  }
  return context;
};
