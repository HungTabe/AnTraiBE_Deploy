"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const poultryController_1 = require("../controllers/poultryController");
const router = express_1.default.Router();
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
/**
 * @swagger
 * /api/poultry:
 *   post:
 *     summary: Create a poultry
 *     tags: [Poultry]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Poultry'
 *     responses:
 *       201:
 *         description: Created
 *   get:
 *     summary: List poultry with filters
 *     tags: [Poultry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: healthStatus
 *         schema:
 *           type: string
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *       - in: query
 *         name: penId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: breedId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/', auth_1.authenticateToken, auth_1.requireFarmer, (0, errorHandler_1.asyncHandler)(poultryController_1.createPoultry));
router.get('/', auth_1.authenticateToken, auth_1.requireFarmer, (0, errorHandler_1.asyncHandler)(poultryController_1.listPoultry));
/**
 * @swagger
 * /api/poultry/{id}:
 *   get:
 *     summary: Get poultry by id
 *     tags: [Poultry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: OK
 *   put:
 *     summary: Update poultry by id
 *     tags: [Poultry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Poultry'
 *     responses:
 *       200:
 *         description: OK
 *   delete:
 *     summary: Delete poultry by id
 *     tags: [Poultry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id', auth_1.authenticateToken, auth_1.requireFarmer, (0, errorHandler_1.asyncHandler)(poultryController_1.getPoultry));
router.put('/:id', auth_1.authenticateToken, auth_1.requireFarmer, (0, errorHandler_1.asyncHandler)(poultryController_1.updatePoultry));
router.delete('/:id', auth_1.authenticateToken, auth_1.requireFarmer, (0, errorHandler_1.asyncHandler)(poultryController_1.deletePoultry));
/**
 * @swagger
 * /api/poultry/{id}/photos:
 *   post:
 *     summary: Add poultry photo (upload or by URL)
 *     tags: [Poultry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               caption:
 *                 type: string
 *               isMain:
 *                 type: boolean
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               caption:
 *                 type: string
 *               isMain:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Created
 * /api/poultry/{id}/photos/{photoId}:
 *   delete:
 *     summary: Remove poultry photo
 *     tags: [Poultry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *       - in: path
 *         name: photoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/:id/photos', auth_1.authenticateToken, auth_1.requireFarmer, upload.single('image'), (0, errorHandler_1.asyncHandler)(poultryController_1.addPoultryPhoto));
router.delete('/:id/photos/:photoId', auth_1.authenticateToken, auth_1.requireFarmer, (0, errorHandler_1.asyncHandler)(poultryController_1.removePoultryPhoto));
exports.default = router;
//# sourceMappingURL=poultry.js.map