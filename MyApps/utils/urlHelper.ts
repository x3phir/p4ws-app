
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Utility to get the correct image URL.
 * It handles relative paths and replaces 'localhost' with the actual server host
 * if the app is running on a physical device.
 */
export const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return 'https://via.placeholder.com/400x300?text=No+Image';

    // If it's already a full URL (but not localhost), or a local file/data URI, return it
    if ((path.startsWith('http') && !path.includes('localhost') && !path.includes('127.0.0.1')) ||
        path.startsWith('file://') ||
        path.startsWith('data:')) {
        return path;
    }

    // Get base backend URL (remove /api from the end)
    const baseUrl = API_URL.replace(/\/api$/, '');

    // If it's a relative path, prepend baseUrl
    let finalUrl = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

    // If it contains localhost/127.0.0.1, replace it with the host from API_URL
    if (finalUrl.includes('localhost') || finalUrl.includes('127.0.0.1')) {
        const apiHost = new URL(API_URL).host;
        finalUrl = finalUrl.replace(/localhost(:\d+)?/, apiHost).replace(/127\.0\.0\.1(:\d+)?/, apiHost);
    }

    return finalUrl;
};
