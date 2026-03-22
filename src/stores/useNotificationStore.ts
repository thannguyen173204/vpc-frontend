import { create } from 'zustand'

export interface SystemNotification {
  id: string;
  message: string;
  time: number;
}

interface NotificationState {
  notifications: SystemNotification[];
  unreadCount: number;
  addNotification: (message: string) => void;
  markAsRead: () => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  
  addNotification: (message: string) => {
    set((state) => {
      const newNotif = {
        id: Date.now().toString() + Math.random().toString(),
        message,
        time: Date.now(),
      };
      return { 
        notifications: [newNotif, ...state.notifications].slice(0, 50),
        unreadCount: state.unreadCount + 1 
      };
    });
  },

  markAsRead: () => set({ unreadCount: 0 }),
  removeNotification: (id: string) => set((state) => ({
    notifications: state.notifications.filter(notif => notif.id !== id)
  })),
}))