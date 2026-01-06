import apiClient from "@/api/client";

/**
 * Upload image file
 */
export const uploadImage = async (uri: string): Promise<string> => {
    try {
        const formData = new FormData();

        // Extract filename from URI
        const filename = uri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // Create file object
        const file: any = {
            uri,
            name: filename,
            type
        };

        formData.append('image', file);

        const response = await apiClient.post<{ url: string }>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
