import apiClient from "@/api/client";
import { Campaign } from "./campaignService";
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Donation {
    id: string;
    amount: number;
    proofUrl: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    campaignId: string;
    createdAt?: Date;
    campaign?: Campaign;
}

export const createDonation = async (campaignId: string, amount: number, proofUri: string): Promise<Donation> => {
    const formData = new FormData();
    formData.append('campaignId', campaignId);
    formData.append('amount', amount.toString());

    let filename = proofUri.split('/').pop() || 'proof.jpg';

    if (!/\.(jpg|jpeg|png|gif)$/i.test(filename)) {
        filename = `proof_${Date.now()}.jpg`;
    }
    // Platform specific file handling
    if (Platform.OS === 'web') {
        console.log("Web environment detected. Converting URI to Blob...");
        try {
            const response = await fetch(proofUri);
            const blob = await response.blob();
            formData.append('proof', blob, filename);
        } catch (e) {
            console.error("Failed to convert URI to Blob on Web:", e);
            throw new Error("Gagal memproses gambar. Pastikan gambar valid.");
        }
    } else {
        console.log("Native environment detected. Using URI object.");
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        formData.append('proof', {
            uri: proofUri,
            name: filename,
            type,
        } as any);
    }

    const token = await AsyncStorage.getItem('auth_token');
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
    const uploadUrl = `${apiUrl}/donations`;

    console.log(`Uploading to ${uploadUrl} (Platform: ${Platform.OS})`);

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Browser/Fetch sets Content-Type automatically with boundary
            },
            body: formData,
        });

        const responseText = await response.text();
        console.log("Upload Response Status:", response.status);
        // console.log("Upload Response Body:", responseText); // Uncomment for full debug

        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            responseData = { error: responseText };
        }

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to upload donation');
        }

        return responseData;
    } catch (error) {
        console.error("Upload Error:", error);
        throw error;
    }
};

export const getMyDonations = async (): Promise<Donation[]> => {
    const response = await apiClient.get<Donation[]>('/donations/my');
    return response.data;
};
