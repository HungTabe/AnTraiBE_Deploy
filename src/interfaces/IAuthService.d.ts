export interface IAuthService {
    register(userData: RegisterData): Promise<AuthResult>;
    login(email: string, password: string): Promise<AuthResult>;
    getUserProfile(userId: number): Promise<UserProfile>;
    refreshToken(userId: number): Promise<TokenResult>;
    logout(userId: number): Promise<void>;
}
export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    farmName: string;
    farmAddress: string;
    farmCity: string;
    farmProvince: string;
}
export interface AuthResult {
    user: UserProfile;
    token: string;
    expiresIn: string;
}
export interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    role: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface TokenResult {
    token: string;
    expiresIn: string;
}
//# sourceMappingURL=IAuthService.d.ts.map