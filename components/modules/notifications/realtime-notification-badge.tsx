"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotificationStore } from "@/stores/use-notification-store";

export function RealtimeNotificationBadge() {
  const [open, setOpen] = useState(false);
  const { alerts, unreadCount, markAllAsRead } = useNotificationStore();

  function toggleNotifications() {
    setOpen((wasOpen) => !wasOpen);
    markAllAsRead();
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={
          unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"
        }
        aria-expanded={open}
        aria-controls="realtime-notifications"
        onClick={toggleNotifications}
        className="relative grid size-9 place-items-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
      >
        <Bell aria-hidden="true" size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold leading-4 text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <section
          id="realtime-notifications"
          aria-label="Recent transaction notifications"
          className="absolute right-0 top-11 z-20 w-[min(22rem,calc(100vw-2rem))] border border-slate-200 bg-white shadow-lg"
        >
          <h2 className="border-b border-slate-200 px-4 py-3 text-sm font-semibold">
            Recent activity
          </h2>
          {alerts.length === 0 ? (
            <p className="px-4 py-5 text-sm text-slate-500">No new activity.</p>
          ) : (
            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {alerts.map((alert) => (
                <li key={alert.id} className="px-4 py-3">
                  <p className="text-sm font-medium">
                    {alert.type === "credit" ? "Incoming" : "Outgoing"}{" "}
                    transaction
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {alert.reference} ·{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(Number(alert.amount))}
                  </p>
                  <time
                    className="mt-1 block text-xs text-slate-500"
                    dateTime={alert.timestamp}
                  >
                    {new Date(alert.timestamp).toLocaleString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
