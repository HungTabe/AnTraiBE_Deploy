import express from 'express';
import { authenticateToken, requireFarmer } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { createPen, getPen, updatePen, deletePen, listPens } from '../controllers/penController';

const router = express.Router();

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
router.post('/', authenticateToken, requireFarmer, asyncHandler(createPen));
router.get('/', authenticateToken, requireFarmer, asyncHandler(listPens));
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
router.get('/:id', authenticateToken, requireFarmer, asyncHandler(getPen));
router.put('/:id', authenticateToken, requireFarmer, asyncHandler(updatePen));
router.delete('/:id', authenticateToken, requireFarmer, asyncHandler(deletePen));

export default router;

