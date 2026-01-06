import apiClient from "@/api/client";
import { Shelter } from "@/types/report.types";

/**
 * Get all shelters
 */
export const getAllShelters = async (): Promise<Shelter[]> => {
    try {
        const response = await apiClient.get<Shelter[]>('/shelters');
        return response.data;
    } catch (error) {
        console.error('Error fetching shelters:', error);
        throw error;
    }
};

/**
 * Get shelter by ID
 */
export const getShelterById = async (id: string): Promise<Shelter | null> => {
    try {
        const response = await apiClient.get<Shelter>(`/shelters/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching shelter:', error);
        return null;
    }
};

/**
 * Get only available shelters
 */
export const getAvailableShelters = async (): Promise<Shelter[]> => {
    try {
        const shelters = await getAllShelters();
        return shelters.filter((s) => s.isAvailable);
    } catch (error) {
        console.error('Error fetching available shelters:', error);
        return [];
    }
};

/**
 * Create shelter (Admin only)
 */
export const createShelter = async (data: Partial<Shelter>): Promise<Shelter> => {
    const response = await apiClient.post<Shelter>('/shelters', data);
    return response.data;
};

/**
 * Update shelter (Admin only)
 */
export const updateShelter = async (id: string, data: Partial<Shelter>): Promise<Shelter> => {
    const response = await apiClient.put<Shelter>(`/shelters/${id}`, data);
    return response.data;
};
