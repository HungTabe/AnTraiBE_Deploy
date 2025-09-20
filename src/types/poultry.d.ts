import { PoultryType, HealthStatus, Gender } from '@prisma/client';
export interface CreatePoultryDTO {
    name: string;
    type: PoultryType;
    gender: Gender;
    age: number;
    weight?: number;
    healthStatus?: HealthStatus;
    image?: string;
    notes?: string;
    penId?: number | null;
    breedId?: number | null;
    tagNumber?: string | null;
    birthDate?: string | Date | null;
}
export interface UpdatePoultryDTO extends Partial<CreatePoultryDTO> {
}
export interface PoultryQueryFilters {
    search?: string;
    type?: PoultryType;
    healthStatus?: HealthStatus;
    gender?: Gender;
    penId?: number;
    breedId?: number;
    minAge?: number;
    maxAge?: number;
    minWeight?: number;
    maxWeight?: number;
    page?: number;
    pageSize?: number;
    sortBy?: 'createdAt' | 'age' | 'weight' | 'name';
    sortOrder?: 'asc' | 'desc';
}
export interface CreatePenDTO {
    name: string;
    description?: string;
    capacity?: number;
    temperature?: number;
    humidity?: number;
    image?: string;
}
export interface UpdatePenDTO extends Partial<CreatePenDTO> {
}
//# sourceMappingURL=poultry.d.ts.map