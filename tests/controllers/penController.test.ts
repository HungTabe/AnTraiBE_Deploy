import { createPen, getPen, listPens, updatePen, deletePen } from '../../src/controllers/penController';
import { penService } from '../../src/services/penService';

jest.mock('../../src/services/penService', () => {
	return {
		penService: {
			createPen: jest.fn(),
			getPenById: jest.fn(),
			listPens: jest.fn(),
			updatePen: jest.fn(),
			deletePen: jest.fn(),
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

describe('penController unit', () => {
	beforeEach(() => jest.clearAllMocks());

	it('createPen returns 201 with data', async () => {
		const req: Req = { user: { id: 1 }, body: { farmId: 2, name: 'Chuồng' } };
		const res = mockRes();
		(penService.createPen as jest.Mock).mockResolvedValue({ id: 10, name: 'Chuồng' });
		await createPen(req, res as any);
		expect(penService.createPen).toHaveBeenCalledWith(1, 2, { farmId: 2, name: 'Chuồng' });
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 10, name: 'Chuồng' } });
	});

	it('listPens returns items', async () => {
		const req: Req = { user: { id: 1 }, query: { farmId: '2' } };
		const res = mockRes();
		(penService.listPens as jest.Mock).mockResolvedValue([{ id: 10 }]);
		await listPens(req, res as any);
		expect(penService.listPens).toHaveBeenCalledWith(1, 2);
		expect(res.json).toHaveBeenCalledWith({ success: true, items: [{ id: 10 }] });
	});

	it('getPen returns data', async () => {
		const req: Req = { user: { id: 1 }, params: { id: '10' } };
		const res = mockRes();
		(penService.getPenById as jest.Mock).mockResolvedValue({ id: 10 });
		await getPen(req, res as any);
		expect(penService.getPenById).toHaveBeenCalledWith(1, 10);
		expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 10 } });
	});

	it('updatePen returns updated', async () => {
		const req: Req = { user: { id: 1 }, params: { id: '10' }, body: { capacity: 200 } };
		const res = mockRes();
		(penService.updatePen as jest.Mock).mockResolvedValue({ id: 10, capacity: 200 });
		await updatePen(req, res as any);
		expect(penService.updatePen).toHaveBeenCalledWith(1, 10, { capacity: 200 });
		expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 10, capacity: 200 } });
	});

	it('deletePen returns success', async () => {
		const req: Req = { user: { id: 1 }, params: { id: '10' } };
		const res = mockRes();
		(penService.deletePen as jest.Mock).mockResolvedValue(true);
		await deletePen(req, res as any);
		expect(penService.deletePen).toHaveBeenCalledWith(1, 10);
		expect(res.json).toHaveBeenCalledWith({ success: true });
	});
});
