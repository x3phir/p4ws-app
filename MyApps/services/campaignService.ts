import apiClient from "@/api/client";

export interface Campaign {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    targetAmount: number;
    currentAmount: number;
    shelterId: string;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    shelter?: {
        id: string;
        name: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Get all campaigns
 */
export const getAllCampaigns = async (filters?: {
    status?: string;
    shelterId?: string;
}): Promise<Campaign[]> => {
    try {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.shelterId) params.append('shelterId', filters.shelterId);

        const response = await apiClient.get<Campaign[]>(`/campaigns?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        return [];
    }
};

/**
 * Get campaign by ID
 */
export const getCampaignById = async (id: string): Promise<Campaign | null> => {
    try {
        const response = await apiClient.get<Campaign>(`/campaigns/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching campaign:', error);
        return null;
    }
};

/**
 * Create campaign
 */
export const createCampaign = async (data: Partial<Campaign>): Promise<Campaign> => {
    const response = await apiClient.post<Campaign>('/campaigns', data);
    return response.data;
};

/**
 * Update campaign
 */
export const updateCampaign = async (id: string, data: Partial<Campaign>): Promise<Campaign> => {
    const response = await apiClient.put<Campaign>(`/campaigns/${id}`, data);
    return response.data;
};

/**
 * Process donation
 */
export const processDonation = async (campaignId: string, amount: number): Promise<Campaign> => {
    const response = await apiClient.post<Campaign>(`/campaigns/${campaignId}/donate`, { amount });
    return response.data;
};
