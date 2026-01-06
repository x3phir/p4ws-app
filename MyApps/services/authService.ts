import apiClient from '@/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone?: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    role: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    // Save token and user data
    await AsyncStorage.setItem('auth_token', response.data.token);
    await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));

    return response.data;
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);

    // Save token and user data
    await AsyncStorage.setItem('auth_token', response.data.token);
    await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));

    return response.data;
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
};

/**
 * Check if user is logged in
 */
export const isAuthenticated = async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
};

/**
 * Get stored user data
 */
export const getStoredUser = async (): Promise<User | null> => {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
};
