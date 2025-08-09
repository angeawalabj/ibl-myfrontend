"use client";

import { Globe, HelpCircle, Bell, ShoppingCart, UserCircle } from "lucide-react";
import { useNotificationsContext } from "@/context/NotificationsContext";
import { useRouter } from "next/navigation";

export default function HeaderIcons() {
  const { unreadCount } = useNotificationsContext();
  const router = useRouter();

  return (
    <div className="flex gap-4 items-center text-gray-600 relative">
      <Globe className="w-5 h-5 cursor-pointer" aria-label="Langue" role="img" />
      <HelpCircle className="w-5 h-5 cursor-pointer" aria-label="Aide" role="img" />

      <div
        className="relative cursor-pointer"
        aria-label="Notifications"
        role="img"
        onClick={() => router.push("/notification")}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      <ShoppingCart className="w-5 h-5 cursor-pointer" aria-label="Panier" role="img" />
      <UserCircle className="w-5 h-5 cursor-pointer" aria-label="Mon compte" role="img" />
    </div>
  );
}
