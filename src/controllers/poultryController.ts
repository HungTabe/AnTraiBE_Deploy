import { Request, Response } from 'express';
import { poultryService } from '../services/poultryService';
import { createError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
	user?: { id: number; email: string; role: string };
}

export const createPoultry = async (req: AuthRequest, res: Response) => {
	if (!req.user) throw createError('Unauthorized', 401);
	const created = await poultryService.createPoultry(req.user.id, req.body);
	res.status(201).json({ success: true, data: created });
};

export const getPoultry = async (req: AuthRequest, res: Response) => {
	if (!req.user) throw createError('Unauthorized', 401);
	const id = Number(req.params.id);
	const item = await poultryService.getPoultryById(req.user.id, id);
	if (!item) throw createError('Not Found', 404);
	res.json({ success: true, data: item });
};

export const updatePoultry = async (req: AuthRequest, res: Response) => {
	if (!req.user) throw createError('Unauthorized', 401);
	const id = Number(req.params.id);
	const updated = await poultryService.updatePoultry(req.user.id, id, req.body);
	if (!updated) throw createError('Not Found', 404);
	res.json({ success: true, data: updated });
};

export const deletePoultry = async (req: AuthRequest, res: Response) => {
	if (!req.user) throw createError('Unauthorized', 401);
	const id = Number(req.params.id);
	const ok = await poultryService.deletePoultry(req.user.id, id);
	if (!ok) throw createError('Not Found', 404);
	res.json({ success: true });
};

export const listPoultry = async (req: AuthRequest, res: Response) => {
	if (!req.user) throw createError('Unauthorized', 401);
	const filters: any = {
		search: req.query.search as string,
		type: req.query.type as any,
		healthStatus: req.query.healthStatus as any,
		gender: req.query.gender as any,
		sortBy: req.query.sortBy as any,
		sortOrder: req.query.sortOrder as any,
	};
	if (req.query.penId) filters.penId = Number(req.query.penId);
	if (req.query.breedId) filters.breedId = Number(req.query.breedId);
	if (req.query.minAge) filters.minAge = Number(req.query.minAge);
	if (req.query.maxAge) filters.maxAge = Number(req.query.maxAge);
	if (req.query.minWeight) filters.minWeight = Number(req.query.minWeight);
	if (req.query.maxWeight) filters.maxWeight = Number(req.query.maxWeight);
	if (req.query.page) filters.page = Number(req.query.page);
	if (req.query.pageSize) filters.pageSize = Number(req.query.pageSize);

	const result = await poultryService.listPoultry(req.user.id, filters);
	res.json({ success: true, ...result });
};

export const addPoultryPhoto = async (req: AuthRequest, res: Response) => {
	if (!req.user) throw createError('Unauthorized', 401);
	const poultryId = Number(req.params.id);
	const file = (req as any).file as Express.Multer.File | undefined;
	const url = file ? `/uploads/${file.filename}` : req.body.url;
	if (!url) throw createError('Image URL required', 400);
	const created = await poultryService.addPhoto(
		req.user.id,
		poultryId,
		url,
		req.body.caption,
		req.body.isMain === 'true' || req.body.isMain === true
	);
	if (!created) throw createError('Not Found', 404);
	res.status(201).json({ success: true, data: created });
};

export const removePoultryPhoto = async (req: AuthRequest, res: Response) => {
	if (!req.user) throw createError('Unauthorized', 401);
	const poultryId = Number(req.params.id);
	const photoId = Number(req.params.photoId);
	const ok = await poultryService.removePhoto(req.user.id, poultryId, photoId);
	if (!ok) throw createError('Not Found', 404);
	res.json({ success: true });
};
