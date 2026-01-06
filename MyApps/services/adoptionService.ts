import apiClient from "@/api/client";
import { Pet } from "./petService";

export interface AdoptionRequest {
    id: string;
    userId: string;
    petId: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
    reason?: string;
    hasYard?: boolean;
    hasOtherPets?: boolean;
    contact?: string;
    adminNote?: string;
    createdAt?: Date;
    updatedAt?: Date;
    pet?: Pet;
}

export const createAdoptionRequest = async (data: {
    petId: string;
    reason: string;
    hasYard: boolean;
    hasOtherPets: boolean;
    contact: string;
}): Promise<AdoptionRequest> => {
    const response = await apiClient.post<AdoptionRequest>('/adoptions', data);
    return response.data;
};

export const getMyAdoptions = async (): Promise<AdoptionRequest[]> => {
    const response = await apiClient.get<AdoptionRequest[]>('/adoptions/my');
    return response.data;
};

export const getAdoptionById = async (id: string): Promise<AdoptionRequest> => {
    const response = await apiClient.get<AdoptionRequest>(`/adoptions/${id}`);
    return response.data;
};
