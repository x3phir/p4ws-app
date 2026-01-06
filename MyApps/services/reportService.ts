import apiClient from "@/api/client";
import {
    CatReport,
    CreateReportData,
    ReportStatus,
} from "@/types/report.types";

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
 * Create new report
 */
export const createReport = async (data: CreateReportData): Promise<CatReport> => {
    try {
        const response = await apiClient.post<CatReport>('/reports', data);
        return response.data;
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
