import { CreatePoultryDTO, UpdatePoultryDTO, PoultryQueryFilters } from '../types/poultry';
export declare class PoultryService {
    createPoultry(userId: number, data: CreatePoultryDTO): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tagNumber: string | null;
        type: import("@prisma/client").$Enums.PoultryType;
        gender: import("@prisma/client").$Enums.Gender;
        age: number;
        weight: number | null;
        healthStatus: import("@prisma/client").$Enums.HealthStatus;
        image: string | null;
        notes: string | null;
        userId: number;
        penId: number | null;
        breedId: number | null;
        birthDate: Date | null;
    }>;
    getPoultryById(userId: number, id: number): Promise<({
        pen: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            description: string | null;
            capacity: number;
            currentCount: number;
            temperature: number | null;
            humidity: number | null;
            farmId: number;
        } | null;
        breed: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.PoultryType;
            image: string | null;
            description: string | null;
            averageWeight: number | null;
            maturityAge: number | null;
            eggProduction: number | null;
            diseaseResistance: string | null;
        } | null;
        photos: {
            id: number;
            createdAt: Date;
            poultryId: number;
            url: string;
            caption: string | null;
            isMain: boolean;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tagNumber: string | null;
        type: import("@prisma/client").$Enums.PoultryType;
        gender: import("@prisma/client").$Enums.Gender;
        age: number;
        weight: number | null;
        healthStatus: import("@prisma/client").$Enums.HealthStatus;
        image: string | null;
        notes: string | null;
        userId: number;
        penId: number | null;
        breedId: number | null;
        birthDate: Date | null;
    }) | null>;
    updatePoultry(userId: number, id: number, data: UpdatePoultryDTO): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tagNumber: string | null;
        type: import("@prisma/client").$Enums.PoultryType;
        gender: import("@prisma/client").$Enums.Gender;
        age: number;
        weight: number | null;
        healthStatus: import("@prisma/client").$Enums.HealthStatus;
        image: string | null;
        notes: string | null;
        userId: number;
        penId: number | null;
        breedId: number | null;
        birthDate: Date | null;
    } | null>;
    deletePoultry(userId: number, id: number): Promise<boolean>;
    listPoultry(userId: number, filters: PoultryQueryFilters): Promise<{
        items: ({
            pen: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                image: string | null;
                description: string | null;
                capacity: number;
                currentCount: number;
                temperature: number | null;
                humidity: number | null;
                farmId: number;
            } | null;
            breed: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.PoultryType;
                image: string | null;
                description: string | null;
                averageWeight: number | null;
                maturityAge: number | null;
                eggProduction: number | null;
                diseaseResistance: string | null;
            } | null;
            photos: {
                id: number;
                createdAt: Date;
                poultryId: number;
                url: string;
                caption: string | null;
                isMain: boolean;
            }[];
        } & {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            tagNumber: string | null;
            type: import("@prisma/client").$Enums.PoultryType;
            gender: import("@prisma/client").$Enums.Gender;
            age: number;
            weight: number | null;
            healthStatus: import("@prisma/client").$Enums.HealthStatus;
            image: string | null;
            notes: string | null;
            userId: number;
            penId: number | null;
            breedId: number | null;
            birthDate: Date | null;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    addPhoto(userId: number, poultryId: number, url: string, caption?: string, isMain?: boolean): Promise<{
        id: number;
        createdAt: Date;
        poultryId: number;
        url: string;
        caption: string | null;
        isMain: boolean;
    } | null>;
    removePhoto(userId: number, poultryId: number, photoId: number): Promise<boolean>;
    private updatePenCountsIfNeeded;
}
export declare const poultryService: PoultryService;
//# sourceMappingURL=poultryService.d.ts.map