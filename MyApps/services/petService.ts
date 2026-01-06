import apiClient from "@/api/client";

export interface Pet {
    id: string;
    name: string;
    description: string;
    about: string;
    imageUrl: string;
    age?: string;
    gender?: string;
    breed?: string;
    vaccine: string;
    steril: string;
    shelterId: string;
    status: 'AVAILABLE' | 'ADOPTED' | 'PENDING';
    shelter?: {
        id: string;
        name: string;
        address: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Get all pets
 */
export const getAllPets = async (filters?: {
    status?: string;
    shelterId?: string;
}): Promise<Pet[]> => {
    try {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.shelterId) params.append('shelterId', filters.shelterId);

        const response = await apiClient.get<Pet[]>(`/pets?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pets:', error);
        return [];
    }
};

/**
 * Get pet by ID
 */
export const getPetById = async (id: string): Promise<Pet | null> => {
    try {
        const response = await apiClient.get<Pet>(`/pets/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pet:', error);
        return null;
    }
};

/**
 * Create pet
 */
export const createPet = async (data: Partial<Pet>): Promise<Pet> => {
    const response = await apiClient.post<Pet>('/pets', data);
    return response.data;
};

/**
 * Update pet
 */
export const updatePet = async (id: string, data: Partial<Pet>): Promise<Pet> => {
    const response = await apiClient.put<Pet>(`/pets/${id}`, data);
    return response.data;
};

/**
 * Delete pet
 */
export const deletePet = async (id: string): Promise<void> => {
    await apiClient.delete(`/pets/${id}`);
};
