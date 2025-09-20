import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}
export declare const createPoultry: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPoultry: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updatePoultry: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deletePoultry: (req: AuthRequest, res: Response) => Promise<void>;
export declare const listPoultry: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addPoultryPhoto: (req: AuthRequest, res: Response) => Promise<void>;
export declare const removePoultryPhoto: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=poultryController.d.ts.map