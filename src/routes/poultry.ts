import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, requireFarmer } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { createPoultry, getPoultry, updatePoultry, deletePoultry, listPoultry, addPoultryPhoto, removePoultryPhoto } from '../controllers/poultryController';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadsDir),
	filename: (req, file, cb) => {
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, unique + path.extname(file.originalname));
	},
});
const upload = multer({ storage });

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
router.post('/', authenticateToken, requireFarmer, asyncHandler(createPoultry));
router.get('/', authenticateToken, requireFarmer, asyncHandler(listPoultry));
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
router.get('/:id', authenticateToken, requireFarmer, asyncHandler(getPoultry));
router.put('/:id', authenticateToken, requireFarmer, asyncHandler(updatePoultry));
router.delete('/:id', authenticateToken, requireFarmer, asyncHandler(deletePoultry));

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
router.post('/:id/photos', authenticateToken, requireFarmer, upload.single('image'), asyncHandler(addPoultryPhoto));
router.delete('/:id/photos/:photoId', authenticateToken, requireFarmer, asyncHandler(removePoultryPhoto));

export default router;

