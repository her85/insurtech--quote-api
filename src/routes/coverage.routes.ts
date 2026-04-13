// src/routes/coverage.routes.ts
import { Router } from 'express';
import * as coverageController from '../controllers/coverage.controller';
import { validate } from '../validations/validate';
import { listCoveragesSchema, getCoverageSchema } from '../validations/coverage.validation';

/**
 * @swagger
 * tags:
 *   - name: Coverages
 *     description: Insurance coverage retrieval
 *
 * /api/coverages:
 *   get:
 *     summary: List available coverages
 *     tags: [Coverages]
 *     responses:
 *       200:
 *         description: Coverage list
 *
 * /api/coverages/{id}:
 *   get:
 *     summary: Get coverage by ID
 *     tags: [Coverages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coverage details
 */
const router = Router();

router.get('/', validate(listCoveragesSchema), coverageController.getCoverages);

router.get('/:id', validate(getCoverageSchema), coverageController.getCoverage);

export default router;