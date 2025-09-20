"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPens = exports.deletePen = exports.updatePen = exports.getPen = exports.createPen = void 0;
const penService_1 = require("../services/penService");
const errorHandler_1 = require("../middleware/errorHandler");
const createPen = async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.createError)('Unauthorized', 401);
    const farmId = Number(req.body.farmId);
    if (!farmId)
        throw (0, errorHandler_1.createError)('farmId is required', 400);
    const pen = await penService_1.penService.createPen(req.user.id, farmId, req.body);
    res.status(201).json({ success: true, data: pen });
};
exports.createPen = createPen;
const getPen = async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.createError)('Unauthorized', 401);
    const id = Number(req.params.id);
    const pen = await penService_1.penService.getPenById(req.user.id, id);
    if (!pen)
        throw (0, errorHandler_1.createError)('Not Found', 404);
    res.json({ success: true, data: pen });
};
exports.getPen = getPen;
const updatePen = async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.createError)('Unauthorized', 401);
    const id = Number(req.params.id);
    const pen = await penService_1.penService.updatePen(req.user.id, id, req.body);
    if (!pen)
        throw (0, errorHandler_1.createError)('Not Found', 404);
    res.json({ success: true, data: pen });
};
exports.updatePen = updatePen;
const deletePen = async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.createError)('Unauthorized', 401);
    const id = Number(req.params.id);
    const ok = await penService_1.penService.deletePen(req.user.id, id);
    if (!ok)
        throw (0, errorHandler_1.createError)('Not Found', 404);
    res.json({ success: true });
};
exports.deletePen = deletePen;
const listPens = async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.createError)('Unauthorized', 401);
    const farmId = Number(req.query.farmId);
    if (!farmId)
        throw (0, errorHandler_1.createError)('farmId is required', 400);
    const items = await penService_1.penService.listPens(req.user.id, farmId);
    res.json({ success: true, items });
};
exports.listPens = listPens;
//# sourceMappingURL=penController.js.map