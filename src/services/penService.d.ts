import { CreatePenDTO, UpdatePenDTO } from '../types/poultry';
export declare class PenService {
    createPen(userId: number, farmId: number, data: CreatePenDTO): Promise<{
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
    }>;
    getPenById(userId: number, id: number): Promise<({
        farm: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            userId: number;
            description: string | null;
            address: string;
            city: string;
            province: string;
            postalCode: string | null;
            latitude: number | null;
            longitude: number | null;
        };
    } & {
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
    }) | null>;
    updatePen(userId: number, id: number, data: UpdatePenDTO): Promise<{
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
    } | null>;
    deletePen(userId: number, id: number): Promise<boolean>;
    listPens(userId: number, farmId: number): Promise<{
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
    }[]>;
    private assertFarmOwnership;
}
export declare const penService: PenService;
//# sourceMappingURL=penService.d.ts.map