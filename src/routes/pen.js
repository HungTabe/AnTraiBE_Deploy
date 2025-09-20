"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const penController_1 = require("../controllers/penController");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/pens:
 *   post:
 *     summary: Create a pen/coop
 *     tags: [Pens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               farmId:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               temperature:
 *                 type: number
 *               humidity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created
 *   get:
 *     summary: List pens by farm
 *     tags: [Pens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: farmId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/', auth_1.authenticateToken, auth_1.requireFarmer, (0, errorHandler_1.asyncHandler)(penController_1.createPen));
router.get('/', auth_1.authenticateToken, auth_1.requireFarmer, (0, errorHandler_1.asyncHandler)(penController_1.listPens));
/**
 * @swagger
 * /api/pens/{id}:
 *   get:
 *     summary: Get pen by id
 *     tags: [Pens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: OK
 *   put:
 *     summary: Update pen by id
 *     tags: [Pens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: OK
 *   delete:
 *     summary: Delete pen by id
 *     tags: [Pens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id', auth_1.authenticateToken, auth_1.requireFarmer, (0, errorHandler_1.asyncHandler)(penController_1.getPen));
router.put('/:id', auth_1.authenticateToken, auth_1.requireFarmer, (0, errorHandler_1.asyncHandler)(penController_1.updatePen));
router.delete('/:id', auth_1.authenticateToken, auth_1.requireFarmer, (0, errorHandler_1.asyncHandler)(penController_1.deletePen));
exports.default = router;
//# sourceMappingURL=pen.js.map