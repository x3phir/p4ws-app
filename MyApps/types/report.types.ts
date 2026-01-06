// Report Types and Interfaces

export enum ReportStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export type CatCondition = "sehat" | "terluka" | "sakit";

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
    timestamp: Date;
    activity: string;
    description?: string;
    icon?: string;
}

export interface CatReport {
    id: string;
    location: string;
    condition: CatCondition;
    imageUri?: string;
    description: string;
    shelter: Shelter;
    status: ReportStatus;
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
