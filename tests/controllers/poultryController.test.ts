import { createPoultry, getPoultry, listPoultry, updatePoultry, deletePoultry, addPoultryPhoto, removePoultryPhoto } from '../../src/controllers/poultryController';
import { poultryService } from '../../src/services/poultryService';

jest.mock('../../src/services/poultryService', () => {
	return {
		poultryService: {
			createPoultry: jest.fn(),
			getPoultryById: jest.fn(),
			listPoultry: jest.fn(),
			updatePoultry: jest.fn(),
			deletePoultry: jest.fn(),
			addPhoto: jest.fn(),
			removePhoto: jest.fn(),
		},
	};
});

type Req = any;

type Res = {
	status: jest.Mock;
	json: jest.Mock;
};

const mockRes = (): Res => {
	const res: any = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

describe('poultryController unit', () => {
	beforeEach(() => jest.clearAllMocks());

	it('createPoultry returns 201 with data', async () => {
		const req: Req = { user: { id: 1 }, body: { name: 'Gà', type: 'CHICKEN', gender: 'FEMALE', age: 10 } };
		const res = mockRes();
		(poultryService.createPoultry as jest.Mock).mockResolvedValue({ id: 1, name: 'Gà' });
		await createPoultry(req, res as any);
		expect(poultryService.createPoultry).toHaveBeenCalledWith(1, req.body);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 1, name: 'Gà' } });
	});

	it('getPoultry returns 200 with item', async () => {
		const req: Req = { user: { id: 1 }, params: { id: '5' } };
		const res = mockRes();
		(poultryService.getPoultryById as jest.Mock).mockResolvedValue({ id: 5 });
		await getPoultry(req, res as any);
		expect(poultryService.getPoultryById).toHaveBeenCalledWith(1, 5);
		expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 5 } });
	});

	it('listPoultry returns 200 with items', async () => {
		const req: Req = { user: { id: 1 }, query: { search: 'Ga' } };
		const res = mockRes();
		(poultryService.listPoultry as jest.Mock).mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 });
		await listPoultry(req, res as any);
		expect(poultryService.listPoultry).toHaveBeenCalled();
		expect(res.json).toHaveBeenCalledWith({ success: true, items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 });
	});

	it('updatePoultry returns 200 with updated', async () => {
		const req: Req = { user: { id: 1 }, params: { id: '7' }, body: { weight: 2.3 } };
		const res = mockRes();
		(poultryService.updatePoultry as jest.Mock).mockResolvedValue({ id: 7, weight: 2.3 });
		await updatePoultry(req, res as any);
		expect(poultryService.updatePoultry).toHaveBeenCalledWith(1, 7, { weight: 2.3 });
		expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 7, weight: 2.3 } });
	});

	it('deletePoultry returns 200 on success', async () => {
		const req: Req = { user: { id: 1 }, params: { id: '9' } };
		const res = mockRes();
		(poultryService.deletePoultry as jest.Mock).mockResolvedValue(true);
		await deletePoultry(req, res as any);
		expect(poultryService.deletePoultry).toHaveBeenCalledWith(1, 9);
		expect(res.json).toHaveBeenCalledWith({ success: true });
	});

	it('addPoultryPhoto returns 201 with created photo', async () => {
		const req: Req = { user: { id: 1 }, params: { id: '3' }, file: { filename: 'a.jpg' }, body: { caption: 'cap', isMain: 'true' } };
		const res = mockRes();
		(poultryService.addPhoto as jest.Mock).mockResolvedValue({ id: 11, url: '/uploads/a.jpg' });
		await addPoultryPhoto(req, res as any);
		expect(poultryService.addPhoto).toHaveBeenCalledWith(1, 3, '/uploads/a.jpg', 'cap', true);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 11, url: '/uploads/a.jpg' } });
	});

	it('removePoultryPhoto returns 200 on success', async () => {
		const req: Req = { user: { id: 1 }, params: { id: '3', photoId: '11' } };
		const res = mockRes();
		(poultryService.removePhoto as jest.Mock).mockResolvedValue(true);
		await removePoultryPhoto(req, res as any);
		expect(poultryService.removePhoto).toHaveBeenCalledWith(1, 3, 11);
		expect(res.json).toHaveBeenCalledWith({ success: true });
	});
});
