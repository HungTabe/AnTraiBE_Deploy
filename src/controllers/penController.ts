import { Request, Response } from 'express';
import { penService } from '../services/penService';
import { createError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
	user?: { id: number; email: string; role: string };
}

export const createPen = async (req: AuthRequest, res: Response) => {
	if (!req.user) throw createError('Unauthorized', 401);
	const farmId = Number(req.body.farmId);
	if (!farmId) throw createError('farmId is required', 400);
	const pen = await penService.createPen(req.user.id, farmId, req.body);
	res.status(201).json({ success: true, data: pen });
};

export const getPen = async (req: AuthRequest, res: Response) => {
	if (!req.user) throw createError('Unauthorized', 401);
	const id = Number(req.params.id);
	const pen = await penService.getPenById(req.user.id, id);
	if (!pen) throw createError('Not Found', 404);
	res.json({ success: true, data: pen });
};

export const updatePen = async (req: AuthRequest, res: Response) => {
	if (!req.user) throw createError('Unauthorized', 401);
	const id = Number(req.params.id);
	const pen = await penService.updatePen(req.user.id, id, req.body);
	if (!pen) throw createError('Not Found', 404);
	res.json({ success: true, data: pen });
};

export const deletePen = async (req: AuthRequest, res: Response) => {
	if (!req.user) throw createError('Unauthorized', 401);
	const id = Number(req.params.id);
	const ok = await penService.deletePen(req.user.id, id);
	if (!ok) throw createError('Not Found', 404);
	res.json({ success: true });
};

export const listPens = async (req: AuthRequest, res: Response) => {
	if (!req.user) throw createError('Unauthorized', 401);
	const farmId = Number(req.query.farmId);
	if (!farmId) throw createError('farmId is required', 400);
	const items = await penService.listPens(req.user.id, farmId);
	res.json({ success: true, items });
};

