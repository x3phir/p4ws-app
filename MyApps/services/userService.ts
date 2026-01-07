// MyApps/services/userService.ts
import apiClient from '@/api/client';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    isVerified: boolean;
    verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
    ktpImageUrl?: string;
    verificationNote?: string;
    verifiedAt?: Date;
    createdAt: Date;
    role: 'USER' | 'ADMIN' | 'SHELTER_STAFF';
}

export interface UpdateProfileData {
    name?: string;
    phone?: string;
    email?: string;
    avatarUri?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

/**
 * Get current user profile
 */
export const getUserProfile = async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/users/profile');
    return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (data: UpdateProfileData): Promise<UserProfile> => {
    const formData = new FormData();

    if (data.name) formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    if (data.email) formData.append('email', data.email);
    console.log("Updating profile with data:", data);

    if (data.avatarUri) {
        const filename = data.avatarUri.split('/').pop() || 'avatar.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        if (Platform.OS === 'web') {
            const response = await fetch(data.avatarUri);
            const blob = await response.blob();
            formData.append('avatar', blob, filename);
        } else {
            formData.append('avatar', {
                uri: data.avatarUri,
                name: filename,
                type,
            } as any);
        }
    }

    const token = await AsyncStorage.getItem('auth_token');
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

    const response = await fetch(`${apiUrl}/users/profile`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
    }

    return await response.json();
};

/**
 * Change password
 */
export const changePassword = async (data: ChangePasswordData): Promise<void> => {
    await apiClient.put('/users/password', data);
};

/**
 * Submit verification request
 */
export const submitVerification = async (ktpUri: string): Promise<UserProfile> => {
    const formData = new FormData();
    const filename = ktpUri.split('/').pop() || 'ktp.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    if (Platform.OS === 'web') {
        const response = await fetch(ktpUri);
        const blob = await response.blob();
        formData.append('ktp', blob, filename);
    } else {
        formData.append('ktp', {
            uri: ktpUri,
            name: filename,
            type,
        } as any);
    }

    const token = await AsyncStorage.getItem('auth_token');
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

    const response = await fetch(`${apiUrl}/users/verification`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit verification');
    }

    const result = await response.json();
    return result.user;
};

/**
 * Admin: Get verification requests
 */
export const getVerificationRequests = async (status?: string): Promise<UserProfile[]> => {
    const params = status ? `?status=${status}` : '';
    const response = await apiClient.get<UserProfile[]>(`/users/verification-requests${params}`);
    return response.data;
};

/**
 * Admin: Update verification status
 */
export const updateVerificationStatus = async (
    userId: string,
    status: 'VERIFIED' | 'REJECTED',
    note?: string
): Promise<UserProfile> => {
    const response = await apiClient.put<any>(`/users/verification/${userId}`, {
        status,
        note,
    });
    return response.data.user;
};