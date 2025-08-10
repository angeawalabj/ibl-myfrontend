// context/NotificationsContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api"; // axios instance configurée

interface NotificationsContextType {
  unreadCount: number;
  refreshUnreadCount: () => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
  unreadCount: 0,
  refreshUnreadCount: () => {},
});

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications/unread_count/");
      setUnreadCount(res.data.unread_count);
    } catch (error) {
      console.error("Erreur fetch unread count", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // toutes les 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationsContext.Provider value={{ unreadCount, refreshUnreadCount: fetchUnreadCount }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => useContext(NotificationsContext);
