// Report Types and Interfaces

export enum ReportStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    REJECTED = "REJECTED",
}

export type CatCondition = "SEHAT" | "TERLUKA" | "SAKIT";

export interface Shelter {
    id: string;
    name: string;
    imageUrl?: string;  // Changed from imageUri to match backend
    isAvailable: boolean;
    capacity: number;
    currentOccupancy: number;
    address: string;
    description?: string;
    phone?: string;
    email?: string;
}

export interface TimelineEntry {
    id: string;
    createdAt: Date;
    activity: string;
    description?: string;
    icon?: string;
}

export interface CatReport {
    id: string;
    location: string;
    condition: CatCondition;
    imageUri?: string; // Keep this for local URI if needed, but the server returns imageUrl
    imageUrl?: string;
    description: string;
    shelter: Shelter;
    status: ReportStatus;
    adminNote?: string;
    timeline: TimelineEntry[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateReportData {
    location: string;
    condition: CatCondition;
    imageUri?: string;
    description: string;
    shelterId: string;
}
