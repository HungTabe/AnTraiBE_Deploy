"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
let prismaClient = null;
exports.prisma = (() => {
    if (!prismaClient) {
        prismaClient = new client_1.PrismaClient({
            log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'info', 'warn', 'error'],
        });
    }
    return prismaClient;
})();
//# sourceMappingURL=database.js.map