"use client";

import React, { forwardRef } from "react";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  id: number;
  verb: string;
  url?: string | null;  // <-- autoriser null ici aussi
  type: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
  onMarkRead: (id: number) => void;
  onArchive: (id: number) => void;
  onDelete: (id: number) => void;
}


const NotificationItem = forwardRef<HTMLLIElement, NotificationItemProps>(({
  id,
  verb,
  url,
  type,
  is_read,
  is_archived,
  created_at,
  onMarkRead,
  onArchive,
  onDelete,
}, ref) => {
  const router = useRouter();

  const handleClick = () => {
    if (!is_read) onMarkRead(id);
    if (url) router.push(url);
  };

  return (
    <li
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
      className={`p-3 border rounded cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-2
        ${is_read ? "bg-gray-100" : "bg-white font-semibold"} ${is_archived ? "opacity-50" : ""}`}
      aria-pressed={is_read}
      aria-disabled={is_archived}
    >
      <div>
        <p>{verb}</p>
        <p className="text-xs text-gray-500">{new Date(created_at).toLocaleString()}</p>
        <p className="text-xs italic text-gray-400">{type}</p>
      </div>
      <div className="flex gap-2 text-sm">
        {!is_read && (
          <button
            onClick={e => { e.stopPropagation(); onMarkRead(id); }}
            className="text-green-600"
            aria-label="Marquer comme lu"
            type="button"
          >
            ✅ Lu
          </button>
        )}
        {!is_archived && (
          <button
            onClick={e => { e.stopPropagation(); onArchive(id); }}
            className="text-blue-600"
            aria-label="Archiver la notification"
            type="button"
          >
            📦 Archiver
          </button>
        )}
        <button
          onClick={e => { e.stopPropagation(); onDelete(id); }}
          className="text-red-600"
          aria-label="Supprimer la notification"
          type="button"
        >
          🗑 Supprimer
        </button>
      </div>
    </li>
  );
});

NotificationItem.displayName = "NotificationItem";

export default NotificationItem;
