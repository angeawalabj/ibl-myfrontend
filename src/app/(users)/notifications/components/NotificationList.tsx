"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import NotificationItem from "./NotificationItem";
import api from "@/lib/api";

interface Notification {
  id: number;
  verb: string;
  url?: string | null;
  type: string;           // ajouté ici
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
  // ajoute d'autres champs si besoin
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastNotifElementRef = useCallback((node: Element | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);

    // Nettoyage lors du démontage
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/notifications/?page=${page}`);
        setNotifications(prev => [...prev, ...res.data.results]);
        setHasMore(!!res.data.next);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [page]);

  const markRead = async (id: number) => {
    try {
      await api.post(`/notifications/${id}/mark_read/`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Erreur lors du marquage lu", error);
    }
  };

  const archive = async (id: number) => {
    try {
      await api.post(`/notifications/${id}/archive/`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_archived: true } : n))
      );
    } catch (error) {
      console.error("Erreur lors de l'archivage", error);
    }
  };

  const remove = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}/`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  return (
    <ul className="max-w-3xl mx-auto p-4 space-y-3">
      {notifications.map((notif, i) => {
        const isLastElement = i === notifications.length - 1;
        return (
          <NotificationItem
            key={notif.id}
            {...notif}
            onMarkRead={markRead}
            onArchive={archive}
            onDelete={remove}
            ref={isLastElement ? lastNotifElementRef : null}
          />
        );
      })}
      {loading && <p>Chargement...</p>}
      {!hasMore && !loading && (
        <p className="text-center text-gray-500">Fin des notifications</p>
      )}
    </ul>
  );
}
