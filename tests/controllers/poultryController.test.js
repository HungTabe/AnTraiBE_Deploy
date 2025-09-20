"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const poultryController_1 = require("../../src/controllers/poultryController");
const poultryService_1 = require("../../src/services/poultryService");
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
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('poultryController unit', () => {
    beforeEach(() => jest.clearAllMocks());
    it('createPoultry returns 201 with data', async () => {
        const req = { user: { id: 1 }, body: { name: 'Gà', type: 'CHICKEN', gender: 'FEMALE', age: 10 } };
        const res = mockRes();
        poultryService_1.poultryService.createPoultry.mockResolvedValue({ id: 1, name: 'Gà' });
        await (0, poultryController_1.createPoultry)(req, res);
        expect(poultryService_1.poultryService.createPoultry).toHaveBeenCalledWith(1, req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 1, name: 'Gà' } });
    });
    it('getPoultry returns 200 with item', async () => {
        const req = { user: { id: 1 }, params: { id: '5' } };
        const res = mockRes();
        poultryService_1.poultryService.getPoultryById.mockResolvedValue({ id: 5 });
        await (0, poultryController_1.getPoultry)(req, res);
        expect(poultryService_1.poultryService.getPoultryById).toHaveBeenCalledWith(1, 5);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 5 } });
    });
    it('listPoultry returns 200 with items', async () => {
        const req = { user: { id: 1 }, query: { search: 'Ga' } };
        const res = mockRes();
        poultryService_1.poultryService.listPoultry.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 });
        await (0, poultryController_1.listPoultry)(req, res);
        expect(poultryService_1.poultryService.listPoultry).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ success: true, items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 });
    });
    it('updatePoultry returns 200 with updated', async () => {
        const req = { user: { id: 1 }, params: { id: '7' }, body: { weight: 2.3 } };
        const res = mockRes();
        poultryService_1.poultryService.updatePoultry.mockResolvedValue({ id: 7, weight: 2.3 });
        await (0, poultryController_1.updatePoultry)(req, res);
        expect(poultryService_1.poultryService.updatePoultry).toHaveBeenCalledWith(1, 7, { weight: 2.3 });
        expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 7, weight: 2.3 } });
    });
    it('deletePoultry returns 200 on success', async () => {
        const req = { user: { id: 1 }, params: { id: '9' } };
        const res = mockRes();
        poultryService_1.poultryService.deletePoultry.mockResolvedValue(true);
        await (0, poultryController_1.deletePoultry)(req, res);
        expect(poultryService_1.poultryService.deletePoultry).toHaveBeenCalledWith(1, 9);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });
    it('addPoultryPhoto returns 201 with created photo', async () => {
        const req = { user: { id: 1 }, params: { id: '3' }, file: { filename: 'a.jpg' }, body: { caption: 'cap', isMain: 'true' } };
        const res = mockRes();
        poultryService_1.poultryService.addPhoto.mockResolvedValue({ id: 11, url: '/uploads/a.jpg' });
        await (0, poultryController_1.addPoultryPhoto)(req, res);
        expect(poultryService_1.poultryService.addPhoto).toHaveBeenCalledWith(1, 3, '/uploads/a.jpg', 'cap', true);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 11, url: '/uploads/a.jpg' } });
    });
    it('removePoultryPhoto returns 200 on success', async () => {
        const req = { user: { id: 1 }, params: { id: '3', photoId: '11' } };
        const res = mockRes();
        poultryService_1.poultryService.removePhoto.mockResolvedValue(true);
        await (0, poultryController_1.removePoultryPhoto)(req, res);
        expect(poultryService_1.poultryService.removePhoto).toHaveBeenCalledWith(1, 3, 11);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });
});
//# sourceMappingURL=poultryController.test.js.map