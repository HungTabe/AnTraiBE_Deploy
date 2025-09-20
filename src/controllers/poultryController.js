"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePoultryPhoto = exports.addPoultryPhoto = exports.listPoultry = exports.deletePoultry = exports.updatePoultry = exports.getPoultry = exports.createPoultry = void 0;
const poultryService_1 = require("../services/poultryService");
const errorHandler_1 = require("../middleware/errorHandler");
const createPoultry = async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.createError)('Unauthorized', 401);
    const created = await poultryService_1.poultryService.createPoultry(req.user.id, req.body);
    res.status(201).json({ success: true, data: created });
};
exports.createPoultry = createPoultry;
const getPoultry = async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.createError)('Unauthorized', 401);
    const id = Number(req.params.id);
    const item = await poultryService_1.poultryService.getPoultryById(req.user.id, id);
    if (!item)
        throw (0, errorHandler_1.createError)('Not Found', 404);
    res.json({ success: true, data: item });
};
exports.getPoultry = getPoultry;
const updatePoultry = async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.createError)('Unauthorized', 401);
    const id = Number(req.params.id);
    const updated = await poultryService_1.poultryService.updatePoultry(req.user.id, id, req.body);
    if (!updated)
        throw (0, errorHandler_1.createError)('Not Found', 404);
    res.json({ success: true, data: updated });
};
exports.updatePoultry = updatePoultry;
const deletePoultry = async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.createError)('Unauthorized', 401);
    const id = Number(req.params.id);
    const ok = await poultryService_1.poultryService.deletePoultry(req.user.id, id);
    if (!ok)
        throw (0, errorHandler_1.createError)('Not Found', 404);
    res.json({ success: true });
};
exports.deletePoultry = deletePoultry;
const listPoultry = async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.createError)('Unauthorized', 401);
    const filters = {
        search: req.query.search,
        type: req.query.type,
        healthStatus: req.query.healthStatus,
        gender: req.query.gender,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
    };
    if (req.query.penId)
        filters.penId = Number(req.query.penId);
    if (req.query.breedId)
        filters.breedId = Number(req.query.breedId);
    if (req.query.minAge)
        filters.minAge = Number(req.query.minAge);
    if (req.query.maxAge)
        filters.maxAge = Number(req.query.maxAge);
    if (req.query.minWeight)
        filters.minWeight = Number(req.query.minWeight);
    if (req.query.maxWeight)
        filters.maxWeight = Number(req.query.maxWeight);
    if (req.query.page)
        filters.page = Number(req.query.page);
    if (req.query.pageSize)
        filters.pageSize = Number(req.query.pageSize);
    const result = await poultryService_1.poultryService.listPoultry(req.user.id, filters);
    res.json({ success: true, ...result });
};
exports.listPoultry = listPoultry;
const addPoultryPhoto = async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.createError)('Unauthorized', 401);
    const poultryId = Number(req.params.id);
    const file = req.file;
    const url = file ? `/uploads/${file.filename}` : req.body.url;
    if (!url)
        throw (0, errorHandler_1.createError)('Image URL required', 400);
    const created = await poultryService_1.poultryService.addPhoto(req.user.id, poultryId, url, req.body.caption, req.body.isMain === 'true' || req.body.isMain === true);
    if (!created)
        throw (0, errorHandler_1.createError)('Not Found', 404);
    res.status(201).json({ success: true, data: created });
};
exports.addPoultryPhoto = addPoultryPhoto;
const removePoultryPhoto = async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.createError)('Unauthorized', 401);
    const poultryId = Number(req.params.id);
    const photoId = Number(req.params.photoId);
    const ok = await poultryService_1.poultryService.removePhoto(req.user.id, poultryId, photoId);
    if (!ok)
        throw (0, errorHandler_1.createError)('Not Found', 404);
    res.json({ success: true });
};
exports.removePoultryPhoto = removePoultryPhoto;
//# sourceMappingURL=poultryController.js.map