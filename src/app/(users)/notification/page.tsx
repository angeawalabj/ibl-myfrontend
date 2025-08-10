// app/(users)/notification/page.tsx
"use client";

import React from "react";
import NotificationList from "./components/NotificationList";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>
      <NotificationList />
    </div>
  );
}
