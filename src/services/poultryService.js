"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poultryService = exports.PoultryService = void 0;
const database_1 = require("../config/database");
class PoultryService {
    async createPoultry(userId, data) {
        const created = await database_1.prisma.poultry.create({
            data: {
                name: data.name,
                type: data.type,
                gender: data.gender,
                age: data.age,
                weight: data.weight ?? null,
                healthStatus: data.healthStatus ?? 'HEALTHY',
                image: data.image ?? null,
                notes: data.notes ?? null,
                tagNumber: data.tagNumber ?? null,
                birthDate: data.birthDate ? new Date(data.birthDate) : null,
                userId,
                penId: data.penId ?? null,
                breedId: data.breedId ?? null,
            },
        });
        await this.updatePenCountsIfNeeded(created.penId);
        return created;
    }
    async getPoultryById(userId, id) {
        return database_1.prisma.poultry.findFirst({
            where: { id, userId },
            include: { pen: true, breed: true, photos: true },
        });
    }
    async updatePoultry(userId, id, data) {
        const existing = await database_1.prisma.poultry.findFirst({ where: { id, userId } });
        if (!existing)
            return null;
        const updated = await database_1.prisma.poultry.update({
            where: { id },
            data: {
                ...(data.name !== undefined ? { name: data.name } : {}),
                ...(data.type !== undefined ? { type: data.type } : {}),
                ...(data.gender !== undefined ? { gender: data.gender } : {}),
                ...(data.age !== undefined ? { age: data.age } : {}),
                ...(data.weight !== undefined ? { weight: data.weight ?? null } : {}),
                ...(data.healthStatus !== undefined ? { healthStatus: data.healthStatus } : {}),
                ...(data.image !== undefined ? { image: data.image ?? null } : {}),
                ...(data.notes !== undefined ? { notes: data.notes ?? null } : {}),
                ...(data.tagNumber !== undefined ? { tagNumber: data.tagNumber ?? null } : {}),
                ...(data.birthDate !== undefined ? { birthDate: data.birthDate ? new Date(data.birthDate) : null } : {}),
                ...(data.penId !== undefined
                    ? data.penId === null
                        ? { pen: { disconnect: true } }
                        : { pen: { connect: { id: data.penId } } }
                    : {}),
                ...(data.breedId !== undefined
                    ? data.breedId === null
                        ? { breed: { disconnect: true } }
                        : { breed: { connect: { id: data.breedId } } }
                    : {}),
            },
        });
        if (existing.penId !== updated.penId) {
            await this.updatePenCountsIfNeeded(existing.penId);
            await this.updatePenCountsIfNeeded(updated.penId);
        }
        return updated;
    }
    async deletePoultry(userId, id) {
        const existing = await database_1.prisma.poultry.findFirst({ where: { id, userId } });
        if (!existing)
            return false;
        await database_1.prisma.poultry.delete({ where: { id } });
        await this.updatePenCountsIfNeeded(existing.penId);
        return true;
    }
    async listPoultry(userId, filters) {
        const { search, type, healthStatus, gender, penId, breedId, minAge, maxAge, minWeight, maxWeight, page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc', } = filters;
        const ageFilter = (() => {
            const f = {};
            if (minAge !== undefined)
                f.gte = minAge;
            if (maxAge !== undefined)
                f.lte = maxAge;
            return Object.keys(f).length ? f : undefined;
        })();
        const weightFilter = (() => {
            const f = {};
            if (minWeight !== undefined)
                f.gte = minWeight;
            if (maxWeight !== undefined)
                f.lte = maxWeight;
            return Object.keys(f).length ? f : undefined;
        })();
        const where = {
            userId,
            ...(search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { tagNumber: { contains: search, mode: 'insensitive' } },
                        { notes: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
            ...(type ? { type } : {}),
            ...(healthStatus ? { healthStatus } : {}),
            ...(gender ? { gender } : {}),
            ...(penId !== undefined ? { penId } : {}),
            ...(breedId !== undefined ? { breedId } : {}),
            ...(ageFilter ? { age: ageFilter } : {}),
            ...(weightFilter ? { weight: weightFilter } : {}),
        };
        const [items, total] = await Promise.all([
            database_1.prisma.poultry.findMany({
                where,
                include: { pen: true, breed: true, photos: true },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            database_1.prisma.poultry.count({ where }),
        ]);
        return {
            items,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }
    async addPhoto(userId, poultryId, url, caption, isMain) {
        const existing = await database_1.prisma.poultry.findFirst({ where: { id: poultryId, userId } });
        if (!existing)
            return null;
        if (isMain) {
            await database_1.prisma.poultryPhoto.updateMany({ where: { poultryId }, data: { isMain: false } });
        }
        return database_1.prisma.poultryPhoto.create({
            data: { poultryId, url, caption: caption ?? null, isMain: Boolean(isMain) },
        });
    }
    async removePhoto(userId, poultryId, photoId) {
        const existing = await database_1.prisma.poultry.findFirst({ where: { id: poultryId, userId } });
        if (!existing)
            return false;
        await database_1.prisma.poultryPhoto.delete({ where: { id: photoId } });
        return true;
    }
    async updatePenCountsIfNeeded(penId) {
        if (!penId)
            return;
        const count = await database_1.prisma.poultry.count({ where: { penId } });
        await database_1.prisma.pen.update({ where: { id: penId }, data: { currentCount: count } });
    }
}
exports.PoultryService = PoultryService;
exports.poultryService = new PoultryService();
//# sourceMappingURL=poultryService.js.map