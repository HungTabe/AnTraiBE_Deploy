"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const penController_1 = require("../../src/controllers/penController");
const penService_1 = require("../../src/services/penService");
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
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('penController unit', () => {
    beforeEach(() => jest.clearAllMocks());
    it('createPen returns 201 with data', async () => {
        const req = { user: { id: 1 }, body: { farmId: 2, name: 'Chuồng' } };
        const res = mockRes();
        penService_1.penService.createPen.mockResolvedValue({ id: 10, name: 'Chuồng' });
        await (0, penController_1.createPen)(req, res);
        expect(penService_1.penService.createPen).toHaveBeenCalledWith(1, 2, { farmId: 2, name: 'Chuồng' });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 10, name: 'Chuồng' } });
    });
    it('listPens returns items', async () => {
        const req = { user: { id: 1 }, query: { farmId: '2' } };
        const res = mockRes();
        penService_1.penService.listPens.mockResolvedValue([{ id: 10 }]);
        await (0, penController_1.listPens)(req, res);
        expect(penService_1.penService.listPens).toHaveBeenCalledWith(1, 2);
        expect(res.json).toHaveBeenCalledWith({ success: true, items: [{ id: 10 }] });
    });
    it('getPen returns data', async () => {
        const req = { user: { id: 1 }, params: { id: '10' } };
        const res = mockRes();
        penService_1.penService.getPenById.mockResolvedValue({ id: 10 });
        await (0, penController_1.getPen)(req, res);
        expect(penService_1.penService.getPenById).toHaveBeenCalledWith(1, 10);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 10 } });
    });
    it('updatePen returns updated', async () => {
        const req = { user: { id: 1 }, params: { id: '10' }, body: { capacity: 200 } };
        const res = mockRes();
        penService_1.penService.updatePen.mockResolvedValue({ id: 10, capacity: 200 });
        await (0, penController_1.updatePen)(req, res);
        expect(penService_1.penService.updatePen).toHaveBeenCalledWith(1, 10, { capacity: 200 });
        expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 10, capacity: 200 } });
    });
    it('deletePen returns success', async () => {
        const req = { user: { id: 1 }, params: { id: '10' } };
        const res = mockRes();
        penService_1.penService.deletePen.mockResolvedValue(true);
        await (0, penController_1.deletePen)(req, res);
        expect(penService_1.penService.deletePen).toHaveBeenCalledWith(1, 10);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });
});
//# sourceMappingURL=penController.test.js.map