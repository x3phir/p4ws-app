import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { getNotifications, Notification } from '@/services/notificationService';
import { useAuth } from '@/context/AuthContext';
import NotificationPopup from '@/components/ui/NotificationPopup';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [lastNotification, setLastNotification] = useState<Notification | null>(null);
    const { isLoggedIn } = useAuth();
    const pollingInterval = useRef<any>(null);
    const isInitialLoad = useRef(true);

    const fetchNotifications = async () => {
        if (!isLoggedIn) return;

        try {
            const data = await getNotifications();

            // Check for new notifications to trigger popup
            if (!isInitialLoad.current && data.length > 0) {
                const latest = data[0];
                const existing = notifications.find(n => n.id === latest.id);

                if (!existing && !latest.isRead) {
                    setLastNotification(latest);
                }
            }

            setNotifications(data);
            isInitialLoad.current = false;
        } catch (error) {
            console.error('Failed to fetch notifications in context:', error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchNotifications();
            // Poll every 10 seconds
            pollingInterval.current = setInterval(fetchNotifications, 10000);
        } else {
            setNotifications([]);
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        }

        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, [isLoggedIn]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, refreshNotifications: fetchNotifications }}>
            {children}
            <NotificationPopup
                notification={lastNotification ? {
                    id: lastNotification.id,
                    title: lastNotification.title,
                    message: lastNotification.message
                } : null}
                onClose={() => setLastNotification(null)}
            />
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
