import { IAuthService, RegisterData, AuthResult, UserProfile, TokenResult } from '../interfaces/IAuthService';
export declare class AuthService implements IAuthService {
    private prisma;
    private jwtSecret;
    private jwtExpiresIn;
    constructor();
    register(userData: RegisterData): Promise<AuthResult>;
    login(email: string, password: string): Promise<AuthResult>;
    getUserProfile(userId: number): Promise<UserProfile>;
    refreshToken(userId: number): Promise<TokenResult>;
    logout(userId: number): Promise<void>;
    private generateToken;
}
//# sourceMappingURL=authService.d.ts.map