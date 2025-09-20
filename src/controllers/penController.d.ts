import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}
export declare const createPen: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPen: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updatePen: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deletePen: (req: AuthRequest, res: Response) => Promise<void>;
export declare const listPens: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=penController.d.ts.map