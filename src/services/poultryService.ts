import { Prisma, HealthStatus, Gender, PoultryType } from '@prisma/client';
import { prisma } from '../config/database';
import { CreatePoultryDTO, UpdatePoultryDTO, PoultryQueryFilters } from '../types/poultry';

export class PoultryService {
	public async createPoultry(userId: number, data: CreatePoultryDTO) {
		const created = await prisma.poultry.create({
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

	public async getPoultryById(userId: number, id: number) {
		return prisma.poultry.findFirst({
			where: { id, userId },
			include: { pen: true, breed: true, photos: true },
		});
	}

	public async updatePoultry(userId: number, id: number, data: UpdatePoultryDTO) {
		const existing = await prisma.poultry.findFirst({ where: { id, userId } });
		if (!existing) return null;

		const updated = await prisma.poultry.update({
			where: { id },
			data: {
				...(data.name !== undefined ? { name: data.name } : {}),
				...(data.type !== undefined ? { type: data.type as PoultryType } : {}),
				...(data.gender !== undefined ? { gender: data.gender as Gender } : {}),
				...(data.age !== undefined ? { age: data.age } : {}),
				...(data.weight !== undefined ? { weight: data.weight ?? null } : {}),
				...(data.healthStatus !== undefined ? { healthStatus: data.healthStatus as HealthStatus } : {}),
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

	public async deletePoultry(userId: number, id: number) {
		const existing = await prisma.poultry.findFirst({ where: { id, userId } });
		if (!existing) return false;
		await prisma.poultry.delete({ where: { id } });
		await this.updatePenCountsIfNeeded(existing.penId);
		return true;
	}

	public async listPoultry(userId: number, filters: PoultryQueryFilters) {
		const {
			search,
			type,
			healthStatus,
			gender,
			penId,
			breedId,
			minAge,
			maxAge,
			minWeight,
			maxWeight,
			page = 1,
			pageSize = 10,
			sortBy = 'createdAt',
			sortOrder = 'desc',
		} = filters;

		const ageFilter: Prisma.IntFilter<'Poultry'> | undefined = (() => {
			const f: any = {};
			if (minAge !== undefined) f.gte = minAge;
			if (maxAge !== undefined) f.lte = maxAge;
			return Object.keys(f).length ? f : undefined;
		})();

		const weightFilter: Prisma.FloatFilter<'Poultry'> | undefined = (() => {
			const f: any = {};
			if (minWeight !== undefined) f.gte = minWeight;
			if (maxWeight !== undefined) f.lte = maxWeight;
			return Object.keys(f).length ? f : undefined;
		})();

		const where: Prisma.PoultryWhereInput = {
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
			prisma.poultry.findMany({
				where,
				include: { pen: true, breed: true, photos: true },
				orderBy: { [sortBy]: sortOrder },
				skip: (page - 1) * pageSize,
				take: pageSize,
			}),
			prisma.poultry.count({ where }),
		]);

		return {
			items,
			total,
			page,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		};
	}

	public async addPhoto(userId: number, poultryId: number, url: string, caption?: string, isMain?: boolean) {
		const existing = await prisma.poultry.findFirst({ where: { id: poultryId, userId } });
		if (!existing) return null;
		if (isMain) {
			await prisma.poultryPhoto.updateMany({ where: { poultryId }, data: { isMain: false } });
		}
		return prisma.poultryPhoto.create({
			data: { poultryId, url, caption: caption ?? null, isMain: Boolean(isMain) },
		});
	}

	public async removePhoto(userId: number, poultryId: number, photoId: number) {
		const existing = await prisma.poultry.findFirst({ where: { id: poultryId, userId } });
		if (!existing) return false;
		await prisma.poultryPhoto.delete({ where: { id: photoId } });
		return true;
	}

	private async updatePenCountsIfNeeded(penId?: number | null) {
		if (!penId) return;
		const count = await prisma.poultry.count({ where: { penId } });
		await prisma.pen.update({ where: { id: penId }, data: { currentCount: count } });
	}
}

export const poultryService = new PoultryService();
