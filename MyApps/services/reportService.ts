import apiClient from "@/api/client";
import {
    CatReport,
    CreateReportData,
    ReportStatus,
} from "@/types/report.types";

export { CatReport, CreateReportData, ReportStatus };
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

/**
 * Get all reports
 */
export const getAllReports = async (): Promise<CatReport[]> => {
    try {
        const response = await apiClient.get<CatReport[]>('/reports');
        return response.data;
    } catch (error) {
        console.error('Error getting reports:', error);
        return [];
    }
};

/**
 * Get report by ID
 */
export const getReportById = async (id: string): Promise<CatReport | null> => {
    try {
        const response = await apiClient.get<CatReport>(`/reports/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting report by ID:', error);
        return null;
    }
};

/**
 * Get current user reports
 */
export const getMyReports = async (): Promise<CatReport[]> => {
    try {
        const profile = await AsyncStorage.getItem('user_data');
        if (!profile) return [];
        const user = JSON.parse(profile);
        const response = await apiClient.get<CatReport[]>(`/reports?userId=${user.id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting my reports:', error);
        return [];
    }
};

/**
 * Create new report
 */
export const createReport = async (data: CreateReportData): Promise<CatReport> => {
    try {
        const formData = new FormData();
        formData.append('location', data.location);
        formData.append('condition', data.condition);
        formData.append('description', data.description);
        formData.append('shelterId', data.shelterId);

        if (data.imageUri) {
            const filename = data.imageUri.split('/').pop() || 'report.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            if (Platform.OS === 'web') {
                const response = await fetch(data.imageUri);
                const blob = await response.blob();
                formData.append('image', blob, filename);
            } else {
                formData.append('image', {
                    uri: data.imageUri,
                    name: filename,
                    type,
                } as any);
            }
        }

        const token = await AsyncStorage.getItem('auth_token');
        const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

        const response = await fetch(`${apiUrl}/reports`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create report');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating report:', error);
        throw error;
    }
};

/**
 * Update report status
 */
export const updateReportStatus = async (
    id: string,
    status: ReportStatus,
    activity?: string,
    description?: string
): Promise<CatReport | null> => {
    try {
        const response = await apiClient.put<CatReport>(`/reports/${id}/status`, {
            status,
            activity,
            description
        });
        return response.data;
    } catch (error) {
        console.error('Error updating report status:', error);
        return null;
    }
};

/**
 * Add timeline entry to report
 */
export const addTimelineEntry = async (
    reportId: string,
    activity: string,
    description?: string,
    icon?: string
): Promise<CatReport | null> => {
    try {
        await apiClient.post(`/reports/${reportId}/timeline`, {
            activity,
            description,
            icon
        });

        // Fetch updated report
        return await getReportById(reportId);
    } catch (error) {
        console.error('Error adding timeline entry:', error);
        return null;
    }
};
