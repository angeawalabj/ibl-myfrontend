"use client";

import { Globe, HelpCircle, Bell, ShoppingCart, UserCircle } from "lucide-react";
import { useNotificationsContext } from "@/context/NotificationsContext";
import { useRouter } from "next/navigation";

export default function MobileBottomBar() {
  const { unreadCount } = useNotificationsContext();
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden flex justify-around items-center h-12 shadow">
      <Globe className="w-5 h-5 text-gray-600" />
      <HelpCircle className="w-5 h-5 text-gray-600" />
      
      <div className="relative cursor-pointer" onClick={() => router.push("/notification")} aria-label="Notifications" role="img">
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      <ShoppingCart className="w-5 h-5 text-gray-600" />
      <UserCircle className="w-5 h-5 text-gray-600" />
    </div>
  );
}
