import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    /**
     * Register a new user
     */
    register(req: Request, res: Response): Promise<void>;
    /**
     * Login user
     */
    login(req: Request, res: Response): Promise<void>;
    /**
     * Get current user profile
     */
    getProfile(req: Request, res: Response): Promise<void>;
    /**
     * Refresh access token
     */
    refreshToken(req: Request, res: Response): Promise<void>;
    /**
     * Logout user
     */
    logout(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map