import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient | null = null;

export const prisma = (() => {
	if (!prismaClient) {
		prismaClient = new PrismaClient({
			log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'info', 'warn', 'error'],
		});
	}
	return prismaClient;
})();

