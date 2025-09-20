import { prisma } from '../config/database';
import { CreatePenDTO, UpdatePenDTO } from '../types/poultry';

export class PenService {
	public async createPen(userId: number, farmId: number, data: CreatePenDTO) {
		await this.assertFarmOwnership(userId, farmId);
		return prisma.pen.create({
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

	public async getPenById(userId: number, id: number) {
		const pen = await prisma.pen.findUnique({ where: { id }, include: { farm: true } });
		if (!pen) return null;
		await this.assertFarmOwnership(userId, pen.farmId);
		return pen;
	}

	public async updatePen(userId: number, id: number, data: UpdatePenDTO) {
		const pen = await prisma.pen.findUnique({ where: { id } });
		if (!pen) return null;
		await this.assertFarmOwnership(userId, pen.farmId);
		return prisma.pen.update({
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

	public async deletePen(userId: number, id: number) {
		const pen = await prisma.pen.findUnique({ where: { id } });
		if (!pen) return false;
		await this.assertFarmOwnership(userId, pen.farmId);
		await prisma.pen.delete({ where: { id } });
		return true;
	}

	public async listPens(userId: number, farmId: number) {
		await this.assertFarmOwnership(userId, farmId);
		return prisma.pen.findMany({ where: { farmId }, orderBy: { createdAt: 'desc' } });
	}

	private async assertFarmOwnership(userId: number, farmId: number) {
		const farm = await prisma.farm.findUnique({ where: { id: farmId } });
		if (!farm || farm.userId !== userId) {
			throw new Error('Forbidden: You do not own this farm');
		}
	}
}

export const penService = new PenService();

