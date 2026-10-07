

import { create } from 'zustand';

interface RealtimeAlert {
  id: string;
  reference: string;
  amount: number;
  type: 'credit' | 'debit';
  timestamp: string;
}

interface NotificationState {
  unreadCount: number;
  alerts: RealtimeAlert[];
  pushAlert: (alert: RealtimeAlert) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  alerts: [],
  pushAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 20),
      unreadCount: state.unreadCount + 1,
    })),
  markAllAsRead: () => set({ unreadCount: 0 }),
}));