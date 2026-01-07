import apiClient from '@/api/client';

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type?: string;
    isRead: boolean;
    createdAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
    try {
        const response = await apiClient.get<Notification[]>('/notifications');
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

export const markAsRead = async (id: string): Promise<void> => {
    try {
        await apiClient.put(`/notifications/${id}/read`);
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
};

export const markAllAsRead = async (): Promise<void> => {
    try {
        await apiClient.put('/notifications/read-all');
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
    }
};

export const deleteNotification = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/notifications/${id}`);
    } catch (error) {
        console.error('Error deleting notification:', error);
    }
};
