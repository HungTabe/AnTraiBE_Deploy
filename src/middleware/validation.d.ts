import { Request, Response, NextFunction } from 'express';
export declare const validateAuth: {
    register: import("express-validator").ValidationChain[];
    login: import("express-validator").ValidationChain[];
};
export declare const validatePoultry: {
    create: import("express-validator").ValidationChain[];
    update: import("express-validator").ValidationChain[];
};
export declare const validateCareRecord: {
    create: import("express-validator").ValidationChain[];
};
export declare const validate: (req: Request, res: Response, next: NextFunction) => void | Response;
//# sourceMappingURL=validation.d.ts.map