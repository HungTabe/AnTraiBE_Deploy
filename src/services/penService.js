"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.penService = exports.PenService = void 0;
const database_1 = require("../config/database");
class PenService {
    async createPen(userId, farmId, data) {
        await this.assertFarmOwnership(userId, farmId);
        return database_1.prisma.pen.create({
            data: {
                name: data.name,
                description: data.description ?? null,
                capacity: data.capacity ?? 0,
                temperature: data.temperature ?? null,
                humidity: data.humidity ?? null,
                image: data.image ?? null,
                farmId,
            },
        });
    }
    async getPenById(userId, id) {
        const pen = await database_1.prisma.pen.findUnique({ where: { id }, include: { farm: true } });
        if (!pen)
            return null;
        await this.assertFarmOwnership(userId, pen.farmId);
        return pen;
    }
    async updatePen(userId, id, data) {
        const pen = await database_1.prisma.pen.findUnique({ where: { id } });
        if (!pen)
            return null;
        await this.assertFarmOwnership(userId, pen.farmId);
        return database_1.prisma.pen.update({
            where: { id },
            data: {
                ...(data.name !== undefined ? { name: data.name } : {}),
                ...(data.description !== undefined ? { description: data.description ?? null } : {}),
                ...(data.capacity !== undefined ? { capacity: data.capacity } : {}),
                ...(data.temperature !== undefined ? { temperature: data.temperature ?? null } : {}),
                ...(data.humidity !== undefined ? { humidity: data.humidity ?? null } : {}),
                ...(data.image !== undefined ? { image: data.image ?? null } : {}),
            },
        });
    }
    async deletePen(userId, id) {
        const pen = await database_1.prisma.pen.findUnique({ where: { id } });
        if (!pen)
            return false;
        await this.assertFarmOwnership(userId, pen.farmId);
        await database_1.prisma.pen.delete({ where: { id } });
        return true;
    }
    async listPens(userId, farmId) {
        await this.assertFarmOwnership(userId, farmId);
        return database_1.prisma.pen.findMany({ where: { farmId }, orderBy: { createdAt: 'desc' } });
    }
    async assertFarmOwnership(userId, farmId) {
        const farm = await database_1.prisma.farm.findUnique({ where: { id: farmId } });
        if (!farm || farm.userId !== userId) {
            throw new Error('Forbidden: You do not own this farm');
        }
    }
}
exports.PenService = PenService;
exports.penService = new PenService();
//# sourceMappingURL=penService.js.map